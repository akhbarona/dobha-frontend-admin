import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";

const KonfimasiPembayaran = (props) => {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKonfirmasi = () => {
    if (resi === "") {
      Swal.fire("Failed!", "Isikan form resi", "warning");
      return;
    }
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin ingin mengkonfirmasi transaksi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.value) {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL_TRANSAKSI}/api/konfirmasi/${props.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            no_resi: resi, 
            status: true , 
            username: props.username,
            email: props.email

           }),
        })
          .then((res) => res.json())
          .then((data) => {
            const updateStock = async() => {
             try{
              const hasil =  await fetch(`${process.env.REACT_APP_API_URL}/api/is-buyed-confirm/${props.produk_id}/${props.buyed_total}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                }

            })

            await hasil.json()
            if (data.status === 200) {
              setLoading(false);
              Swal.fire("Berhasil!", "Transaksi telah dikonfirmasi", "success");
              props.getProduk();
            } else {
              setLoading(false);
              Swal.fire("Failed!", "Konfirmasi Gagal", "error");
            }
        
            }catch(err){
              setLoading(false);
              console.log(err)
            }

         }

          updateStock();
           
          })
          .catch((err) => {
            setLoading(false);
            navigate("/");
            window.location.reload();
          });
      }
    });
  };

  const handleHapus  = () => {
    try{
      Swal.fire({
        title: "Konfirmasi",
        text: "Apakah anda yakin ingin menghapus transaksi ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
      }).then(async(result) => {
        if (result.value) {
        const hasil  = await fetch(`${process.env.REACT_APP_API_URL_TRANSAKSI}/api/konfirmasi/${props.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })

         const data =  await hasil.json()
          if (data.status === 200) {
            Swal.fire("Berhasil!", "Transaksi Berhasil di Hapus", "success");
            props.getProduk();
          } else {
            Swal.fire("Failed!", "Hapus Gagal", "error");
          } 
        }

      });
    }catch(error){
      Swal.fire("Failed!", "Hapus Gagal", "error");
    }

  }


  return (
    <div
      className="d-flex d-flex justify-content-around"
      style={{ width: 400 }}
    >
      <input
        value={props.resi ? props.resi : resi}
        onChange={(e) => setResi(e.target.value)}
        type="text"
        className="form-control"
        placeholder="Masukan Resi"
        disabled={props.resi ? true : false}
      />

      {props.status ? (
        <button className="btn btn-success" style={{ marginLeft: 10 }} disabled>
          Sudah di Konfirmasi
        </button>
      ) : (
        <>
          {loading ? (
            <button
              className="btn btn-success"
              style={{ marginLeft: 10 }}
              disabled
            >
              Loading . . .
            </button>
          ) : (
              <button
              onClick={() => handleKonfirmasi()}
              className="btn btn-success"
              style={{ marginLeft: 10 }}
            >
              Konfirmasi
            </button>
            
          )}
          <button
              onClick={() => handleHapus()}
              className="btn btn-danger"
              style={{ marginLeft: 10 }}
            >
              Hapus
            </button>
        </>
      )}
    </div>
  );
};
export default KonfimasiPembayaran;
