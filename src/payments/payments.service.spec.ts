import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'MIDTRANS_SERVER_KEY') return 'mock_server_key';
      if (key === 'MIDTRANS_CLIENT_KEY') return 'mock_client_key';
      return null;
    }),
  };
  const mockPrismaService = {};
  const mockEventEmitter = { emit: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
