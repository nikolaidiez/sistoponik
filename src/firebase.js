import { initializeApp } from 'firebase/app'

const config = {
  apiKey: 'AIzaSyAF3dqySnRdreNkX3ghGOJATYiPylxedX8',
  authDomain: 'sistoponik.firebaseapp.com',
  databaseURL: 'https://sistoponik-default-rtdb.firebaseio.com',
  projectId: 'sistoponik',
  storageBucket: 'sistoponik.appspot.com',
  messagingSenderId: '162662901377',
  appId: '1:162662901377:web:77380cc7cbc4177ce7cf80',
  measurementId: 'G-FPVDE8NQT9'
}

const firebase = initializeApp(config)
export default firebase
