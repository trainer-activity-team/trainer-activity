import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { InstitutionIdDto } from './dto/institution-id.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { UpdateInstitutionRequestDto } from './dto/update-institution-request.dto';
import { InstitutionsService } from './institutions.service';

@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get()
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.institutionsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateInstitutionDto) {
    return this.institutionsService.create(payload);
  }

  @Patch()
  update(@Body() payload: UpdateInstitutionRequestDto) {
    const { institutionId, ...updatePayload } = payload;
    return this.institutionsService.update(institutionId, updatePayload as UpdateInstitutionDto);
  }

  @Delete()
  remove(@Body() payload: InstitutionIdDto) {
    return this.institutionsService.remove(payload.institutionId);
  }
}
