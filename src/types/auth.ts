export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenData {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface AuthResponse {
  data: {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    'not-before-policy': number;
    session_state: string;
    scope: string;
  };
}

export interface UserData {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
} 