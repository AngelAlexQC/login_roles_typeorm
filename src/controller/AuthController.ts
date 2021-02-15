import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";

class AuthController {
  static login = async (req: Request, res: Response) => {
    // Obtener y Validar los campos requeridos
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json({
        message: "Email & Password are required",
      });
    }
    // Buscar en la DB
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      return res.status(400).json({ message: "Email or password incorrect!" });
    }
    res.send(user);
  };
}
export default AuthController;
