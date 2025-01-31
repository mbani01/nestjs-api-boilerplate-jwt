import {
  Controller,
  Put,
  Get,
  Body,
  Res,
  Param,
  UseGuards,
  HttpStatus,
  NotFoundException,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { IUsers } from './interfaces/users.interface';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../iam/login/decorators/auth-guard.decorator';
import { AuthType } from '../iam/login/enums/auth-type.enum';

@ApiTags('users')
@AuthGuard(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async findAllUser(): Promise<IUsers[]> {
    return this.usersService.findAll();
  }

  @Get('/:userId')
  public async findOneUser(@Param('userId') userId: string): Promise<IUsers> {
    return this.usersService.findById(userId);
  }

  @Get('/:userId/profile')
  public async getUser(@Param('userId') userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return {
      user: user,
      status: HttpStatus.OK,
    };
  }

  @Put('/:userId/profile')
  public async updateProfileUser(
    @Param('userId') userId: string,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<any> {
    try {
      await this.usersService.updateProfileUser(userId, userProfileDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Put('/:userId')
  public async updateUser(
    @Param('userId') userId: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    try {
      await this.usersService.updateUser(userId, userUpdateDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Delete('/:userId')
  public async deleteUser(@Param('userId') userId: string): Promise<void> {
    const user = this.usersService.deleteUser(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }
}
