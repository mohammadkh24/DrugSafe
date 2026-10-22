import { registerAs } from '@nestjs/config';

export enum configKeys {
  App = 'app',
  Db = 'db',
  Jwt = 'jwt',
}

export const appConfig = registerAs(configKeys.App, () => ({
  port: Number(process.env.PORT) || 3000,
}));

export const dbConfig = registerAs(configKeys.Db, () => ({
  port: Number(process.env.DB_PORT) || 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME,
}));

export const JwtConfig = registerAs(configKeys.Jwt, () => ({
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
}));



export const configurations = [
  appConfig,
  dbConfig,
  JwtConfig,
];