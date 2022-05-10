import { useEffect, useMemo, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import AuthService from '../../services/auth.service';
import GetService from '../../services/get.service';

import { useTable, useSortBy, usePagination } from 'react-table';
import { format } from 'date-fns';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [getDataAdmin, setGetDataAdmin] = useState([]);

  // const [loading, setLoading] = useState(true);
  // console.log(getDataAdmin);
  const navigate = useNavigate();
  useEffect(() => {
    getAdmin();
  }, []);
  const getAdmin = () => {
    // setLoading(true);
    GetService.getAllAdmin().then(
      (res) => {
        const newData = res.map((item, index) => {
          item.no = index + 1;
          return item;
        });
        // console.log(newData);
        setGetDataAdmin(newData);
        // setLoading(false);
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
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
      await AuthService.register(username, password).then(
        (res) => {
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Menambahkan',
            showConfirmButton: false,
            timer: 1500,
          });
          getAdmin();
          // setGetDataAdmin([...getDataAdmin, newData]);
          // setLoading(false);
          setPassword('');
          setUsername('');
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
  };

  const handleDelete = (username) => {
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
          await AuthService.deleteAdmin(username)
            .then((res) => {
              // setGetDataAdmin(getDataAdmin.filter((p) => p.username !== username));
              Swal.fire('Deleted', `Admin Berhasil Dihapus ${res}`, 'success');
              getAdmin();
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
      Header: 'Username',
      accessor: 'username',
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
        <div className="d-flex justify-content-around">
          <button className="btn w-45 btn-warning" onClick={() => navigate(`/create-admin/${row.row.original.username}`)}>
            Update
          </button>
          <button className="btn w-45  btn-danger" onClick={() => handleDelete(row.row.original.username)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  // function handleEdit(row) {
  //   console.log(row);
  // }

  const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => getDataAdmin, []);
  const { getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions, state, gotoPage, pageCount, setPageSize, prepareRow } = useTable(
    {
      columns,
      data: getDataAdmin,
    },
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  return (
    <Container fluid>
      <Row>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Manage Admin</h1>
          <div className="btn-toolbar mb-2 mb-md-0"></div>
        </div>
        <div className="pt-2" style={{ fontWeight: '500' }}>
          <Form onSubmit={handleAddAdmin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="h5">Username</Form.Label>
              <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Masukkan Username..." autoComplete="username" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="h5">Password</Form.Label>
              <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Masukkan Password..." autoComplete="current-password" required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Tambah
            </Button>
          </Form>
        </div>
        {getDataAdmin.length > 0 ? (
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
                              <svg className="th-align-left bi bi-caret-down-fill" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                              </svg>
                            ) : (
                              <svg className="th-align-right bi bi-caret-up-fill" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="currentColor" viewBox="0 0 16 16">
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
            <p className="text-center">Tidak ada data Admin </p>
          </div>
        )}
      </Row>
    </Container>
  );
};
export default Admin;
