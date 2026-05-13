export const COIN_EVENTS = {
  COMPLETE_ACTIVITY: 50,
  SCAN_QR: 80,
  VISIT_NEW_FARM: 150,
  WRITE_REVIEW: 30,
  REGISTER: 100,
  DAILY_LOGIN: 10,
  REFER_FRIEND: 200,
} as const;

export type CoinEventKey = keyof typeof COIN_EVENTS;
