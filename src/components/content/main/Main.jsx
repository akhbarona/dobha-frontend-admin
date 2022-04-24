import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Placeholder ,Row} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import authHeader from "../../services/auth.header";
import AuthService from "../../services/auth.service";
const numberWithCommas = (x) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const Main = () => {
  const [total, setTotal] = useState(null);
  const [pendapatan, setPendapatan] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getTotal = async () => {
      await axios
        .get(`/api/auth/admin/dashboard-data`, { headers: authHeader() })
        .then((res) => setTotal(res.data))
        .catch((err) => console.log(err));
    };

    const getPendapatan = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL_TRANSAKSI}/api/pendapatan`)
        .then((res) => setPendapatan(res.data))
        .catch((err) => console.log(err));
    };

    getPendapatan();
    getTotal();
  }, []);

  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    setCurrentUser(user);
  }, []);

  // useEffect(() => {
  //   const timerId = timeout(currentUser.expired_token);
  //   return () => {
  //     clearTimeout(timerId);
  //   };
  // }, []);

  console.log("pendapatan", pendapatan);

  return (
    <div className="container-fluid height-container">
      <div className="row g-4 row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
        <Col xl={3} lg={4}>
          <div className="card bg-primary text-center">
            <div className="card-body p-4">
              <div className="tile-left">
                <i className="fa-solid fa-box fa-3x"></i>
              </div>
              <div className="tile-right">
                <div className="tile-number">
                  {total !== null ? (
                    total.total_produk
                  ) : (
                    <Placeholder as="span" animation="glow">
                      <Placeholder xs={7} />
                    </Placeholder>
                  )}
                </div>
                <div className="tile-description">Total Produk</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={4}>
          <div className="card bg-secondary text-center">
            <div className="card-body p-4">
              <div className="tile-left">
                <i className="fa-solid fa-newspaper fa-3x"></i>
              </div>
              <div className="tile-right">
                <div className="tile-number">
                  {total !== null ? (
                    total.total_article
                  ) : (
                    <Placeholder as="span" animation="glow">
                      <Placeholder xs={7} />
                    </Placeholder>
                  )}
                </div>
                <div className="tile-description">Total Artikel</div>
              </div>
            </div>
          </div>
        </Col>
        {currentUser && currentUser.user.username === "superadmin" ? (
          <Col xl={3} lg={4}>
            <div className="card bg-primary text-center">
              <div className="card-body p-4">
                <div className="tile-left">
                  <i className="fa-solid fa-users fa-3x"></i>
                </div>
                <div className="tile-right">
                  <div className="tile-number">
                    {total !== null ? (
                      total.total_admin
                    ) : (
                      <Placeholder as="span" animation="glow">
                        <Placeholder xs={7} />
                      </Placeholder>
                    )}
                  </div>
                  <div className="tile-description">Total Admin</div>
                </div>
              </div>
            </div>
          </Col>
        ) : undefined}
      </div>

      <div className="d-flex mt-5">
      <Col xl={3} lg={6}>
          <div className="card bg-success text-center m-3">
            <div className="card-body p-4">
              <div className="tile-left">
                <i className="fa-solid fa-bank fa-3x"></i>
              </div>
              <div className="tile-right">
                <div className="tile-number">
                  {pendapatan !== null ? (
                    pendapatan.data.bca?`Rp. ${numberWithCommas(pendapatan.data.bca)}`:'Rp. 0'
                  ) : (
                    <Placeholder as="span" animation="glow">
                      <Placeholder xs={7} />
                    </Placeholder>
                  )}
                </div>
                <div className="tile-description">BCA</div>
              </div>
            </div>
          </div>
        </Col>

        <Col xl={3} lg={6}>
          <div className="card bg-warning text-center m-3">
            <div className="card-body p-4">
              <div className="tile-left">
                <i className="fa-solid fa-wallet fa-3x"></i>
              </div>
              <div className="tile-right">
                <div className="tile-number">
                  {pendapatan !== null ? (
                    pendapatan.data.gopay?`Rp. ${numberWithCommas(pendapatan.data.gopay)}`:'Rp. 0'
                  ) : (
                    <Placeholder as="span" animation="glow">
                      <Placeholder xs={7} />
                    </Placeholder>
                  )}
                </div>
                <div className="tile-description">Gopay</div>
              </div>
            </div>
          </div>
        </Col>

        <Col xl={3} lg={6}>
          <div className="card bg-primary text-center m-3">
            <div className="card-body p-4">
              <div className="tile-left">
                <i className="fa-solid fa-wallet fa-3x"></i>
              </div>
              <div className="tile-right">
                <div className="tile-number">
                  {pendapatan !== null ? (
                   pendapatan.data.dana?`Rp. ${numberWithCommas(pendapatan.data.dana)}`: 'Rp .0'
                  ) : (
                    <Placeholder as="span" animation="glow">
                      <Placeholder xs={7} />
                    </Placeholder>
                  )}
                </div>
                <div className="tile-description">Dana</div>
              </div>
            </div>
          </div>
        </Col>

        <Col xl={3} lg={6}>
          <div className="card bg-danger text-center m-3">
            <div className="card-body p-4">
              <div className="tile-left">
                <i className="fa-solid fa-calculator fa-3x"></i>
              </div>
              <div className="tile-right">
                <div className="tile-number">
                  {pendapatan !== null ? (
                    pendapatan.data.total?`Rp. ${numberWithCommas(pendapatan.data.total)}`:'Rp. 0'
                  ) : (
                    <Placeholder as="span" animation="glow">
                      <Placeholder xs={7} />
                    </Placeholder>
                  )}
                </div>
                <div className="tile-description">Pendapatan</div>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </div>
  );
};
export default Main;
