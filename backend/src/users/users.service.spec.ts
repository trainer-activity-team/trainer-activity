import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user by email', async () => {
    const mockedUser = { id: 1, email: 'john@doe.fr' };
    prismaServiceMock.user.findUnique.mockResolvedValue(mockedUser);

    const result = await service.findByEmail('john@doe.fr');

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'john@doe.fr' },
    });
    expect(result).toEqual(mockedUser);
  });

  it('should throw InternalServerErrorException when prisma fails', async () => {
    prismaServiceMock.user.findUnique.mockRejectedValue(new Error('db down'));

    await expect(service.findByEmail('john@doe.fr')).rejects.toThrow(
      "Erreur lors de la récupération de l'utilisateur.",
    );
  });
});
