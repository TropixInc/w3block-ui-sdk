export interface Statement {
  id: string;
  type: StatementStatusType;
  amount: number;
  description: string;
  createdAt: Date;
}

export enum StatementStatusType {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
