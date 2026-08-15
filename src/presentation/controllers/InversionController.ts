import { Request, Response, NextFunction } from 'express';
import { InversionService } from '../../application/services/InversionService';
import {
  CrearInversionDto,
  SimularInversionDto,
} from '../../application/dto/InversionDto';

export class InversionController {
  constructor(private readonly service: InversionService) {}

  simular = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto = req.body as SimularInversionDto;
      const resultado = this.service.simular(dto);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CrearInversionDto;
      const inversion = await this.service.registrar(dto);

      res.status(201).json({
        success: true,
        data: inversion,
      });
    } catch (error) {
      next(error);
    }
  };

  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const inversiones = await this.service.listar();

      res.status(200).json({
        success: true,
        data: inversiones,
      });
    } catch (error) {
      next(error);
    }
  };

  listarPorUsuario = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const usuarioId = String(req.params.id);
      const inversiones = await this.service.listarPorUsuario(usuarioId);

      res.status(200).json({
        success: true,
        data: inversiones,
      });
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const inversion = await this.service.obtenerPorId(id);

      res.status(200).json({
        success: true,
        data: inversion,
      });
    } catch (error) {
      next(error);
    }
  };
}
