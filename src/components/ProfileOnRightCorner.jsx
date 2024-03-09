import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"

export default function ProfileOnRightCorner({
  userInfo,
  setEmail,
  setPassword,
}) {
  const signOutButton = async () => {
    try {
      await signOut(auth).then(() => {
        setEmail("")
        setPassword("")
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="text-center flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <img
          src={userInfo.photoURL}
          className="h-[75px] w-[75px] border border-blue-800 rounded-full p-0.5"
          alt="profile_picture"
        />
        <p>Hello, {userInfo.displayName}</p>
      </div>
      <div className="grow">
        <button
          onClick={signOutButton}
          className="bg-red-800 rounded-md text-white px-4 py-2 w-full"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
