import { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AuthService from '../../../services/auth.service';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import GetService from '../../../services/get.service';
const CreateProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [kodeProduk, setkodeProduk] = useState('');
  const [namaProduk, setnamaProduk] = useState('');
  const [stockProduk, setstockProduk] = useState('');
  const [hargaSatuan, sethargaSatuan] = useState('');
  const [deskripsi_produk, setDeskripsi_Produk] = useState('');
  const [gambarProduk, setgambarProduk] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [getAllCategory, setGetAllCategory] = useState([]);
  const [category, setCategory] = useState(0);

  const navigate = useNavigate();
  const { slug_produk } = useParams();
  console.log(slug_produk);

  useEffect(() => {
    if (slug_produk) {
      setIsUpdate(true);
      axios
        .get(`/api/read-product/${slug_produk}`)
        .then((res) => {
          console.log(res);
          const data = res.data.data;
          console.log(data);
          setkodeProduk(data.kode_produk);
          setnamaProduk(data.nama_produk);
          setstockProduk(data.stock_produk);
          sethargaSatuan(data.harga_satuan);
          setDeskripsi_Produk(data.deskripsi_produk);
          setImagePreview(data.gambar_produk);
          setCategory(data.product_category_id);
        })
        .catch((err) => console.log(err));
    }
    getCategory();
  }, [slug_produk]);

  const getCategory = () => {
    GetService.getAllCategoryProduct().then(
      (res) => {
        setGetAllCategory(res);
      },
      (error) => {
        if (error.response && error.response.status === 403) {
          AuthService.logout();
          navigate('/');
          window.location.reload();
        }
      }
    );
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setgambarProduk(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduk = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      try {
        await AuthService.updateProduct(kodeProduk, namaProduk, deskripsi_produk, stockProduk, hargaSatuan, gambarProduk, slug_produk, category).then(
          (res) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Update',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/manage-products');
            setkodeProduk('');
            setnamaProduk('');
            setstockProduk('');
            sethargaSatuan('');
            setImagePreview(null);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal Update',
              text: `${error.message}`,
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
    } else {
      try {
        await AuthService.postProduct(kodeProduk, namaProduk, deskripsi_produk, stockProduk, hargaSatuan, gambarProduk, category).then(
          (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Menambahkan Produk',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/manage-products');
            setkodeProduk('');
            setnamaProduk('');
            setstockProduk('');
            sethargaSatuan('');
            setDeskripsi_Produk('');
            setgambarProduk('');
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal Menambahkan',
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

  const handleChangeKodeProduk = (e) => {
    setkodeProduk(e.target.value);
  };
  const handleChangeNamaProduk = (e) => {
    setnamaProduk(e.target.value);
  };
  const handleChangeStockProduk = (e) => {
    const newValue = Number(e.target.value);
    setstockProduk(newValue);
  };

  const handleChangeHargaSatuan = (e) => {
    const newValue = Number(e.target.value);
    sethargaSatuan(newValue);
  };

  return (
    <Container fluid>
      <Row>
        <div className="d-flex">
          <Button className="btn btn-sm btn-danger" onClick={() => navigate(-1)}>
            go back
          </Button>
        </div>
        <div className="pt-2" style={{ fontWeight: '500' }}>
          <Form onSubmit={handleAddProduk}>
            <Form.Group className="mb-3" controlId="formBasicKodeProduk">
              <Form.Label className="h5">Kode produk</Form.Label>
              <Form.Control value={kodeProduk} onChange={handleChangeKodeProduk} type="text" placeholder="Ketik kode produk..." />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicNamaProduk">
              <Form.Label className="h5">Nama produk</Form.Label>
              <Form.Control value={namaProduk} onChange={handleChangeNamaProduk} type="text" placeholder="Ketik nama produk..." />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicNamaProduk">
              <Form.Label className="h5">Kategori produk</Form.Label>
              <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="category">
                <option value={0} disabled selected>
                  Pilih Kategori Produk
                </option>
                {getAllCategory.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicStockProduk">
              <Form.Label className="h5">Stock produk</Form.Label>
              <Form.Control value={stockProduk} onChange={handleChangeStockProduk} placeholder="Ketik stock produk..." />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicHargaSatuanProduk">
              <Form.Label className="h5">Harga satuan produk</Form.Label>
              <Form.Control value={hargaSatuan} onChange={handleChangeHargaSatuan} placeholder="Ketik harga produk..." />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDeskripsi">
              <Form.Label className="h5">Isi deskripsi</Form.Label>
              <CKEditor
                editor={ClassicEditor}
                data={deskripsi_produk}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDeskripsi_Produk(data);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicGambarProduk">
              {imagePreview && (
                <div className="text-center p-3">
                  <img className="preview" src={imagePreview} alt="preview" />
                </div>
              )}
              <Form.Label className="h5">Gambar produk</Form.Label>
              <Form.Control onChange={handleImage} type="file" placeholder="Masukkan gambar produk..." />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isUpdate ? 'Update' : 'Submit'}
            </Button>
          </Form>
        </div>
      </Row>
    </Container>
  );
};

export default CreateProduct;
