import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/auth.service';

const useAuth = () => {
  const user = AuthService.getCurrentUser();
  //   const user = { loggedIn: false };
  return user && user.token;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
