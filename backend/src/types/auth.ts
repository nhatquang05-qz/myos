export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface JwtUserPayload {
  userId: string;
}

export interface AuthResponseData {
  user: AuthUser;
  token?: string;
}