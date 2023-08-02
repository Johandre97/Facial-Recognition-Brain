import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Signin from './components/signin/Signin';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/rank';
import ParticlesBg from "particles-bg";
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Register from './components/register/Register.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn : false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (boundingBox) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - (boundingBox.right_col * width),
      bottomRow: height - (boundingBox.bottom_row * height)
    };
  }

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    const PAT = '80681ca49bdd48e5920c6e0b849b12c0';
    const USER_ID = 'clarifai';       
    const APP_ID = 'main';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    const IMAGE_URL = this.state.input;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {"data": {"image": {"url": IMAGE_URL}}}
          ]
          });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    this.setState({ IMAGE_URL: this.state.input });

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.json()) // Parse the response as JSON
      .then(data => {
        // Access the bounding box information for each region (face)
        const regions = data.outputs[0].data.regions;
        if (regions && regions.length > 0) {
          const boundingBoxes = regions.map(region => {
            const boundingBox = region.region_info.bounding_box;
            return this.calculateFaceLocation(boundingBox);
          });

          this.displayFaceBoxes(boundingBoxes);

          if (data) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  id: this.state.user.id,
              })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          }
        } else {
          console.log("No bounding box data found in the response.");
        }
      })
      .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route : route});
  }

  render() {  
    const { isSignedIn, IMAGE_URL, route, boxes } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={ isSignedIn } onRouteChange = {this.onRouteChange} />
        {  route  === 'home' ?
          <div> 
            <Logo />
            <Rank name={this.state.user.name} entries = {this.state.user.entries}/>
            <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}>          
            </ImageLinkForm>
            <FaceRecognition boxes={boxes} 
            IMAGE_URL={ IMAGE_URL }></FaceRecognition>
            <ParticlesBg color={'#FFFFFF'} type="cobweb" bg={true} />
          </div>
        :  (
          route === 'signin'
           ? <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
           : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

        )
        }
      </div>
    );
  }
}

export default App; 
