import { useEffect, useMemo, useState } from 'react';
import { Button, Container, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import AuthService from '../../services/auth.service';
import GetService from '../../services/get.service';
import { format } from 'date-fns';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

const Products = () => {
  const [getDataProduk, setDataProduk] = useState([]);

  const [loading, setLoading] = useState(true);
  // console.log(getDataProduk);
  const navigate = useNavigate();
  useEffect(() => {
    getProduk();
  }, []);
  const getProduk = () => {
    setLoading(true);
    GetService.getAllProduct().then(
      (res) => {
        // console.log(res);
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
          navigate('/');
          window.location.reload();
        }
      }
    );
  };

  const formatRupiah = (money) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(money);
  };

  const handleDelete = (slug) => {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const onDelete = () => {
          AuthService.deleteProduct(slug)
            .then((res) => {
              // const data = getDataArticle.filter((p) => console.log(p));
              // console.log(data);

              const result = getDataProduk.filter((p) => p.slug !== slug);
              setDataProduk(result);
              Swal.fire('Deleted', `Produk Berhasil Dihapus ${res}`, 'success');
              getProduk();
            })
            .catch((err) => Swal.fire('Upss!', `${err}`, 'error'));
        };
        onDelete();
      }
    });
  };

  const COLUMNS = [
    {
      Header: 'No',
      accessor: 'no',
    },
    {
      Header: 'Kode',
      accessor: 'kode_produk',
    },
    {
      Header: 'Nama Produk',
      accessor: 'nama_produk',
    },
    {
      Header: 'Stock',
      accessor: 'stock_produk',
    },
    {
      Header: 'Harga Satuan',
      accessor: 'harga_satuan',
      Cell: ({ value }) => {
        return formatRupiah(value);
      },
    },
    {
      Header: 'Dibuat pada',
      accessor: 'created_at',
      Cell: ({ value }) => {
        return format(new Date(value), 'dd MMMM yyyy h:mm:ss a');
      },
    },
    {
      Header: 'Diperbarui pada',
      accessor: 'updated_at',
      Cell: ({ value }) => {
        return format(new Date(value), 'dd MMMM yyyy h:mm:ss a');
      },
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: (row) => (
        <div className="d-flex d-flex justify-content-around">
          <button className="btn w-45 btn-warning" onClick={() => navigate(`/create-products/${row.row.original.slug_produk}`)}>
            Update
          </button>
          <button className="btn w-45  btn-danger" onClick={() => handleDelete(row.row.original.slug_produk)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => getDataAdmin, []);
  const { getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions, setGlobalFilter, state, gotoPage, pageCount, setPageSize, prepareRow } = useTable(
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
      <Row>
        {loading ? (
          <div className="py-3 px-0 text-center m-0">
            <Spinner animation="grow" variant="info" />
          </div>
        ) : getDataProduk.length > 0 ? (
          <>
            <Row className="justify-content-between">
              <Button className="w-25" variant="primary" onClick={() => navigate('/create-products')}>
                Tambah Produk
              </Button>
              <InputGroup className="w-50">
                <InputGroup.Text id="basic-addon1">
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <FormControl placeholder="Pencarian..." aria-label="Searching" value={globalFilter || ''} onChange={(e) => setGlobalFilter(e.target.value)} />
              </InputGroup>
            </Row>
            <div className="my-3 table-container">
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <svg className="th-align-left" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                </svg>
                              ) : (
                                <svg className="th-align-right" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                              )
                            ) : (
                              ''
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-center">
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="py-3">
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} dari {pageOptions.length}{' '}
                  </strong>
                </span>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                  {[10, 20, 50].map((pageSize) => (
                    <option value={pageSize} key={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {'<<'}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  Previous
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  Next
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                  {'>>'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-3">
            <p className="text-center">Tidak ada data Produk </p>
          </div>
        )}
      </Row>
    </Container>
  );
};
export default Products;
