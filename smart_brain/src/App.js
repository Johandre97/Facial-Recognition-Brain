import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/rank';
import ParticlesBg from "particles-bg";


class App extends Component {
  render() {  
    // const particleColor = ['#e1cbcc', '#bf78c4', '#eeddde', '#ccb5b7', '#d59fdb', '#a75ba9'];
    return (
      <div className="App">
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm></ImageLinkForm>
        {/*<FaceRecognition></FaceRecognition>} */}
        <ParticlesBg color={'#FFFFFF'} type="cobweb" bg={true} />
      </div>
    );
  }
}

export default App; 
