import { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import { Editor, EditorState, convertToRaw, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';
import AuthService from '../../../services/auth.service';
import GetService from '../../../services/get.service';
const CreateArticle = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const navigate = useNavigate();
  const { slug } = useParams();
  const [getAllCategory, setGetAllCategory] = useState([]);
  const [category, setCategory] = useState(0);
  useEffect(() => {
    if (slug) {
      setIsUpdate(true);
      async function getData() {
        await axios
          .get(`${process.env.REACT_APP_API_URL}/api/read-article/${slug}`)
          .then((res) => {
            console.log(res);
            const data = res.data.data;
            setTitle(data.title);
            setBody(data.body);
            setImagePreview(data.image || '');
            setCategory(data.category_id);
            /*  Convert html to draftJS editor  */
            // const contentFromHtml = htmlToDraft(data.body);
            // const contentState = ContentState.createFromBlockArray(contentFromHtml.contentBlocks);
            // const _editorState = EditorState.createWithContent(contentState);

            // setEditorState(_editorState);
          })
          .catch((err) => console.log(err));
      }
      getData();
    }
    getCategory();
  }, [slug]);

  const getCategory = () => {
    GetService.getAllCategoryArticle().then(
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
  // const onSetEditorState = (newState) => {
  //   setEditorState(newState);
  //   setBody(draftToHtml(convertToRaw(newState.getCurrentContent())));
  // };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      //   console.log('picture: ', e.target.files);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   setImage(e.target.result);
      // };
      // reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      try {
        await AuthService.updateArticle(title, body, image, slug, category).then(
          (res) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Update',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/manage-article');

            // setLoading(false);
            setTitle('');
            setBody('');
            setImage(null);
          },
          (error) => {
            if (error.response.data.errors.title) {
              setTitleError(error.response.data.errors.title[0]);
              titleRef.current.focus();
            } else {
              setTitleError('');
            }

            if (error.response.data.errors.category_id) {
              setCategoryError(error.response.data.errors.category_id[0]);
              categoryRef.current.focus();
            } else {
              setCategoryError('');
            }
            if (error.response.data.errors.body) {
              setBodyError(error.response.data.errors.body[0]);
              bodyRef.current.editor.editing.view.focus();
              window.scrollTo(0, ErrorBody.current.offsetTop);
            } else {
              setBodyError('');
            }
            Swal.fire({
              icon: 'error',
              title: 'Gagal Update',
              text: `periksa kolom error`,
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
        await AuthService.postArticle(title, body, image, category).then(
          (res) => {
            // console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Menambahkan',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/manage-article');

            // setLoading(false);
            setTitle('');
            setBody('');
            setImage(null);
          },
          (error) => {
            if (error.response.data.errors.title) {
              setTitleError(error.response.data.errors.title[0]);
              titleRef.current.focus();
            } else {
              setTitleError('');
            }

            if (error.response.data.errors.category_id) {
              setCategoryError(error.response.data.errors.category_id[0]);
              categoryRef.current.focus();
            } else {
              setCategoryError('');
            }
            if (error.response.data.errors.body) {
              setBodyError(error.response.data.errors.body[0]);
              bodyRef.current.editor.editing.view.focus();
              window.scrollTo(0, ErrorBody.current.offsetTop);
            } else {
              setBodyError('');
            }

            Swal.fire({
              icon: 'error',
              title: 'Gagal Menambahkan',
              text: `periksa kolom error`,
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

  const [titleError, setTitleError] = useState('');

  const [categoryError, setCategoryError] = useState('');

  const [bodyError, setBodyError] = useState('');

  const [gambarError, setGambarError] = useState('');

  const titleRef = useRef();
  const categoryRef = useRef();
  const bodyRef = useRef();
  const ErrorBody = useRef(null);
  const gambarRef = useRef();

  return (
    <Container fluid>
      <Row>
        <div className="d-flex">
          <Button className="btn btn-sm btn-danger" onClick={() => navigate(-1)}>
            go back
          </Button>
        </div>
        <Row className="pt-2" style={{ fontWeight: '500' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicTitle">
              <Form.Label className="h5">Judul Artikel</Form.Label>
              <Form.Control ref={titleRef} name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ketik judul artikel..." required />
              {titleError !== '' && <div style={{ fontSize: 12, color: 'red' }}>{titleError}</div>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label className="h5">Kategori Artikel</Form.Label>
              <Form.Control ref={categoryRef} as="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="" hidden>
                  Pilih Kategori Artikel
                </option>
                {getAllCategory.length > 0 &&
                  getAllCategory.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Form.Control>
              {categoryError !== '' && <div style={{ fontSize: 12, color: 'red' }}>{categoryError}</div>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicBody">
              <Form.Label className="h5" ref={ErrorBody}>
                Isi Artikel
              </Form.Label>
              {/* <Form.Control type="text" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Masukkan isi artikel..." /> */}
              {bodyError !== '' && <div style={{ fontSize: 12, color: 'red' }}>{bodyError}</div>}
              <CKEditor
                ref={bodyRef}
                config={{ placeholder: 'Ketik isi artikel...' }}
                editor={ClassicEditor}
                data={body}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setBody(data);
                }}
                required
              />

              {/* <Editor
              wrapperStyle={wrapperStyle}
              editorStyle={editorStyle}
              editorState={editorState}
              onEditorStateChange={onSetEditorState}
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'embedded', 'emoji'],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                blockType: {
                  inDropdown: true,
                },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            /> */}
              {/* 
            <Form.Control as="textarea" rows="3" value={body} onChange={(e) => setBody(e.target.value)} /> */}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicImage">
              {imagePreview && (
                <div className="text-center p-3">
                  <img className="preview" src={imagePreview} alt="preview" />
                </div>
              )}
              <Form.Label className="h5">Upload Gambar</Form.Label>
              <Form.Control name="image" accept="image/png, image/jpg, image/jpeg" type="file" onChange={handleImage} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isUpdate ? 'Update' : 'Submit'}
            </Button>
          </Form>
        </Row>
      </Row>
    </Container>
  );
};

export default CreateArticle;
