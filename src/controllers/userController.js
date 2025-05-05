import path from "path";
import User from "../models/User.js";
import StatusCodes from "http-status-codes";
import fs from "fs/promises";
import { BadRequestError } from "../error/errorResponse.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password -_id -token -confirmed");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select(
    "-password -_id -token -confirmed -state -internalRol -accessAplications"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: "User not found",
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

export const updateUser = async (req, res) => {
  // Obtenemos el ID de parametros de la solicitud



  const userId = req.params.id;
  const user = await User.findById(userId);

 if (user.confirmed === false) throw new BadRequestError("Usuario no puede actualizarse")

  if (!user)
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "User ID is no valid" });

  const userName = user.username;
  const photoProfileUsername = user.photoProfile;
  // Alternativa moderna, debo optimizar el código
  //   const regex = new RegExp(`\\b${palabra}\\b`, 'i'); // 'i' para case-insensitive
  // const existe = regex.test(texto);

  if (!photoProfileUsername.includes(userName)) {
    console.log("The photo profile does not match the username");
  } else {
    console.log("The photo profile matches the username");
  }

  if (user.photoProfile) {
    const oldPhoto = path.join("src/uploads", path.basename(user.photoProfile));

    // Antes de guardar la nueva imagen, el código elimina la imagen anterior si existe:
    try {
      // Verifica si el archivo existe intentando acceder a él
      await fs.access(oldPhoto);

      // Si no lanza error, el archivo existe, entonces lo borramos
      await fs.unlink(oldPhoto);
      console.log("Foto de perfil eliminada correctamente");
    } catch (err) {
      // Si el error es porque no existe el archivo, lo ignoramos
      if (err.code !== "ENOENT") {
        throw new ErrorResponse(
          "Ha ocurrido un error al eliminar la foto de perfil anterior"
        );
      }
    }

    // 🔁 Evita actualizar todos los campos que vienen en req.body
    const camposProhibidos = ["_id", "internalRol", "rol", "state", "token"];

    // Recorre los campos que vienen en el body y los asigna al usuario
    Object.entries(req.body).forEach(([key, value]) => {
      if (!camposProhibidos.includes(key)) {
        user[key] = value;
      }
    });

    // Crear nombre único de archivo
    const uploadDir = path.join("src/uploads");
    const extension = path.extname(req.file.originalname);
    const filename = `${Date.now()}-${user.username}${extension}`;
    const filePath = path.join(uploadDir, filename);

    if (req.file) {
      
      try {
        await fs.mkdir(uploadDir, { recursive: true }); // No falla si ya existe
      } catch (err) {
        console.error("Error creando carpeta:", err);
        return res.status(500).json({
          success: false,
          message: "Error al crear carpeta de subida.",
        });
      }

      // Guardar el archivo desde el buffer en disco
      try {
        await fs.writeFile(filePath, req.file.buffer);
        user.photoProfile = `/uploads/${filename}`;
      } catch (err) {
        console.error("Error al guardar archivo:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error al guardar la imagen." });
      }
    }

    // Asignar path accesible públicamente
    // Actualza la url de la imagen nueva
    const photoUrl = `/uploads/${filename}`;
    user.photoProfile = photoUrl;
  }

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "User updated",
    user,
  });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;


  const user = await User.findByIdAndDelete(
    { _id: id },
    { returnDocument: "before" }
  );

  if (!user) throw new BadRequestError("User not found");

  res.status(StatusCodes.OK).json({
    msg: "User deleted",
    user,
  });
};
