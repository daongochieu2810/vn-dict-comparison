import firebase from 'firebase';
import 'firebase/firestore';
const firebaseConfig = {   
    apiKey : "AIzaSyCFvIHCWkKNoE5U5cUTspVAlszlsv_nMdU",
    authDomain : "vn-dict-comparison.firebaseapp.com",   
    DatabaseURL : "https://vn-dict-comparison.firebaseio.com",
    projectId : "vn-dict-comparison",
    storageBucket : "vn-dict-comparison.appspot.com",
    messagingSenderId : "752423783280",
    appId : "1:752423783280:web:727859613c7efa40cfddb5",
    measurementId : "G-R9B0ZKZSEP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {
    console.log('Error when setting firebase auth persistentce')
})
const FieldValue = firebase.firestore.FieldValue;
const TaskEvent = firebase.storage.TaskEvent;
const TaskState = firebase.storage.TaskState;

const dictCollection = db.collection('dictionary');

export default {
    dictCollection,
    auth,
    storage,
    FieldValue,
    TaskEvent,
    TaskState
}