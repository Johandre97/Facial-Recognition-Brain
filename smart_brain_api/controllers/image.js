// image.js

const PAT = '80681ca49bdd48e5920c6e0b849b12c0'; // Replace with your Clarifai API Key
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const handleApiCall = (imageUrl) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        { "data": { "image": { "url": imageUrl } } }
      ]
    }),
  };

  return fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
    .then(response => response.json())
    .then(data => {
      return data.outputs[0].data.regions; // Extract bounding box data
    })
    .catch(error => {
      console.log('Clarifai API error:', error);
      throw new Error('Clarifai API request failed');
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  // Update user entries in the database
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(error => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall,
};