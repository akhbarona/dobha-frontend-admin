import { useEffect, useMemo, useState } from 'react';
import { Button, FormControl, InputGroup, Row } from 'react-bootstrap';
import AuthService from '../../services/auth.service';
import GetService from '../../services/get.service';
import { useNavigate } from 'react-router-dom';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import Swal from 'sweetalert2';

const Articles = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [getDataArticle, setDataArticle] = useState([]);

  useEffect(() => {
    getArticle();
  }, []);
  const getArticle = () => {
    setLoading(true);
    GetService.getAllArticle().then(
      (res) => {
        const newData = res.map((item, index) => {
          item.no = index + 1;
          return item;
        });
        setDataArticle(newData);
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
  function handleLength(value, lengths) {
    if (value.length < lengths) {
      return value;
    } else {
      return value.substring(0, lengths).substring(0, value.substring(0, lengths).lastIndexOf(' ')) + '...';
    }
  }

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
        const onDelete = async () => {
          await AuthService.deleteArticle(slug)
            .then((res) => {
              setDataArticle(getDataArticle.filter((p) => p.slug !== slug));
              Swal.fire('Deleted', `Artikel Berhasil Dihapus ${res}`, 'success');
              getArticle();
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
      Header: 'Judul Artikel',
      accessor: 'title',
      Cell: ({ value }) => {
        return handleLength(value, 35);
      },
    },
    {
      Header: 'Isi Artikel',
      accessor: 'excerpt',
      Cell: ({ value }) => {
        return handleLength(value, 40);
      },
    },
    {
      Header: 'Published',
      accessor: 'published',
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: (row) => (
        <div className="d-flex d-flex justify-content-around">
          <button className="btn w-45 btn-warning" onClick={() => navigate(`/create-article/${row.row.original.slug}`)}>
            Update
          </button>
          <button className="btn w-45  btn-danger" onClick={() => handleDelete(row.row.original.slug)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const { getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions, setGlobalFilter, state, gotoPage, pageCount, setPageSize, prepareRow } = useTable(
    {
      columns,
      data: getDataArticle,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <div className="container-fluid">
      <Row className="justify-content-between">
        <Button className="w-25" variant="primary" onClick={() => navigate('/create-article')}>
          Tambah Artikel
        </Button>
        <InputGroup className="w-50">
          <InputGroup.Text id="basic-addon1">
            <i className="fas fa-search"></i>
          </InputGroup.Text>
          <FormControl placeholder="Pencarian..." aria-label="Searching" value={globalFilter || ''} onChange={(e) => setGlobalFilter(e.target.value)} />
        </InputGroup>
      </Row>

      <Row>
        {loading ? (
          <p className="py-3 px-0 text-center m-0">Loading...</p>
        ) : getDataArticle.length > 0 ? (
          <div className="my-3 table-wrapper  p-0">
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
              <tbody {...getTableBodyProps()}>
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
        ) : (
          <div className="py-3">
            <p className="text-center">Tidak ada data Article</p>
          </div>
        )}
      </Row>
    </div>
  );
};

export default Articles;
