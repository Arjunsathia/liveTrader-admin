/**
 * authService.js
 *
 * Mock authentication service.
 * When you connect a real backend, swap out `authenticateUser` only.
 * The AuthProvider and all portals remain unchanged.
 *
 * portalType: 'admin' → routes to /#/admin/dashboard
 * portalType: 'client' → routes to /#/client/dashboard
 */

export const MOCK_USERS = [
  {
    id:         'adm-001',
    email:      'admin@livetrade.pro',
    password:   'admin123',
    name:       'Arjun Sathia',
    initials:   'AS',
    role:       'super-admin',
    portalType: 'admin',
  },
  {
    id:         'adm-002',
    email:      'ops@livetrade.pro',
    password:   'ops123',
    name:       'Ariana Reed',
    initials:   'AR',
    role:       'operations',
    portalType: 'admin',
  },
  {
    id:         'adm-003',
    email:      'audit@livetrade.pro',
    password:   'audit123',
    name:       'Sam Chen',
    initials:   'SC',
    role:       'auditor',
    portalType: 'admin',
  },
  {
    id:         'cli-001',
    email:      'john@example.com',
    password:   'client123',
    name:       'John Doe',
    initials:   'JD',
    role:       'client',
    portalType: 'client',
  },
  {
    id:         'cli-002',
    email:      'jane@example.com',
    password:   'client123',
    name:       'Jane Smith',
    initials:   'JS',
    role:       'client',
    portalType: 'client',
  },
];

/**
 * Authenticate a user with email + password.
 * @returns {Object} The user object (without password) on success.
 * @throws  {Error}  On invalid credentials.
 */
export function authenticateUser(email, password) {
  const found = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password,
  );

  if (!found) {
    throw new Error('Invalid email or password. Please try again.');
  }

  // Strip the password before returning
  const { password: _pw, ...safeUser } = found;
  return safeUser;
}
