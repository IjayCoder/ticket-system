import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(
  schema: ZodSchema,
  property: "body" | "query" | "params" = "body"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync(req[property]);
      req[property] = parsedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }

      next(error);
    }
  };
}
