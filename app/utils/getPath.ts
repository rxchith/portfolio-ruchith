const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/portfolio-ruchith' : '';

/**
 * Ensures a path is prefixed with the basePath in production.
 * @param path The path to prefix (e.g., '/models/chair.glb')
 * @returns The prefixed path
 */
export const getPath = (path: string): string => {
  if (!path) return '';
  // Don't prefix external URLs or paths already starting with the basePath
  if (path.startsWith('http') || path.startsWith('https') || path.startsWith(basePath + '/')) {
    return path;
  }
  
  // Clean the path (ensure it starts with /)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};
