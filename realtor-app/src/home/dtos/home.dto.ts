import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

// Those validations in DTO only works because of whitelist in ValidationPipe in main.ts file
export class HomeResponseDto {
  id: number;

  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({
    name: 'numberOfBedrooms',
  })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({
    name: 'numberOfBathrooms',
  })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  city: string;

  @Exclude()
  listed_date: Date;

  @Expose({
    name: 'listedDate',
  })
  listedDate() {
    return this.listed_date;
  }

  price: number;

  @Exclude()
  @Expose({
    name: 'landSize',
  })
  land_size: number;

  @Expose({
    name: 'landSize',
  })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  property_type: PropertyType;

  @Expose({
    name: 'propertyType',
  })
  propertyType() {
    return this.property_type;
  }

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>) {
    return Object.assign(this, partial);
  }
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  // Error founded. To fix: https://github.com/typestack/class-validator/issues/1873
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}
