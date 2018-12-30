// GET DOM NODES
const submitTrain = document.querySelector('.train-form__button');

let trains = document.querySelector('tbody');

let form = document.querySelector('.train-form');

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

db.ref().on(
  'child_added',
  function(snapshot, prevChildKey) {
    let newPost = snapshot.val();
 
    let firstTrain = moment(newPost.firstTrain, "hh:mm");

    let nowMinusFirst = moment().diff(moment(firstTrain), "minutes");
    let Remainder = nowMinusFirst % newPost.frequency;
    let minutesAway = newPost.frequency - Remainder;
    let nextTrain = moment(moment().add(minutesAway, "minutes")).format('hh:mm');

    if(nowMinusFirst > 0){
      let tr = document.createElement('tr');
      tr.className = 'show-train__tr'
      tr.innerHTML = `<td>${newPost.trainName}</td>
      <td>${newPost.destination}</td>
      <td class='center'>${newPost.frequency}</td>
      <td class='center'>${nextTrain}</td>
      <td class='center'>${minutesAway}</td>
      `;
      
      trains.appendChild(tr);

    } else {
      nextTrain = moment(firstTrain).format('hh:mm');
      minutesAway = moment(firstTrain).diff(moment(), 'minutes');
      let tr = document.createElement('tr');
      tr.className = 'show-train__tr'
      tr.innerHTML = `<td>${newPost.trainName}</td>
       <td>${newPost.destination}</td>
       <td class='center'>${newPost.frequency}</td>
       <td class='center'>${nextTrain}</td>
       <td class='center'>${minutesAway}</td>
       `;
  
      trains.appendChild(tr);
    }


  },
  error => (error ? console.log('error child_added ' + error) : '')
);

// FUNCTIONS______________________________________________________
function addTrain(e) {
  e.preventDefault();

  let train = {
    trainName: document.querySelector('.name').value.trim(),
    destination: document.querySelector('.destination').value.trim(),
    firstTrain: document.querySelector('.first').value.trim(),
    frequency: document.querySelector('.frequency').value.trim(),
  }

  db.ref().push(
    train,
    error => {
      error
        ? console.log('there was and error, it says: ', +error)
        : form.reset();
    }
  );
}


// LISTENERS______________________________________________________
submitTrain.addEventListener('click', addTrain);
