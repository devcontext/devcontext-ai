export interface AccessToken {
  id: string;
  userId: string;
  tokenHash: string;
  name: string;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessTokenCreateInput {
  userId: string;
  name: string;
  tokenHash: string;
}

export interface AccessTokenListItem {
  id: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}
