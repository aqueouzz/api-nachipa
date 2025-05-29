export const permissionsComplete = {
  user: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['create', 'read', 'update', 'delete_own'],
    user: ['read_own', 'create_own', 'update_own'],
  },
  business: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['create_own', 'read_own', 'update_own'],
    user: ['read_own'],
  },
  ubication: {
    superadmin: [
      'create',
      'create_own',
      'read',
      'read_own',
      'update',
      'delete',
    ],
    admin: ['create_own', 'read_own', 'update_own', 'delete_own'],
    user: [],
  },
  user: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['read_own', 'update_own'],
    user: ['update_own', 'read_own'],
  },

  area: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['create_own', 'read_own', 'update_own'],
    user: [''],
  },
  titulo: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['read_own', 'update_own'],
    user: ['update_own', 'read_own'],
  },
  rol: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['read_own', 'update_own'],
    user: ['update_own', 'read_own'],
  },
  course: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['read_own', 'update_own'],
    user: ['update_own', 'read_own'],
  },
  userCourse: {
    superadmin: ['create', 'read', 'update', 'delete'],
    admin: ['create_own', 'read_own', 'update_own'],
    user: ['read_own'],
  },
  // Agrega otros modelos según sea necesario
};
