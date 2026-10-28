import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { prescriptionMessages } from 'src/common/enums/messages.enum';

import { Customer } from '../customers/entities/customer.entity';
import { Drug } from '../drugs/entities/drug.entity';
import { MedicationChecksService } from '../medication-checks/medication-checks.service';

import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { PrescriptionInteraction } from './entities/prescription-interaction.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly medicationChecksService: MedicationChecksService,

    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,

    @InjectRepository(Drug)
    private readonly drugsRepository: Repository<Drug>,

    @InjectRepository(Prescription)
    private readonly prescriptionsRepository: Repository<Prescription>,
  ) {}

  async create(dto: CreatePrescriptionDto) {
    const customer = await this.customersRepository.findOne({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        prescriptionMessages.PRESCRIPTION_CUSTOMER_NOT_FOUND,
      );
    }

    if (!customer.isActive) {
      throw new ConflictException(
        prescriptionMessages.PRESCRIPTION_CUSTOMER_INACTIVE,
      );
    }

    const drugIds = dto.items.map((item) => item.drugId);

    if (new Set(drugIds).size !== drugIds.length) {
      throw new ConflictException(
        prescriptionMessages.PRESCRIPTION_DUPLICATE_DRUG,
      );
    }

    const drugs = await this.drugsRepository.find({
      where: { id: In(drugIds) },
    });

    if (drugs.length !== drugIds.length) {
      throw new NotFoundException(
        prescriptionMessages.PRESCRIPTION_DRUG_NOT_FOUND,
      );
    }

    if (drugs.some((drug) => !drug.isActive)) {
      throw new ConflictException(
        prescriptionMessages.PRESCRIPTION_DRUG_INACTIVE,
      );
    }

    // بررسی تداخل با منطق موجود پروژه
    const checkResult =
      drugIds.length >= 2
        ? await this.medicationChecksService.check({ drugIds })
        : null;

    const drugsMap = new Map(drugs.map((drug) => [drug.id, drug]));

    return this.dataSource.transaction(async (manager) => {
      const prescriptionRepo = manager.getRepository(Prescription);
      const itemRepo = manager.getRepository(PrescriptionItem);
      const resultRepo = manager.getRepository(PrescriptionInteraction);

      const prescription = await prescriptionRepo.save(
        prescriptionRepo.create({
          customerId: customer.id,
          notes: dto.notes?.trim() || null,
        }),
      );

      const items = dto.items.map((item) => {
        const drug = drugsMap.get(item.drugId)!;

        return itemRepo.create({
          prescriptionId: prescription.id,
          drugId: drug.id,
          drugName: drug.brandName
            ? `${drug.genericName} (${drug.brandName})`
            : drug.genericName,
          strength: drug.strength,
          dosage: item.dosage.trim(),
          frequency: item.frequency.trim(),
          duration: item.duration.trim(),
          instructions: item.instructions?.trim() || null,
          quantity: item.quantity,
        });
      });

      await itemRepo.save(items);

      const results = checkResult?.data.results ?? [];

      if (results.length > 0) {
        await resultRepo.save(
          results.map((pair) =>
            resultRepo.create({
              prescriptionId: prescription.id,
              drugAId: pair.drugA.id,
              drugBId: pair.drugB.id,
              drugAName: pair.drugA.brandName
                ? `${pair.drugA.genericName} (${pair.drugA.brandName})`
                : pair.drugA.genericName,
              drugBName: pair.drugB.brandName
                ? `${pair.drugB.genericName} (${pair.drugB.brandName})`
                : pair.drugB.genericName,
              interactionFound: pair.interactionFound,
              interactionId: pair.interaction?.id ?? null,
              severity: pair.interaction?.severity ?? null,
              description: pair.interaction?.description ?? null,
              recommendation: pair.interaction?.recommendation ?? null,
            }),
          ),
        );
      }

      return {
        message: prescriptionMessages.PRESCRIPTION_CREATED,
        data: {
          ...prescription,
          items,
          interactionResults: results,
          disclaimer:
            checkResult?.data.disclaimer ??
            prescriptionMessages.PRESCRIPTION_SINGLE_DRUG_DISCLAIMER,
        },
      };
    });
  }

  async findAllByCustomer(customerId: string) {
    const customer = await this.customersRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        prescriptionMessages.PRESCRIPTION_CUSTOMER_NOT_FOUND,
      );
    }

    const prescriptions = await this.prescriptionsRepository.find({
      where: { customerId },
      relations: {
        items: true,
        interactionResults: true,
      },
      order: { createdAt: 'DESC' },
    });

    return {
      data: prescriptions,
    };
  }

  async findOne(id: string) {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        items: true,
        interactionResults: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException(prescriptionMessages.PRESCRIPTION_NOT_FOUND);
    }

    return {
      data: prescription,
    };
  }
}
