import { InterestRateStrategy } from './InterestRateStrategy';

/** Plazo 1–6 meses → TNA 8.0% */
export class ShortTermRateStrategy implements InterestRateStrategy {
  readonly name = 'corto-plazo';

  supports(plazoMeses: number): boolean {
    return plazoMeses >= 1 && plazoMeses <= 6;
  }

  getTasaAnual(): number {
    return 0.08;
  }
}
