import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { JwtAuthGuard } from '../../common/guards/auth.gurad';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد کاربر جدید' })
  @ApiResponse({ status: 201, description: 'کاربر با موفقیت ایجاد شد' })
  @ApiResponse({ status: 409, description: 'ایمیل قبلاً ثبت شده است' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'دریافت لیست کاربران با جست‌وجو، فیلتر و صفحه‌بندی',
  })
  @ApiResponse({ status: 200, description: 'لیست کاربران دریافت شد' })
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت اطلاعات یک کاربر' })
  @ApiResponse({ status: 200, description: 'اطلاعات کاربر دریافت شد' })
  @ApiResponse({ status: 404, description: 'کاربر پیدا نشد' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ویرایش اطلاعات کاربر' })
  @ApiResponse({ status: 200, description: 'اطلاعات کاربر ویرایش شد' })
  @ApiResponse({ status: 404, description: 'کاربر پیدا نشد' })
  @ApiResponse({ status: 409, description: 'ایمیل قبلاً ثبت شده است' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف کاربر' })
  @ApiResponse({ status: 200, description: 'کاربر حذف شد' })
  @ApiResponse({ status: 404, description: 'کاربر پیدا نشد' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
