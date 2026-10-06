import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from './config/typeorm-db-config';

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
  ],
})
export class AppModule {}
