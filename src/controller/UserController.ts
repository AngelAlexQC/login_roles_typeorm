import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";

export class UserController {
  static getAll = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const users = await repository.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(400).json({ message: "Sin Resultados" });
    }
  };

  static findByID = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const { id } = req.params;
    try {
      const user = await repository.findOneOrFail(id);
      res.send(user);
    } catch (error) {
      res.status(404).json({ message: "Not Found" });
    }
  };

  static create = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const { email, password, role } = req.body;
    const user = new User();
    user.email = email;
    user.password = password;
    user.role = role;

    // Validate
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    // TODO: Hash Password

    try {
      await repository.save(user);
    } catch (error) {
      return res.status(409).json({ message: "Email already exist" });
    }
    // All OK
    res.send("User Created!");
  };

  static update = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    let user;
    const { id } = req.params;
    const { email, role } = req.body;

    try {
      user = await repository.findOneOrFail(id);
    } catch (error) {
      return res.status(404).json({ message: "User not found" });
    }
    user.email = email;
    user.role = role;

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    // Try to save User
    try {
      await repository.save(user);
    } catch (error) {
      return res.status(409).json({ message: "Email already in use!" });
    }
    return res.json({ message: "User Updated!" });
  };

  static delete = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const { id } = req.params;
    try {
    } catch (error) {
      return res.status(404).json({ message: "User not found" });
    }
    // Remove User
    repository.delete(id);
    return res.status(201).json({ message: "User deleted" });
  };
}
export default UserController;
