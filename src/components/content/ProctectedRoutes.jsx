import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const useAuth = () => {
  const user = AuthService.getCurrentUser();
  //   const user = { loggedIn: false };
  return user && user.token;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.expired_token) {
      console.log(currentUser.expired_token);
      const timerId = timeout(currentUser.expired_token);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [currentUser]);

  const timeout = (value) => {
    setTimeout(() => {
      AuthService.Logout();
      navigate('/');
    }, 1800000 - 10000);
  };
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
