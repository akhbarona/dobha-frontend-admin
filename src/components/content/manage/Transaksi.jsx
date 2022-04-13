import { useEffect, useMemo, useState } from "react";
import {
  Container,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ModalImage from "react-modal-image";
import AuthService from "../../services/auth.service";
import GetService from "../../services/get.service";
import moment from 'moment';
import 'moment/locale/id';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import KonfimasiPembayaran from "../../KonfimasiPembayaran";

const Transaksi = () => {
  const [getDataProduk, setDataProduk] = useState([]);

  const [loading, setLoading] = useState(true);
  // console.log(getDataProduk);
  const navigate = useNavigate();
  useEffect(() => {
    getProduk();
  }, []);

  const getProduk = () => {
    setLoading(true);
    // GetService.getAllTransaksi();
    GetService.getAllTransaksi().then(
      (res) => {
        const newData = res.map((item, index) => {
          item.no = index + 1;
          return item;
        });
        // console.log(newData);
        setDataProduk(newData);
        setLoading(false);
      },
      (error) => {
        if (error.response && error.response.status === 403) {
          AuthService.logout();
          navigate("/");
          window.location.reload();
        }
      }
    );
  };


  const COLUMNS = [
    {
      Header: "No",
      accessor: "no",
    },
    {
      Header: "Nama Pembeli",
      accessor: "username",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Nama Produk",
      accessor: "nama_produk",
    },
    {
      Header: "Jumlah",
      accessor: "jumlah",
    },
    {
      Header: "Tagihan (Harga+Ongkir)",
      accessor: "tagihan_total",
    },
    {
      Header: "Ongir",
      accessor: "ongkir",
    },
    {
      Header: "Provinsi",
      accessor: "provinsi",
    },
    {
      Header: "Kabupaten",
      accessor: "kabupaten",
    },
    {
      Header: "Alamat",
      accessor: "alamat",
    },
    {
      Header: "Tanggal Pembelian",
      accessor: "created_at",
      Cell: (row) => (
        <div className="d-flex d-flex justify-content-around">
          <p>{moment(row.row.original.created_at).format('LL')}</p>
        </div>
      )
    },
    {
      Header: "Estimasi (hari)",
      accessor: "estimasi",
    },
    {
      Header: "Bukti Pembayaran",
      accessor: "bukti",
      Cell: (row) => (
        <div className="d-flex d-flex justify-content-around">
          <ModalImage
           small={row.row.original.bukti_bayar}
           large={row.row.original.bukti_bayar}
           alt="bukti pembayaran" />
          {/* <img src={row.row.original.bukti_bayar} alt="bukti pembayaran" /> */}
        </div>
      ),
    },
    {
      Header: "No Resi - Action",
      accessor: "action",
      Cell: (row) => (
        <KonfimasiPembayaran
          status={row.row.original.status}
          resi={row.row.original.no_resi}
          id={row.row.original.id}
          email={row.row.original.email}
          username={row.row.original.username}
          getProduk={getProduk}
        />
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => getDataAdmin, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setGlobalFilter,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
  } = useTable(
    {
      columns,
      data: getDataProduk,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;
  return (
    <Container fluid>
      <Row className="justify-content-between">
        <InputGroup className="w-50">
          <InputGroup.Text id="basic-addon1">
            <i className="fas fa-search"></i>
          </InputGroup.Text>
          <FormControl
            placeholder="Pencarian..."
            aria-label="Searching"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </InputGroup>
      </Row>
      <Row>
        {loading ? (
          <p className="py-3 px-0 text-center m-0">Loading...</p>
        ) : getDataProduk.length > 0 ? (
          <div className="my-3 table-container table-responsive">
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <svg
                                className="th-align-left"
                                focusable="false"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14px"
                                height="14px"
                                fill="currentColor"
                                class="bi bi-caret-down-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                              </svg>
                            ) : (
                              <svg
                                className="th-align-right"
                                focusable="false"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14px"
                                height="14px"
                                fill="currentColor"
                                class="bi bi-caret-up-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                              </svg>
                            )
                          ) : (
                            ""
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="py-3">
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} dari {pageOptions.length}{" "}
                </strong>
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 20, 50].map((pageSize) => (
                  <option value={pageSize} key={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {"<<"}
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Previous
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                Next
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3">
            <p className="text-center">Tidak ada data Produk </p>
          </div>
        )}
      </Row>
    </Container>
  );
};
export default Transaksi;
