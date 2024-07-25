import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../css/forgetPassword.css'
import UserContext from '../../context/userContext'
import Alert from '../alert'
import Expire from './expire'
import Loader from '../loader'

const forgetPassword = () => {

    const value = useContext(UserContext);
    const navigate = useNavigate();

    const [isScaled, setisScaled] = useState(false)
    const [isUpdate, setisUpdate] = useState(false)
    const [isValid, setisValid] = useState(null)
    const [isValidMessage, setisValidMessage] = useState('')

    //state for alert
    const [isOK, setisOK] = useState(null)
    const [message, setmessage] = useState("")

    const checkExpiry = async()=>{
        const str = window.location.search.substring(1).split('&')
        const token = str[0].split('=')[1]
        
        const res = await fetch(`${value.backendServer}/api/auth/check/expairy`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token
            }),
        })
        const data = await res.json()
        console.log(data)
        if(!data.isValid){
            setisValid(false)
            setisValidMessage(data.message)
        }else{
            setisValid(true)
            setisValidMessage(data.message)
        }
    }

    const resetPassword = async (pass, formElem) => {
        const str = window.location.search.substring(1).split('&')
        const token = str[0].split('=')[1]

        const res = await fetch(`${value.backendServer}/api/auth/reset/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                password: pass
            }),
        })
        const data = await res.json()
        formElem.querySelector('button').disabled = false
        formElem.querySelector('button').innerHTML = 'Log-in'
        console.log(data)
        if (data.error) {
            setisOK(false)
            setmessage(data.message)
            !data.isValid ? setisValid(false) : ''
            !data.isValid ? setisValidMessage(data.message) : ''
        } else {
            setisOK(null)
            setisUpdate(true)
            formElem.querySelector('button').setAttribute('type', 'button')
            document.addEventListener('click', () => {
                navigate('/login')
            })
        }

    }

    const submitForm = async (e) => {
        e.preventDefault()
        const currentTarget = e.currentTarget
        if (currentTarget.querySelectorAll('input')[0].value !== currentTarget.querySelectorAll('input')[1].value) {
            const message = document.createElement('p')
            message.classList.add('text-danger')
            message.style.textAlign = "center"
            message.innerHTML = 'Please confirm with same password'
            currentTarget.querySelectorAll('input')[1].value = ''
            currentTarget.parentElement.insertBefore(message, currentTarget.parentElement.firstChild)
            setisOK(false)
            setmessage('Please confirm with same password')
        } else {
            currentTarget.parentElement.querySelector('p') ? currentTarget.parentElement.removeChild(currentTarget.parentElement.querySelector('p')) : ''
            currentTarget.querySelector('button').innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
            currentTarget.querySelector('button').disabled = true
            resetPassword(currentTarget.querySelectorAll('input')[0].value, currentTarget)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setisScaled(true)
        }, 50);
        setTimeout(() => {
            setisScaled(false)
        }, 550);
    }, [isUpdate])

    useEffect(() => {
        checkExpiry()
    }, [])
    


    return (
        <>
            <Alert isDisplay={isOK !== null ? true : false} message={message} mode={isOK ? "success" : "danger"} />
        
            {isValid===false && <Expire isScaled={isScaled} isValidMessage={isValidMessage} />}

            {isValid === null && <Loader/>}

            {isValid && <div className="  position-absolute w-100 h-100 d-flex justify-content-center align-items-center ">
                <div className="setpassword overflow-auto bg-body-tertiary rounded-3 d-flex flex-column align-items-center">
                    <div className="svgIcon my-2 w-100  h-auto d-flex justify-content-center " >
                        <div className={`svg ${isScaled ? 'scaleup' : 'scaledowmn'}`}>
                            {!isUpdate && <svg className='w-100' version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                <path transform="translate(507,25)" d="m0 0 34 1 33 3 37 6 36 9 25 8 19 7 21 9 25 12 22 12 19 12 23 16 14 11 11 9 11 10 8 7 28 28 9 11 12 14 12 16 11 16 12 19 12 21 15 30 11 27 12 36 7 26 6 31 4 30 2 25v51l-4 41-5 29-6 27-8 27-10 28-12 28-14 28-13 22-16 24-14 19-11 13-9 11-16 17-17 17-8 7-14 12-14 11-18 13-15 10-20 12-22 12-25 12-28 11-30 10-32 8-27 5-31 4-27 2h-44l-35-3-33-5-38-9-29-9-27-10-28-13-20-10-28-17-18-12-19-14-13-11-11-9-8-8-8-7-18-18-7-8-9-10-11-14-15-20-10-15-11-18-9-16-11-21-12-28-10-27-9-30-7-31-5-32-3-29-1-35 1-29 4-38 5-28 7-30 9-29 10-27 12-27 10-19 6-11 8-14 16-24 13-18 13-16 9-10 7-8 8-8 1-2h2l2-4 4-4h2v-2l8-7 12-11 11-9 15-12 17-12 20-13 24-14 26-13 28-12 23-8 29-9 31-7 31-5 33-3z" fill="#3298FE" />
                                <path transform="translate(505,204)" d="m0 0h11l20 2 22 5 15 5 19 9 16 10 10 8 14 13 9 11 8 11 10 18 7 16 5 18 3 15 2 26v95l17 1 17 3 16 7 10 7 7 6 9 13 6 13 3 14 1 29v184l-2 21-4 12-5 9-8 10-9 9-13 8-14 5-11 2h-371l-13-3-17-8-9-7-9-9-8-13-4-12-2-12-1-20v-199l2-14 5-13 7-12 11-12 11-8 10-5 13-4 25-1 2-1v-100l2-23 4-18 6-18 9-19 7-11 9-12 9-10 11-11 13-10 18-11 15-7 18-6 18-4z" fill="#FEFEFE" />
                                <path transform="translate(500,277)" d="m0 0h23l16 4 12 5 14 8 11 9 8 9 9 15 5 11 4 16 1 58v55l-4 1h-96l-81-1-1-37v-58l1-19 4-16 8-17 11-14 9-9 14-9 8-4 15-5z" fill="#3298FF" />
                                <path transform="translate(503,539)" d="m0 0h15l16 4 12 6 10 8 6 7 6 10 5 11 2 9v17l-4 13-5 10-8 11-12 11-1 3v59l-3 10-6 8-8 7-12 5h-8l-11-4-9-7-6-9-2-6-1-7-1-59-13-13-8-11-5-10-3-13v-15l4-15 7-13 11-12 10-7 14-6z" fill="#3298FF" />
                            </svg>}
                            {isUpdate && <svg className=' w-100' version="1.1" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
                                <path transform="translate(761,146)" d="m0 0h33l17 3 17 5 18 8 17 9 16 10 12 8 14 10 53 39 17 12 19 12 19 10 6 2h8l16-8 22-12 19-13 14-10 13-10 12-9 21-16 27-18 15-9 22-11 19-7 18-4 8-1h31l17 3 15 5 17 9 16 12 14 14 13 17 8 13 12 23 10 25 12 36 13 42 12 35 12 25 8 11 8 4 26 4 9 1 104 1 36 1 29 4 20 5 16 6 21 11 12 9 12 11 13 17 6 10 8 19 5 19 1 8v31l-3 23-7 29-11 36-12 36-12 38-7 30-3 20 6 8 9 10 13 12 17 13 36 26 13 9 14 10 28 22 10 9 8 7 14 14 11 14 9 14 10 19 5 15 4 20v22l-4 21-6 18-11 21-13 18-9 10-7 8-10 10-11 9-15 12-19 14-14 10-13 9-17 12-18 13-11 9-14 12-9 9-5 9 1 12 6 29 7 25 18 55 10 31 7 25 4 21 2 17v28l-4 21-8 20-10 18-10 13-12 12-14 10-19 9-17 6-22 5-27 4-28 2-44 1-77 1-23 3-11 3-5 5-12 26-9 25-14 43-9 29-11 31-10 23-11 21-8 12-9 12-12 13-13 11-14 8-19 8-16 4-9 1h-32l-17-3-21-7-21-10-27-16-36-26-19-14-13-10-17-12-21-14-16-9-17-8-10 1-17 9-16 10-17 12-19 14-17 13-15 12-18 13-15 9-12 7-23 11-35 12-21 5-9 1h-26l-16-4-16-7-14-8-11-9-12-11-11-13-14-22-10-19-12-29-12-35-12-40-15-44-13-27-5-5-14-3-22-2-109-1-38-2-23-3-18-4-16-5-17-7-15-9-14-12-7-7-11-15-7-11-8-19-5-19-1-6v-32l5-32 7-28 11-35 12-35 10-33 7-32 2-11-1-8-5-8-14-15-22-18-17-12-20-14-15-11-18-13-13-10-11-9-12-11-10-9-7-8-9-10-11-16-6-10-7-15-5-16-3-14-1-8v-14l6-27 6-16 7-14 10-15 9-11 9-10 18-18 14-11 15-12 16-11 15-11 34-24 13-10 16-13 10-9 7-8 2-7-3-20-6-25-7-24-12-36-12-35-8-29-6-31-1-8v-33l3-17 6-18 7-16 10-15 10-11 5-5 8-7 19-12 21-9 21-6 24-4 15-1 133-1 34-4 10-4 6-7 8-16 8-20 14-42 9-30 10-29 10-26 12-25 9-15 12-16 15-16 16-12 15-8 18-6z" fill="#49A9F7" />
                                <path transform="translate(1273,875)" d="m0 0h11l16 4 12 6 11 9 8 8 8 14 4 11 2 8v14l-4 13-9 13-7 7-16 14-9 7-18 13-13 10-16 12-15 11-16 12-17 13-16 12-14 10-12 9-30 23-19 14-17 13-14 11-12 9-18 13-10 8-14 10-10 8-19 13-14 10-19 12-14 7-11 4h-9l-13-5-12-7-17-12-14-12-10-9-6-5-13-13-7-8-75-75-12-11-18-18-9-11-12-16-8-16-2-9v-14l4-12 8-14 7-9 11-10 13-8 15-5h12l12 3 14 7 10 7 13 10 12 11 8 7 35 35 7 8 43 43 8 7 6 5 5-1 14-8 20-14 17-12 12-9 17-12 12-9 19-14 13-10 16-12 19-14 16-12 18-14 47-36 16-12 17-13 17-12 18-10z" fill="#FDFDFD" />
                                <path transform="translate(1369,1844)" d="m0 0 3 1-2 5-12 14-7 7-13 10-15 8-15 6-16 4-9 1h-32l-17-3-8-3 2-4 8-4 11-3 8-4 1-1 14-1 12-3 13-3 7-3 7-2 2-1 7 1 8-3 5 1 1 1 9-3 8-6 5-2 10-6 1-2z" fill="#3B9DEF" />
                                <path transform="translate(899,1846)" d="m0 0h6v3l-11 8-21 12-19 10-21 8-28 9-14 3-9 1h-26l-13-3-2-3 4-1v-2l11-3 4-3 11-3 10-2 6-2 13-2 5-2 2-2 21-4 9-2 11-2 11-3 9-4 7-1 4-2 8-1 10-6z" fill="#3B9DEF" />
                                <path transform="translate(1726,1586)" d="m0 0h2l-2 5 5-1-1 3h-2v3l-15 7-17 6-22 5-27 4-28 2h-101v-1l14-1 16-2 25-2 21-4 17-3 22-2 5-1 8-2 2-1 22-2 15-3h10l7-3 7-1 8-3z" fill="#3B9DEF" />
                                <path transform="translate(1891,1113)" d="m0 0 5 2 1 4-5 5h-6-2l-3 7-4 5-2 5-5 4-1 4-30 23-17 12-13 9-3 2h-3l-1-4 3-5 2-5 7-4 4-6 4-4h2v-2l8-5h2l2-4 3-3 6-3 4-4h2v-2l9-6h4v-5l2-2h5l1-4 8-6 5-5 2 1z" fill="#3B9DEF" />
                                <path transform="translate(761,146)" d="m0 0h33l17 3 14 4v2l-3 2h-12l-9-1-14 1h-7l-5-1h-8l-12 2h-16l-6 2-6-1-2-1v-2l16-6z" fill="#3B9DEF" />
                                <path transform="translate(1433,1679)" d="m0 0h5l-1 8-13 40-9 29-8 23h-2l-1-7 1-7v-8l3-4 3-16 2-12 3-7 5-13 4-12 1-2 5-1 3-6-3 1-1-2z" fill="#3C9EEF" />
                                <path transform="translate(1253,146)" d="m0 0h31l17 3 15 5 2 1v2l-18-1h-25l-9 1-11-1h-12l-13 1-8-2 2-3 21-5z" fill="#3B9DEF" />
                                <path transform="translate(420,1615)" d="m0 0h52l14 1 13-1h15l21 2h10l9 3v1h-116l-25-1-7-2 4-2z" fill="#3D9FF0" />
                                <path transform="translate(267,510)" d="m0 0h2l1 4v10l-1 10-3 8 1 4h-2v14l-1 12v31l-2 3-3-12-2-14v-33l3-17 6-18z" fill="#3B9DEF" />
                                <path transform="translate(1781,519)" d="m0 0h2l5 19 1 8v31l-3 23-3 13h-4v-12h2l-1-3 1-9-1-4 1-9v-23l-1-5 1-16z" fill="#3C9EEF" />
                                <path transform="translate(1783,1443)" d="m0 0h3l4 29v28l-4 21-2 6h-2l-2-9 1-10 1-6-1-24 1-5v-26z" fill="#3C9EEF" />
                                <path transform="translate(1910,1088)" d="m0 0 1 4 5 1 1 4-10 14-3 3-6-1-1-9v-3l4-6z" fill="#3B9DEF" />
                                <path transform="translate(1938,1010)" d="m0 0 3 1v22l-4 21-2 4-2-4-2-5 1-14v-4l3-9v-6z" fill="#3D9EF0" />
                                <path transform="translate(260,1455)" d="m0 0 3 1v36l-2 18-2-2-1-6v-32z" fill="#3C9EEF" />
                                <path transform="translate(1451,1638)" d="m0 0h4l-1 6-8 18h-2l-1-7 1-1 1-9 4-6z" fill="#3C9EF0" />
                                <path transform="translate(1679,433)" d="m0 0 9 1 18 6v3h-12l-4-3-9-3z" fill="#3C9EEF" />
                            </svg>}
                        </div>
                    </div>
                    <div className="resetPasswordForm w-100 ">
                        {!isUpdate && <form className=' d-flex flex-column align-items-center mx-auto' onSubmit={submitForm}>
                            <div className="password w-100 my-2">
                                <label htmlFor='password1' className=' ps-2 user-select-none fs-6 fw-normal mb-1'>New Password</label>  <br />
                                <input required type="password" id='password1' className=' py-2 px-2 w-100 rounded-3 border-primary border-1' placeholder='New Password' />
                            </div>
                            <div className="confirmPassword w-100 my-2">
                                <label htmlFor='password2' className=' ps-2 user-select-none fs-6 fw-normal mb-1'>confirm Password</label>  <br />
                                <input required type="password" id='password2' className=' py-2 px-2 w-100 rounded-3 border-primary border-1' placeholder='confirm Password' />
                            </div>
                            <button type='submit' className='btn btn-primary my-3'>Save</button>
                        </form>}
                        {isUpdate && <div className="congratulation d-flex flex-column align-items-center">
                            <div className="heading text-center my-2 fs-3 fw-bold">Congratulation</div>
                            <div className="content fs-6 py-2">Password is Updated Successfully. Please login...</div>
                            <button className='btn btn-primary my-2' onClick={(e) => { navigate('/login') }}>Login</button>
                        </div>}

                    </div>
                </div>
            </div>}
        </>
    )
}

export default forgetPassword