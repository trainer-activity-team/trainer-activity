import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Institution } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Institution[]> {
    try {
      return await this.prisma.institution.findMany({
        orderBy: { id: 'desc' },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erreur lors de la recuperation des etablissements.',
      );
    }
  }

  async findOne(id: number): Promise<Institution> {
    try {
      const institution = await this.prisma.institution.findUnique({
        where: { id },
      });

      if (!institution) {
        throw new NotFoundException('Etablissement introuvable.');
      }

      return institution;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Erreur lors de la recuperation de l'etablissement.",
      );
    }
  }

  async create(payload: CreateInstitutionDto): Promise<Institution> {
    try {
      return await this.prisma.institution.create({
        data: {
          name: payload.name,
          address: payload.address,
          requiresDeclaration: payload.requiresDeclaration ?? false,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        "Erreur lors de la creation de l'etablissement.",
      );
    }
  }

  async update(id: number, payload: UpdateInstitutionDto): Promise<Institution> {
    try {
      const existing = await this.prisma.institution.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new NotFoundException('Etablissement introuvable.');
      }

      return await this.prisma.institution.update({
        where: { id },
        data: payload,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Erreur lors de la mise a jour de l'etablissement.",
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const existing = await this.prisma.institution.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new NotFoundException('Etablissement introuvable.');
      }

      await this.prisma.institution.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Erreur lors de la suppression de l'etablissement.",
      );
    }
  }
}
