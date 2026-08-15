import { z } from 'zod';

const plazoMesesSchema = z
  .number({ error: 'El plazo debe ser un número' })
  .int('El plazo debe ser un entero')
  .min(1, 'El plazo mínimo es 1 mes')
  .max(24, 'El plazo máximo es 24 meses');

/** Acepta UUID o entero positivo (número o string numérico). */
export const usuarioIdSchema = z.union([
  z.uuid({ error: 'usuarioId debe ser un UUID válido' }),
  z
    .number({ error: 'usuarioId debe ser un entero positivo' })
    .int('usuarioId debe ser un entero')
    .positive('usuarioId debe ser un entero positivo')
    .transform((id) => String(id)),
  z
    .string()
    .regex(/^\d+$/, 'usuarioId debe ser un UUID o un entero positivo')
    .transform((id) => id),
]);

export const simularInversionSchema = z.object({
  monto: z
    .number({ error: 'El monto debe ser un número' })
    .min(100, 'El monto mínimo es S/ 100')
    .finite('El monto debe ser un número finito'),
  plazoMeses: plazoMesesSchema,
});

export const crearInversionSchema = z.object({
  usuarioId: usuarioIdSchema,
  monto: z
    .number({ error: 'El monto debe ser un número' })
    .min(100, 'El monto mínimo es S/ 100.00')
    .finite('El monto debe ser un número finito'),
  plazoMeses: plazoMesesSchema,
});

export type SimularInversionDto = z.infer<typeof simularInversionSchema>;
export type CrearInversionDto = z.infer<typeof crearInversionSchema>;
