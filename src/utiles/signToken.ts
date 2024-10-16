import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './secretKey';

interface Payload {
  email: string;
}

export const generateToken = (payload: Payload): string => {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '1h',
  });
  return token;
};
