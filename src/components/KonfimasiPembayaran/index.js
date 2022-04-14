import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
        fetch(`https://apiongkir.herokuapp.com/api/konfirmasi/${props.id}`, {
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
            if (data.status === 200) {
              setLoading(false);
              Swal.fire("Berhasil!", "Transaksi telah dikonfirmasi", "success");
              props.getProduk();
            } else {
              setLoading(false);
              Swal.fire("Failed!", "Konfirmasi Gagal", "error");
            }
          })
          .catch((err) => {
            setLoading(false);
            navigate("/");
            window.location.reload();
          });
      }
    });
  };

  // console.log('props.resi' , props.status)

  return (
    <div
      className="d-flex d-flex justify-content-around"
      style={{ width: 300 }}
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
        </>
      )}
    </div>
  );
};
export default KonfimasiPembayaran;
