import mongoose from 'mongoose';
export const requireCompanyIfNotSuperadmin = (req, res, next) => {
  if (req.user?.isSuperadmin) return next();
  const id = req.user?.businessID;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'No existe una empresa valida asignada al usuario',
      });
  }
  next();
};
