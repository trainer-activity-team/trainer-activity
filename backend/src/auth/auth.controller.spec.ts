import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.login', async () => {
    authServiceMock.login.mockResolvedValue({
      accessToken: 'jwt-token',
      user: { id: 1, email: 'john@doe.fr' },
    });

    const result = await controller.login({
      email: 'john@doe.fr',
      password: 'password123',
    });

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'john@doe.fr',
      password: 'password123',
    });
    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: { id: 1, email: 'john@doe.fr' },
    });
  });
});
