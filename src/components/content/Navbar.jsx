import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Button, Nav } from 'react-bootstrap';
import AuthService from '../services/auth.service';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NavBar(props) {
  const logOut = () => {
    AuthService.logout();
    // window.location.reload();
  };
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  return (
    <Navbar bg="light" className="navbar shadow-sm p-3 mb-3 bg-white rounded" expand>
      <Button variant="outline-info" onClick={props.toggle}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </Button>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
        <Nav className="ml-auto" navbar>
          <Nav.Link className="px-3" as={Link} style={{ fontWeight: 'Bold' }} to="#">
            Hi, {currentUser && currentUser.user.username}
          </Nav.Link>
          <Nav.Link className="px-3" as={Link} style={{ fontWeight: 'Bold' }} onClick={logOut} to="/">
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
