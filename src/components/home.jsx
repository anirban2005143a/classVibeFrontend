import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";
import Navbar from "./navbar";
import Loader from './loader'
import Error from './error'
import homrBgImg from '../assets/homeBgImg.jpg'
import JoinModal from "./modals/join";
import getCookie from "./functions/getCookie";

const home = () => {

  const value = useContext(UserContext);
  const navigate = useNavigate();

  const [imageLoaded, setimageLoaded] = useState(null)
  const [isAuthorized, setisAuthorized] = useState(null)
  const [iserror, setiserror] = useState(null)
  const [errorMessage, seterrorMessage] = useState('')
  const [errorStatus, seterrorStatus] = useState(0)
  let roomno = null

  //function to check token and userid same or not
  const checkUser = async () => {
    const authtoken = getCookie("authtoken")
    const userId = getCookie("userId")
    console.log(value.backendServer, value.forntendServer , `${value.backendServer}/api/auth/checkUser`)
    if (!authtoken || !userId) {
      navigate('/login')
    } else {
      const res = await fetch(`${value.backendServer}/api/auth/checkUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authToken: `${authtoken}`,
        },
        body: JSON.stringify({
          userId: `${userId}`,
        }),
      })
      const data = await res.json()
      console.log(data.authError, data)
      data.error && !data.authError ? setiserror(true) : setiserror(false)
      data.error && !data.authError ? seterrorMessage(data.message) : ''
      data.error && !data.authError ? seterrorStatus(data.status) : ''
      !data.isMatched ? navigate("/login") : ""
      data.isMatched ? setisAuthorized(true) : setisAuthorized(false)
    }
  }

  //function to generate room id
  const generateRoomId = async () => {
    const random = Math.random().toString(36).substr(2, 10);
    const encodedId = btoa(random)
    roomno = random
    return encodedId
  }

  //function to redirect the meeting page
  const redirect = async () => {
    const owners = localStorage.getItem('owners')
    if (!owners) {
      localStorage.setItem('owners', JSON.stringify([{ isowner: true, roomId: roomno }]))
    } else {
      let arr = JSON.parse(owners)
      arr.push({ isowner: true, roomId: roomno })
      localStorage.setItem('owners', JSON.stringify(arr))
    }

    const id = await generateRoomId()
    window.open(`/meeting/${id}`, '_blank')
  }

  const isImageLoaded = () => {
    const image = new Image()
    try {
      image.src = homrBgImg
      image.onload = () => {
        setimageLoaded(true)
      }
    } catch {
      setiserror(true)
      seterrorStatus(500)
      seterrorMessage("Internal server error ... please try again")
      setimageLoaded(false)
    }
  }

  useEffect(() => {
    checkUser()
    isImageLoaded()
  }, [])


  return (
    <>
      <JoinModal />

      {(isAuthorized === null || imageLoaded === null || iserror===null) && <Loader />}

      {iserror && <Error status={errorStatus} message={errorMessage} />}

      {isAuthorized !== null && imageLoaded !== null && !iserror && <div className="main position-absolute w-100 h-100 overflow-x-hidden" style={{ backgroundImage: `url(${homrBgImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
        <Navbar />
        <div className="container d-flex flex-column align-items-center mt-5 pt-3 ">
          <div className="startBtn my-2 dropdown">
            <button type="button" className="btn btn-primary py-2 px-3 startMeeting" onClick={redirect}>Start Meeting</button>

          </div>
          <div className="joinBtn my-2">
            <button type="button" className="btn btn-primary py-2 px-3 joinMeeting" data-bs-toggle="modal" data-bs-target="#exampleModalJoin">Join Meeting</button>
          </div>
        </div>
      </div>}
    </>
  )
}

export default home