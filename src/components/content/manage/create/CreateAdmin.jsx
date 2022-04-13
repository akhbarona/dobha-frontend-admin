import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import authHeader from '../../../services/auth.header';
import authService from '../../../services/auth.service';

const CreateAdmin = () => {
  const { username } = useParams();
  const [isUpdate, setIsUpdate] = useState(false);
  const [Username, setUsername] = useState('');
  //   const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      setIsUpdate(true);
      axios
        .get(`/api/auth/admin/read-admin/${username}`, { headers: authHeader() })
        .then((res) => {
          const admin = res.data.admin;
          //   console.log(res);
          setUsername(admin.username);
        })
        .catch((err) => console.log(err));
    } else {
      navigate('/manage-admin');
    }
  }, [username]);

  const handleAdmin = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      try {
        await authService.updateAdmin(Username, username).then(
          (res) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Berhasil update',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/manage-admin');
            // setLoading(false);
            // setPassword('');
            setUsername('');
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal Update',
              text: `${error}`,
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
    }
  };
  return (
    <Container fluid>
      <Row>
        <div className="d-flex">
          <Button className="btn btn-sm btn-danger" onClick={() => navigate(-1)}>
            go back
          </Button>
        </div>
        <Row className="pt-2" style={{ fontWeight: '500' }}>
          <Form onSubmit={handleAdmin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="h5">Username</Form.Label>
              <Form.Control value={Username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Masukkan Username..." autoComplete="username" />
            </Form.Group>
            {/* 
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Masukkan Password..." autoComplete="current-password" />
          </Form.Group> */}

            <Button variant="primary" type="submit">
              {isUpdate ? 'Update' : ''}
            </Button>
          </Form>
        </Row>
      </Row>
    </Container>
  );
};

export default CreateAdmin;
