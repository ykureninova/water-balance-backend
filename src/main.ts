import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    console.log('Starting Nest application...');
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService); 
    const mongoUri = configService.get<string>('MONGO_URI');
    logger.log(`MongoDB URI: ${mongoUri ? 'Set' : 'Not set'}`);
    
    await app.listen(process.env.PORT || 3000);
    logger.log('Application is running on: http://localhost:3000');
  } catch (error) {
    logger.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
