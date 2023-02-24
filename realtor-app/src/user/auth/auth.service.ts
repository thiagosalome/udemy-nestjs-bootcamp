import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  private generateJWT(id: number, name: string) {
    return jwt.sign(
      {
        id,
        name,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600,
      },
    );
  }

  async signup(
    { email, password, name, phone }: SignupParams,
    userType: UserType,
  ) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      // The nestjs/common makes avalilable many types of exeption
      throw new ConflictException('The user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });

    const token = await this.generateJWT(user.id, name);

    return { token };
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;

    const isValidPassowrd = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassowrd) {
      throw new HttpException('Invalid credentials', 400);
    }

    const token = await this.generateJWT(user.id, user.name);

    return { token };
  }

  async generateProductKey(email: string, userType: UserType) {
    const stringKey = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    const key = await bcrypt.hash(stringKey, 10);

    return { key };
  }
}
