import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Drug } from '../drugs/entities/drug.entity';
import { Interaction } from '../interactions/entities/interaction.entity';
import { CheckMedicationsDto } from './dto/create-medication-check.dto';
import { interactionMessages } from 'src/common/enums/messages.enum';

type MedicationCheckPair = {
  drugA: {
    id: string;
    genericName: string;
    brandName: string | null;
  };
  drugB: {
    id: string;
    genericName: string;
    brandName: string | null;
  };
  interactionFound: boolean;
  interaction: {
    id: string;
    severity: Interaction['severity'];
    description: string;
    recommendation: string | null;
  } | null;
};

@Injectable()
export class MedicationChecksService {
  constructor(
    @InjectRepository(Drug)
    private readonly drugsRepository: Repository<Drug>,

    @InjectRepository(Interaction)
    private readonly interactionsRepository: Repository<Interaction>,
  ) {}

  private normalizePair(idA: string, idB: string): string {
    return [idA, idB].sort().join(':');
  }

  async check(dto: CheckMedicationsDto) {
    const drugIds = [...new Set(dto.drugIds)];

    if (drugIds.length < 2) {
      throw new ConflictException(
        'برای بررسی تعامل، حداقل دو داروی متفاوت لازم است',
      );
    }

    const drugs = await this.drugsRepository.find({
      where: { id: In(drugIds) },
    });

    if (drugs.length !== drugIds.length) {
      throw new NotFoundException(
        interactionMessages.INTERACTION_DRUG_NOT_FOUND,
      );
    }

    if (drugs.some((drug) => !drug.isActive)) {
      throw new ConflictException(
        interactionMessages.INTERACTION_DRUG_INACTIVE,
      );
    }

    const interactions = await this.interactionsRepository.find({
      where: {
        drugAId: In(drugIds),
        drugBId: In(drugIds),
        isActive: true,
      },
    });

    const interactionMap = new Map(
      interactions.map((interaction) => [
        this.normalizePair(interaction.drugAId, interaction.drugBId),
        interaction,
      ]),
    );

    const drugsMap = new Map(drugs.map((drug) => [drug.id, drug]));

    const checkedPairs: MedicationCheckPair[] = [];

    for (let i = 0; i < drugIds.length; i++) {
      for (let j = i + 1; j < drugIds.length; j++) {
        const drugA = drugsMap.get(drugIds[i])!;
        const drugB = drugsMap.get(drugIds[j])!;

        const interaction = interactionMap.get(
          this.normalizePair(drugA.id, drugB.id),
        );

        checkedPairs.push({
          drugA: {
            id: drugA.id,
            genericName: drugA.genericName,
            brandName: drugA.brandName,
          },
          drugB: {
            id: drugB.id,
            genericName: drugB.genericName,
            brandName: drugB.brandName,
          },
          interactionFound: Boolean(interaction),
          interaction: interaction
            ? {
                id: interaction.id,
                severity: interaction.severity,
                description: interaction.description,
                recommendation: interaction.recommendation,
              }
            : null,
        });
      }
    }

    return {
      message: 'بررسی داروها با موفقیت انجام شد',
      data: {
        drugsCount: drugs.length,
        pairsChecked: checkedPairs.length,
        interactionsFound: checkedPairs.filter((pair) => pair.interactionFound)
          .length,
        results: checkedPairs,
        disclaimer:
          'این خروجی بر اساس داده‌های آزمایشی ثبت‌شده است. پیدا نشدن تعامل در این سامانه به معنی بی‌خطر بودن ترکیب داروها نیست.',
      },
    };
  }
}
