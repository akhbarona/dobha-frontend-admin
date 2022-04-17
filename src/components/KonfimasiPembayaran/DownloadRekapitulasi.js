import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import "moment/locale/id";

const DownloadRekapitulasi = async (bulan, tahun) => {
    const dateNow = new Date();
    const date = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const numberWithCommas = (x) => {
        return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };
  try {
    const resDataPelamar = await fetch(
        // process.env.REACT_APP_API_URL_TRANSAKSI
      `${process.env.REACT_APP_API_URL_TRANSAKSI}/api/rekapitulasi-transaksi?bulan=${bulan}&tahun=${tahun}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const dataPelamar = await resDataPelamar.json();

    const convertNo = dataPelamar.data.map((item ,i) => 
      ({ ...item, No: i+ 1, Tanggal_Pembelian: moment(item.created_at).format("LL"),Nama_Pembeli: item.username,Tagihan_Total: numberWithCommas(item.tagihan_total),Nama_Produk: item.nama_produk}));
  
    function buildTableBody(data, columns) {
      var body = [];

      body.push(columns);

      data.forEach(function (row) {
        var dataRow = [];

        columns.forEach(function (column) {
          dataRow.push(row[column].toString());
        });

        body.push(dataRow);
      });

      return body;
    }

    function table(data, columns) {
      return {
        table: {
          headerRows: 1,
          widths: [30, 100, 100, 120, "*"],
          body: buildTableBody(data, columns),
        },
      };
    }

    var dd = {
      content: [
        { text: `Data Penjulan Produk Bulan ${bulan}/${tahun}`, style: "header" },
        { text: `Di cetak : ${date}/${month}/${year}`, style: "tanggal" },
        table(convertNo, [
          "No",
          "Nama_Pembeli",
          "Nama_Produk",
          "Tagihan_Total",
          "Tanggal_Pembelian",
        ]),
        { text: "Total Pendapatan", style: "normal" },
        { text: `Rp.${numberWithCommas(dataPelamar.pendapatan)}`, style: "harga" },
      ],
      styles: {
        normal: {
          fontSize: 12,
          margin: [0, 20, 0, 0],
          alignment: "left",
        },
        harga: {
          fontSize: 12,
          margin: [0, 10, 0, 0],
          alignment: "left",
          bold: true,
        },
        tanggal: {
          fontSize: 12,
          margin: [0, 10, 0, 10],
          alignment: "left",
          bold: true,
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: "center",
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd).open();
  } catch (error) {
    console.log(error.response && error.response.data.message ? error.response.data.message : error.message,)
    alert("err");
  }
};
export default DownloadRekapitulasi;
