import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/userContext";
import { Peer } from "peerjs";
import io from "socket.io-client";
import '../css/global.css'
import { v4 as uuidv4 } from 'uuid';
import getCookie from "./functions/getCookie";
import Leave from "./modals/leave";
import sendIconImg from '../assets/sendIconImg.png'
import closeVideo from '../assets/close.png'
import cameraOff from '../assets/videoClose.png'
import camera from '../assets/video.png'
import audioOff from '../assets/audioOff.png'
import audio from '../assets/audio.png'
import fullscreen from '../assets/fullscreen.png'
import pin from '../assets/pin.png'
import unpin from '../assets/unpin.png'
import screenShare from '../assets/screenShare.png'
import stopSharing from '../assets/stopScreenSharing.png'
import Loader from './loader'
import Error from './error'

const videoGroup = () => {

    const value = useContext(UserContext);
    const navigate = useNavigate();

    const { id } = useParams()

    const peerConn = useRef()//make peer reference
    const socketConn = useRef()//make socket refernece
    const localVideo = useRef()
    const senderName = useRef()
    const senderMessage = useRef()

    const [yourId, setyourId] = useState(null)//state to save peer id of currect user
    const [ownerId, setownerId] = useState(null)//state to save peer id of the owner of the room
    const [roomno, setroomno] = useState("")//state for room no
    const [yourStream, setyourStream] = useState(null)//state for sve user stream
    const [allStreams, setallStreams] = useState([])
    const [otherUserDetails, setotherUserDetails] = useState([])
    const [streamCount, setstreamCount] = useState(0)
    const [userDataCount, setuserDataCount] = useState(0)
    const [newJoiner, setnewJoiner] = useState(null)
    const [isSharing, setisSharing] = useState(false)
    const [alreadyJoin, setalreadyJoin] = useState({})

    const [user, setuser] = useState({})
    const [allChats, setallChats] = useState([])

    const [isOK, setisOK] = useState(null)
    const [message, setmessage] = useState('')
    const [animateModal, setanimateModal] = useState(false)

    const [isAuthorized, setisAuthorized] = useState(null)
    const [iserror, setiserror] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')
    const [errorStatus, seterrorStatus] = useState(0)

    //function to generate roomid
    const generateId = () => {
        const roomId = atob(id)
        setroomno(roomId)
    }

    //function to check token and userid same or not
    const checkUser = async () => {
        const authtoken = getCookie("authtoken")
        const userId = getCookie("userId")

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
            data.error && !data.authError ? setiserror(true) : setiserror(false)
            data.error && !data.authError ? seterrorMessage(data.message) : ''
            !data.isMatched ? navigate("/login") : ""
            data.isMatched ? setisAuthorized(true) : setisAuthorized(false)
        }
    }

    //function to start stream
    const Start = () => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: false }, (mediaStream) => {
            localVideo.current.srcObject = mediaStream;
            setyourStream(mediaStream)
        })
    }

    //function to call other
    const callOther = (peerId) => {
        console.log("calling")
        try {
            if (peerId && peerId !== yourId) {
                // console.log(peerId ,yourId )
                const call = peerConn.current.call(`${peerId}`, yourStream, {
                    metadata: { user: user, peerId: yourId }
                })
                console.log(peerId , call)
                call.on('stream', stream => {
                    const arr = allStreams
                    arr.push(stream)
                    setallStreams(arr)
                    setstreamCount(arr.length)
                })
            }
        } catch {
            setiserror(true)
            seterrorMessage("Internal Error Occured ... Please try again")
            seterrorStatus(500)
        }
    }

    //function to send additional data
    const sendAdditionalInfo = (peerId, AdditionalData) => {
        try {
            const conn = peerConn.current.connect(peerId)
            conn.on('open', () => {
                // Send user data when the connection is established
                conn.send(AdditionalData);
            });
        } catch (error) {
            setiserror(true)
            seterrorMessage("Internal Error Occured ... Please try again")
            seterrorStatus(500)
        }

    }

    //function to animate chat box
    const animateChatBox = () => {
        const Elem = document.querySelector('.chatbox')

        if (Elem.classList.contains('d-none')) {
            Elem.classList.remove('d-none')
            Elem.classList.add('animateFromRight')
            Elem.classList.remove('animateToRight')
        }
        else if (Elem.classList.contains('animateFromRight')) {
            Elem.classList.add('animateToRight')
            Elem.classList.remove('animateFromRight')
        }
        else if (Elem.classList.contains('animateToRight')) {
            Elem.classList.add('animateFromRight')
            Elem.classList.remove('animateToRight')
        }
    }

    //function to get overlayer to the video
    const getOverlayer = (elem) => {
        elem.getAttribute("pined") === "false" ? elem.style.scale = 1.015 : ''
        elem.querySelector('.otherVideoControl') ? elem.querySelector('.otherVideoControl').classList.remove('d-none') : ""

    }

    //function to remove overlayer
    const removeOverlayer = (elem) => {
        elem.getAttribute("pined") === "false" ? elem.style.scale = 1 : ''
        let timer = null
        timer = setTimeout(() => {
            elem.querySelector('.otherVideoControl') ? elem.querySelector('.otherVideoControl').classList.add('d-none') : ""
        }, 2000);
        ['mouseover', 'click'].forEach((evt) => {
            elem.addEventListener(evt, () => {
                if (timer !== null) {
                    elem.querySelector('.otherVideoControl') ? elem.querySelector('.otherVideoControl').classList.remove('d-none') : ""
                    clearTimeout(timer)
                }
            })
        })
    }

    //function to handel audio
    const handelAudio = (e) => {
        //change icon 
        if (e.currentTarget.querySelectorAll('i')[1].classList.contains('d-none')) {
            e.currentTarget.querySelectorAll('i')[1].classList.remove('d-none')
            e.currentTarget.querySelectorAll('i')[0].classList.add('d-none')
        } else {
            e.currentTarget.querySelectorAll('i')[0].classList.remove('d-none')
            e.currentTarget.querySelectorAll('i')[1].classList.add('d-none')
        }

        //handel audio from your stream
        if (e.currentTarget.querySelectorAll('i')[1].classList.contains('d-none')) {
            yourStream.getAudioTracks().forEach(track => track.enabled = true)
        } else {
            yourStream.getAudioTracks().forEach(track => track.enabled = false)
        }
    }

    //function to handel viddeo
    const handelVideo = (e) => {
        //change icon 
        if (e.currentTarget.querySelectorAll('i')[1].classList.contains('d-none')) {
            e.currentTarget.querySelectorAll('i')[1].classList.remove('d-none')
            e.currentTarget.querySelectorAll('i')[0].classList.add('d-none')
        } else {
            e.currentTarget.querySelectorAll('i')[0].classList.remove('d-none')
            e.currentTarget.querySelectorAll('i')[1].classList.add('d-none')
        }

        //handel video from your stream
        if (e.currentTarget.querySelectorAll('i')[1].classList.contains('d-none')) {
            yourStream.getVideoTracks().forEach(track => track.enabled = true);
        } else {
            yourStream.getVideoTracks().forEach(track => track.enabled = false)
        }
    }

    //function to handel full screen
    const handelFullscreen = (e) => {
        const fullscreenDiv = e.currentTarget.parentElement.parentElement.parentElement.querySelector('video')
        if (document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement) {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }

        } else {
            // Request fullscreen
            if (fullscreenDiv.requestFullscreen) {
                fullscreenDiv.requestFullscreen();
            } else if (fullscreenDiv.mozRequestFullScreen) { // Firefox
                fullscreenDiv.mozRequestFullScreen();
            } else if (fullscreenDiv.webkitRequestFullscreen) { // Chrome, Safari and Opera
                fullscreenDiv.webkitRequestFullscreen();
            } else if (fullscreenDiv.msRequestFullscreen) { // IE/Edge
                fullscreenDiv.msRequestFullscreen();
            }

        }
    }

    //function to start screen shareing
    const startScreenShare = async (e) => {
        e.preventDefault()
        let sharing = null
        isSharing ? sharing = true : sharing = false
        setisSharing(!isSharing)
        if (!sharing) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                setisOK(false)
                setmessage('Your browser does not support screen sharing')
            } else {
                const screenShare = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
                localVideo.current.srcObject = screenShare;
                setyourStream(screenShare)

                screenShare.getVideoTracks()[0].addEventListener('ended', () => {
                    setisSharing(false)
                    // console.log("end")
                    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    getUserMedia({ video: true, audio: false }, (mediaStream) => {
                        localVideo.current.srcObject = mediaStream;
                        setyourStream(mediaStream)
                    })
                })
            }
        } else {
            const screenShare = localVideo.current.srcObject
            screenShare.getTracks().forEach(track => track.stop());
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            getUserMedia({ video: true, audio: false }, (mediaStream) => {
                localVideo.current.srcObject = mediaStream;
                setyourStream(mediaStream)
            })
        }
    }

    //function to handel pin video
    const pinVideo = (e, index) => {
        const videoItem = document.querySelectorAll('.videoItem')[index]
        // console.log(videoItem, index)
        const videogroup = document.querySelector('.videogroup')
        if (e.currentTarget.querySelectorAll('svg')[1].classList.contains('d-none')) {
            Array.from(document.querySelectorAll('.videoItem')).forEach((item, i) => {
                if (i !== index) {
                    item.querySelector('.pinVideo').querySelectorAll('svg')[1].classList.add('d-none')
                    item.querySelector('.pinVideo').querySelectorAll('svg')[0].classList.remove('d-none')
                } else {
                    e.currentTarget.querySelectorAll('svg')[1].classList.remove('d-none')
                    e.currentTarget.querySelectorAll('svg')[0].classList.add('d-none')
                }
            })
        } else {
            e.currentTarget.querySelectorAll('svg')[1].classList.add('d-none')
            e.currentTarget.querySelectorAll('svg')[0].classList.remove('d-none')
        }

        if (e.currentTarget.querySelectorAll('svg')[0].classList.contains('d-none')) {

            videoItem.addEventListener('mouseover', (e) => { e.currentTarget.style.scale = 1 })
            videoItem.setAttribute("pined", "true")
            document.querySelector('.videogroup').classList.remove("overflow-auto")
            document.querySelector('.videogroup').classList.add("overflow-hidden")
            document.querySelector('.sidepannel').parentElement.classList.remove('d-none')
            Array.from(document.querySelectorAll('.videoItem')).forEach((Item, i) => {
                if (index === i) {
                    !videogroup.contains(Item) ? videogroup.appendChild(Item) : ''
                    Item.style.margin = '0'
                    Item.classList.add('w-100')
                    Item.classList.add('h-100')
                    Item.querySelector('video').classList.add('h-100')
                    Item.style.maxWidth = 'none'
                } else {
                    Item.style.margin = '15px'
                    Item.classList.remove('w-100')
                    Item.classList.remove('h-100')
                    Item.querySelector('video').classList.remove('h-100')
                    Item.style.maxWidth = '320px'
                    document.querySelector('.sidepannel').appendChild(Item)
                }
            })
        } else {
            videoItem.addEventListener('mouseover', (e) => { e.currentTarget.style.scale = 1.015 })
            videoItem.setAttribute("pined", "false")
            document.querySelector('.videogroup').classList.add("overflow-auto")
            document.querySelector('.videogroup').classList.remove("overflow-hidden")
            document.querySelector('.sidepannel').parentElement.classList.add('d-none')
            Array.from(document.querySelectorAll('.videoItem')).forEach((Item, i) => {
                if (index !== i) {
                    videogroup.appendChild(Item)
                } else {
                    Item.style.margin = '15px'
                    Item.classList.remove('w-100')
                    Item.classList.remove('h-100')
                    Item.querySelector('video').classList.remove('h-100')
                    Item.style.maxWidth = '320px'
                }
            })
        }
    }

    //function to create video item and append
    const createVideoItem = (stream, index) => {

        // console.log(otherUserDetails[index])
        if (otherUserDetails[index]) {

            const videoItem = document.createElement('div')
            videoItem.classList.add('videoItem')
            videoItem.classList.add('rounded-3')
            videoItem.setAttribute("pined", "false")
            videoItem.style.margin = '15px'
            videoItem.setAttribute('peerId', otherUserDetails[index].peerId)
            videoItem.innerHTML = `
             <div class='otherVideoControl rounded-3 w-100 my-auto position-absolute h-100 d-none z-2 d-flex justify-content-center align-items-center'>
                    <div class="controls rounded-4 d-flex justify-content-center align-items-center px-3 py-1" style="background-color: rgb(0 0 0 /70%);">
                        <div class="fullscreen mx-3 my-1" style="cursor: pointer;"><i class="fa-solid fa-expand fs-3 fw-bold" style="color: white;" ></i></div>
                        <div class="pinVideo mx-3 my-1" style="cursor: pointer;" >
                            <svg style="width: 30px;"  version="1.1" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
                                <path transform="translate(1392)" d="m0 0h44l1 4 2 1v2l4 2 11 9 10 9 4 3v2l4 2 336 336 5 6 7 6 6 7 6 5 5 6 7 6 5 6 7 6 5 6 7 6 6 7 6 5 5 6 7 6 4 4v2l4 2 6 7 6 5 5 6 7 6 5 6 7 6 6 7 6 5 6 7 6 5 6 7 6 5 4 4v2l4 2 5 6 8 7 5 5v2h2l7 8 13 13 10 14 8 17 1 4v11l-4 14-9 14-12 11-19 14-20 13-14 7-17 5-28 5-18 5h-21l-10-3h-11l-7 1-12-5-28-10-10-5-9 10-8 11-9 11-8 10-13 15-9 10-7 8-12 14-11 14-9 11-15 16-9 11-6 8h-2l-2 4-12 14-9 10-7 8-12 14-9 11-10 13-8 8-8 10h-2l-2 4-22 26-7 8-9 10-7 8-12 14-11 14-9 11-13 14-9 11-9 10-9 11-11 12-9 11-11 12-9 11-10 11-7 8-14 17-11 13-12 14-9 11-10 11-7 8-12 14-11 12-8 10h-2l-2 4-10 12-7 8-11 11h-2l4 10 10 14 10 15 9 16 7 16 9 25 6 19 4 17 2 15v13l1 5v16l-5 37-5 23-5 16-11 25-9 16-10 14-11 14-8 10-9 10-11 9-17 9-8 3h-9l-13-4-13-7-17-14-12-12-6-5-7-8-279-279-8-5-4-1-8 6-10 9-20 20-5 6-4 4h-2l-2 4-16 16h-2l-2 4-14 13-2 3h-2l-2 4-8 7-8 9-8 7-4 5-8 7-221 221-8 7-13 13-8 7-13 12-9 9-8 7-9 9-8 7-14 13-8 7-15 13-14 12-8 7-16 15-14 12-11 10-11 9-14 12-8 7-30 26-14 12-8 7-15 14-14 11-13 11-13 10-18 14-13 11-10 8-9 8-28 22-10 9-11 8-15 10-23 12v3h-37l3-3-1-4-9-9-8-7-8-12-4-14v-8l6-15 6-12 9-14 10-13 11-13 7-9 10-13 2-3h2l2-4 10-13 11-14 11-13 13-16 7-8 10-13 10-11 9-11 12-14 12-13 8-10 13-14 1-2h2l2-4 12-13 7-8 9-10 14-17 9-10 18-22h2l2-4 11-12 13-15 7-7 7-8 11-12 1-2h2v-2l8-7 9-10 10-10 7-8 15-16 7-8 9-10 16-17 14-14 1-2h2l2-4h2l2-4 4-4h2l2-4 4-4h2l2-4 84-84h2l2-4 4-4h2l2-4 4-4h2l2-4 4-4h2l2-4h2l2-4h2l2-4 4-4h2l2-4h2l2-4h2l2-4 98-98 6-7h2l1-3 8-7 17-17h2v-2l8-7h2l2-4 4-4h2v-2h2l-1-5-5-5v-2l-4-2-12-12v-2l-4-2-32-32v-2l-4-2-4-4v-2h-2l-7-8-227-227-6-5-6-7-6-5-7-8-8-8-11-14-8-14-2-5v-17l5-13 9-14 15-16 17-13 14-10 15-10 23-12 21-8 16-5 23-4 25-2h18l29 3 30 5 27 9 29 13 19 12 14 10 11 11 4-2 8-7 12-11 8-7 8-8 8-7 9-8 17-13 13-11 10-8 10-9 13-11 8-7 14-12 6-6h2v-2l11-9 11-10 14-11 13-11 10-8 10-9 14-12 11-10 8-7 10-9 11-9 10-9 22-18 9-8 11-9 11-10 11-9 10-9 8-7 14-12 10-9 11-9 17-14 10-9 11-9 10-9 11-9 10-9 8-7 14-12 10-9 11-9 11-10 8-7 13-11 14-11 11-9 10-9 11-9 7-7-1-7-10-22-5-16-4-19-1-8v-24l5-25 6-29 5-12 9-16 9-14 8-12 9-11 11-12 9-8z" fill="#fff" />
                                <path transform="translate(2047,623)" d="m0 0h1v6l-3-1z" fill="#fff" />
                                <path transform="translate(1290,1288)" d="m0 0 5 1v2l-4-1z" fill="#fff" />
                                <path transform="translate(0,2046)" d="m0 0 4 1-4 1z" />
                                <path transform="translate(1296,1287)" d="m0 0 2 1-2 1z" fill="#aaa" />
                                <path transform="translate(1439)" d="m0 0 3 1z" fill="#fff" />
                                <path transform="translate(75,2047)" d="m0 0 2 1z" fill="#fff" />
                                <path transform="translate(1437)" d="m0 0" fill="#fff" />
                            </svg>
                            <svg class=" d-none" style="width: 30px;" version="1.1" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
                                <path transform="translate(1361,60)" d="m0 0h49l23 2 23 4 24 6 21 7 21 9 22 11 19 12 16 11 13 10 13 11 8 8 8 7 227 227 7 8 21 21 7 8 12 14 10 14 10 15 12 21 10 21 10 26 7 23 5 22 4 33 1 17v13l-2 27-3 23-6 28-7 24-10 25-13 27-11 19-9 14-8 10-9 10-2 3h-2l-2 4-22 22-8 7-10 8-15 11-27 18-16 10-17 11-24 15-27 18-28 17-25 16-20 13-69 44-13 8-24 15-30 20-22 14-17 11-23 15-22 14-16 9-9 6-7 6-4 1-13-12-17-17-7-8-344-344-6-5-7-8-6-5v-2l-3-1-6-7-3-2v-2l-3-1-7-8-3-2v-2l-3-1-6-7-3-2v-2l-3-1-6-7-3-2v-2l-3-1v-2h-2l-4-4v-2l-4-2-7-8-2-1v-2l-4-2-5-6-8-7-56-56-2-3 1-5 5-5 7-10 10-16 18-27 13-23 20-30 12-19 10-16 16-25 16-24 13-22 18-27 7-11 11-17 8-13 11-18 16-24 10-16 13-19 12-20 7-11 13-20 10-16 12-17 11-14 10-11 1-2h2l2-4 8-8 8-7 15-13 18-13 22-14 18-10 15-7 26-10 31-8 22-4z" fill="#FEFEFE" />
                                <path transform="translate(127,85)" d="m0 0 6 1 6 5v2l4 2 11 12 4 3v2l4 2 776 776v2l4 2 8 8v2l4 2 9 9v2l4 2 8 8v2l4 2 8 8v2l4 2 18 18v2l3 1 3 3v2l4 2 6 7 2 1v2l4 2 3 3v2h2l4 5 6 5 6 7 6 5 6 7 7 6v2h2l10 10v2l3 1 3 3v2l4 2 6 7 8 7 4 5 8 7 4 4v2l4 2 21 21v2l4 2 8 8v2l4 2 33 33v2l4 2 21 21v2l4 2 11 11v2l4 2 9 10 5 4 7 8 6 5 7 8 5 4 7 8 5 4 7 8 3 2v2l3 1 7 8 2 1v2l3 1 4 5 2 1v2l4 2 3 3v2h2l4 4v2l4 2 5 5v2l4 2 582 582 5 4 3 4-1 5-10 10-8 7-9 10-31 31-4 5-4 3-5-2-8-8-7-8-142-142-6-5v-2h-2l-7-8-210-210-3-2v-2l-3-1v-2l-3-1v-2l-4-2-18-18v-2l-3-1v-2l-4-2-2-4-3-1-4-5-89-89-8-7-19-19-7-8-10-9-3-1-1 11-10 37-8 25-8 22-10 23-10 21-14 24-12 21-13 21-11 15-13 16-10 13-13 15-14 16-8 7-5 6-8 7-9 10-7 8-5 1-8-7-6-7-8-7-26-26-7-8-10-10-8-7-59-59-7-8-11-11-8-7-26-26-7-8-32-32-8-7-55-55-7-8-15-14-23-23-13-12-16-16-7-6-6 1-10 9-23 23-7 8-8 7-86 86-5 6-6 5-7 8-5 4-7 8-5 4-7 8-6 5-5 6-8 7-19 19-12 13-13 13h-2l-2 4-20 20-8 7-5 5-11 12-6 5-7 8-40 40h-2l-2 4-9 8-7 8-6 5-7 8-6 5-7 8-5 4-7 8-6 5-7 8-5 4-5 6h-2v2l-8 7-12 12-5 6-62 62-8 7-7 7-10 7-19 8-28 12-25 10-13 6-24 10-4 2-3-1 8-13 21-49 11-26 6-13 4-11 6-10 12-13 5-5h2v-2l8-7 12-13 14-14 7-8 4-2 2-4 8-8h2l2-4 95-95h2l2-4 141-141 7-6 7-8 3-1 2-4 30-30 7-6 7-8 63-63h2l2-4 17-17 8-7 15-15 7-8 20-20h2v-2h2l2-4 9-7 1-2-4-2-11-9-25-25-7-8-23-23-7-8-31-31-8-7-51-51-7-8-7-7-8-7-64-64-7-8-8-8-8-7-21-21-7-8-26-26-8-7-30-30-1-3 3-6 12-11 7-7 8-7 18-18 8-7 12-11 26-20 18-13 14-10 19-12 24-13 16-9 23-11 26-10 33-11 29-8 15-4 7-1-7-9-31-31v-2l-4-2-11-12-5-5-16-15-10-10v-2h-2l-7-8-330-330-8-7-44-44-7-8-34-34-8-7-13-13-7-8-13-13-6-8-1-3 16-15 7-7 8-7z" fill="#FEFEFE" />
                            </svg>
                        </div>
                        
                    </div>
                </div>
            `
            videoItem.addEventListener('mouseleave', (e) => { e.preventDefault(); removeOverlayer(e.currentTarget) })
            videoItem.addEventListener('mouseover', (e) => { e.preventDefault(); getOverlayer(e.currentTarget) })
            videoItem.querySelector(".fullscreen").addEventListener('click', handelFullscreen)
            videoItem.querySelector('.pinVideo').addEventListener('click', (e) => {
                const index = Array.from(document.querySelectorAll('.videoItem')).indexOf(videoItem)
                pinVideo(e, index)
            })

            const name = document.createElement('div')
            name.classList.add('name')
            name.classList.add('position-absolute')
            name.classList.add('top-0')
            name.classList.add('start-0')
            name.classList.add('fw-semibold')
            name.classList.add('fs-5')
            name.classList.add('z-2')
            name.classList.add('rounded-3')
            name.classList.add('px-2')
            name.classList.add('py-1')
            name.classList.add('text-white')
            name.style.backgroundColor = '#0606066b'
            name.innerHTML = `${otherUserDetails[index].user.firstName} ${otherUserDetails[index].user.lastName}`
            videoItem.appendChild(name)

            const video = document.createElement('video')
            video.srcObject = stream
            video.autoplay = true
            video.muted = false
            video.classList.add('overflow-hidden')
            video.classList.add('rounded-3')
            video.classList.add('w-100')
            video.classList.add('remoteVideo')

            videoItem.appendChild(video)
            document.querySelector('.videogroup').appendChild(videoItem)

            resizeVideoItem()
        }
    }

    //function to get user details
    const getUserDetails = async () => {
        const res = await fetch(`${value.backendServer}/api/auth/get`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authToken: `${value.authtoken}`,
            },
            body: JSON.stringify({
                userId: `${value.userId}`,
            }),
        })
        const data = await res.json()
        if (data.error && !data.authError) {
            setiserror(true)
            seterrorMessage(data.message)
            seterrorStatus(data.status)
        } else {
            setuser(data.user)
        }
    }

    //function to send message
    const sendMessage = (target) => {
        target.querySelector('button').disabled = true
        target.querySelector('button').querySelector('img').classList.add('d-none')
        target.querySelector('button').querySelector('i').classList.remove('d-none')
        const message = target.querySelector('input').value

        try {
            //send message to socket
            socketConn.current.emit('chatMessage', { message, roomno, userId: value.userId, userName: `${user.presentClientsName} ${user.lastName}` })
        } catch (error) {
            setiserror(true)
            seterrorMessage("Internal Error Occured ... Please try again")
            seterrorStatus(500)
        }
    }

    // function to disconnet client 
    const disconnectClient = async () => {
        try {
            socketConn.current.emit('disconnected', { peerId: yourId, roomno: roomno })
        } catch (error) {
            setiserror(true)
            seterrorMessage("Internal Error Occured ... Please try again")
            seterrorStatus(500)
        }
    }

    //function to remove disconnected stream
    const removeStream = (peerId) => {
        const videoGroup = document.querySelector('.videogroup')
        Array.from(document.querySelectorAll('.videoItem')).forEach((item) => {
            item.getAttribute('peerId') === peerId ? videoGroup.removeChild(item) : ''
        })
    }

    const resizeVideoItem = () => {
        if (document.querySelector('.videogroup')) {
            const parentElemWidth = document.querySelector('.videogroup').clientWidth
            const videoItemArr = Array.from(document.querySelectorAll('.videoItem'))
            const videoItemLen = videoItemArr.length
            if (parentElemWidth >= 750) {
                videoItemLen === 1 ? videoItemArr.forEach((item) => {
                    item.querySelector('video').classList.add('h-100')
                    item.style.maxWidth = `${parentElemWidth * 1.0 - 50}px`
                }) : ""
                videoItemLen === 2 ? videoItemArr.forEach((item) => {
                    item.querySelector('video').classList.remove('h-100')
                    item.style.maxWidth = `${parentElemWidth * 0.5 - 50}px`
                }) : ""
                videoItemLen === 3 ? videoItemArr.forEach((item) => {
                    item.style.maxWidth = `${parentElemWidth * 0.333 - 50}px`
                }) : ""
                videoItemLen > 3 ? videoItemArr.forEach((item) => {
                    item.style.maxWidth = '320px'
                }) : ""

            } else {
                if (videoItemLen !== 1) {
                    //resize item when window is resize
                    parentElemWidth > 650 && parentElemWidth < 850 ? videoItemArr.forEach((item) => {
                        item.style.maxWidth = `320px`
                    }) : ''
                }
            }
        }
    }

    window.addEventListener('resize', resizeVideoItem)

    //peer js after loading the page
    useEffect(() => {
        try {
            if (roomno) {
                const peer = new Peer
                peerConn.current = peer
                peer.on('open', id => {
                    setyourId(id)
                })

                peer.on('connection', (conn) => {
                    conn.on('data', (data) => {
                        const obj = alreadyJoin
                        !obj[roomno] ? obj[roomno] = [] : ''


                        if (!obj[roomno].includes(data.peerId)) {
                            const arr = otherUserDetails
                            arr.push(data)
                            setotherUserDetails(arr)
                            setuserDataCount(arr.length)
                            !obj[roomno].includes(data.peerId) ? obj[roomno].push(data.peerId) : ''
                            setalreadyJoin(obj)
                        }
                    });
                });
            }
        } catch (error) {
            setiserror(true)
            seterrorMessage("Internal Error Occured ... Please try again")
            seterrorStatus(500)
        }

    }, [roomno])


    // console.log(allStreams)
    // console.log(otherUserDetails)


    useEffect(() => {
        try {
            if (yourStream) {
                console.log("stream")
                peerConn.current.on('call', call => {
                    console.log('incomming call')
                    sendAdditionalInfo(call.metadata.peerId, { user: user, peerId: yourId })
                    const arr = otherUserDetails
                    arr.push(call.metadata)
                    setotherUserDetails(arr)
                    setuserDataCount(arr.length)

                    call.answer(yourStream)
                    call.on('stream', stream => {
                        console.log('recieve call')
                        const obj = alreadyJoin
                        !obj[roomno] ? obj[roomno] = [] : ''

                        if (!obj[roomno].includes(call.metadata.peerId)) {
                            const arr = allStreams
                            arr.push(stream)
                            setallStreams(arr)
                            setstreamCount(arr.length)
                            obj[roomno].push(call.metadata.peerId)
                            setalreadyJoin(obj)
                        }
                    })
                })
            }
        } catch (error) {
            setiserror(true)
            seterrorMessage("Internal Error Occured ... Please try again")
            seterrorStatus(500)
        }

    }, [yourStream])
    // console.log(allChats)

    // all socket handels
    useEffect(() => {
        try {
            const socket = io(`${value.backendServer}`);
            socketConn.current = socket

            socket.on("joined", data => {
                setnewJoiner(data.peerId)
                setownerId(data.ownerId)
                // console.log(data.peerId)
            })

            //handle chat messages
            socket.on('chatMessage', (data) => {
                const arr = allChats
                arr.push(data)
                setallChats(arr)
                localStorage.setItem('allChats', JSON.stringify(arr))

                //set previous style of input box and btn
                document.querySelector('#exampleChatInput').value = ''
                if (document.querySelector('.sendMessage')) {
                    document.querySelector('.sendMessage').disabled = false
                    document.querySelector('.sendMessage').querySelector('img').classList.remove('d-none')
                    document.querySelector('.sendMessage').querySelector('i').classList.add('d-none')
                }
            })

            //handel disconnect
            socket.on('disconnected', (data) => {
                // console.log(data)
                removeStream(data.peerId)

                const obj = alreadyJoin
                const index = obj[roomno].indexOf(data.peerId)
                if (index !== -1) {
                    obj[roomno].splice(index, 1)
                }
                setalreadyJoin(obj)

                data.peerId === yourId ? window.close() : ''
            })
        } catch (error) {
            setiserror(true)
            seterrorMessage("Internal Error Occured ... Please try again")
            seterrorStatus(500)
        }


    }, [])
    console.log(alreadyJoin)
    // to make peer call funcationable
    useEffect(() => {
        !alreadyJoin[roomno] ? alreadyJoin[roomno] = [] : ''
        !alreadyJoin[roomno].includes(newJoiner) ? callOther(newJoiner) : ''
    }, [newJoiner])

    //set room no
    useEffect(() => {
        generateId()
        getUserDetails()
        checkUser()
    }, [])

    //call function to strat streaming
    useEffect(() => {
        if (roomno && yourId) {
            socketConn.current.emit("joinroom", { roomno: roomno, peerId: yourId })
        }
    }, [yourId, roomno])

    useEffect(() => {
        if (localVideo.current) {
            Start()
        }
    }, [ownerId])

    useEffect(() => {
        localVideo.current ? resizeVideoItem() : ''
    }, [localVideo.current])


    //when window is resize
    window.addEventListener('resize', () => {
        if (document.querySelector('.chatbox')) {
            document.querySelector('.chatbox').style.height = `${window.innerHeight * 0.7}px`
        }
        if (document.querySelector('.videoAndChat')) {
            // window.innerWidth > 768 ? document.querySelector('.videoAndChat').style.height = `${window.innerHeight}px` : document.querySelector('.videoAndChat').style.height = `${window.innerHeight * 1.4}px`
        }
        if (window.innerWidth < 768) {
            document.querySelector('.sidepannel') ? document.querySelector('.sidepannel').style.display = 'flex' : ''
        } else {
            document.querySelector('.sidepannel') ? document.querySelector('.sidepannel').style.display = 'block' : ''
        }
    })

    //when window is loaded
    window.addEventListener('beforeunload', (e) => {
        // disconnectClient()
    })

    useEffect(() => {
        const chats = localStorage.getItem('allChats')
        if (chats) {
            setallChats(JSON.parse(chats))
        }
    }, [])

    useEffect(() => {
        let isProgress = false
        if (allStreams.length > 0 && !isProgress) {

            const startCount = Array.from(document.querySelectorAll('.videoItem')).length - 1

            for (let index = startCount; index < allStreams.length; index++) {
                isProgress = true
                createVideoItem(allStreams[index], index)
                index === allStreams.length - 1 ? isProgress = false : isProgress = true
            }
        }
    }, [streamCount, userDataCount, otherUserDetails.length, allStreams.length])


    return (
        <>  <Leave disconnectClient={disconnectClient} />

            {(user == {} || !yourId || !ownerId) && !iserror && isAuthorized === null && <Loader />}

            {iserror && <Error status={errorStatus} message={errorMessage} />}

            {user.firstName && user.lastName && yourId && ownerId && !iserror && isAuthorized !== null && <div className=' w-100 position-absolute overflow-x-hidden'>

                <div className="roomId mx-3 mt-2 d-flex align-items-center" >
                    <span className="margarine-regular mx-2">Room Id </span> <span className=" fw-bold fs-3">: </span><span className=" mx-2 fw-semibold fs-3">{roomno}</span>
                </div>

                <div className="chatbox bg-body-secondary d-none overflow-hidden rounded-3 z-3 d-flex flex-column " style={{ width: "40%", height: `${window.innerHeight * 0.7}px`, boxShadow: "0 0 20px #0000ff75" }}>
                    {allChats.map((chat) => {
                        // console.log(chat.userId, value.userId)
                        return <div key={uuidv4()} className={`allMessages rounded-3  d-flex ${chat.userId === value.userId ? 'justify-content-end' : ""}`}>
                            <div className={`singleChat p-2 m-2 rounded-3 ${chat.userId === value.userId ? 'bg-primary-subtle' : 'bg-body-tertiary'}`} style={{ width: "70%" }}>
                                <div ref={senderName} className={`senderName fw-lighter ${chat.userId === value.userId ? 'text-end' : ''}`}>{chat.userId === value.userId ? 'you' : chat.userName}</div>
                                <div ref={senderMessage} className={`senderMessage fw-semibold h-auto ${chat.userId === value.userId ? 'text-end' : ''}`}>{chat.message}</div>
                            </div>
                        </div>
                    })}
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage(e.currentTarget)
                    }} className=" position-absolute bottom-0 w-100">
                        <div className="inputChat w-100 d-flex justify-content-center align-items-center">

                            <div className="inputBox p-2 w-100">
                                <input className="form-control" id="exampleChatInput" placeholder="Messages..." />
                            </div>

                            <div className=" me-2" style={{ width: "30px", cursor: 'pointer' }}>
                                <button type="submit" className="sendMessage border-0 m-0 p-0" style={{ outline: "none", backgroundColor: "transparent" }} >
                                    <img className=" w-100" src={sendIconImg} />
                                    <i className="fa-solid fa-spinner fa-spin fs-5 d-none" style={{ color: "blue" }}></i>
                                </button>
                            </div>

                        </div>
                    </form>
                </div>

                <div className="mainsection ">
                    <div className="videoAndChat rounded-4 m-3 h-100 position-relative overflow-x-hidden overflow-y-auto d-flex align-items-md-start flex-md-row flex-column" style={{ backgroundColor: "#cbdbfd", scrollbarWidth: "thin" }} >

                        <div className="videogroup h-100 w-100 p-2 overflow-auto rounded-4 position-relative " >
                            <div className="videoItem rounded-3 my-2 mx-2" pined="false" onMouseOver={(e) => { e.preventDefault(); getOverlayer(e.currentTarget) }} onMouseLeave={(e) => { e.preventDefault(); removeOverlayer(e.currentTarget) }} style={{ margin: "15px" }}>

                                <div className="name position-absolute top-0 start-0 fw-semibold fs-5 z-2 rounded-3 px-2 py-1 text-white" style={{ backgroundColor: "#0606066b" }}>
                                    {`${user.firstName} ${user.lastName}`}
                                </div>

                                <div className='otherVideoControl rounded-3 w-100 my-auto position-absolute h-100 d-none z-2 d-flex justify-content-center align-items-center'>
                                    <div className="controls rounded-4 d-flex justify-content-center align-items-center px-3 py-1" style={{ backgroundColor: "rgb(0 0 0 /70%)" }}>
                                        <div className="fullscreen mx-2 my-1" style={{ cursor: 'pointer' }} onClick={handelFullscreen}><i className="fa-solid fa-expand fs-3 fw-bold" style={{ color: "white" }}></i></div>
                                        <div className="pinVideo mx-3 my-1" style={{ cursor: 'pointer' }} onClick={(e) => {
                                            const index = Array.from(document.querySelectorAll('.videoItem')).indexOf(e.currentTarget.parentElement.parentElement.parentElement)
                                            pinVideo(e, index)
                                        }}>
                                            <svg style={{ width: "30px" }} version="1.1" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
                                                <path transform="translate(1392)" d="m0 0h44l1 4 2 1v2l4 2 11 9 10 9 4 3v2l4 2 336 336 5 6 7 6 6 7 6 5 5 6 7 6 5 6 7 6 5 6 7 6 6 7 6 5 5 6 7 6 4 4v2l4 2 6 7 6 5 5 6 7 6 5 6 7 6 6 7 6 5 6 7 6 5 6 7 6 5 4 4v2l4 2 5 6 8 7 5 5v2h2l7 8 13 13 10 14 8 17 1 4v11l-4 14-9 14-12 11-19 14-20 13-14 7-17 5-28 5-18 5h-21l-10-3h-11l-7 1-12-5-28-10-10-5-9 10-8 11-9 11-8 10-13 15-9 10-7 8-12 14-11 14-9 11-15 16-9 11-6 8h-2l-2 4-12 14-9 10-7 8-12 14-9 11-10 13-8 8-8 10h-2l-2 4-22 26-7 8-9 10-7 8-12 14-11 14-9 11-13 14-9 11-9 10-9 11-11 12-9 11-11 12-9 11-10 11-7 8-14 17-11 13-12 14-9 11-10 11-7 8-12 14-11 12-8 10h-2l-2 4-10 12-7 8-11 11h-2l4 10 10 14 10 15 9 16 7 16 9 25 6 19 4 17 2 15v13l1 5v16l-5 37-5 23-5 16-11 25-9 16-10 14-11 14-8 10-9 10-11 9-17 9-8 3h-9l-13-4-13-7-17-14-12-12-6-5-7-8-279-279-8-5-4-1-8 6-10 9-20 20-5 6-4 4h-2l-2 4-16 16h-2l-2 4-14 13-2 3h-2l-2 4-8 7-8 9-8 7-4 5-8 7-221 221-8 7-13 13-8 7-13 12-9 9-8 7-9 9-8 7-14 13-8 7-15 13-14 12-8 7-16 15-14 12-11 10-11 9-14 12-8 7-30 26-14 12-8 7-15 14-14 11-13 11-13 10-18 14-13 11-10 8-9 8-28 22-10 9-11 8-15 10-23 12v3h-37l3-3-1-4-9-9-8-7-8-12-4-14v-8l6-15 6-12 9-14 10-13 11-13 7-9 10-13 2-3h2l2-4 10-13 11-14 11-13 13-16 7-8 10-13 10-11 9-11 12-14 12-13 8-10 13-14 1-2h2l2-4 12-13 7-8 9-10 14-17 9-10 18-22h2l2-4 11-12 13-15 7-7 7-8 11-12 1-2h2v-2l8-7 9-10 10-10 7-8 15-16 7-8 9-10 16-17 14-14 1-2h2l2-4h2l2-4 4-4h2l2-4 4-4h2l2-4 84-84h2l2-4 4-4h2l2-4 4-4h2l2-4 4-4h2l2-4h2l2-4h2l2-4 4-4h2l2-4h2l2-4h2l2-4 98-98 6-7h2l1-3 8-7 17-17h2v-2l8-7h2l2-4 4-4h2v-2h2l-1-5-5-5v-2l-4-2-12-12v-2l-4-2-32-32v-2l-4-2-4-4v-2h-2l-7-8-227-227-6-5-6-7-6-5-7-8-8-8-11-14-8-14-2-5v-17l5-13 9-14 15-16 17-13 14-10 15-10 23-12 21-8 16-5 23-4 25-2h18l29 3 30 5 27 9 29 13 19 12 14 10 11 11 4-2 8-7 12-11 8-7 8-8 8-7 9-8 17-13 13-11 10-8 10-9 13-11 8-7 14-12 6-6h2v-2l11-9 11-10 14-11 13-11 10-8 10-9 14-12 11-10 8-7 10-9 11-9 10-9 22-18 9-8 11-9 11-10 11-9 10-9 8-7 14-12 10-9 11-9 17-14 10-9 11-9 10-9 11-9 10-9 8-7 14-12 10-9 11-9 11-10 8-7 13-11 14-11 11-9 10-9 11-9 7-7-1-7-10-22-5-16-4-19-1-8v-24l5-25 6-29 5-12 9-16 9-14 8-12 9-11 11-12 9-8z" fill="#fff" />
                                                <path transform="translate(2047,623)" d="m0 0h1v6l-3-1z" fill="#fff" />
                                                <path transform="translate(1290,1288)" d="m0 0 5 1v2l-4-1z" fill="#fff" />
                                                <path transform="translate(0,2046)" d="m0 0 4 1-4 1z" />
                                                <path transform="translate(1296,1287)" d="m0 0 2 1-2 1z" fill="#aaa" />
                                                <path transform="translate(1439)" d="m0 0 3 1z" fill="#fff" />
                                                <path transform="translate(75,2047)" d="m0 0 2 1z" fill="#fff" />
                                                <path transform="translate(1437)" d="m0 0" fill="#fff" />
                                            </svg>
                                            <svg className=" d-none" style={{ width: "30px" }} version="1.1" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
                                                <path transform="translate(1361,60)" d="m0 0h49l23 2 23 4 24 6 21 7 21 9 22 11 19 12 16 11 13 10 13 11 8 8 8 7 227 227 7 8 21 21 7 8 12 14 10 14 10 15 12 21 10 21 10 26 7 23 5 22 4 33 1 17v13l-2 27-3 23-6 28-7 24-10 25-13 27-11 19-9 14-8 10-9 10-2 3h-2l-2 4-22 22-8 7-10 8-15 11-27 18-16 10-17 11-24 15-27 18-28 17-25 16-20 13-69 44-13 8-24 15-30 20-22 14-17 11-23 15-22 14-16 9-9 6-7 6-4 1-13-12-17-17-7-8-344-344-6-5-7-8-6-5v-2l-3-1-6-7-3-2v-2l-3-1-7-8-3-2v-2l-3-1-6-7-3-2v-2l-3-1-6-7-3-2v-2l-3-1v-2h-2l-4-4v-2l-4-2-7-8-2-1v-2l-4-2-5-6-8-7-56-56-2-3 1-5 5-5 7-10 10-16 18-27 13-23 20-30 12-19 10-16 16-25 16-24 13-22 18-27 7-11 11-17 8-13 11-18 16-24 10-16 13-19 12-20 7-11 13-20 10-16 12-17 11-14 10-11 1-2h2l2-4 8-8 8-7 15-13 18-13 22-14 18-10 15-7 26-10 31-8 22-4z" fill="#FEFEFE" />
                                                <path transform="translate(127,85)" d="m0 0 6 1 6 5v2l4 2 11 12 4 3v2l4 2 776 776v2l4 2 8 8v2l4 2 9 9v2l4 2 8 8v2l4 2 8 8v2l4 2 18 18v2l3 1 3 3v2l4 2 6 7 2 1v2l4 2 3 3v2h2l4 5 6 5 6 7 6 5 6 7 7 6v2h2l10 10v2l3 1 3 3v2l4 2 6 7 8 7 4 5 8 7 4 4v2l4 2 21 21v2l4 2 8 8v2l4 2 33 33v2l4 2 21 21v2l4 2 11 11v2l4 2 9 10 5 4 7 8 6 5 7 8 5 4 7 8 5 4 7 8 3 2v2l3 1 7 8 2 1v2l3 1 4 5 2 1v2l4 2 3 3v2h2l4 4v2l4 2 5 5v2l4 2 582 582 5 4 3 4-1 5-10 10-8 7-9 10-31 31-4 5-4 3-5-2-8-8-7-8-142-142-6-5v-2h-2l-7-8-210-210-3-2v-2l-3-1v-2l-3-1v-2l-4-2-18-18v-2l-3-1v-2l-4-2-2-4-3-1-4-5-89-89-8-7-19-19-7-8-10-9-3-1-1 11-10 37-8 25-8 22-10 23-10 21-14 24-12 21-13 21-11 15-13 16-10 13-13 15-14 16-8 7-5 6-8 7-9 10-7 8-5 1-8-7-6-7-8-7-26-26-7-8-10-10-8-7-59-59-7-8-11-11-8-7-26-26-7-8-32-32-8-7-55-55-7-8-15-14-23-23-13-12-16-16-7-6-6 1-10 9-23 23-7 8-8 7-86 86-5 6-6 5-7 8-5 4-7 8-5 4-7 8-6 5-5 6-8 7-19 19-12 13-13 13h-2l-2 4-20 20-8 7-5 5-11 12-6 5-7 8-40 40h-2l-2 4-9 8-7 8-6 5-7 8-6 5-7 8-5 4-7 8-6 5-7 8-5 4-5 6h-2v2l-8 7-12 12-5 6-62 62-8 7-7 7-10 7-19 8-28 12-25 10-13 6-24 10-4 2-3-1 8-13 21-49 11-26 6-13 4-11 6-10 12-13 5-5h2v-2l8-7 12-13 14-14 7-8 4-2 2-4 8-8h2l2-4 95-95h2l2-4 141-141 7-6 7-8 3-1 2-4 30-30 7-6 7-8 63-63h2l2-4 17-17 8-7 15-15 7-8 20-20h2v-2h2l2-4 9-7 1-2-4-2-11-9-25-25-7-8-23-23-7-8-31-31-8-7-51-51-7-8-7-7-8-7-64-64-7-8-8-8-8-7-21-21-7-8-26-26-8-7-30-30-1-3 3-6 12-11 7-7 8-7 18-18 8-7 12-11 26-20 18-13 14-10 19-12 24-13 16-9 23-11 26-10 33-11 29-8 15-4 7-1-7-9-31-31v-2l-4-2-11-12-5-5-16-15-10-10v-2h-2l-7-8-330-330-8-7-44-44-7-8-34-34-8-7-13-13-7-8-13-13-6-8-1-3 16-15 7-7 8-7z" fill="#FEFEFE" />
                                            </svg>
                                        </div>
                                        <div className="screenShare mx-2 my-1" style={{ cursor: 'pointer', width: "40px" }} onClick={startScreenShare}>
                                            <svg className={`w-100 ${isSharing ? 'd-none' : ""}`} version="1.1" viewBox="0 0 2048 2028" xmlns="http://www.w3.org/2000/svg" >
                                                <path transform="translate(361,359)" d="m0 0h1325l23 3 19 5 19 8 17 10 11 8 13 11 10 10 10 13 9 14 8 16 7 19 4 17 2 16v839l-3 21-6 21-8 19-8 14-10 14-12 13-10 10-18 13-16 9-19 8-20 6 203 1 19 1 13 3 14 6 14 10 11 11 9 14 5 12 3 12 1 8v10l-2 14-6 17-6 10-8 10-9 9-13 8-14 6-15 3-18 1-1791-1-16-4-16-8-13-10-9-10-8-13-5-12-3-13v-21l4-17 5-12 8-12 11-12 13-9 12-6 16-4 12-1 211-1-21-6-18-8-13-7-12-8-13-11-6-5-7-8-10-12-12-19-9-20-6-21-3-19-1-15v-820l2-21 5-21 7-19 10-19 12-17 12-13 8-8 17-13 19-11 17-7 13-4 20-4zm745 246v171l-29 5-39 8-37 10-36 12-27 11-24 11-25 13-17 10-17 11-20 14-14 11-14 12-8 7-12 11-19 19-7 8-9 10-8 10-11 14-13 18-13 20-12 20-12 22-11 22-14 32-13 35-9 28-11 40-6 24-1 6 6-5 9-12 12-14 9-11 7-7v-2l3-1 7-8 14-14 8-7 11-10 14-11 18-14 27-18 24-14 21-11 20-9 25-10 33-11 34-9 34-7 33-5 37-4 31-2 37-1h14v176l4-2v-2l4-2 11-11 8-7 12-12 8-7 9-9 8-7 17-16 13-12 8-8 8-7 7-7 8-7 9-9 8-7 17-16 7-6v-2l4-2 11-11 8-7 9-9 8-7 17-16 32-30 7-6v-2l4-2 9-9 8-7 15-15 5-10 2-7v-14l-4-11-6-9-15-15h-2v-2l-8-7-16-15-8-7-9-9-8-7-7-7-8-7-7-7-8-7-16-15-12-11-7-7-8-7-8-8-8-7-12-11-17-16-13-12-17-16-8-7-8-8-8-7-9-9-8-7-17-16-10-9-8-7zm-762 892m1353 0v1h6v-1z" fill="white" />
                                            </svg>

                                            <svg className={`w-100 ${!isSharing ? 'd-none' : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="stop-screen-share">
                                                <path fill="white" d="M23 18h-1.2l1.79 1.79c.24-.18.41-.46.41-.79 0-.55-.45-1-1-1zM3.23 2.28c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l.84.86s-.66.57-.66 1.47C2 6.92 2 16 2 16l.01.01c0 1.09.88 1.98 1.97 1.99H1c-.55 0-1 .45-1 1s.45 1 1 1h17.13l2 2c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L3.23 2.28zM7 15c.31-1.48.94-2.93 2.08-4.05l1.59 1.59C9.13 12.92 7.96 13.71 7 15zm6-5.87v-.98c0-.44.52-.66.84-.37L15 8.87l1.61 1.5c.21.2.21.53 0 .73l-.89.83 5.58 5.58c.43-.37.7-.9.7-1.51V6c0-1.09-.89-1.98-1.98-1.98H7.8l5.14 5.13c.02-.01.04-.02.06-.02z">
                                                </path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <video ref={localVideo} autoPlay muted className="localVideo overflow-hidden rounded-3 w-100" ></video>

                            </div>
                        </div>
                        <div className="unpinVideoItems d-none overflow-hidden" >
                            <div className="sidepannel h-100 overflow-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#022b85 #99b9ff" }}></div>
                        </div>

                        {/* local video controls  */}

                    </div>
                    <div id="controls" className={` z-3 py-2 mx-3 rounded-3 mb-3 d-flex justify-content-center align-items-center`} style={{ backgroundColor: "#000000c2" }}>
                        <div className="close mx-1 rounded-circle" style={{ cursor: "pointer", width: "45px" }}><button className="close border-0" data-bs-toggle="modal" data-bs-target="#exampleModalLeave" style={{ outline: 'none', backgroundColor: 'transparent' }}>
                            <svg className=" w-100" version="1.0" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 64.000000 64.000000"
                                preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                                    fill="red" stroke="none">
                                    <path d="M261 629 c-149 -30 -254 -157 -255 -309 0 -88 28 -156 93 -221 65
                                    -64 132 -92 221 -92 89 0 156 28 221 92 64 65 92 132 92 221 0 196 -182 348
                                    -372 309z m242 -248 c24 -9 27 -16 27 -53 0 -59 -10 -70 -56 -66 -34 3 -39 7
                                    -42 30 -3 24 -8 27 -58 34 -30 3 -78 3 -108 0 -50 -7 -55 -10 -58 -34 -3 -23
                                    -8 -27 -42 -30 -24 -2 -42 2 -47 10 -12 19 -11 96 2 103 39 25 323 29 382 6z"/>
                                </g>
                            </svg></button>
                        </div>
                        <div className="video mx-3 rounded-circle" style={{ cursor: "pointer", }} onClick={handelVideo}> <i className="fa-solid fa-video fs-4 fw-bold" style={{ color: "white" }}></i> <i className="fa-solid fa-video-slash d-none fs-4 fw-bold" style={{ color: "white" }}></i> </div>
                        <div className="audio mx-3 rounded-circle" style={{ cursor: "pointer", }} onClick={handelAudio}> <i className="fa-solid fa-volume-high fs-4 fw-bold" style={{ color: "white" }}></i> <i className="fa-solid fa-volume-xmark d-none fs-4 fw-bold" style={{ color: "white" }}></i> </div>
                        <div className="screenShare mx-3" style={{ cursor: 'pointer', width: "38px" }} onClick={startScreenShare}>
                            <svg className={`w-100 ${isSharing ? 'd-none' : ""}`} version="1.1" viewBox="0 0 2048 2028" xmlns="http://www.w3.org/2000/svg" >
                                <path transform="translate(361,359)" d="m0 0h1325l23 3 19 5 19 8 17 10 11 8 13 11 10 10 10 13 9 14 8 16 7 19 4 17 2 16v839l-3 21-6 21-8 19-8 14-10 14-12 13-10 10-18 13-16 9-19 8-20 6 203 1 19 1 13 3 14 6 14 10 11 11 9 14 5 12 3 12 1 8v10l-2 14-6 17-6 10-8 10-9 9-13 8-14 6-15 3-18 1-1791-1-16-4-16-8-13-10-9-10-8-13-5-12-3-13v-21l4-17 5-12 8-12 11-12 13-9 12-6 16-4 12-1 211-1-21-6-18-8-13-7-12-8-13-11-6-5-7-8-10-12-12-19-9-20-6-21-3-19-1-15v-820l2-21 5-21 7-19 10-19 12-17 12-13 8-8 17-13 19-11 17-7 13-4 20-4zm745 246v171l-29 5-39 8-37 10-36 12-27 11-24 11-25 13-17 10-17 11-20 14-14 11-14 12-8 7-12 11-19 19-7 8-9 10-8 10-11 14-13 18-13 20-12 20-12 22-11 22-14 32-13 35-9 28-11 40-6 24-1 6 6-5 9-12 12-14 9-11 7-7v-2l3-1 7-8 14-14 8-7 11-10 14-11 18-14 27-18 24-14 21-11 20-9 25-10 33-11 34-9 34-7 33-5 37-4 31-2 37-1h14v176l4-2v-2l4-2 11-11 8-7 12-12 8-7 9-9 8-7 17-16 13-12 8-8 8-7 7-7 8-7 9-9 8-7 17-16 7-6v-2l4-2 11-11 8-7 9-9 8-7 17-16 32-30 7-6v-2l4-2 9-9 8-7 15-15 5-10 2-7v-14l-4-11-6-9-15-15h-2v-2l-8-7-16-15-8-7-9-9-8-7-7-7-8-7-7-7-8-7-16-15-12-11-7-7-8-7-8-8-8-7-12-11-17-16-13-12-17-16-8-7-8-8-8-7-9-9-8-7-17-16-10-9-8-7zm-762 892m1353 0v1h6v-1z" fill="white" />
                            </svg>

                            <svg className={`w-100 ${!isSharing ? 'd-none' : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="stop-screen-share">
                                <path fill="white" d="M23 18h-1.2l1.79 1.79c.24-.18.41-.46.41-.79 0-.55-.45-1-1-1zM3.23 2.28c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l.84.86s-.66.57-.66 1.47C2 6.92 2 16 2 16l.01.01c0 1.09.88 1.98 1.97 1.99H1c-.55 0-1 .45-1 1s.45 1 1 1h17.13l2 2c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L3.23 2.28zM7 15c.31-1.48.94-2.93 2.08-4.05l1.59 1.59C9.13 12.92 7.96 13.71 7 15zm6-5.87v-.98c0-.44.52-.66.84-.37L15 8.87l1.61 1.5c.21.2.21.53 0 .73l-.89.83 5.58 5.58c.43-.37.7-.9.7-1.51V6c0-1.09-.89-1.98-1.98-1.98H7.8l5.14 5.13c.02-.01.04-.02.06-.02z">
                                </path>
                            </svg>
                        </div>
                        <div className="chatIcon mx-3" style={{ width: "30px", cursor: "pointer" }} onClick={(e) => {
                            e.preventDefault()
                            animateChatBox()
                        }}>
                            <svg className=" w-100" version="1.1" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
                                <path fill="white" transform="translate(488,85)" d="m0 0h1071l33 3 31 5 29 7 36 12 26 11 17 8 23 13 19 12 18 13 14 11 13 11 13 12 22 22 9 11 8 9 12 16 11 16 13 21 13 24 12 26 13 36 8 30 5 24 4 30 2 27v718l-3 36-6 35-7 28-12 36-11 26-13 26-10 17-18 27-9 12-9 11-11 13-7 8h-2l-2 4-13 13-8 7-11 10-13 10-19 14-17 11-17 10-16 9-31 14-27 10-27 8-27 6-33 5-23 2-26 1h-418l-69 1-40 27-165 110-43 29-44 29-43 29-44 29-102 68-13 8-16 7-17 4h-18l-15-3-15-6-14-9-11-10-11-15-7-16-3-12-1-8-1-34v-130l1-107-11-2-29-8-29-10-30-13-25-13-23-14-20-14-14-11-13-11-8-7-16-15-14-15-13-15-14-18-11-16-12-19-10-18-8-16-8-17-11-29-8-26-6-26-5-29-3-32v-734l3-30 5-29 7-29 6-20 11-29 9-20 8-16 11-20 16-24 11-15 11-14 9-10 7-8 5-6h2l2-4 4-4h2v-2h2v-2l8-7 11-10 14-11 13-10 16-11 21-13 28-15 20-9 26-10 34-10 29-6 27-4zm96 512-83 1-15 3-12 5-10 6-10 8-11 12-9 16-5 15-2 12v16l3 15 5 13 7 12 8 10 11 10 14 8 9 4 13 3 6 1h1042l15-3 13-5 15-9 10-9v-2h2l9-13 7-14 4-16 1-19-3-17-6-16-8-13-9-10-11-9-10-6-16-6-11-2-80-1zm91 342-14 2-16 6-10 6-10 8-8 8-9 14-7 16-3 14v22l4 16 5 12 6 10 11 13 12 9 15 8 18 5 9 1 143 1h368l175-1 19-2 16-5 16-9 10-8v-2l3-1 11-15 7-16 3-12 1-7v-15l-2-13-5-15-9-16-11-12-10-8-15-8-12-4-12-2z" />
                            </svg>
                        </div>
                    </div>
                    {/* <Canvas/> */}
                </div>
            </div>}
        </>
    )
}

export default videoGroup