// command: nest g controller auth user
import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import { User, UserInfo } from '../decorators/user.decorator';

// To create this controller is just run 'nest g controller auth user'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // This signup consider 3 types of user (ADMIN, REALTOR, BUYER)
  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValid = await bcrypt.compare(validProductKey, body.productKey);

      if (!isValid) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  // The product key is necessary for ADMIN and REALTOR cases
  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    // console.log('user', user);
    return user;
  }
}
