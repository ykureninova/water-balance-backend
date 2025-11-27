import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AchievementDocument } from './achievement.schema';
import { Water, WaterDocument } from '../water/water.schema';
import { User, UserDocument } from '../user/user.schema';
import { ACHIEVEMENTS_META } from './achievement.meta';

const META_MAP = new Map(ACHIEVEMENTS_META.map((m) => [m.code, m]));

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel('UserAchievement')
    private achievementModel: Model<AchievementDocument>,

    @InjectModel(Water.name)
    private waterModel: Model<WaterDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}


  // LIST USER ACHIEVEMENTS
  async getUserAchievements(userId: string) {
    const achievements = await this.achievementModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ achievedAt: 1 });

    return achievements.map((a) => {
      const meta = META_MAP.get(a.code);
      return {
        id: a._id,
        code: a.code,
        name: meta?.name ?? a.code,
        condition: meta?.condition ?? '',
        achievedAt: a.achievedAt,
      };
    });
  }

  // CREATE ACHIEVEMENT ONCE
  async giveAchievement(userId: string, code: string) {
    const exists = await this.achievementModel.findOne({
      user: new Types.ObjectId(userId),
      code,
    });

    if (exists) return null;

    return this.achievementModel.create({
      user: new Types.ObjectId(userId),
      code,
      achievedAt: new Date(),
    });
  }

  // CHECK AFTER ADDING WATER
  async checkOnWaterAdd(userId: string) {
    await this.checkAll(userId);
  }

  async checkAll(userId: string) {
    const water = await this.waterModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: 1 });

    if (!water.length) return;

    const user = await this.userModel.findById(userId);
    if (!user) return;

    const dailyNorm = user.waterNorm ?? 2000;

    // FIRST SIP
    await this.giveAchievement(userId, 'first_sip');

    // FIRST GOAL (повний денний норматив)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTotal = water
      .filter((w) => new Date(w.createdAt) >= today)
      .reduce((s, w) => s + w.amount, 0);

    if (todayTotal >= dailyNorm) {
      await this.giveAchievement(userId, 'first_goal');
    }

    // BACK AGAIN (повернулась після дня паузи)
    if (water.length >= 2) {
      const last = new Date(water[water.length - 1].createdAt);
      const prev = new Date(water[water.length - 2].createdAt);
      const diff = (last.getTime() - prev.getTime()) / 86400000;

      if (diff >= 1 && diff < 2) {
        await this.giveAchievement(userId, 'back_again');
      }
    }

    // СТРІКИ ДЛЯ АЧІВОК (по dailyNorm)
    const normStreak = await this.calculateNormStreak(userId, dailyNorm);
    if (normStreak >= 3) await this.giveAchievement(userId, 'streak_3');
    if (normStreak >= 7) await this.giveAchievement(userId, 'streak_7');
    if (normStreak >= 14) await this.giveAchievement(userId, 'streak_14');
    if (normStreak >= 30) await this.giveAchievement(userId, 'streak_30');

    // TOTAL
    const total = water.reduce((s, w) => s + w.amount, 0);
    if (total >= 1000) await this.giveAchievement(userId, 'liter_1');
    if (total >= 10000) await this.giveAchievement(userId, 'liter_10');
    if (total >= 100000) await this.giveAchievement(userId, 'liter_100');

    // EARLY BIRD
    const firstToday = water.find((w) => new Date(w.createdAt) >= today);
    if (firstToday && new Date(firstToday.createdAt).getHours() < 9) {
      await this.giveAchievement(userId, 'early_bird');
    }

    // NIGHT OWL
    const todayWaters = water.filter(
      (w) => new Date(w.createdAt) >= today,
    );
    if (todayWaters.length > 0) {
      const lastDrink = todayWaters[todayWaters.length - 1];
      if (new Date(lastDrink.createdAt).getHours() >= 21) {
        await this.giveAchievement(userId, 'night_owl');
      }
    }

    // HEALTHY HABIT
    await this.checkHealthyHabit(userId);
  }

 
  // HEALTHY HABIT
  async checkHealthyHabit(userId: string) {
    const water = await this.waterModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate('drinkType');

    const days = new Map<string, boolean>();

    for (const w of water) {
      const d = new Date(w.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

      if (!days.has(key)) {
        const caffeinated = (w as any).drinkType?.caffeinated || false;
        days.set(key, caffeinated);
      }
    }

    let streak = 0;
    for (const caffeinated of days.values()) {
      if (!caffeinated) streak++;
      else break;
    }

    if (streak >= 5) {
      await this.giveAchievement(userId, 'healthy_habit');
    }
  }


  // СТРІК ДЛЯ АЧІВОК (по dailyNorm)
  private async calculateNormStreak(
    userId: string,
    dailyNorm: number,
  ): Promise<number> {
    const water = await this.waterModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: 1 });

    const dayMap = new Map<string, number>();

    for (const w of water) {
      const d = new Date(w.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      dayMap.set(key, (dayMap.get(key) || 0) + w.amount);
    }

    const sortedDays = Array.from(dayMap.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
    );

    let streak = 0;
    let prevDate: Date | null = null;

    for (const [dateStr, total] of sortedDays) {
      const current = new Date(dateStr);

      if (total >= dailyNorm) {
        if (
          !prevDate ||
          prevDate.getTime() === current.getTime() - 86400000
        ) {
          streak++;
        } else break;

        prevDate = current;
      } else break;
    }

    return streak;
  }

  // ---------------------------------------------------------
  // ДАНІ ДЛЯ WEEKLY CARD:
  //   - weekDays[7]   : чи пила в цей день тижня (Mo..Su)
  //   - weeklySum     : скільки випито за цей тиждень
  //   - weeklyGoal    : dailyNorm * 7
  //   - weeklyPercent : weeklySum / weeklyGoal (0..1)
  //   - streak        : КІЛЬКІСТЬ ДНІВ ПІДРЯД, де пила ХОЧ ЩОСЬ
  // ---------------------------------------------------------
  async getWeeklyStreak(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        weekDays: [false, false, false, false, false, false, false],
        weeklySum: 0,
        weeklyGoal: 0,
        weeklyPercent: 0,
        streak: 0,
      };
    }

    const dailyNorm = user.waterNorm ?? 2000;
    const weeklyGoal = dailyNorm * 7;

    const now = new Date();
    const jsDay = now.getDay();
    const diff = jsDay === 0 ? 6 : jsDay - 1;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // вода за поточний тиждень
    const weekWater = await this.waterModel.find({
      user: new Types.ObjectId(userId),
      createdAt: { $gte: startOfWeek, $lt: endOfWeek },
    });

    const weekDays = [false, false, false, false, false, false, false];
    let weeklySum = 0;

    for (const w of weekWater) {
      weeklySum += w.amount;

      const d = new Date(w.createdAt);
      const day = d.getDay();
      const idx = day === 0 ? 6 : day - 1;
      weekDays[idx] = true;
    }

    const weeklyPercent =
      weeklyGoal > 0 ? Math.min(weeklySum / weeklyGoal, 1) : 0;


    const allWater = await this.waterModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: 1 });

    const daySet = new Set<string>();
    for (const w of allWater) {
      const d = new Date(w.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      daySet.add(key);
    }

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
      if (daySet.has(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }

    return {
      weekDays,
      weeklySum,
      weeklyGoal,
      weeklyPercent,
      streak,
    };
  }
}
