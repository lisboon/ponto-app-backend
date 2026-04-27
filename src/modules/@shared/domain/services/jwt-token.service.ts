import { UserRole } from '../enums';

export interface JwtPayloadData {
  userId: string;
  role: UserRole;
}

export interface JwtTokenService {
  sign(payload: JwtPayloadData): string;
  verify(token: string): JwtPayloadData;
}
