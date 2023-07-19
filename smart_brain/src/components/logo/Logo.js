import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.svg';
import './Logo.css';


function Logo() {
  return (
    <div className="ma4 mt0">
      <Tilt style={{ width: '150px' }}>
        <div className="Tilt bd2 shadow-2 pa1">
          <img style={{ paddingTop: '5px', display: "flex" }} alt="Logo" src={brain} />
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;