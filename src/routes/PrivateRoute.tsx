import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import type { ReactNode } from 'react';

import { AuthContext } from '../contexts/AuthContext';

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
