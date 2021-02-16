import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";
import lang from "../lang/lang.es";
import { ApiResponser } from "../helpers/ApiResponser";

export class UserController {
  static getAll = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const users = await repository.find();
    if (users.length > 0) {
      return ApiResponser.successResponse(req, res, { code: 200, messages: [lang.SUCCESS], data: users });
    } else {
      return ApiResponser.errorResponse(req, res, { code: 404, messages: [lang.NO_RECORDS] });
    }
  };

  static findByID = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const { id } = req.params;
    try {
      const user = await repository.findOneOrFail(id);
      return ApiResponser.successResponse(req, res, { code: 200, messages: [lang.SUCCESS], data: user });
    } catch (error) {
      return ApiResponser.errorResponse(req, res, { code: 404, messages: [lang.NO_RECORDS] });
    }
  };

  static create = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const user = new User();
    user.email = email;
    user.password = password;
    user.role = role;

    // Validate
    const validationOptions = { validationError: { target: false, value: false } };
    const errors = await validate(user, validationOptions);
    if (errors.length > 0) {
      return ApiResponser.errorResponse(req, res, {
        code: 422,
        errors: errors.map((error) => {
          return error.toString();
        }),
        messages: [lang.VALIDATION_ERROR],
      });
    }
    // Hash Password
    const userRepository = getRepository(User);
    try {
      user.hashPassword();
      await userRepository.save(user);
    } catch (e) {
      return ApiResponser.errorResponse(req, res, { code: 409, messages: [lang.EMAIL_ALREADY_IN_USE] });
    }
    // All OK
    return ApiResponser.successResponse(req, res, { code: 201, messages: [lang.SUCCESS] });
  };

  static update = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    let user;
    const { id } = req.params;
    const { email, role } = req.body;

    try {
      user = await repository.findOneOrFail(id);
    } catch (error) {
      return ApiResponser.errorResponse(req, res, { code: 404, messages: [lang.NO_RECORDS] });
    }
    user.email = email;
    user.role = role;

    const validationOptions = { validationError: { target: false, value: false } };
    const errors = await validate(user, validationOptions);
    if (errors.length > 0) {
      return ApiResponser.errorResponse(req, res, {
        code: 422,
        errors: errors.map((error) => {
          return error.toString();
        }),
        messages: [lang.VALIDATION_ERROR],
      });
    }
    // Try to save User
    try {
      await repository.save(user);
    } catch (error) {
      return res.status(409).json({ message: lang.EMAIL_ALREADY_IN_USE });
    }
    return ApiResponser.successResponse(req, res, { code: 204, messages: [lang.SUCCESS] });
  };

  static delete = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const { id } = req.params;
    try {
    } catch (error) {
      return ApiResponser.errorResponse(req, res, { code: 404, messages: [lang.NO_RECORDS] });
    }
    // Remove User
    repository.delete(id);
    return ApiResponser.successResponse(req, res, { code: 200, messages: [lang.SUCCESS] });
  };
}
export default UserController;
