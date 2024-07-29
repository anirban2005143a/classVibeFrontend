import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/userContext'
import '../../css/verifyemail.css'
import addCookie from '../functions/addCookie'
import Alert from '../alert'
import Loader from '../loader'
import Expire from './expire'
import mailVerification from '../../assets/email verification.png'

const verifyEmail = () => {

    const value = useContext(UserContext);
    const navigate = useNavigate();

    //state for alert
    const [isOK, setisOK] = useState(null)
    const [message, setmessage] = useState("")

    const [isScaled, setisScaled] = useState(false)
    const [isValid, setisValid] = useState(null)
    const [isValidMessage, setisValidMessage] = useState('')
    const [alreadyVerified, setalreadyVerified] = useState(false)

    //function to make user verified
    const userVerified = async (email, token) => {
        const res = await fetch(`${value.backendServer}/api/auth/verify`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                token
            }),
        })
        const data = await res.json()
        if (data.error) {
            if (!data.isValid) {
                setisValid(false)
                setisValidMessage(data.message)
                return false
            }
            else if (data.isValid && data.alreadyVerified) {
                setisValid(true)
                setisValidMessage(data.message)
                setalreadyVerified(true)
            }
            setisOK(false)
            setmessage('Some error occured')
            return false
        } else {
            setisValid(true)
            setisValidMessage(data.message)
            addCookie("authtoken", `${data.jwtToken}`)
            addCookie("userId", `${data.userId}`)
            value.setislogout(false)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setisScaled(true)
        }, 50);
        setTimeout(() => {
            setisScaled(false)
        }, 550);
    }, [])


    useEffect(() => {
        const str = window.location.search.substring(1).split('&')
        let email, token
        str.forEach((item, index) => {
            index === 1 ? email = atob(item.split('=')[1]) : token = item.split('=')[1]
        })
        userVerified(email, token)
    }, [])


    return (
        <>
            <Alert isDisplay={isOK !== null ? true : false} message={message} mode={isOK ? "success" : "danger"} />

            {isValid === null && <Loader />}

            {!isValid === false && <Expire isScaled={isScaled} isValidMessage={isValidMessage} />}

            {!isValid && <div id='emailVerificationPage' className=' w-100 h-100 position-absolute d-flex justify-content-center align-items-center'>
                <div className="verifyContainer overflow-auto rounded-3 d-flex flex-column align-items-center">
                    <div className="svgIcon w-100 h-auto d-flex justify-content-center text-center">
                        <div className={` svg ${isScaled ? 'scaleup' : 'scaledowmn'} `}>
                            <img className='w-100' src={mailVerification} />
                        </div>
                    </div>

                    {!alreadyVerified && <div className="content text-center">
                        <p className=' fs-4 fw-bolder'>Congratulations!</p>
                        <span className=' fs-5 fw-semibold'>You are successfully verified</span>
                        <hr />
                        <span className=' fs-5 fw-semibold'>Continue , your journey ...</span>
                    </div>}

                    {!alreadyVerified && <div className="button my-3">
                        <button className='btn btn-primary' onClick={(e) => {
                            e.preventDefault()
                            navigate('/')
                        }}>Continue</button>
                    </div>}

                    {alreadyVerified && <h1 className=' my-3'>{isValidMessage}</h1>}
                    {alreadyVerified && <button className='btn btn-primary my-3' onClick={(e) => {
                        e.preventDefault()
                        navigate('/login')
                    }}>Log-in</button>}

                </div>
            </div>}
        </>
    )
}

export default verifyEmail