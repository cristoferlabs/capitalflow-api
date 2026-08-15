import { randomUUID } from 'crypto';
import {
  Inversion,
  InversionConUsuario,
  ResultadoSimulacion,
} from '../../domain/entities/Inversion';
import { InterestRateStrategyFactory } from '../../domain/strategies/InterestRateStrategyFactory';
import { IInversionRepository } from '../../domain/repositories/IInversionRepository';
import { AppError } from '../../shared/errors/AppError';
import { CrearInversionDto, SimularInversionDto } from '../dto/InversionDto';
import { SimuladorService } from './SimuladorService';

/**
 * Motor de registro y consulta de micro-inversiones.
 * Delega el cálculo al SimuladorService (Strategy Pattern).
 */
export class InversionService {
  private readonly simulador: SimuladorService;

  constructor(
    private readonly repository: IInversionRepository,
    rateFactory: InterestRateStrategyFactory = new InterestRateStrategyFactory()
  ) {
    this.simulador = new SimuladorService(rateFactory);
  }

  simular(dto: SimularInversionDto): ResultadoSimulacion {
    return this.simulador.calcular(dto.monto, dto.plazoMeses);
  }

  async registrar(dto: CrearInversionDto): Promise<Inversion> {
    const usuarioId = String(dto.usuarioId);
    const simulacion = this.simular({
      monto: dto.monto,
      plazoMeses: dto.plazoMeses,
    });

    const inversion: Inversion = {
      id: randomUUID(),
      usuarioId,
      monto: simulacion.monto,
      plazoMeses: simulacion.plazoMeses,
      tasaAnual: simulacion.tasaAplicada,
      ganancia: simulacion.gananciaEstimada,
      montoFinal: simulacion.montoTotal,
      estado: 'activa',
      creadaEn: new Date(),
    };

    return this.repository.saveInTransaction(inversion);
  }

  async listar(): Promise<Inversion[]> {
    return this.repository.findAll();
  }

  async listarPorUsuario(usuarioId: string): Promise<InversionConUsuario[]> {
    const exists = await this.repository.usuarioExists(usuarioId);

    if (!exists) {
      throw new AppError(
        `Usuario con id "${usuarioId}" no encontrado`,
        404,
        'USUARIO_NO_ENCONTRADO'
      );
    }

    return this.repository.findByUsuarioId(usuarioId);
  }

  async obtenerPorId(id: string): Promise<Inversion> {
    const inversion = await this.repository.findById(id);

    if (!inversion) {
      throw new AppError(
        `Inversión con id "${id}" no encontrada`,
        404,
        'INVERSION_NO_ENCONTRADA'
      );
    }

    return inversion;
  }
}
