import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: ".....",
  authDomain: "......firebaseapp.com",
  projectId: ".....",
  storageBucket: ".....appspot.com",
  messagingSenderId: "....",
  appId: "....",
  measurementId: "....",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const storage = getStorage()
