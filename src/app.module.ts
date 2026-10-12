import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from './config/typeorm-db-config';
import { DrugsModule } from './modules/drugs/drugs.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { MedicationChecksModule } from './modules/medication-checks/medication-checks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
      inject: [ConfigService],
    }),

    DrugsModule,
    InteractionsModule,
    MedicationChecksModule,
  ],
})
export class AppModule {}
