"use client"
import React, { useState } from 'react'
import axios from 'axios'
import Link from "next/link"
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"


const  ProfilePage = ()  => {
  const router = useRouter() 
  const [data, setData] = useState("Nothing")

  // remove token id to logout -
  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast.success("Logout successful")
      router.push("/login")
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  // get user details ----
  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me")
    console.log(res.data)
    setData(res.data.data._id)
  }


  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1> Profile dashboard !</h1>
      <hr />
      <p> Profile page </p>
      <h2 className='p-2 rounded bg-green-500'> {data === "Nothing" ? "Nothing": <Link href={`/profile/${data}`}> data </Link>}</h2>
      <button onClick={logout} className='bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> Logout </button>  

      <button onClick={getUserDetails} className='bg-purple-800 mt-4 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'> getUser details </button>
    </div>
  )
}

export default ProfilePage