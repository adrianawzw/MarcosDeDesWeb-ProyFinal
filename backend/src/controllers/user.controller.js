import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany();

    const fixedUsers = users.map((user) => ({
      ...user,
      id_usuario: user.id_usuario.toString(), // convierte BigInt a string
    }));

    res.json(fixedUsers);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};
