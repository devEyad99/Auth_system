import jwt from 'jsonwebtoken';
import { refreshTokenSecret, SECRET_KEY as secretKey } from './secretKey';

export interface ICurrentUser {
  email: string;
}

type Payload = Record<string, unknown>;

function grantToken(
  secret: string,
  expiresIn: number | string
): (data: Payload) => string {
  return (data: Payload): string => {
    const result = jwt.sign(data, secret, { expiresIn });
    return result;
  };
}
export const getAccessToken = grantToken(secretKey, '30m');
export const getRefreshToken = grantToken(refreshTokenSecret, '1h');

function verifyToken(secret: string): (token: string) => ICurrentUser {
  return (token: string) => {
    const result = jwt.verify(token, secret) as ICurrentUser;
    return result;
  };
}
export const verifyRefreshToken = verifyToken(refreshTokenSecret);
export const verifyAccessToken = verifyToken(secretKey);
