import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  try {
    // Hashowanie hasła
    const password_hash = await bcrypt.hash(password, 10);

    // Wstawienie do bazy
    const result = await db.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, password_hash],
    );

    // Zwracamy tylko dane użytkownika bez tokena
    res.status(201).json({ user: result.rows[0], message: "User registered!" });
  } catch (err: any) {
    if (err.code === "23505") {
      // unikalny email
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Error! Sorry something went wrong" });
  }
};
