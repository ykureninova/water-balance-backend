"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        console.log('Starting Nest application...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        const mongoUri = configService.get('MONGO_URI');
        logger.log(`MongoDB URI: ${mongoUri ? 'Set' : 'Not set'}`);
        await app.listen(process.env.PORT || 3000);
        logger.log('Application is running on: http://localhost:3000');
    }
    catch (error) {
        logger.error('Error starting application:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map