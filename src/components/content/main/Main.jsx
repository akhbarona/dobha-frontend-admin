import axios from 'axios';
import { useEffect, useState } from 'react';
import { Col, Placeholder } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authHeader from '../../services/auth.header';
import AuthService from '../../services/auth.service';

const Main = () => {
  const [total, setTotal] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getTotal = async () => {
      await axios
        .get(`/api/auth/admin/dashboard-data`, { headers: authHeader() })
        .then((res) => setTotal(res.data))
        .catch((err) => console.log(err));
    };
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
        {currentUser && currentUser.user.username === 'superadmin' ? (
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
    </div>
  );
};
export default Main;
