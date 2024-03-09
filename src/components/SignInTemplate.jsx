import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, storage } from "../config/firebase"
import React, { useEffect, useRef, useState } from "react"
import ProfileOnRightCorner from "./ProfileOnRightCorner"

export default function SignInTemplate() {
  const firstName = useRef()
  const lastName = useRef()
  const fileInput = useRef()

  const [isSigningIn, setIsSigningIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const [showSignInComponentOnly, setShowSignInComponentOnly] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setShowProfile(true)
      } else {
        setShowProfile(false)
      }
    })
  }, [])

  const createUserButton = async () => {
    try {
      setIsSigningIn(true)
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          //storage reference for uploading images
          const refToImage = ref(
            storage,
            `${userCredential.user.email}/${userCredential.user.email}_pp`
          )

          //state change might cause re-rendering which might lose the data in the form. hence we store it in a variable before moving forward with anything that might cause state change
          const fileToBeUploaded = fileInput.current.files[0]
          const userFirstName = firstName.current.value
          const userLastName = lastName.current.value

          //upload image to the storage
          try {
            await uploadBytes(refToImage, fileToBeUploaded)
          } catch (err) {
            console.error(err)
          }

          //update displayName and photoURL
          try {
            let photoURL
            //generate photoURL for recently uploaded photo
            try {
              await getDownloadURL(refToImage).then((url) => {
                photoURL = url
              })
            } catch (err) {
              console.error(err)
            }

            //finally updates the displayName and photoURL
            await updateProfile(userCredential.user, {
              displayName: `${userFirstName} ${userLastName}`,
              photoURL: photoURL,
            })
          } catch (err) {
            console.error(err)
          }

          console.log(
            `user created with email "${userCredential.user.email}" and name "${userCredential.user.displayName}"`
          )
          setIsSigningIn(false)
        }
      )
    } catch (err) {
      console.error(err)
      setIsSigningIn(false)
    }
  }

  const flagSignInComponentOnly = () => {
    setShowSignInComponentOnly(!showSignInComponentOnly)
  }

  //on clicking in sign in button
  const signInButton = async () => {
    setIsSigningIn(true)
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        setEmail("")
        setPassword("")
        setIsSigningIn(false)
      })
    } catch (err) {
      console.error(err)
      setIsSigningIn(false)
    }
  }

  const handleEmailInput = (e) => {
    setEmail(e.target.value)
  }
  const handlePasswordInput = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div className="relative">
      <div className="flex flex-col justify-center items-center min-h-screen">
        {!showProfile && (
          <div className="p-[1rem] mx-auto w-[400px] flex flex-col gap-3">
            {!showSignInComponentOnly && (
              <div>
                <input
                  type="text"
                  placeholder="firstname..."
                  ref={firstName}
                  className="px-2 py-1 border rounded-md border-black w-full"
                  required
                />
              </div>
            )}
            {!showSignInComponentOnly && (
              <div>
                <input
                  type="text"
                  placeholder="lastname..."
                  ref={lastName}
                  className="px-2 py-1 border rounded-md border-black w-full"
                  required
                />
              </div>
            )}
            <div>
              <input
                type="text"
                onChange={handleEmailInput}
                value={email}
                placeholder="email..."
                className="px-2 py-1 border rounded-md border-black w-full"
                required
              />
            </div>
            <div>
              <input
                type="password"
                onChange={handlePasswordInput}
                value={password}
                placeholder="password..."
                className="px-2 py-1 border rounded-md border-black w-full"
                required
              />
            </div>
            {!showSignInComponentOnly && (
              <label htmlFor="fileInput">
                <div className="py-2 cursor-pointer text-center rounded-md border-2 border-blue-800 border-dashed bg-blue-100 text-blue-900">
                  <input
                    id="fileInput"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    className=""
                    ref={fileInput}
                  />
                </div>
              </label>
            )}
            <div className="flex flex-col justify-between gap-2">
              {showSignInComponentOnly && (
                <div>
                  <button
                    onClick={signInButton}
                    className="bg-blue-800 rounded-md text-white px-4 py-2 w-full"
                  >
                    Sign In
                  </button>
                </div>
              )}
              {!showSignInComponentOnly && (
                <div>
                  <button
                    onClick={createUserButton}
                    className="bg-green-800 rounded-md text-white px-4 py-2 w-full"
                  >
                    Create User
                  </button>
                </div>
              )}
              {!showSignInComponentOnly && (
                <div className="text-center">
                  Already A User ?{" "}
                  <button
                    onClick={flagSignInComponentOnly}
                    className="underline hover:text-blue-700"
                  >
                    Sign In Here
                  </button>
                </div>
              )}
              {showSignInComponentOnly && (
                <div className="text-center">
                  New User ?{" "}
                  <button
                    onClick={flagSignInComponentOnly}
                    className="underline hover:text-blue-700"
                  >
                    Sign Up Here
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {showProfile && (
          <div>
            <ProfileOnRightCorner
              userInfo={{
                displayName: auth.currentUser?.displayName,
                photoURL: auth.currentUser?.photoURL,
              }}
              setEmail={setEmail}
              setPassword={setPassword}
            />
          </div>
        )}
      </div>
      {isSigningIn && (
        <div>
          <div className="h-screen w-screen absolute text-white left-0 top-0 bg-gray-700 opacity-80"></div>
          <div className="absolute h-screen w-screen flex justify-center items-center left-0 top-0 text-white">
            Signing In...
          </div>
        </div>
      )}
    </div>
  )
}
