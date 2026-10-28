
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { QueryDrugsDto } from './dto/query-drugs.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.gurad';

@ApiTags('Drugs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a drug' })
  create(@Body() dto: CreateDrugDto) {
    return this.drugsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Search, filter, sort and paginate drugs',
  })
  findAll(@Query() query: QueryDrugsDto) {
    return this.drugsService.findAll(query);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a drug by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.drugsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a drug' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDrugDto,
  ) {
    return this.drugsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a drug' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.drugsService.remove(id);
  }
}
