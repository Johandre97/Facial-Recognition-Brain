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

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({ user: { ...this.state.user, ...data } });
  }

  calculateFaceLocation = (boundingBox, width, height) => {
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
    // Check if an image URL is provided
    if (!this.state.input) {
      return;
    }

    // Call the handleApiCall function from image.js
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: this.state.input })
    })
      .then(response => response.json())
      .then(data => {
        // Access the bounding box information for each region (face)
        const regions = data.boxes;
        if (regions && regions.length > 0) {
          // Get the image element
          const image = document.getElementById('inputImage');

          // Calculate width and height of the image
          const width = Number(image.width);
          const height = Number(image.height);

          // Calculate bounding box coordinates
          const boundingBoxes = regions.map(region => {
            const boundingBox = region.region_info.bounding_box;
            return this.calculateFaceLocation(boundingBox, width, height);
          });

          // Update the bounding boxes on the front-end
          this.displayFaceBoxes(boundingBoxes);

          // Update user entries on the server
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState({ user: { ...this.state.user, entries: count } });
            })
            .catch(console.log);
        } else {
          console.log("No bounding box data found in the response.");
        }
      })
      .catch(error => {
        console.log('Error handling image URL:', error);
        // Handle errors here if needed
      });
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, user, route, boxes } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            ></ImageLinkForm>
            <FaceRecognition boxes={boxes} IMAGE_URL={this.state.input}></FaceRecognition>
            <ParticlesBg color={'#FFFFFF'} type="cobweb" bg={true} />
          </div>
        ) : route === 'signin' ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
