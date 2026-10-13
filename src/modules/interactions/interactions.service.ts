import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Interaction } from './entities/interaction.entity';
import { Drug } from '../drugs/entities/drug.entity';

import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { QueryInteractionsDto } from './dto/query-interactions.dto';
import { interactionMessages } from 'src/common/enums/messages.enum';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionsRepository: Repository<Interaction>,

    @InjectRepository(Drug)
    private readonly drugsRepository: Repository<Drug>,
  ) {}

  // استانداردسازی ترتیب شناسه‌ها برای جلوگیری از ثبت جفت معکوس
  private normalizeDrugIds(drugAId: string, drugBId: string) {
    return [drugAId, drugBId].sort();
  }

  // بررسی وجود و فعال بودن دو دارو
  private async validateDrugs(drugAId: string, drugBId: string) {
    if (drugAId === drugBId) {
      throw new ConflictException(
        interactionMessages.INTERACTION_DRUGS_MUST_DIFFER,
      );
    }

    const [drugA, drugB] = await Promise.all([
      this.drugsRepository.findOneBy({ id: drugAId }),
      this.drugsRepository.findOneBy({ id: drugBId }),
    ]);

    if (!drugA || !drugB) {
      throw new NotFoundException(
        interactionMessages.INTERACTION_DRUG_NOT_FOUND,
      );
    }

    if (!drugA.isActive || !drugB.isActive) {
      throw new ConflictException(
        interactionMessages.INTERACTION_DRUG_INACTIVE,
      );
    }
  }

  // بررسی تکراری نبودن تعامل، حتی با ترتیب معکوس
  private async ensureInteractionDoesNotExist(
    drugAId: string,
    drugBId: string,
    excludeId?: string,
  ) {
    const [firstId, secondId] = this.normalizeDrugIds(drugAId, drugBId);

    const qb = this.interactionsRepository
      .createQueryBuilder('interaction')
      .where(
        `(
          ("interaction"."drugAId" = :firstId
            AND "interaction"."drugBId" = :secondId)
          OR
          ("interaction"."drugAId" = :secondId
            AND "interaction"."drugBId" = :firstId)
        )`,
        { firstId, secondId },
      );

    if (excludeId) {
      qb.andWhere('interaction.id != :excludeId', { excludeId });
    }

    if (await qb.getOne()) {
      throw new ConflictException(
        interactionMessages.INTERACTION_ALREADY_EXISTS,
      );
    }
  }

  private async getInteractionOrFail(id: string) {
    const interaction = await this.interactionsRepository
      .createQueryBuilder('interaction')
      .leftJoinAndSelect('interaction.drugA', 'drugA')
      .leftJoinAndSelect('interaction.drugB', 'drugB')
      .where('interaction.id = :id', { id })
      .getOne();
  
    if (!interaction) {
      throw new NotFoundException(
        interactionMessages.INTERACTION_NOT_FOUND,
      );
    }
  
    return interaction;
  }

  async create(dto: CreateInteractionDto) {
    await this.validateDrugs(dto.drugAId, dto.drugBId);

    const [drugAId, drugBId] = this.normalizeDrugIds(dto.drugAId, dto.drugBId);

    await this.ensureInteractionDoesNotExist(drugAId, drugBId);

    const interaction = this.interactionsRepository.create({
      drugAId,
      drugBId,
      severity: dto.severity,
      description: dto.description.trim(),
      recommendation: dto.recommendation?.trim() || null,
    });

    const savedInteraction =
      await this.interactionsRepository.save(interaction);

    return {
      message: interactionMessages.INTERACTION_CREATED,
      data: savedInteraction,
    };
  }

  async findAll(query: QueryInteractionsDto) {
    const {
      search,
      drugId,
      severity,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.interactionsRepository
    .createQueryBuilder('interaction')
    .leftJoinAndSelect('interaction.drugA', 'drugA')
    .leftJoinAndSelect('interaction.drugB', 'drugB');
    if (search?.trim()) {
      qb.andWhere(
        `(
          interaction.description ILIKE :search
          OR interaction.recommendation ILIKE :search
        )`,
        { search: `%${search.trim()}%` },
      );
    }

    if (drugId) {
      qb.andWhere(
        '(interaction.drugAId = :drugId OR interaction.drugBId = :drugId)',
        { drugId },
      );
    }

    if (severity) {
      qb.andWhere('interaction.severity = :severity', {
        severity,
      });
    }

    if (isActive !== undefined) {
      qb.andWhere('interaction.isActive = :isActive', {
        isActive,
      });
    }

    qb.orderBy(`interaction.${sortBy}`, sortOrder);

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      message: interactionMessages.INTERACTIONS_FETCHED,
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

  async findOne(id: string) {
    const interaction = await this.getInteractionOrFail(id);

    return {
      message: interactionMessages.INTERACTION_FETCHED,
      data: interaction,
    };
  }

  async update(id: string, dto: UpdateInteractionDto) {
    const interaction = await this.getInteractionOrFail(id);

    const drugAId = dto.drugAId ?? interaction.drugAId;
    const drugBId = dto.drugBId ?? interaction.drugBId;

    // اگر شناسه یکی از داروها تغییر کرده، جفت جدید را بررسی کن.
    if (dto.drugAId !== undefined || dto.drugBId !== undefined) {
      await this.validateDrugs(drugAId, drugBId);

      await this.ensureInteractionDoesNotExist(
        drugAId,
        drugBId,
        interaction.id,
      );

      const [normalizedA, normalizedB] = this.normalizeDrugIds(
        drugAId,
        drugBId,
      );

      interaction.drugAId = normalizedA;
      interaction.drugBId = normalizedB;
    }

    if (dto.severity !== undefined) {
      interaction.severity = dto.severity;
    }

    if (dto.description !== undefined) {
      const description = dto.description.trim();

      if (!description) {
        throw new ConflictException('توضیحات تعامل نمی‌تواند خالی باشد');
      }

      interaction.description = description;
    }

    if (dto.recommendation !== undefined) {
      interaction.recommendation = dto.recommendation.trim() || null;
    }

    const updatedInteraction =
      await this.interactionsRepository.save(interaction);

    return {
      message: interactionMessages.INTERACTION_UPDATED,
      data: updatedInteraction,
    };
  }

  async remove(id: string) {
    const interaction = await this.getInteractionOrFail(id);

    interaction.isActive = false;

    await this.interactionsRepository.save(interaction);

    return {
      message: interactionMessages.INTERACTION_DEACTIVATED,
    };
  }
}
