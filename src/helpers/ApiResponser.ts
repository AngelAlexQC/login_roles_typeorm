import { Request, Response } from "express";
export class ApiResponser {
  public static successResponse(
    req: Request,
    res: Response,
    {
      data = null,
      messages = null,
      type = "success",
      status = true,
      code = 200,
    }: {
      data?: Object | Array<any>;
      messages?: string | Array<string>;
      type?: string;
      status?: boolean;
      code: number;
    }
  ) {
    return res.status(code).json({
      data,
      messages,
      status,
      type,
      code,
    });
  }
  public static errorResponse(
    req: Request,
    res: Response,
    {
      data = null,
      messages = null,
      errors = null,
      type = "danger",
      status = false,
      code = null,
    }: {
      data?: Object | Array<any>;
      messages: Array<string>;
      errors?: string | Array<any>;
      type?: string;
      status?: boolean;
      code: number;
    }
  ) {
    return res.status(code).json({
      data,
      messages,
      errors,
      status,
      type,
      code,
    });
  }
}
