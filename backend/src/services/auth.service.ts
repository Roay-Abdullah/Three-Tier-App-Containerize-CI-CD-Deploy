import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { signToken } from '../utils/jwt';

export class AuthService {
  static async signup(email: string, password: string) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new Error('Email already exists');
    const hash = await hashPassword(password);
    const user = await UserRepository.create(email, hash);
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, role: user.role }, token };
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, role: user.role }, token };
  }
}