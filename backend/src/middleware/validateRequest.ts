import { NextFunction, Request, Response } from 'express';
import { z, ZodError, ZodTypeAny } from 'zod';

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        color: z
          .string()
          .regex(/^#([0-9A-Fa-f]{6})$/, {
            message: 'Värin on oltava heksadesimaalikoodi, esim. #FF0000',
          }),
        text: z.string().min(1, 'Teksti ei voi olla tyhjä').max(20, 'Teksti saa olla enintään 20 merkkiä'),
        quantity: z.number().int('Määrän tulee olla kokonaisluku').min(1, 'Määrän tulee olla vähintään 1'),
      })
    )
    .min(1, 'Tilauksessa on oltava vähintään yksi tuote'),
  customerInfo: z.object({
    name: z.string().min(1, 'Nimi ei voi olla tyhjä'),
    address: z.string().min(1, 'Osoite ei voi olla tyhjä'),
  }),
});

export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.issues,
        });
      }
      next(error as Error);
    }
  };
}
