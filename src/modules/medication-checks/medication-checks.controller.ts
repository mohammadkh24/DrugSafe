
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MedicationChecksService } from './medication-checks.service';
import { CheckMedicationsDto } from './dto/create-medication-check.dto';

@ApiTags('Medication Checks')
@Controller('medication-checks')
export class MedicationChecksController {
  constructor(
    private readonly medicationChecksService: MedicationChecksService,
  ) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'بررسی تعاملات ثبت‌شده بین چند دارو',
  })
  @ApiResponse({
    status: 200,
    description: 'نتیجه بررسی جفت‌های دارویی',
  })
  @ApiResponse({
    status: 400,
    description: 'شناسه‌ها یا تعداد داروها نامعتبر است',
  })
  @ApiResponse({
    status: 404,
    description: 'یکی از داروها یافت نشد',
  })
  @ApiResponse({
    status: 409,
    description: 'یکی از داروها غیرفعال است',
  })
  check(@Body() dto: CheckMedicationsDto) {
    return this.medicationChecksService.check(dto);
  }
}
