// GET DOM NODES
const submitTrain = document.querySelector('.train-form__button');

const trainName = document.querySelector('.train-form__input__name');
const destination = document.querySelector('.train-form__input__destination');
const firstTrain = document.querySelector('.train-form__input__first-train');
const frequency = document.querySelector('.train-form__input__frequency');



// DATABASE_______________________________________________________
// Initialize Firebase
const config = {
  apiKey: "AIzaSyDNvJosGkdxJVn1IQeAmjFtNEAZk40jAnY",
  authDomain: "train-times-d3c38.firebaseapp.com",
  databaseURL: "https://train-times-d3c38.firebaseio.com",
  projectId: "train-times-d3c38",
  storageBucket: "train-times-d3c38.appspot.com",
  messagingSenderId: "284803371862"
};

firebase.initializeApp(config);

let db = firebase.database();

// FUNCTIONS______________________________________________________
function addTrain() {
  db.ref().push({
    trainName: trainName.value.trim(),
    destination: destination.value.trim(),
    firstTrain: firstTrain.value.trim(),
    frequency: frequency.value.trim(),
  }, error => {
    error ? console.log('there was and error, it says: ', + error)
    : console.log('Data saved successfully');
  });
}

// LISTENERS______________________________________________________
submitTrain.addEventListener('click', addTrain);


// trainName
// destination
// firstTrainTime
// frequency