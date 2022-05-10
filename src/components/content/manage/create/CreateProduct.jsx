import { useEffect, useRef, useState } from 'react';
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
  // console.log(slug_produk);

  useEffect(() => {
    if (slug_produk) {
      setIsUpdate(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/read-product/${slug_produk}`)
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
      // setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      // reader.onload(() => {
      //   setImagePreview(reader.result);
      // });
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddProduk = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      try {
        setcategoryError('');
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
            console.log(error.response);
            if (error.response.data.errors.kode_produk && kodeProduk !== '') {
              const error_kodeProduk = error.response.data.errors.kode_produk;
              setkodeError(error_kodeProduk[0]);
              kodeRef.current.focus();
            } else {
              setkodeError('');
            }

            if (error.response.data.errors.nama_produk && namaProduk !== '') {
              const error_namaProduk = error.response.data.errors.nama_produk;
              setnamaError(error_namaProduk[0]);
              namaRef.current.focus();
            } else {
              setnamaError('');
            }

            if (error.response.data.errors.gambar_produk) {
              const error_gambarProduk = error.response.data.errors.gambar_produk;
              setgambarError(error_gambarProduk);
              gambarRef.current.focus();
            } else {
              setgambarError('');
            }

            if (error.response.data.errors.deskripsi_produk) {
              const error_deskripsiProduk = error.response.data.errors.deskripsi_produk;
              setdeskripsiError(error_deskripsiProduk);
              desRef.current.editor.editing.view.focus();
              window.scrollTo(0, desError.current.offsetTop);
            } else {
              setdeskripsiError('');
            }
            Swal.fire({
              icon: 'error',
              title: 'Gagal Update',
              text: 'periksa kolom error',
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
            setkodeError('');
            setnamaError('');
          },
          (error) => {
            console.log(error.response);
            if (error.response.data.errors.kode_produk && kodeProduk !== '') {
              const error_kodeProduk = error.response.data.errors.kode_produk;
              setkodeError(error_kodeProduk[0]);
              kodeRef.current.focus();
            } else {
              setkodeError('');
            }

            if (error.response.data.errors.nama_produk && namaProduk !== '') {
              const error_namaProduk = error.response.data.errors.nama_produk;
              setnamaError(error_namaProduk[0]);
              namaRef.current.focus();
            } else {
              setnamaError('');
            }

            if (error.response.data.errors.gambar_produk) {
              const error_gambarProduk = error.response.data.errors.gambar_produk;
              setgambarError(error_gambarProduk);
              gambarRef.current.focus();
            } else {
              setgambarError('');
            }
            if (error.response.data.errors.deskripsi_produk) {
              const error_deskripsiProduk = error.response.data.errors.deskripsi_produk;
              setdeskripsiError(error_deskripsiProduk);
              desRef.current.editor.editing.view.focus();
              window.scrollTo(0, desError.current.offsetTop);
            } else {
              setdeskripsiError('');
            }

            Swal.fire({
              icon: 'error',
              title: 'Gagal Menambahkan',
              text: 'periksa kolom error',
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
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleChangeStockProduk = (e) => {
    const newValue = e.target.value;

    const re = /^[0-9\b]+$/;

    if (re.test(newValue) && newValue.length <= 15) {
      setstockProduk(Number(newValue));
    } else {
      setstockProduk('');
    }
  };

  const handleBlurCategory = () => {
    if (category === 0) {
      setcategoryError('Kategori belum dipilih');
    } else {
      setcategoryError('');
    }
  };

  const handleChangeHargaSatuan = (e) => {
    const newValue = e.target.value;
    const re = /^[0-9\b]+$/;

    if (re.test(newValue) && newValue.length <= 15) {
      sethargaSatuan(Number(newValue));
    } else {
      sethargaSatuan('');
    }
  };
  const [kodeError, setkodeError] = useState('');

  const [namaError, setnamaError] = useState('');

  const [categoryError, setcategoryError] = useState('');

  const [deskripsiError, setdeskripsiError] = useState('');

  const [gambarError, setgambarError] = useState(null);

  const kodeRef = useRef();
  const namaRef = useRef();

  const desRef = useRef(null);
  const desError = useRef(null);
  const gambarRef = useRef();

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
              <Form.Label className="h5">
                Kode produk<span style={{ color: '#ff0000' }}>*</span>
              </Form.Label>
              <Form.Control ref={kodeRef} value={kodeProduk} onChange={handleChangeKodeProduk} type="text" placeholder="Ketik kode produk..." required />
              {kodeError ? <div style={{ fontSize: 12, color: 'red' }}>{kodeError}</div> : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicNamaProduk">
              <Form.Label className="h5">
                Nama produk<span style={{ color: '#ff0000' }}>*</span>
              </Form.Label>
              <Form.Control ref={namaRef} value={namaProduk} onChange={handleChangeNamaProduk} type="text" placeholder="Ketik nama produk..." required />
              {namaError ? <div style={{ fontSize: 12, color: 'red' }}>{namaError}</div> : null}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicNamaProduk">
              <Form.Label className="h5">
                Kategori produk<span style={{ color: '#ff0000' }}>*</span>
              </Form.Label>

              <Form.Control as="select" value={category} onChange={handleCategory} onBlur={handleBlurCategory} required>
                <option value="" hidden>
                  Pilih Kategori Produk
                </option>
                {getAllCategory.length > 0 &&
                  getAllCategory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Form.Control>

              {category !== '' && <div style={{ fontSize: 12, color: 'red' }}>{categoryError}</div>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicStockProduk">
              <Form.Label className="h5">
                Stock produk<span style={{ color: '#ff0000' }}>*</span>
              </Form.Label>
              <Form.Control value={stockProduk} onChange={handleChangeStockProduk} placeholder="Ketik stock produk..." required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicHargaSatuanProduk">
              <Form.Label className="h5">
                Harga satuan produk<span style={{ color: '#ff0000' }}>*</span>
              </Form.Label>
              <Form.Control value={hargaSatuan} onChange={handleChangeHargaSatuan} placeholder="Ketik harga produk..." required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDeskripsi">
              <Form.Label ref={desError} className="h5">
                Isi deskripsi<span style={{ color: '#ff0000' }}>*</span>
              </Form.Label>
              {deskripsiError ? <div style={{ fontSize: 12, color: 'red' }}>{deskripsiError}</div> : null}
              <CKEditor
                ref={desRef}
                id="myeditor"
                config={{ placeholder: 'Ketik deskripsi produk' }}
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
              <Form.Label className="h5">
                Gambar produk<span style={{ color: '#ff0000' }}>*</span>
              </Form.Label>
              <Form.Control ref={gambarRef} onChange={handleImage} accept="image/png, image/jpg, image/jpeg" type="file" placeholder="Masukkan gambar produk..." />
              {gambarError
                ? gambarError &&
                  gambarError.map((err, idx) => {
                    return (
                      <div key={idx} style={{ fontSize: 12, color: 'red' }}>
                        {err}
                      </div>
                    );
                  })
                : null}
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
