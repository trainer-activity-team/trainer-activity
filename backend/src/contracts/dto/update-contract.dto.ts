import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateContractDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  institutionId?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  pricingModeId?: number;

  @IsNotEmpty()
  @IsOptional()
  contractNumber?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  hourlyVolumePlanned?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  unitPrice?: number;
}
