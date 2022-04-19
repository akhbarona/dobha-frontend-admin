import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faBoxArchive, faTimes, faUsers, faNewspaper, faTags } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';

function SideBar(props) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const location = useLocation();
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className={classNames('sidebar', { 'is-open': props.isOpen })}>
      <div className="sidebar-header">
        <Button variant="link" onClick={props.toggle} style={{ color: '#fff' }} className="mt-4">
          <FontAwesomeIcon icon={faTimes} pull="right" size="xs" />
        </Button>

        <img className="bg-logo" src="/dobha-transparent.png" alt="dobha-parfume" style={{ width: '100%', height: '100%' }} />
      </div>

      <Nav className="flex-column pt-2">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/dashboard">
            <FontAwesomeIcon icon={faHome} className="margin-nav-right" />
            Dashboard
          </Nav.Link>
        </Nav.Item>
        {currentUser && currentUser.user.username === 'superadmin' ? (
          <Nav.Item>
            <Nav.Link as={NavLink} to="/manage-admin">
              <FontAwesomeIcon icon={faUsers} className="margin-nav-right" />
              Manage Admin
            </Nav.Link>
          </Nav.Item>
        ) : undefined}

        <Nav.Item>
          <Nav.Link as={NavLink} to="/manage-products">
            <FontAwesomeIcon icon={faBox} className="margin-nav-right" />
            Manage Products
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/manage-article">
            <FontAwesomeIcon icon={faNewspaper} className="margin-nav-right" />
            Manage Article
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/manage-category-products">
            <FontAwesomeIcon icon={faTags} className="margin-nav-right" />
            Manage Category Products
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/manage-category-articles">
            <FontAwesomeIcon icon={faNewspaper} className="margin-nav-right" />
            Manage Category Article
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/manage-transaksi">
            <FontAwesomeIcon icon={faBoxArchive} className="margin-nav-right" />
            Manage Transaksi
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default SideBar;
