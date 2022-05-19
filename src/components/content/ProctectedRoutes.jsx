import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import jwt_decode from 'jwt-decode';

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
    if (isAuth) {
      let tokens = AuthService.getCurrentUser();
      // const decodedJWT = jwt_decode(tokens.token);
      console.log(tokens);
      const isRunTime = () => {
        const isExpiredJWT = (token) => {
          const dateNow = new Date();
          const miliseconds = dateNow.getTime() / 1000;

          if (tokens.expired_token_timestamp < miliseconds) {
            return false; // <- token sudah exp
          } else {
            return true; // <- token belum exp
          }
        };
        if (isExpiredJWT()) {
          return true;
        } else {
          return false;
        }
      };

      if (isRunTime()) {
        const timeout = () => {
          const UnixTimestamp = new Date(tokens.expired_token_timestamp * 1000).getTime(); // 1652810400000
          if (UnixTimestamp !== null) {
            let temp;
            const toISOString = new Date(UnixTimestamp);
            const dateNow = new Date();
            temp = toISOString - dateNow;

            if (Math.sign(temp) !== -1) {
              return temp;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        };
        console.log(timeout());
        setTimeout(() => {
          AuthService.Logout();
          navigate('/');
        }, timeout() - 5000);
      }
    }
  }, [currentUser]);

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
