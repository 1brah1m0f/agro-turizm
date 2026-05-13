export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  event: string;
  createdAt: Date;
}
