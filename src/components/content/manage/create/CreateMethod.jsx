import axios from 'axios';
import { Button, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const CreateMethod = () => {
  const [getMethod, setGetMethod] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAPIMethod();
  }, []);

  //   const [update, setUpdate] = useState(false);
  //   const [PaymentNumber, setPaymentNumber] = useState('');

  //   const editUpdateMethod = (e) => {
  //     setUpdate(true);
  //     setPaymentNumber(e.payment_number);
  //   };
  const addUpdateMethod = (e) => {
    // const data = new FormData();
    // data.append('payment_number', PaymentNumber);
    // data.append('method', e.method);
    // axios
    //   .post(`https://dobha.herokuapp.com/api/payment/update`, data)
    //   .then((response) => {
    //     console.log(response);
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Berhasil Update',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //     setUpdate(false);
    //   })
    //   .catch((error) => {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Terjadi Kesalahan',
    //       text: `${error.message}`,
    //     });
    //     setUpdate(false);
    //   });

    Swal.fire({
      title: 'Masukkan nomor metode pembayaran',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Kirim',
      showLoaderOnConfirm: true,
      backdrop: true,
      preConfirm: (PaymentNumber) => {
        const data = new FormData();
        data.append('payment_number', PaymentNumber);
        data.append('method', e.method);
        return axios
          .post(`https://dobha.herokuapp.com/api/payment/update`, data)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.log(error);
            Swal.showValidationMessage(`Request failed: ${error.message}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Update',
          showConfirmButton: false,
          timer: 1500,
        });
        getAPIMethod();
      }
    });
  };
  const getAPIMethod = () => {
    axios
      .get(`https://dobha.herokuapp.com/api/payment`)
      .then((response) => {
        console.log(response);
        setGetMethod(response.data.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: `${error.message}`,
        });
        navigate('/manage-method');
      });
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
          <h5>Jenis Metode Pembayaran</h5>
          <div style={{ maxWidth: '500px' }}>
            {getMethod.map((item, index) => {
              return (
                <div key={index} className="d-flex w-100 py-2">
                  <div className="d-flex w-25 align-items-center">
                    <p className="w-75 mb-0">{item.method} </p>
                    <p className="mb-0">:</p>
                  </div>

                  <div className="d-flex w-100 align-items-center">
                    <p className="w-50 mb-0">{item.payment_number}</p>
                    <Button onClick={() => addUpdateMethod(item)} variant="primary">
                      <i className="fas fa-edit"></i>Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default CreateMethod;
