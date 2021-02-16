import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { ApiResponser } from "../helpers/ApiResponser";
import lang from "../lang/lang.es";

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, config.jwtSecret);
    return next();
  } catch (error) {
    return ApiResponser.errorResponse(req, res, { code: 401, messages: [lang.UNAUTHORIZED] });
  }
};
