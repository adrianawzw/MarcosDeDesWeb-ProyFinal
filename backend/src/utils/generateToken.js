import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_super_segura";
const JWT_EXPIRES_IN = "1h";

// Generar token
export const generateToken = (usuario) => {
  return jwt.sign(
    {
      id: String(usuario.id_usuario), // convertir BigInt a String
      correo: usuario.correo,
      rol: usuario.rol,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verificar token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
