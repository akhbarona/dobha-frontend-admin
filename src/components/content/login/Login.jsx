import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(username, password).then(
        () => {
          navigate('/dashboard');
          // window.location.reload();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Terjadi Kesalahan',
            html: '<p>Username dan Password tidak valid </p>' + `${error}`,
          });
        }
      );
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: `${err}`,
      });
    }
  };

  return (
    <main className="form-signin">
      <form onSubmit={handleLogin}>
        <img className="mb-4" src="./dobha.jpg" alt="" width="200" height="100" />
        <div className="form-floating my-2">
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" id="floatingInput" placeholder="Masukkan Username" autoComplete="username" />
          <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating my-2">
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="floatingPassword" placeholder="Password" autoComplete="current-password" />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
};
export default Login;
