import path from "path";
import User from "../models/User.js";
import StatusCodes from "http-status-codes";
import fs from 'fs';


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
    "-password -_id -token -confirmed"
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

  const userName = user.username;
  const photoProfileUsername = user.photoProfile;

  // Alternativa moderna, debo optimizar el código
  //   const regex = new RegExp(`\\b${palabra}\\b`, 'i'); // 'i' para case-insensitive
  // const existe = regex.test(texto);

  // if (!photoProfileUsername.includes(userName)) {
  //   console.log("The photo profile does not match the username");
  // } else {
  //   console.log("The photo profile matches the username");
  // }


  console.log(req.file)
  // if (user.photoProfile) {
  //   const oldPhoto = path.join("src/uploads", user.photoProfile);

  //   if (fs.existsSync(oldPhoto)) {
  //     fs.unlink(oldPhoto, (err) => {
  //       if (err) {
  //         throw new ErrorResponse(
  //           "Ha ocurrido un error al eliminar la foto de perfil anterior"
  //         );
  //       } else {
  //         console.log("Foto de perfil eliminada correctamente");
  //       }
  //     });
  //   }
  // }

  user.photoProfile = req.file.photoProfile;
  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "User updated",
    user,
  });

};

export const deleteUser = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;

  console.log(req.body);

  const user = await User.findByIdAndDelete(
    { _id: id },
    { returnDocument: "before" }
  );

  if (!user) throw new ErrorResponse("User not found");

  res.status(StatusCodes.OK).json({
    msg: "User deleted",
    user,
  });
};
