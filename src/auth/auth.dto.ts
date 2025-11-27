export class AuthDto {
  username: string;
  email?: string;

  password: string;

  gender?: 'male' | 'female';
  weight?: number;
  height?: number;
  activity?: number;

  waterNorm?: number;
}
