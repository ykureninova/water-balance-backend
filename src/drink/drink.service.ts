import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DrinkType, DrinkTypeDocument } from './drink.schema';

@Injectable()
export class DrinkService implements OnModuleInit {
  constructor(
    @InjectModel(DrinkType.name)
    private drinkTypeModel: Model<DrinkTypeDocument>,
  ) {}

  // --- AUTO-SEED ON MODULE INIT ---
  async onModuleInit() {
    const exists = await this.drinkTypeModel.countDocuments();

    if (exists === 0) {
      await this.drinkTypeModel.insertMany([
        { name: 'Water', caffeinated: false },
        { name: 'Tea', caffeinated: true },
        { name: 'Coffee', caffeinated: true },
        { name: 'Juice', caffeinated: false },
        { name: 'Milk', caffeinated: false },
        { name: 'Sparkling water', caffeinated: false },
      ]);

      console.log('Default drink types created');
    }
  }

  // --- CRUD ---

  async create(name: string, caffeinated: boolean) {
    return this.drinkTypeModel.create({ name, caffeinated });
  }

  async getAll() {
    return this.drinkTypeModel.find().lean();
  }

  async findById(id: string) {
    return this.drinkTypeModel.findById(id).lean();
  }
}
