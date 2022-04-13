import { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, convertFromHTML, ContentState, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Swal from 'sweetalert2';
import AuthService from '../../../services/auth.service';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CreateProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [kodeProduk, setkodeProduk] = useState('');
  //   console.log(imagePreview);
  const [namaProduk, setnamaProduk] = useState('');
  const [stockProduk, setstockProduk] = useState('');
  //   console.log(stockProduk);
  const [hargaSatuan, sethargaSatuan] = useState('');
  const [deskripsi_produk, setDeskripsi_Produk] = useState('');
  const [gambarProduk, setgambarProduk] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [editorStates, setEditorState] = useState(EditorState.createEmpty());
  // const [buttonName, setButtonName] = useState('Submit');

  const navigate = useNavigate();
  const { slug_produk } = useParams();
  console.log(slug_produk);

  useEffect(() => {
    if (slug_produk) {
      // setButtonName('Update');
      setIsUpdate(true);
      axios
        .get(`/api/read-product/${slug_produk}`)
        .then((res) => {
          console.log(res);
          const data = res.data.data;
          console.log(data);
          //   console.log(arrayObj);
          setkodeProduk(data.kode_produk);
          setnamaProduk(data.nama_produk);
          setstockProduk(data.stock_produk);
          sethargaSatuan(data.harga_satuan);
          setDeskripsi_Produk(data.deskripsi_produk);
          console.log(data.deskripsi_produk);
          //   const blocksFromHtml = convertFromHTML(data.deskripsi_produk);

          //   const state = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap);

          //   setEditorState(EditorState.createWithContent(state));

          //   const blocksFromHtml = htmlToDraft(data.deskripsi_produk);
          //   const { contentBlocks, entityMap } = blocksFromHtml;
          //   const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
          //   const editorState = EditorState.createWithContent(contentState);
          //   setEditorState(editorState);
          //   setEditorState(htmlToDraft(convertFromHTML(data.deskripsi_produk)));

          setImagePreview(data.gambar_produk);
        })
        .catch((err) => console.log(err));
    }
  }, [slug_produk]);

  const onEditorStateChange = (editorState) => {
    // console.log(editorState);
    setEditorState(editorState);
    setDeskripsi_Produk(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      //   console.log('picture: ', e.target.files);
      setgambarProduk(file);
      setImagePreview(URL.createObjectURL(file));
      //   const reader = new FileReader();
      //   reader.addEventListener('load', () => {
      //     // console.log(reader.result)
      //     setFileImageData(reader.result);
      //   });
      //   reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddProduk = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      try {
        await AuthService.updateProduct(kodeProduk, namaProduk, deskripsi_produk, stockProduk, hargaSatuan, gambarProduk, slug_produk).then(
          (res) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Update',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/manage-products');

            // setLoading(false);
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
        await AuthService.postProduct(kodeProduk, namaProduk, deskripsi_produk, stockProduk, hargaSatuan, gambarProduk).then(
          (res) => {
            // console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Menambahkan Produk',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/manage-products');

            // setLoading(false);
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

  const wrapperStyle = {
    border: '2px solid rgb(236 238 241)',
  };
  const editorStyle = {
    height: '10rem',
    background: '#eee',
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
      <Button className="btn btn-sm btn-danger" onClick={() => navigate(-1)}>
        go back
      </Button>
      <Row className="pt-2">
        <Form onSubmit={handleAddProduk}>
          <Form.Group className="mb-3" controlId="formBasicKodeProduk">
            <Form.Label>Kode Produk</Form.Label>
            <Form.Control value={kodeProduk} onChange={handleChangeKodeProduk} type="text" placeholder="Masukkan kode produk..." />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicNamaProduk">
            <Form.Label>Nama Produk</Form.Label>
            <Form.Control value={namaProduk} onChange={handleChangeNamaProduk} type="text" placeholder="Masukkan nama produk..." />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicStockProduk">
            <Form.Label>Stock Produk</Form.Label>
            <Form.Control value={stockProduk} onChange={handleChangeStockProduk} placeholder="Masukkan stock produk..." />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicHargaSatuanProduk">
            <Form.Label>Harga Satuan Produk</Form.Label>
            <Form.Control value={hargaSatuan} onChange={handleChangeHargaSatuan} placeholder="Masukkan harga produk..." />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDeskripsi">
            <Form.Label className="h4">Isi Deskripsi</Form.Label>
            {/* <Editor wrapperStyle={wrapperStyle} editorStyle={editorStyle} editorState={editorStates} onEditorStateChange={onEditorStateChange} /> */}
            <Form.Control as="textarea" rows="3" value={deskripsi_produk} onChange={(e) => setDeskripsi_Produk(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicGambarProduk">
            {imagePreview && (
              <div className="text-center p-3">
                <img className="preview" src={imagePreview} alt="preview" />
              </div>
            )}
            <Form.Label>Gambar Produk</Form.Label>
            <Form.Control onChange={handleImage} type="file" placeholder="Masukkan gambar produk..." />
          </Form.Group>
          <Button variant="primary" type="submit">
            {isUpdate ? 'Update' : 'Submit'}
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default CreateProduct;
