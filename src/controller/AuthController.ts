import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { validate } from "class-validator";
import { ApiResponser } from "../helpers/ApiResponser";
import lang from "../lang/lang.es";
class AuthController {
  static login = async (req: Request, res: Response) => {
    // Obtener y Validar los campos requeridos
    const { email, password } = req.body;
    if (!(email && password)) {
      return ApiResponser.errorResponse(req, res, {
        code: 401,
        messages: [lang.EMAIL_AND_PASSWORD_REQUIRED],
      });
    }
    // Buscar en la DB
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      return ApiResponser.errorResponse(req, res, {
        code: 401,
        messages: [lang.LOGIN_FAILED],
      });
    }
    let existe: boolean = false;
    // Check password
    if (!user.checkPassword(password)) {
      return ApiResponser.errorResponse(req, res, {
        code: 401,
        messages: [lang.LOGIN_FAILED],
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: "1h" });
    if (token != null && token != undefined) {
      return ApiResponser.successResponse(req, res, {
        code: 200,
        data: {
          token,
        },
      });
    } else {
      return ApiResponser.errorResponse(req, res, {
        code: 401,
        messages: [lang.UNAUTHORIZED],
      });
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const token = req.headers.authorization;
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      return ApiResponser.errorResponse(req, res, { code: 422, messages: [lang.OLD_PASSWORD_REQUIRED] });
    }
    try {
      let payload: any = jwt.verify(token, config.jwtSecret);
      payload = { id: payload.userId, ...payload };
      delete payload.userId;
      let user: User = await userRepository.findOneOrFail(payload.id);
      if (!user.checkPassword(oldPassword)) {
        return ApiResponser.errorResponse(req, res, { code: 422, messages: [lang.OLD_PASSWORD_FAILED] });
      }
      user.password = newPassword;
      const validationOps = { validationError: { target: false, value: false } };
      const errors = await validate(user, validationOps);

      if (errors.length > 0) {
        return ApiResponser.errorResponse(req, res, { code: 422, messages: [lang.VALIDATION_ERROR], errors: errors });
      }
      //Hash password
      user.hashPassword();
      userRepository.save(user);
      return ApiResponser.successResponse(req, res, { code: 200, messages: [lang.SUCCESS] });
    } catch (error) {
      return ApiResponser.errorResponse(req, res, { code: 401, messages: [lang.UNAUTHORIZED] });
    }
  };

  static profile = async (req: Request, res: Response) => {
    jwt.verify(req.headers.authorization, config.jwtSecret, function (err, user) {
      if (err) {
        return ApiResponser.errorResponse(req, res, {
          code: 401,
          messages: [lang.UNAUTHORIZED],
        });
      }
      if (user) {
        // @ts-ignore
        const id = user.userId;
        // @ts-ignore
        delete user.userId;
        return ApiResponser.successResponse(req, res, { data: { id, ...user }, code: 200 });
      }
    });
  };
}
export default AuthController;
