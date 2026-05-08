export enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
}

export interface DBError {
  code?: string;
  detail?: string;
  table?: string;
}
