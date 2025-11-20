"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const water_controller_1 = require("./water.controller");
const water_service_1 = require("./water.service");
const water_schema_1 = require("./water.schema");
const user_schema_1 = require("../user/user.schema");
const events_module_1 = require("../events/events.module");
let WaterModule = class WaterModule {
};
exports.WaterModule = WaterModule;
exports.WaterModule = WaterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: water_schema_1.Water.name, schema: water_schema_1.WaterSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            events_module_1.EventsModule,
        ],
        controllers: [water_controller_1.WaterController],
        providers: [water_service_1.WaterService],
    })
], WaterModule);
//# sourceMappingURL=water.module.js.map