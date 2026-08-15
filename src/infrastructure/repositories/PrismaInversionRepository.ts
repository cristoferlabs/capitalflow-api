import { Prisma, PrismaClient } from '@prisma/client';
import {
  EstadoInversion,
  Inversion,
  InversionConUsuario,
} from '../../domain/entities/Inversion';
import { IInversionRepository } from '../../domain/repositories/IInversionRepository';
import { AppError } from '../../shared/errors/AppError';

type DecimalLike = Prisma.Decimal | number | string;

type InversionRecord = {
  id: string;
  usuarioId: string;
  monto: DecimalLike;
  plazoMeses: number;
  tasaAnual: DecimalLike;
  ganancia: DecimalLike;
  montoFinal: DecimalLike;
  estado: string;
  creadaEn: Date;
};

type InversionConUsuarioRecord = InversionRecord & {
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
};

function toNumber(value: DecimalLike): number {
  return typeof value === 'number' ? value : Number(value);
}

export class PrismaInversionRepository implements IInversionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * ACID vía Prisma.$transaction:
   * valida usuario + insert; rollback automático si falla.
   */
  async saveInTransaction(inversion: Inversion): Promise<Inversion> {
    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.findUnique({
          where: { id: inversion.usuarioId },
          select: { id: true },
        });

        if (!usuario) {
          throw new AppError(
            `Usuario con id "${inversion.usuarioId}" no existe`,
            404,
            'USUARIO_NO_ENCONTRADO'
          );
        }

        return tx.inversion.create({
          data: {
            id: inversion.id,
            usuarioId: inversion.usuarioId,
            monto: inversion.monto,
            plazoMeses: inversion.plazoMeses,
            tasaAnual: inversion.tasaAnual,
            ganancia: inversion.ganancia,
            montoFinal: inversion.montoFinal,
            estado: inversion.estado,
            creadaEn: inversion.creadaEn,
          },
        });
      });

      return this.mapInversion(created);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new AppError(
          `Usuario con id "${inversion.usuarioId}" no existe`,
          404,
          'USUARIO_NO_ENCONTRADO'
        );
      }

      throw error;
    }
  }

  async findById(id: string): Promise<Inversion | null> {
    const row = await this.prisma.inversion.findUnique({ where: { id } });
    return row ? this.mapInversion(row) : null;
  }

  async findAll(): Promise<Inversion[]> {
    const rows = await this.prisma.inversion.findMany({
      orderBy: { creadaEn: 'desc' },
    });
    return rows.map((row) => this.mapInversion(row));
  }

  /** Equivalente a INNER JOIN inversiones ⋈ usuarios (relación requerida). */
  async findByUsuarioId(usuarioId: string): Promise<InversionConUsuario[]> {
    const rows = await this.prisma.inversion.findMany({
      where: { usuarioId },
      include: { usuario: { select: { id: true, nombre: true, email: true } } },
      orderBy: { creadaEn: 'desc' },
    });

    return rows.map((row) => this.mapInversionConUsuario(row));
  }

  async usuarioExists(usuarioId: string): Promise<boolean> {
    const count = await this.prisma.usuario.count({
      where: { id: usuarioId },
    });
    return count > 0;
  }

  private mapInversion(row: InversionRecord): Inversion {
    return {
      id: row.id,
      usuarioId: row.usuarioId,
      monto: toNumber(row.monto),
      plazoMeses: row.plazoMeses,
      tasaAnual: toNumber(row.tasaAnual),
      ganancia: toNumber(row.ganancia),
      montoFinal: toNumber(row.montoFinal),
      estado: row.estado as EstadoInversion,
      creadaEn: row.creadaEn,
    };
  }

  private mapInversionConUsuario(
    row: InversionConUsuarioRecord
  ): InversionConUsuario {
    return {
      ...this.mapInversion(row),
      usuario: {
        id: row.usuario.id,
        nombre: row.usuario.nombre,
        email: row.usuario.email,
      },
    };
  }
}
