import { useEffect, useState } from 'react';
import './App.css';

import SideBar from './components/sidebar/Sidebar';
import Content from './components/content/Content';
import { Routes, useLocation } from 'react-router-dom';

function App(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  let previousWidth = -1;

  const updteWidth = () => {
    const width = window.innerWidth;
    const widthLimit = 576;
    const isMobile = width <= widthLimit;
    const wasMobile = previousWidth <= widthLimit;

    if (isMobile !== wasMobile) {
      setIsOpen(!isMobile);
    }
    previousWidth = width;
  };

  useEffect(() => {
    updteWidth();
    window.addEventListener('resize', updteWidth());
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();

  const position = location.pathname !== '/';
  return (
    <div className={position ? 'App' : 'login-wrapper'}>
      {position && <SideBar toggle={toggle} isOpen={isOpen} />}

      <Content toggle={toggle} isOpen={isOpen} />
    </div>
  );
}
export default App;
