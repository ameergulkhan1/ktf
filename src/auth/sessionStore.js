// src/auth/sessionStore.js
//
// One login per role, so Admin, Vendor and Customer can be signed in side by side in the
// same browser. Each role's { token, user } lives under its own localStorage key; which
// one a tab uses is decided by the page it is on:
//
//   /admin/*                      -> admin session
//   /vendor/*                     -> vendor session
//   customer-only pages (/cart...) -> customer session
//   anything else (storefront)    -> the session this tab last used, then the most recent login
//
// Previously there was a single `token` slot plus an `adminToken` slot, and each login
// wiped the other, so signing in as a vendor in a second tab silently turned the admin
// tab into a vendor session on its next refresh.

export const ROLES = ['admin', 'vendor', 'user'];

const SESSION_KEY = (role) => `kft_session_${role}`;
const TAB_ROLE_KEY = 'kft_tab_role'; // sessionStorage: survives refresh, private to the tab
const LAST_ROLE_KEY = 'kft_last_role'; // localStorage: most recent login, for new tabs

const CUSTOMER_PATHS = ['/cart', '/checkout', '/orders', '/profile', '/wishlist', '/notifications', '/ai-advisor'];

// Storage can throw (private mode, blocked site data); a missing session is the safe fallback.
const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const roleOfUser = (user) => {
  if (user?.role === 'admin' || user?.role === 'super_admin') return 'admin';
  if (user?.role === 'vendor') return 'vendor';
  return 'user';
};

export const readSession = (role) =>
  safe(() => {
    const raw = localStorage.getItem(SESSION_KEY(role));
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.token && session?.user ? session : null;
  });

export const readAllSessions = () =>
  Object.fromEntries(ROLES.map((role) => [role, readSession(role)]));

const setTabRole = (role) => safe(() => sessionStorage.setItem(TAB_ROLE_KEY, role));

export const saveSession = (role, token, user) => {
  safe(() => {
    localStorage.setItem(SESSION_KEY(role), JSON.stringify({ token, user }));
    localStorage.setItem(LAST_ROLE_KEY, role);
  });
  setTabRole(role);
};

export const updateSessionUser = (role, user) => {
  const session = readSession(role);
  if (session) safe(() => localStorage.setItem(SESSION_KEY(role), JSON.stringify({ ...session, user })));
};

export const clearSession = (role) =>
  safe(() => {
    localStorage.removeItem(SESSION_KEY(role));
    if (localStorage.getItem(LAST_ROLE_KEY) === role) localStorage.removeItem(LAST_ROLE_KEY);
  });

const isUnder = (pathname, prefix) => pathname === prefix || pathname.startsWith(prefix + '/');

// The role whose session a page should use. Panel paths always map to their own role,
// even when that role is signed out, so a vendor session can never render the admin
// panel (or vice versa) — the route guard sends the tab to the right login instead.
export const roleForPath = (pathname = window.location.pathname, sessions = readAllSessions()) => {
  if (isUnder(pathname, '/admin')) return 'admin';
  if (isUnder(pathname, '/vendor')) return 'vendor';
  if (CUSTOMER_PATHS.some((p) => isUnder(pathname, p)) && sessions.user) return 'user';

  const tabRole = safe(() => sessionStorage.getItem(TAB_ROLE_KEY));
  if (tabRole && sessions[tabRole]) return tabRole;

  const lastRole = safe(() => localStorage.getItem(LAST_ROLE_KEY));
  if (lastRole && sessions[lastRole]) return lastRole;

  return ROLES.find((role) => sessions[role]) || 'user';
};

// Remember which session this tab is on, so a refresh of a storefront page stays put.
export const rememberTabRole = (role) => setTabRole(role);

export const getActiveRole = () => roleForPath(window.location.pathname);

export const getTokenForRole = (role) => readSession(role)?.token || null;

export const getActiveToken = () => getTokenForRole(getActiveRole());

// One-time move from the old single-slot keys, so people who are already signed in stay
// signed in after this release.
export const migrateLegacySession = () =>
  safe(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (adminToken && adminUser && !readSession('admin')) {
      const parsed = JSON.parse(adminUser);
      if (parsed) localStorage.setItem(SESSION_KEY('admin'), JSON.stringify({ token: adminToken, user: parsed }));
    }
    if (token && user) {
      const parsed = JSON.parse(user);
      const role = roleOfUser(parsed);
      if (parsed?.id && !readSession(role)) {
        localStorage.setItem(SESSION_KEY(role), JSON.stringify({ token, user: parsed }));
      }
    }
    ['adminToken', 'adminUser', 'token', 'user'].forEach((k) => localStorage.removeItem(k));
  });

// The key prefix lets AuthContext react to logins/logouts made in other tabs.
export const isSessionStorageKey = (key) => key === null || key.startsWith('kft_session_');
