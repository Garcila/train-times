// GET DOM NODES
const submitTrain = document.querySelector('.train-form__button');

let trains = document.querySelector('tbody');
let form = document.querySelector('.train-form');
let table = document.querySelector('tbody');

//_____________________________________________________________
//get login elements
let txtEmail = document.getElementById('txtEmail');
let txtPassword = document.getElementById('txtPassword');
let btnLogin = document.getElementById('btnLogin');
let btnSignUp = document.getElementById('btnSignUp');
let btnLogout = document.getElementById('btnLogout');

//___________________________________________________________

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

//________________________________________________________________________
// Add login event
// TODO: Need to verify that the email passed is a valid email
btnLogin.addEventListener('click', (e) => {
	// Get email and pass
	let email = txtEmail.value;
	let pass = txtPassword.value;
	let auth = firebase.auth();
	// Sign in
	let promise = auth.signInWithEmailAndPassword(email, pass);
	promise.catch((e) => console.log(e.message));
});

// Add signup event
btnSignUp.addEventListener('click', (e) => {
	// Get email and pass
	let email = txtEmail.value;
	let pass = txtPassword.value;
	let auth = firebase.auth();
	// Sign in
	let promise = auth.createUserWithEmailAndPassword(email, pass);
	promise.catch((e) => console.log(e.message));
});

btnLogout.addEventListener('click', (e) => {
	firebase.auth().signOut();
});

// Add real time listener to authentication
firebase.auth().onAuthStateChanged((firebaseUser) => {
	if (firebaseUser) {
		console.log(firebaseUser);
		btnLogin.classList.add('hide');
		btnSignUp.classList.add('hide');
		btnLogout.classList.remove('hide');
	} else {
		console.log('not logged in');
    btnLogout.classList.add('hide');
    btnLogin.classList.remove('hide');
		btnSignUp.classList.remove('hide');
	}
});

//_____________________________________________________________________

//______________________________________________________________________

db.ref().on(
	'child_added',
	function(snapshot, prevChildKey) {
		let newPost = snapshot.val();

		let firstTrain = moment(newPost.firstTrain, 'hh:mm');

		let nowMinusFirst = moment().diff(moment(firstTrain), 'minutes');
		let Remainder = nowMinusFirst % newPost.frequency;
		let minutesAway = newPost.frequency - Remainder;
		let nextTrain = moment(moment().add(minutesAway, 'minutes')).format('hh:mm');

		if (nowMinusFirst > 0) {
			let tr = document.createElement('tr');
			tr.className = 'show-train__tr';
			tr.dataset.id = snapshot.key;
			tr.innerHTML = `<td>${newPost.trainName}</td>
      <td>${newPost.destination}</td>
      <td class='center'>${newPost.frequency}</td>
      <td class='center'>${nextTrain}</td>
      <td class='center'>${minutesAway}</td>
      <td class='center X'>X</td>
      `;

			trains.appendChild(tr);
		} else {
			nextTrain = moment(firstTrain).format('hh:mm');
			minutesAway = moment(firstTrain).diff(moment(), 'minutes');
			let tr = document.createElement('tr');
			tr.className = 'show-train__tr';
			tr.dataset.id = snapshot.key;
			tr.innerHTML = `<td>${newPost.trainName}</td>
      <td>${newPost.destination}</td>
      <td class='center'>${newPost.frequency}</td>
      <td class='center'>${nextTrain}</td>
      <td class='center'>${minutesAway}</td>
      <td class='center X'>X</td>
       `;

			trains.appendChild(tr);
		}
	},
	(error) => (error ? console.log('error child_added ' + error) : '')
);

// FUNCTIONS______________________________________________________
function addTrain(e) {
	// e.preventDefault();

	let train = {
		trainName: document.querySelector('.name').value.trim(),
		destination: document.querySelector('.destination').value.trim(),
		firstTrain: document.querySelector('.first').value.trim(),
		frequency: document.querySelector('.frequency').value.trim()
	};

	db.ref().push(train, (error) => {
		error ? console.log('there was and error, it says: ', +error) : form.reset();
	});
}

// LISTENERS______________________________________________________
submitTrain.addEventListener('click', addTrain);

// Delete record

table.addEventListener('click', (e) => {
	let node = e.target.parentNode;
	let nodeKey = node.dataset.id;
	db.ref().child(nodeKey).remove(); // remove from DB
	node.remove(); // remove from DOM
});
