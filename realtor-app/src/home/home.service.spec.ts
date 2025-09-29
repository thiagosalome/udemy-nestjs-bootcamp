import { Test, TestingModule } from '@nestjs/testing';
import { homeSelect, HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

// Nestjs uses Jest for test
const mockGetHomes = [
  {
    id: 1,
    address: '111 Axe Ave',
    city: 'Dallas',
    price: 500000,
    image: 'img5',
    number_of_bedrooms: 4,
    number_of_bathrooms: 5,
    listedDate: '2025-09-17T12:01:27.743Z',
    landSize: 3500,
    property_type: PropertyType.CONDO,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

const mockHome = {
  id: 1,
  address: '111 Axe Ave',
  city: 'Dallas',
  price: 500000,
  image: 'img5',
  number_of_bedrooms: 4,
  number_of_bathrooms: 5,
  listedDate: '2025-09-17T12:01:27.743Z',
  landSize: 3500,
  property_type: PropertyType.CONDO,
};

const mockImages = [
  {
    id: 1,
    url: 'src1',
  },
  {
    id: 2,
    url: 'src2',
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
              // Mocking findMany function using jest.fn(). The mockReturn value I use to define the function return
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              // Mocking create function
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHome', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };

    it('should call prisma home.findMany with correct params', async () => {
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

    it('should thrown not found exception if not homes are found', async () => {
      // Creating a mock function using jest and defining the return
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      // When we use spyOn it means that instead of using prismaService.home.findMany in home.service.ts we are gonna use mockPrismaFindManyHomes
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      // Expect getHomes returns a error
      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createHome', () => {
    const mockCreateHomeParams = {
      address: '111 Axe Ave',
      numberOfBedrooms: 2,
      numberOfBathrooms: 2,
      city: 'Vancouver',
      price: 3000000,
      landSize: 444,
      propertyType: PropertyType.RESIDENTIAL,
      images: [
        {
          url: 'src1',
        },
      ],
    };

    it('should call prisma home.create with the correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      await service.createHome(mockCreateHomeParams, 5);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: '111 Axe Ave',
          number_of_bedrooms: 2,
          number_of_bathrooms: 2,
          city: 'Vancouver',
          price: 3000000,
          land_size: 444,
          property_type: PropertyType.RESIDENTIAL,
          realtor_id: 5,
        },
      });
    });

    it('should call prisma image.createMany with the correct payload', async () => {
      const mockCreateManyImages = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImages);

      await service.createHome(mockCreateHomeParams, 5);

      expect(mockCreateManyImages).toBeCalledWith({
        data: [
          {
            url: 'src1',
            home_id: 1,
          },
        ],
      });
    });
  });
});
