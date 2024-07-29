import React, { useState, useEffect, useContext } from 'react'
import UserContext from '../../context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../alert';
import addCookie from '../functions/addCookie';
import '../../css/login.css'
import '../../css/importedCss.css'
import AdImg from '../../assets/colorWheel.png'

const login = () => {

    const value = useContext(UserContext);
    const navigate = useNavigate();

    const [windowWidth, setwindowWidth] = useState(window.innerWidth)

    const [email, setemail] = useState("")
    const [forgotPassword, setforgotPassword] = useState(false)
    //state for alert
    const [isOK, setisOK] = useState(null)
    const [message, setmessage] = useState("")

    //function to login
    const loginUser = async (password, parentElem) => {
        const res = await fetch(`${value.backendServer}/api/auth/login`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            }),
        })
        const data = await res.json()
        parentElem.querySelector('button').disabled = false
        parentElem.querySelector('button').innerHTML = 'Login'
        if (data.error) {
            setisOK(false)
            setmessage(data.message)
            data.message === "incorrect Password" ? setforgotPassword(true) : ""
        } else {
            addCookie("authtoken", `${data.jwtToken}`)
            addCookie("userId", `${data.userId}`)
            value.setislogout(false)
            setisOK(true)
            setmessage('Successfully login')
            setemail('')
            document.querySelector('#exampleFormControlInput2').value = ''
            navigate('/')
        }
    }

    const changePassword = async (e) => {
        const currentTarget = e.currentTarget
        document.querySelector('button').classList.add('d-none')
        document.querySelector('.loader').classList.remove('d-none')
        const span = document.createElement('span')
        span.classList.add('text-primary')
        span.innerHTML = 'Please Wait...'
        currentTarget.parentElement.appendChild(span)
        currentTarget.parentElement.removeChild(currentTarget)
        const res = await fetch(`${value.backendServer}/api/auth/change/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                url: `${value.forntendServer}/forget/password`
            })
        })
        const data = await res.json()
        console.log(data)
        document.querySelector('button').classList.remove('d-none')
        document.querySelector('.loader').classList.add('d-none')
        if (data.error) {
            setisOK(false)
            setmessage(data.message)
        } else {
            setisOK(true)
            setmessage(data.message)
            span.innerHTML = data.message
        }
    }

    const addhoverEffect = (e) => {
        e.currentTarget.style.fontWeight = 600
    }
    const removehoverEffect = (e) => {
        e.currentTarget.style.fontWeight = 400
    }

    const resizeImgpart = () => {
        const imgpart = document.querySelector('.login .imgpart')
        const formPart = document.querySelector('.login .formPart')
        const width = window.innerWidth

        imgpart && formPart ? (() => {
            width < 680 ? imgpart.classList.add('d-none') : imgpart.classList.remove('d-none')
            width < 680 ? formPart.classList.remove('m-3') : formPart.classList.add('m-3')
            width < 680 ? formPart.classList.add('mx-auto') : formPart.classList.remove('mx-auto')
            width >= 550 && width < 680 ? formPart.classList.remove('w-50') : formPart.classList.add('w-75')
            width > 680 ? (() => {
                formPart.classList.remove('w-75')
                formPart.classList.add('w-50')
            })() : ''
            width < 680 ? formPart.classList.add('rounded-4') : formPart.classList.remove('rounded-4')
            width < 680 ? formPart.parentElement.classList.remove('d-flex') : formPart.parentElement.classList.add('d-flex')
            width < 680 ? formPart.style.backgroundColor = 'rgb(173 157 255 / 70%)' : formPart.style.backgroundColor = 'transparent'
        })() : ""
    }

    window.addEventListener('resize', () => {
        setwindowWidth(window.innerWidth)
        resizeImgpart()
    })

    useEffect(() => {
        let timer = null
        timer = setTimeout(() => {
            setisOK(null)
        }, 1500);

        if (isOK !== null && timer !== null) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                setisOK(null)
            }, 1500);
        }
    }, [isOK])

    useEffect(() => {
        resizeImgpart()
    }, [])


    return (
        <>
            <Alert isDisplay={isOK !== null ? true : false} message={message} mode={isOK ? "success" : "danger"} />
            <div className=' w-100 position-absolute h-100' id="login" >

                <div className="loginForm h-100 my-auto " >
                    <div className="heading">Welcome Back</div>
                    <div className="form w-100">
                        <form className=' mx-auto d-flex flex-column align-items-center' onSubmit={(e) => {
                            e.preventDefault()
                            e.currentTarget.querySelector('button').classList.add("d-none")
                            e.currentTarget.querySelector('.loader').classList.remove("d-none")
                            const password = e.currentTarget.querySelector('#exampleFormControlInput2').value.trim()
                            loginUser(password, e.currentTarget)
                        }}>



                            <div className="email w-100 my-2">
                                <div className="form__group field">
                                    <input type="email" className="form__field" placeholder="Email" required value={email} onChange={(e) => {
                                        e.preventDefault()
                                        setemail(e.target.value.trim())
                                    }} />
                                    <label htmlFor="name" className="form__label">Email</label>
                                </div>
                            </div>
                            <div className="password w-100 my-2">
                                <div className="form__group field">
                                    <input type="password" className="form__field" placeholder="Password" required />
                                    <label htmlFor="name" className="form__label">Password</label>
                                </div>
                            </div>
                            {/* verification alert  */}
                            {forgotPassword && <p className=' m-0 my-2 fw-normal text-danger fs-6' >Forgot password ? <span className=' text-primary' onMouseOver={addhoverEffect} onMouseLeave={removehoverEffect} onClick={changePassword} style={{ cursor: "pointer", fontWeight: "400" }}>Change</span></p>}
                            {/* create account  */}
                            <p className=' my-2'>Don't have any account ? <Link to="/signup" className=' text-decoration-none' onMouseOver={addhoverEffect} onMouseLeave={removehoverEffect} style={{ fontWeight: 400 }}>Create account</Link></p>
                            {/* submit button  */}
                            <div className=" my-3">
                                <button type="submit" className="submitBtn rounded-5">
                                    Login
                                </button>
                            </div>

                            <div className="loader d-none">
                                <div className="cell d-0"></div>
                                <div className="cell d-1"></div>
                                <div className="cell d-2"></div>

                                <div className="cell d-1"></div>
                                <div className="cell d-2"></div>


                                <div className="cell d-2"></div>
                                <div className="cell d-3"></div>


                                <div className="cell d-3"></div>
                                <div className="cell d-4"></div>
                            </div>

                        </form>
                    </div>
                </div>

                <div className="formSideAd w-50 h-100 position-relative pe-4 overflow-hidden">

                    <div className="AdImg z-1 position-relative " style={{ width: '60%' }}>
                        <div className="svg d-flex justify-content-center">
                            <img src={AdImg} style={{ width: '150px', objectFit: "cover" }} />
                        </div>
                    </div>
                    <div className="AdContent z-1 position-relative text-center" style={{ width: '60%' }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum repudiandae harum porro fuga, illum id aliquam in vitae. Saepe cumque iure maiores optio at. Ducimus provident fugit eum eius natus!
                    </div>
                </div>

            </div>
        </>
    )
}

export default login