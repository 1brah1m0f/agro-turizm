export type UserRole = "TOURIST" | "ENTREPRENEUR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}
