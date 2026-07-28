import prisma from '../db';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async create(email: string, passwordHash: string) {
    return prisma.user.create({
      data: { email, password: passwordHash },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}