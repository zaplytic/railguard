export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "operator" | "viewer";

export interface CreateUserRequest {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  email?: string;
}

export interface UserSession {
  userId: string;
  token: string;
  expiresAt: string;
  refreshToken: string;
}
