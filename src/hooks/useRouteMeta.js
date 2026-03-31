import { useLocation } from 'react-router-dom';
import { getRouteMeta } from '../app/routes/routeMeta';

export function useRouteMeta() {
  const location = useLocation();
  return getRouteMeta(location.pathname);
}
