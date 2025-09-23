import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { UserInfo } from 'src/user/decorators/user.decorator';

interface GetHomesParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propoertyType?: PropertyType;
}

interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}

interface UpdateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: GetHomesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        listed_date: true,
        land_size: true,
        property_type: true,
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

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map((home) => {
      const fetchHome = {
        ...home,
        image: home.images[0].url,
      };
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }

  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        property_type: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome(
    {
      address,
      numberOfBedrooms,
      numberOfBathrooms,
      city,
      price,
      landSize,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        city,
        price,
        land_size: landSize,
        property_type: propertyType,
        realtor_id: userId,
      },
    });

    const homeImages = images.map((image) => ({
      ...image,
      home_id: home.id,
    }));

    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return new HomeResponseDto(home);
  }

  async updateHomeById(id: number, data: UpdateHomeParams) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException(`Home  not found`);
    }

    const updatedHome = await this.prismaService.home.update({
      where: {
        id,
      },
      data,
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    // I added this code into Image model
    // Home @relation(fields: [home_id], references: [id], onDelete: Cascade)

    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException(`Home  not found`);
    }

    await this.prismaService.home.delete({
      where: {
        id,
      },
    });
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      // With this select I define what I want to get from home table. In this case I only want to realtor params
      select: {
        // Select to return not only the realtor id, but other properties
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return home.realtor;
  }

  async inquire(buyer: UserInfo, homeId: number, message: string) {
    // Find the realtor that owns this house
    const realtor = await this.getRealtorByHomeId(homeId);

    // Create the message
    return this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        message,
      },
    });
  }

  async getMessagesByHome(homeId: number) {
    return this.prismaService.message.findMany({
      where: {
        home_id: homeId,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }
}
