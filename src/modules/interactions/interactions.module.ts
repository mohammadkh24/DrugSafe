import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaction } from './entities/interaction.entity';
import { Drug } from '../drugs/entities/drug.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction, Drug])],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
