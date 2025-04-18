export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  user: UserData;
  token_type?: string;
  refresh_token?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
} 