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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { QueryInteractionsDto } from './dto/query-interactions.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.gurad';

@ApiTags('Interactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('interactions')
export class InteractionsController {
  constructor(
    private readonly interactionsService: InteractionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'ثبت تعامل دارویی جدید' })
  @ApiResponse({ status: 201, description: 'تعامل با موفقیت ثبت شد' })
  @ApiResponse({ status: 404, description: 'دارو یافت نشد' })
  @ApiResponse({ status: 409, description: 'تعامل تکراری یا ورودی نامعتبر' })
  create(@Body() dto: CreateInteractionDto) {
    return this.interactionsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'جست‌وجو، فیلتر و دریافت صفحه‌بندی‌شده تعاملات',
  })
  findAll(@Query() query: QueryInteractionsDto) {
    return this.interactionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات یک تعامل دارویی' })
  @ApiParam({ name: 'id', description: 'شناسه UUID تعامل' })
  @ApiResponse({ status: 404, description: 'تعامل یافت نشد' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.interactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ویرایش تعامل دارویی' })
  @ApiParam({ name: 'id', description: 'شناسه UUID تعامل' })
  @ApiResponse({ status: 404, description: 'تعامل یافت نشد' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInteractionDto,
  ) {
    return this.interactionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'غیرفعال‌سازی تعامل دارویی' })
  @ApiParam({ name: 'id', description: 'شناسه UUID تعامل' })
  @ApiResponse({
    status: 200,
    description: 'تعامل با موفقیت غیرفعال شد',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.interactionsService.remove(id);
  }
}
