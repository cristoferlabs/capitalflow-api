export type EstadoInversion = 'activa' | 'vencida' | 'cancelada';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  creadoEn: Date;
}

export interface Inversion {
  id: string;
  usuarioId: string;
  monto: number;
  plazoMeses: number;
  tasaAnual: number;
  ganancia: number;
  montoFinal: number;
  estado: EstadoInversion;
  creadaEn: Date;
}

/** Resultado del INNER JOIN inversiones ⋈ usuarios */
export interface InversionConUsuario extends Inversion {
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
}

export interface ResultadoSimulacion {
  monto: number;
  plazoMeses: number;
  tasaAplicada: number;
  gananciaEstimada: number;
  montoTotal: number;
}
