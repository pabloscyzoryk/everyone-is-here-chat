// imports
import './ui/css/styles.css';

import { initializeApp } from 'firebase/app';
import { 
    getFirestore, collection, 
    addDoc, deleteDoc, doc, 
    onSnapshot, query, 
    where, orderBy, serverTimestamp,
    getDoc, updateDoc, limit, getDocs
} from 'firebase/firestore';

// firebase config

const firebaseConfig = {
    apiKey: "AIzaSyBoldLl3M_6aEucrZkOzRZqpKF1VckqKq8",
    authDomain: "everyone-is-here-9d230.firebaseapp.com",
    projectId: "everyone-is-here-9d230",
    storageBucket: "everyone-is-here-9d230.appspot.com",
    messagingSenderId: "561931449933",
    appId: "1:561931449933:web:841e0d4d240e59ee8b0e04",
    measurementId: "G-L49JLQ5GLT"
  };

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, 'messages');
const codeRef = doc(db, 'settings', 'UJIEHIQnTF0tL1o9wPt8');

// dom
const form = document.querySelector('.chatForm');
const send = document.querySelector('.send-icon');
const chat = document.querySelector('.chat');

// firebase document query
const q = query(colRef, orderBy('timestamp', 'desc'));

send.addEventListener('click', e => {
    form.submit.click();
});

if(localStorage.getItem('nick')) {
    form.nick.value = localStorage.getItem('nick');
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const time = new Date();
    const now = `${time.getHours()}:${time.getMinutes()}`;

    localStorage.setItem('nick', form.nick.value);

    addDoc(colRef, {
        author: form.nick.value,
        message: form.message.value,
        createdAt: now,
        timestamp: serverTimestamp(),
    })
    .then(() => {
        form.reset();
        form.nick.value = localStorage.getItem('nick');
    })
    .catch(err => {
        form.message.value = err;
    })
});

const unsubCol = onSnapshot(q, snapshot => {
    let messagesArray = [];
    getDoc(codeRef)
    snapshot.docs.forEach(doc => {
        messagesArray.push({...doc.data(), id: doc.id})
    })
    chat.innerHTML = '';
    messagesArray.forEach(message => {
        chat.innerHTML += `<li>
        <p class="from">From: <i>${message.author}</i></p>
        <div class="chat-element">
            <div class="message">
            <p class="text">${message.message} </p>
          </div>
        </div>
        <p class="send">Send at: <b>${message.createdAt}</b></p>
        </li>`
    })
})