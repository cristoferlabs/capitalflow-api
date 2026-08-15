import { InterestRateStrategy } from './InterestRateStrategy';

/** Plazo 13–24 meses → TNA 12.5% */
export class LongTermRateStrategy implements InterestRateStrategy {
  readonly name = 'largo-plazo';

  supports(plazoMeses: number): boolean {
    return plazoMeses >= 13 && plazoMeses <= 24;
  }

  getTasaAnual(): number {
    return 0.125;
  }
}
