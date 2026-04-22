import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login and return token with safe user', async () => {
    usersServiceMock.findByEmail.mockResolvedValue({
      id: 1,
      email: 'john@doe.fr',
      password: 'hashedPassword',
      roleId: 2,
      firstName: 'John',
      lastName: 'Doe',
    });
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    jwtServiceMock.signAsync.mockResolvedValue('jwt-token');

    const result = await service.login({
      email: 'john@doe.fr',
      password: 'password123',
    });

    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: {
        id: 1,
        email: 'john@doe.fr',
        firstName: 'John',
        lastName: 'Doe',
        roleId: 2,
      },
    });
  });

  it('should throw UnauthorizedException for unknown email', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'unknown@doe.fr', password: 'password123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    usersServiceMock.findByEmail.mockResolvedValue({
      id: 1,
      email: 'john@doe.fr',
      password: 'hashedPassword',
      roleId: 2,
      firstName: 'John',
      lastName: 'Doe',
    });
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'john@doe.fr', password: 'wrong-pass' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    usersServiceMock.findByEmail.mockRejectedValue(new Error('db failure'));

    await expect(
      service.login({ email: 'john@doe.fr', password: 'password123' }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
