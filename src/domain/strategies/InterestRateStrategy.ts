/**
 * Strategy Pattern: contrato para reglas de tasa de interés.
 * Permite agregar tasas promocionales o nuevas franjas sin tocar el servicio.
 */
export interface InterestRateStrategy {
  readonly name: string;
  supports(plazoMeses: number): boolean;
  getTasaAnual(): number;
}
