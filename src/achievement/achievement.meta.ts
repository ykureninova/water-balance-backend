export type AchievementMeta = {
  id: number;
  code: string;
  name: string;
  condition: string;
};

export const ACHIEVEMENTS_META: AchievementMeta[] = [
  {
    id: 1,
    code: 'first_sip',
    name: 'First sip',
    condition: 'Add first drink',
  },
  {
    id: 2,
    code: 'first_goal',
    name: 'First goal',
    condition: 'Reach daily water goal for the first time',
  },
  {
    id: 3,
    code: 'back_again',
    name: 'Back again',
    condition: 'Return after 1 day break',
  },
  {
    id: 4,
    code: 'streak_3',
    name: '3-day streak',
    condition: 'Meet goal 3 days in a row',
  },
  {
    id: 5,
    code: 'streak_7',
    name: '7-day streak',
    condition: 'Meet goal 7 days in a row',
  },
  {
    id: 6,
    code: 'streak_14',
    name: '14-day streak',
    condition: 'Meet goal 14 days in a row',
  },
  {
    id: 7,
    code: 'streak_30',
    name: '30-day streak',
    condition: 'Meet goal 30 days in a row',
  },
  {
    id: 8,
    code: 'liter_1',
    name: '1 liter club',
    condition: 'Drink total of 1 liter',
  },
  {
    id: 9,
    code: 'liter_10',
    name: '10 liters total',
    condition: 'Drink total of 10 liters',
  },
  {
    id: 10,
    code: 'liter_100',
    name: '100 liters legend',
    condition: 'Drink total of 100 liters',
  },
  {
    id: 11,
    code: 'early_bird',
    name: 'Early bird',
    condition: 'Add first drink before 9:00',
  },
  {
    id: 12,
    code: 'night_owl',
    name: 'Night owl',
    condition: 'Add last drink after 21:00',
  },
  {
    id: 13,
    code: 'healthy_habit',
    name: 'Healthy habit',
    condition: '5 days without caffeine',
  },
];
