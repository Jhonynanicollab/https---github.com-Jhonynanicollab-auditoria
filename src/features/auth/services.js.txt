import { firebaseService } from "@/firebase/auth";

export const registerUser = async (email, password) => {
  const newUser = await firebaseService.registerUser(email, password);
  if (newUser) {
    return { message: "Usuario registrado correctamente", user: newUser };
  } else {
    return { message: "Error al registrar el usuario" };
  }
};
