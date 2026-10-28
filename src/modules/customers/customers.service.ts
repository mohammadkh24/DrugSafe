
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { customerMessages } from 'src/common/enums/messages.enum';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto) {
    const nationalCode = dto.nationalCode?.trim() || null;

    if (nationalCode) {
      const exists = await this.customersRepository.exist({
        where: { nationalCode },
      });

      if (exists) {
        throw new ConflictException(
          customerMessages.NATIONAL_CODE_EXISTS,
        );
      }
    }

    const customer = this.customersRepository.create({
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      nationalCode,
      birthDate: dto.birthDate || null,
      notes: dto.notes?.trim() || null,
      isActive: dto.isActive ?? true,
    });

    const savedCustomer = await this.customersRepository.save(customer);

    return {
      message: customerMessages.CUSTOMER_CREATED,
      data: savedCustomer,
    };
  }

  async findAll(query: QueryCustomersDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
  
    const [customers, total] = await this.customersRepository.findAndCount({
      where:
        query.isActive === undefined
          ? {}
          : { isActive: query.isActive },
      order: {
        [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const search = query.search?.trim().toLowerCase();
  
    const filteredCustomers = search
      ? customers.filter(
          (customer) =>
            customer.fullName.toLowerCase().includes(search) ||
            customer.phone.includes(search) ||
            customer.nationalCode?.includes(search),
        )
      : customers;
  
    return {
      message: customerMessages.CUSTOMERS_FETCHED,
      data: filteredCustomers,
      meta: {
        total: search ? filteredCustomers.length : total,
        page,
        limit,
        totalPages: Math.ceil((search ? filteredCustomers.length : total) / limit),
      },
    };
  }

  async findOne(id: string) {
    const customer = await this.customersRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(
        customerMessages.CUSTOMER_NOT_FOUND,
      );
    }

    return {
      message: customerMessages.CUSTOMER_FETCHED,
      data: customer,
    };
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.customersRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(
        customerMessages.CUSTOMER_NOT_FOUND,
      );
    }

    const nationalCode =
      dto.nationalCode === undefined
        ? customer.nationalCode
        : dto.nationalCode.trim() || null;

    if (nationalCode) {
      const exists = await this.customersRepository.exist({
        where: { nationalCode },
      });

      if (exists && nationalCode !== customer.nationalCode) {
        throw new ConflictException(
          customerMessages.NATIONAL_CODE_EXISTS,
        );
      }
    }

    if (dto.fullName !== undefined) {
      customer.fullName = dto.fullName.trim();
    }

    if (dto.phone !== undefined) {
      customer.phone = dto.phone.trim();
    }

    if (dto.nationalCode !== undefined) {
      customer.nationalCode = nationalCode;
    }

    if (dto.birthDate !== undefined) {
      customer.birthDate = dto.birthDate || null;
    }

    if (dto.notes !== undefined) {
      customer.notes = dto.notes.trim() || null;
    }

    if (dto.isActive !== undefined) {
      customer.isActive = dto.isActive;
    }

    const updatedCustomer =
      await this.customersRepository.save(customer);

    return {
      message: customerMessages.CUSTOMER_UPDATED,
      data: updatedCustomer,
    };
  }

  async remove(id: string) {
    const customer = await this.customersRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(
        customerMessages.CUSTOMER_NOT_FOUND,
      );
    }

    if (!customer.isActive) {
      throw new BadRequestException(
        customerMessages.CUSTOMER_ALREADY_INACTIVE,
      );
    }

    customer.isActive = false;

    const updatedCustomer =
      await this.customersRepository.save(customer);

    return {
      message: customerMessages.CUSTOMER_DEACTIVATED,
      data: updatedCustomer,
    };
  }
}
