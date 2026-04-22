import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type CreateUserInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch {
      throw new InternalServerErrorException(
        "Erreur lors de la récupération de l'utilisateur.",
      );
    }
  }

  async create(input: CreateUserInput): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          roleId: input.roleId,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        "Erreur lors de la creation de l'utilisateur.",
      );
    }
  }
}
