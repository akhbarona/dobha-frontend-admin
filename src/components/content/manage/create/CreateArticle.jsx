import { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Swal from 'sweetalert2';
import AuthService from '../../../services/auth.service';

const CreateArticle = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      setIsUpdate(true);
      async function getData() {
        await axios
          .get(`/api/read-article/${slug}`)
          .then((res) => {
            console.log(res);
            const data = res.data.data;
            setTitle(data.title);
            setBody(data.body);
            setImagePreview(data.image || '');

            /*  Convert html to draftJS editor  */
            const contentFromHtml = htmlToDraft(data.body);
            const contentState = ContentState.createFromBlockArray(contentFromHtml.contentBlocks);
            const _editorState = EditorState.createWithContent(contentState);

            setEditorState(_editorState);
          })
          .catch((err) => console.log(err));
      }
      getData();
    }
  }, [slug]);

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      //   console.log('picture: ', e.target.files);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      //   const reader = new FileReader();
      //   reader.addEventListener('load', () => {
      //     // console.log(reader.result)
      //     setFileImageData(reader.result);
      //   });
      //   reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      try {
        await AuthService.updateArticle(title, body, image, slug).then(
          (res) => {
            // console.log(res);
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
    } else {
      try {
        await AuthService.postArticle(title, body, image).then(
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
    padding: '0.375rem 0.75rem',
    background: '#eee',
  };
  const onSetEditorState = (newState) => {
    setEditorState(newState);
    setBody(draftToHtml(convertToRaw(newState.getCurrentContent())));
  };
  return (
    <Container fluid>
      <Button className="btn btn-sm btn-danger" onClick={() => navigate(-1)}>
        go back
      </Button>
      <Row className="pt-2">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label className="h4">Judul Artikel</Form.Label>
            <Form.Control name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan judul artikel..." />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicBody">
            <Form.Label className="h4">Isi Artikel</Form.Label>
            {/* <Form.Control type="text" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Masukkan isi artikel..." /> */}

            <Editor
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
            />
            {/* 
            <Form.Control as="textarea" rows="3" value={body} onChange={(e) => setBody(e.target.value)} /> */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicImage">
            {imagePreview && (
              <div className="text-center p-3">
                <img className="preview" src={`${imagePreview}`} alt="preview" />
              </div>
            )}
            <Form.Label className="h4">Upload Gambar</Form.Label>
            <Form.Control name="image" accept="image/*" type="file" onChange={handleImage} />
          </Form.Group>
          <Button variant="primary" type="submit">
            {isUpdate ? 'Update' : 'Submit'}
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default CreateArticle;
