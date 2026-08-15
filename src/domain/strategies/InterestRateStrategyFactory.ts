import { InterestRateStrategy } from './InterestRateStrategy';
import { ShortTermRateStrategy } from './ShortTermRateStrategy';
import { MediumTermRateStrategy } from './MediumTermRateStrategy';
import { LongTermRateStrategy } from './LongTermRateStrategy';
import { AppError } from '../../shared/errors/AppError';

export class InterestRateStrategyFactory {
  private readonly strategies: InterestRateStrategy[];

  constructor(strategies?: InterestRateStrategy[]) {
    this.strategies = strategies ?? [
      new ShortTermRateStrategy(),
      new MediumTermRateStrategy(),
      new LongTermRateStrategy(),
    ];
  }

  resolve(plazoMeses: number): InterestRateStrategy {
    const strategy = this.strategies.find((s) => s.supports(plazoMeses));

    if (!strategy) {
      throw new AppError(
        `No hay estrategia de tasa para el plazo de ${plazoMeses} meses. Rango válido: 1–24.`,
        400,
        'PLAZO_NO_SOPORTADO'
      );
    }

    return strategy;
  }

  /** Permite registrar estrategias adicionales (p. ej. tasas promocionales). */
  register(strategy: InterestRateStrategy): void {
    this.strategies.unshift(strategy);
  }
}
