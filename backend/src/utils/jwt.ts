import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret) as { id: string; email: string; role: string };
};