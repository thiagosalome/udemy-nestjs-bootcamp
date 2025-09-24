import { Test, TestingModule } from '@nestjs/testing';
import { homeSelect, HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';

// Nestjs uses Jest for test
const mockGetHomes = [
  {
    id: 2,
    address: '111 Axe Ave',
    city: 'Dallas',
    price: 500000,
    image: 'img5',
    numberOfBedrooms: 4,
    numberOfBathrooms: 5,
    listedDate: '2025-09-17T12:01:27.743Z',
    landSize: 3500,
    propertyType: 'CONDO',
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          // Mocking Prisma Service
          provide: PrismaService,
          useValue: {
            // Mocking home object
            home: {
              // Mocking findMany function using jest.fn(). The mockReturn valeu I use to define the function return
              findMany: jest.fn().mockReturnValue(mockGetHomes),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHome', () => {
    it('should call prisma home.findMany with correct params', async () => {
      const filters = {
        city: 'Toronto',
        price: {
          gte: 1000000,
          lte: 1500000,
        },
        propertyType: PropertyType.RESIDENTIAL,
      };

      // Creating a mock function using jest and defining the return
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      // When we use spyOn it means that instead of using prismaService.home.findMany in home.service.ts we are gonna use mockPrismaFindManyHomes
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: {
          ...filters,
        },
      });
    });
  });
});
