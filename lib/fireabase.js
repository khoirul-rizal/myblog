import firebase from "firebase";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCdmxgUKaONF-9HnrdRub2ikpUBHLfjm0E",
  authDomain: "nextfire-25549.firebaseapp.com",
  projectId: "nextfire-25549",
  storageBucket: "nextfire-25549.appspot.com",
  messagingSenderId: "357839473347",
  appId: "1:357839473347:web:9bd2c02e2d6279b564b076",
  measurementId: "G-TB6LBPBNQQ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
export const increment = firebase.firestore.FieldValue.increment

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}