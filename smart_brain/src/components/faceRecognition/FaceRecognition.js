import React from "react";
import './FaceRecognition.css'

const FaceRecognition = ({ IMAGE_URL, boxes }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputImage" src={IMAGE_URL} alt="" width='500px' height='auto' />
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bounding-box"
            style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default FaceRecognition;
