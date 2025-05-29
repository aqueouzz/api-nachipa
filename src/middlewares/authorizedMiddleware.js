import { permissionsComplete } from '../utils/permissions.js';

import User from '../models/User.js';

import { BadRequestError, ForbiddenError } from '../error/errorResponse.js';

// ✅ :  Antes se valida que este asociado al modelo empresa
// ✅ :  Se valida que tenga un Rol y que tenga permisos para realizar una acción específica en un modelo específico.s
export const authorizeAction = (action, model) => {
  return async (req, res, next) => {
    const userCount = await User.countDocuments();

    // ✅ Si no hay usuarios, permitir el paso sin importar headers
    if (userCount === 0) {
      return next(); // No hay usuarios: permite el acceso
    }

    const role = req.user?.role;

    if (!role) {
      throw new ForbiddenError('Rol no definido!');
    }

    // ✅ : si el rol es superadmin, permitir el paso sin validar sus permisos
    // ❌ : Pero deberia validar hasta que punto puede eliminar o editar
    if (req.user.role === 'superadmin') {
      return next();
    }

    const modelPermissions = permissionsComplete[model];

    if (!modelPermissions) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para realizar esta acción!' });
    }

    const allowedActions = modelPermissions[role] || [];

    if (!allowedActions.includes(action)) {
      throw new ForbiddenError(
        `No tienes permiso para realizar esta acción: ${action} en ${model}`
      );
    }

    next();
  };
};
