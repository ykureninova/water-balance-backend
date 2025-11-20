import { IsNumber, Min, Max, IsBoolean, IsOptional } from 'class-validator';

export class AddPortionDto {
  @IsNumber()
  @Min(50)
  @Max(1000)
  amount: number;

  @IsBoolean()
  @IsOptional()
  isCaffeinated?: boolean;
}
