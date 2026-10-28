
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from 'src/common/guards/auth.gurad';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(
    private readonly prescriptionsService: PrescriptionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'ثبت نسخه برای مشتری و بررسی تداخل داروها' })
  @ApiResponse({ status: 201, description: 'نسخه ثبت شد' })
  @ApiResponse({ status: 404, description: 'مشتری یا دارو یافت نشد' })
  @ApiResponse({ status: 409, description: 'مشتری یا داروی غیرفعال' })
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(dto);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'دریافت تاریخچه نسخه‌های مشتری' })
  findAllByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    return this.prescriptionsService.findAllByCustomer(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات نسخه و نتایج بررسی تداخل' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.findOne(id);
  }
}
