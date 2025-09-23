import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/generateToken.js"; // asegúrate de tener este helper

const prisma = new PrismaClient();

// ---------------------- REGISTER ----------------------
export const register = async (req, res) => {
  try {
    const {
      email,
      nombre,
      apellido,
      dni,
      direccion,
      telefono,
      password,
      fechaNacimiento,
    } = req.body;

    if (!email || !nombre || !apellido || !dni || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos obligatorios no fueron llenados" });
    }

    const userExist = await prisma.usuario.findUnique({
      where: { correo: email },
    });
    if (userExist) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const dniExist = await prisma.usuario.findUnique({
      where: { dni },
    });
    if (dniExist) {
      return res.status(400).json({ error: "El DNI ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        dni,
        rol: "paciente", // fijo
        direccion,
        telefono,
        correo: email,
        password: hashedPassword,
      },
    });

    // Crear paciente
    await prisma.paciente.create({
      data: {
        id_usuario: usuario.id_usuario,
        fecha_nacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
      },
    });

    return res.status(201).json({
      message: "Paciente registrado con éxito",
      token: generateToken(usuario),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar paciente" });
  }
};

// ---------------------- LOGIN ----------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo: email },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    return res.json({
      message: "Login exitoso",
      token: generateToken(usuario),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
