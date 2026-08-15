import { SimuladorService } from './SimuladorService';

describe('SimuladorService (Unit Tests)', () => {
  let service: SimuladorService;

  beforeEach(() => {
    service = new SimuladorService();
  });

  it('debe aplicar la tasa del 8% para un plazo de 6 meses', () => {
    const resultado = service.calcular(1000, 6);
    expect(resultado.tasaAplicada).toBe(0.08);
    expect(resultado.gananciaEstimada).toBe(40);
  });

  it('debe escalar automáticamente a la tasa del 10% para plazos de 12 meses', () => {
    const resultado = service.calcular(1000, 12);
    expect(resultado.tasaAplicada).toBe(0.1);
    expect(resultado.gananciaEstimada).toBe(100);
  });

  it('debe lanzar una excepción si el monto es menor a S/ 100', () => {
    expect(() => service.calcular(50, 12)).toThrow('El monto mínimo es S/ 100');
  });
});
