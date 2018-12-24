// GET DOM NODES
const submitTrain = document.querySelector('.train-form__button');

const trains = document.querySelector('tbody');
const form = document.querySelector('.train-form');

const trainName = document.querySelector('.train-form__input__name');
const destination = document.querySelector('.train-form__input__destination');
const firstTrain = document.querySelector('.train-form__input__first-train');
const frequency = document.querySelector('.train-form__input__frequency');

// DATABASE_______________________________________________________
// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDNvJosGkdxJVn1IQeAmjFtNEAZk40jAnY',
  authDomain: 'train-times-d3c38.firebaseapp.com',
  databaseURL: 'https://train-times-d3c38.firebaseio.com',
  projectId: 'train-times-d3c38',
  storageBucket: 'train-times-d3c38.appspot.com',
  messagingSenderId: '284803371862'
};

firebase.initializeApp(config);

let db = firebase.database();

db.ref().on('child_added', function(snapshot, prevChildKey) {
  let newPost = snapshot.val();

  let tr = document.createElement('tr');
  tr.innerHTML = `<td>${newPost.trainName}</td>
     <td>${newPost.destination}</td>
     <td>${newPost.frequency}</td>
     `;

  trains.appendChild(tr);
});

// FUNCTIONS______________________________________________________
function addTrain() {
  db.ref().push(
    {
      trainName: trainName.value.trim(),
      destination: destination.value.trim(),
      firstTrain: firstTrain.value.trim(),
      frequency: frequency.value.trim(),
      timeStamp: firebase.database.ServerValue.TIMESTAMP
    },
    error => {
      error
        ? console.log('there was and error, it says: ', +error)
        : form.reset();
    }
  );
}

// LISTENERS______________________________________________________
submitTrain.addEventListener('click', addTrain);
