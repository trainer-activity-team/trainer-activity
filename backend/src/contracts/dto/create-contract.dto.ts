import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateContractDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  institutionId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pricingModeId: number;

  @IsNotEmpty()
  contractNumber: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  hourlyVolumePlanned: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitPrice: number;
}
