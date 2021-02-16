import { IsEmail, isNotEmpty, IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  dni: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  surname: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  phone: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column("text")
  @IsNotEmpty()
  gender: Gender;

  @Column()
  @IsNotEmpty()
  birthday: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}

enum Gender {
  Male = "Masculino",
  Female = "Femenino",
}
