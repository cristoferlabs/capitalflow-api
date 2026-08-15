import { ResultadoSimulacion } from '../../domain/entities/Inversion';
import { InterestRateStrategyFactory } from '../../domain/strategies/InterestRateStrategyFactory';
import { AppError } from '../../shared/errors/AppError';

const MONTO_MINIMO = 100;

/**
 * Servicio de cálculo puro (Strategy Pattern).
 * Sin persistencia: ideal para pruebas unitarias.
 */
export class SimuladorService {
  constructor(
    private readonly rateFactory: InterestRateStrategyFactory = new InterestRateStrategyFactory()
  ) {}

  /**
   * Ganancia = Monto × Tasa_Anual × (Plazo_Meses / 12)
   */
  calcular(monto: number, plazoMeses: number): ResultadoSimulacion {
    if (monto < MONTO_MINIMO) {
      throw new AppError('El monto mínimo es S/ 100', 400, 'MONTO_MINIMO');
    }

    const strategy = this.rateFactory.resolve(plazoMeses);
    const tasaAplicada = strategy.getTasaAnual();
    const gananciaEstimada = this.roundMoney(
      monto * tasaAplicada * (plazoMeses / 12)
    );

    return {
      monto,
      plazoMeses,
      tasaAplicada,
      gananciaEstimada,
      montoTotal: this.roundMoney(monto + gananciaEstimada),
    };
  }

  private roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
