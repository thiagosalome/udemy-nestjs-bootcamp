import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';

const mockUser = {
  id: 53,
  name: 'Laith',
  email: 'laith@laith.laith',
  phone: '555 555 5555',
};

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

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          // Mocking HomeService
          provide: HomeService,
          useValue: {
            // Mocking getHomes method
            getHomes: jest.fn().mockReturnValue([]),
            // Mocking getRealtorByHomeId method
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            // Mocking updateHomeById
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      // Mocking getHomes method from home service
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);

      // Calling getHomes from controller
      await controller.getHomes('Toronto', '1500000');

      // Checking if mockGetHomes method was called with the correct params
      expect(mockGetHomes).toBeCalledWith({
        city: 'Toronto',
        price: {
          gte: 1500000,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUserInfo = {
      name: 'Laith',
      id: 30,
      iat: 1,
      exp: 2,
    };

    const mockUpdateHomeParams = {
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

    it('should throw unauth error if realtor did not creat home', async () => {
      await expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
