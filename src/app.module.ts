import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { WaterModule } from './water/water.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Подключаем ConfigModule для работы с .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Подключаем PostgreSQL через TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UserModule,
    WaterModule,
    AuthModule, // <- подключаем AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
