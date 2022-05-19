import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
<<<<<<< HEAD
import { Container, Button, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import AuthService from '../../../services/auth.service';
import Swal from 'sweetalert2';
=======
import { Container, Button, Form,Row } from 'react-bootstrap';
import axios from 'axios';
import AuthService from '../../../services/auth.service';
import Swal from 'sweetalert2';

>>>>>>> 3e31c899a59971c02b7342eb2ac83be561d5feb8
const CreateCategoryArticles = () => {
  const { id } = useParams();

  const [namaCategory, setNamaCategory] = useState('');

  const [isUpdate, setIsUpdate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsUpdate(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/article-category/${id}`)
        .then((res) => {
          //   console.log(response)
          const data = res.data.data;
          setNamaCategory(data.name);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            navigate('/manage-category-articles');
          }
        });
    } else {
      navigate('/manage-category-articles');
    }
  }, [id]);

  const handleCategory = async (e) => {
    e.preventDefault();
    try {
      await AuthService.updateCategoryArticle(namaCategory, id).then(
        (res) => {
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Update',
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/manage-category-articles');
          setNamaCategory('');
        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: `${err.message}`,
      });
    }
  };
  return (
    <Container>
      <Row>
        <div className="d-flex">
          <Button className="btn btn-sm btn-danger" onClick={() => navigate(-1)}>
            go Back
          </Button>
        </div>
        <div className="pt-2" style={{ fontWeight: '500' }}>
          <Form onSubmit={handleCategory}>
            <Form.Group>
              <Form.Label className="h5">Article Name Category</Form.Label>
              <Form.Control onChange={setNamaCategory} placeholder="Ketikkan Kategori..." type="text" value={namaCategory} required />
              <Button type="submit" variant="primary">
                {isUpdate ? 'Update' : 'Submit'}
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Row>
    </Container>
  );
};

export default CreateCategoryArticles;
