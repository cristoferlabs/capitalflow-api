import { InterestRateStrategy } from './InterestRateStrategy';

/** Plazo 7–12 meses → TNA 10.0% */
export class MediumTermRateStrategy implements InterestRateStrategy {
  readonly name = 'mediano-plazo';

  supports(plazoMeses: number): boolean {
    return plazoMeses >= 7 && plazoMeses <= 12;
  }

  getTasaAnual(): number {
    return 0.1;
  }
}
