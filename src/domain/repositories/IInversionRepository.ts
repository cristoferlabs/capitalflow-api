import { Inversion, InversionConUsuario } from '../entities/Inversion';

export interface IInversionRepository {
  /** Insert atómico (transacción SQL ACID). */
  saveInTransaction(inversion: Inversion): Promise<Inversion>;
  findById(id: string): Promise<Inversion | null>;
  findAll(): Promise<Inversion[]>;
  /** Historial con INNER JOIN a usuarios. */
  findByUsuarioId(usuarioId: string): Promise<InversionConUsuario[]>;
  usuarioExists(usuarioId: string): Promise<boolean>;
}
