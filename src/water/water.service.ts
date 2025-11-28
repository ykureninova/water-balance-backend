import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Water, WaterDocument } from './water.schema';
import { User, UserDocument } from '../user/user.schema';
import { DrinkType, DrinkTypeDocument } from '../drink/drink.schema';

@Injectable()
export class WaterService {
  constructor(
    @InjectModel(Water.name) private waterModel: Model<WaterDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(DrinkType.name)
    private drinkTypeModel: Model<DrinkTypeDocument>,
  ) {}


  // ADD PORTION
  async addPortion(userId: string, amount: number, drinkTypeId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const drink = await this.drinkTypeModel.findById(drinkTypeId);
    if (!drink) throw new NotFoundException('Drink type not found');

    const raw = await this.waterModel.create({
      user: user._id,
      amount,
      drinkType: drink._id,
      caffeinated: drink.caffeinated,
    });

    await user.updateOne({ $push: { waters: raw._id } });

    return raw.populate('drinkType');
  }


  // GET USER WATER
  async getUserWater(userId: string) {
    return this.waterModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .populate('drinkType');
  }

 
  // GLOBAL DAILY AVERAGE (ALL TIME)
  private async computeGlobalDailyAverage(userId: string): Promise<number> {
    const all = await this.waterModel.find({
      user: new Types.ObjectId(userId),
    });

    if (!all.length) return 0;

    const map: Record<string, number> = {};

    for (const w of all) {
      const d = new Date(w.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = 0;
      map[key] += w.amount;
    }

    const dayTotals = Object.values(map).filter((v) => v > 0);

    if (!dayTotals.length) return 0;

    return Math.round(
      dayTotals.reduce((s, x) => s + x, 0) / dayTotals.length,
    );
  }


  // GLOBAL DAILY RECORD (MAX DAY TOTAL IN USER HISTORY)
  private async computeGlobalDailyRecord(userId: string): Promise<number> {
    const all = await this.waterModel.find({
      user: new Types.ObjectId(userId),
    });

    if (!all.length) return 0;

    const map: Record<string, number> = {};

    for (const w of all) {
      const d = new Date(w.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

      if (!map[key]) map[key] = 0;
      map[key] += w.amount;
    }

    const totals = Object.values(map);
    return totals.length ? Math.max(...totals) : 0;
  }


  // STATS — RANGE GRAPH + GLOBAL DAILY AVERAGE + GLOBAL DAILY RECORD
  async getStats(userId: string, range: 'd' | 'w' | 'm' | 'y') {
    const now = new Date();
    let start = new Date();

    let labels: string[] = [];
    let keys: string[] = [];

    const weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // DAY
    if (range === 'd') {
      start.setHours(0, 0, 0, 0);
      keys = Array.from({ length: 24 }, (_, i) => String(i));
      labels = keys;
    }

    // WEEK
    if (range === 'w') {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;

      start.setDate(now.getDate() - diff);
      start.setHours(0, 0, 0, 0);

      const tmp = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });

      keys = tmp.map((d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate(),
        ).padStart(2, '0')}`,
      );

      labels = tmp.map((d) => weekNames[d.getDay() === 0 ? 6 : d.getDay() - 1]);
    }

    // MONTH
    if (range === 'm') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);

      const days = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).getDate();

      keys = Array.from({ length: days }, (_, i) => {
        const d = new Date(start);
        d.setDate(i + 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(d.getDate()).padStart(2, '0')}`;
      });

      labels = keys;
    }

    // YEAR
    if (range === 'y') {
      start = new Date(now.getFullYear(), 0, 1);

      keys = Array.from({ length: 12 }, (_, i) => {
        return `${now.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
      });

      labels = keys;
    }

    // LOAD WATER
    const items = await this.waterModel.find({
      user: new Types.ObjectId(userId),
      createdAt: { $gte: start },
    });

    const map: Record<string, number> = {};

    for (const w of items) {
      const d = new Date(w.createdAt);

      const keyDay = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(d.getDate()).padStart(2, '0')}`;

      const keyMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0',
      )}`;

      let key = '';

      if (range === 'd') key = String(d.getHours());
      else if (range === 'w' || range === 'm') key = keyDay;
      else if (range === 'y') key = keyMonth;

      if (!map[key]) map[key] = 0;
      map[key] += w.amount;
    }

    // GRAPH DATA
    const data = keys.map((k, i) => ({
      h: i + 1,
      ml: map[k] || 0,
    }));

    // GLOBALS
    const globalAvg = await this.computeGlobalDailyAverage(userId);
    const globalRecord = await this.computeGlobalDailyRecord(userId);

    const label =
      range === 'd'
        ? 'Today'
        : range === 'w'
        ? 'This week'
        : range === 'm'
        ? 'This month'
        : 'This year';

    return {
      label,
      labels,
      data,
      average: globalAvg,
      record: globalRecord,
    };
  }
}
