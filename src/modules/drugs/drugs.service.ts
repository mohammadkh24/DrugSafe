import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Drug } from './entities/drug.entity';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { QueryDrugsDto } from './dto/query-drugs.dto';
import { drugMessages } from 'src/common/enums/messages.enum';

@Injectable()
export class DrugsService {
  constructor(
    @InjectRepository(Drug)
    private readonly drugsRepository: Repository<Drug>,
  ) {}

  async create(dto: CreateDrugDto) {
    const genericName = dto.genericName.trim();

    if (!genericName) {
      throw new ConflictException('نام ژنریک دارو نمی‌تواند خالی باشد');
    }

    const drug = this.drugsRepository.create({
      ...dto,
      genericName,
      brandName: dto.brandName?.trim() || null,
      activeIngredient: dto.activeIngredient?.trim() || null,
      strength: dto.strength?.trim() || null,
      dosageForm: dto.dosageForm?.trim() || null,
      description: dto.description?.trim() || null,
    });

    await this.drugsRepository.save(drug);

    return {
      message: drugMessages.DRUG_CREATED,
    };
  }

  async findAll(query: QueryDrugsDto) {
    const {
      search,
      brandName,
      activeIngredient,
      dosageForm,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb: SelectQueryBuilder<Drug> =
      this.drugsRepository.createQueryBuilder('drug');

    if (search?.trim()) {
      qb.andWhere(
        `(
          drug.genericName ILIKE :search
          OR drug.brandName ILIKE :search
          OR drug.activeIngredient ILIKE :search
        )`,
        { search: `%${search.trim()}%` },
      );
    }

    if (brandName?.trim()) {
      qb.andWhere('drug.brandName ILIKE :brandName', {
        brandName: `%${brandName.trim()}%`,
      });
    }

    if (activeIngredient?.trim()) {
      qb.andWhere('drug.activeIngredient ILIKE :activeIngredient', {
        activeIngredient: `%${activeIngredient.trim()}%`,
      });
    }

    if (dosageForm?.trim()) {
      qb.andWhere('drug.dosageForm ILIKE :dosageForm', {
        dosageForm: `%${dosageForm.trim()}%`,
      });
    }

    if (isActive !== undefined) {
      qb.andWhere('drug.isActive = :isActive', { isActive });
    }

    qb.orderBy(`drug.${sortBy}`, sortOrder);

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      message: drugMessages.DRUGS_FETCHED,
      data: {
        items,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
    };
  }

  async findOne(id: string): Promise<Drug> {
    const drug = await this.drugsRepository.findOneBy({ id });

    if (!drug) {
      throw new NotFoundException(drugMessages.DRUG_NOT_FOUND);
    }

    return drug;
  }

  async update(id: string, dto: UpdateDrugDto) {
    const drug = await this.findOne(id);

    if (dto.genericName !== undefined) {
      const genericName = dto.genericName.trim();

      if (!genericName) {
        throw new ConflictException('نام ژنریک دارو نمی‌تواند خالی باشد');
      }

      drug.genericName = genericName;
    }

    if (dto.brandName !== undefined) {
      drug.brandName = dto.brandName.trim() || null;
    }

    if (dto.activeIngredient !== undefined) {
      drug.activeIngredient = dto.activeIngredient.trim() || null;
    }

    if (dto.strength !== undefined) {
      drug.strength = dto.strength.trim() || null;
    }

    if (dto.dosageForm !== undefined) {
      drug.dosageForm = dto.dosageForm.trim() || null;
    }

    if (dto.description !== undefined) {
      drug.description = dto.description.trim() || null;
    }

    if (dto.isActive !== undefined) {
      drug.isActive = dto.isActive;
    }

    const updatedDrug = await this.drugsRepository.save(drug);

    return {
      message: drugMessages.DRUG_UPDATED,
      data: updatedDrug,
    };
  }

  async remove(id: string) {
    const drug = await this.findOne(id);

    drug.isActive = false;
    await this.drugsRepository.save(drug);

    return {
      message: drugMessages.DRUG_DEACTIVATED,
    };
  }
}
