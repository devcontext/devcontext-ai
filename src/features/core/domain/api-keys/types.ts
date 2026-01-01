export interface ApiKey {
  id: string;
  userId: string;
  keyHash: string;
  name: string;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyCreateInput {
  userId: string;
  name: string;
  keyHash: string;
}

export interface ApiKeyListItem {
  id: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}
