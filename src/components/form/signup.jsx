import React, { useState, useEffect, useContext } from 'react'
import UserContext from '../../context/userContext';
import { Link } from 'react-router-dom';
import Alert from '../alert';
import Error from '../error';
import '../../css/signup.css'
import '../../css/importedCss.css'
import AdImg from '../../assets/colorWheel.png'

const signup = () => {

  const value = useContext(UserContext);

  const [email, setemail] = useState("")
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  //state for alert
  const [isOK, setisOK] = useState(null)
  const [message, setmessage] = useState("")

  const [verificationMessage, setverificationMessage] = useState(null)

  const [iserror, setiserror] = useState(false)
  const [errorMessage, seterrorMessage] = useState('')
  const [errorStatus, seterrorStatus] = useState(0)

  //function to login
  const signUp = async (password, parentElem) => {
    const res = await fetch(`${value.backendServer}/api/auth/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        url: `${value.forntendServer}/verify/email`
      }),
    })
    const data = await res.json()
    parentElem.querySelector('button').classList.remove('d-none')
    parentElem.querySelector('.loader').classList.add('d-none')
    if (data.error) {
      setisOK(false)
      setmessage(data.message)
      setiserror(true)
      seterrorStatus(data.status)
      seterrorMessage(data.message)
    } else {
      setisOK(true)
      setmessage(data.message)
      setverificationMessage('We have send a mail to you , Please verify')
      setfirstName('')
      setlastName('')
      setemail('')
      document.querySelector('#signup .password input').value = ''
    }
  }

  const resizeFormPart = () => {
    const width = window.innerWidth
    const formPart = document.querySelector('.signup .formPart')
    formPart ? (() => {
      width >= 900 ? formPart.style.width = '50%' : ''
      width < 900 && width >= 750 ? formPart.style.width = '60%' : ''
      width < 750 && width >= 550 ? formPart.style.width = '70%' : ''
      width < 550 && width >= 350 ? formPart.style.width = '80%' : ''

      const userName = formPart.querySelector('form').querySelector('.userName')
      width < 450 ? userName.classList.remove('d-flex') : userName.classList.add('d-flex')
      width < 450 ? userName.classList.remove('justify-content-between') : userName.classList.add('justify-content-between')
      width < 450 ? userName.querySelectorAll('div')[0].classList.remove('w-50') : userName.querySelectorAll('div')[0].classList.add('w-50')
      width < 450 ? userName.querySelectorAll('div')[0].classList.remove('me-4') : userName.querySelectorAll('div')[0].classList.add('me-4')
      width < 450 ? userName.querySelectorAll('div')[1].classList.remove('w-50') : userName.querySelectorAll('div')[1].classList.add('w-50')
    })() : ""

  }

  window.addEventListener('resize', resizeFormPart)

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
    resizeFormPart()
  }, [])


  return (
    <>
      <Alert isDisplay={isOK !== null ? true : false} message={message} mode={isOK ? "success" : "danger"} />

      {iserror && <Error status={errorStatus} message={errorMessage} />}

      {/* <div className='signup w-100 '> */}

      <div className='signup w-100 position-absolute h-100 overflow-hidden' id="signup" >
        <div className="formSideAd w-50 h-100 position-relative ps-3">

          <div className="AdImg z-1 position-relative " style={{ width: '60%' }}>
            <div className="svg d-flex justify-content-center">
              <img src={AdImg} style={{ width: '150px', objectFit: "cover" }} />
            </div>
          </div>
          <div className="AdContent z-1 position-relative text-center" style={{ width: '60%' }}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum repudiandae harum porro fuga, illum id aliquam in vitae. Saepe cumque iure maiores optio at. Ducimus provident fugit eum eius natus!
          </div>
        </div>

        <div className="loginForm h-100 my-auto " >
          <div className="heading">Create Account</div>
          <div className="form w-100">
            <form className=' mx-auto d-flex flex-column align-items-center' onSubmit={(e) => {
              e.preventDefault()
              e.currentTarget.querySelector('button').classList.add('d-none')
              e.currentTarget.querySelector('.loader').classList.remove('d-none')   
              setverificationMessage(false)
              const password = e.currentTarget.querySelector('.password input').value.trim()
              signUp(password, e.currentTarget)
            }}>
              <div className="firstname w-100  my-2">
                <div className="form__group field">
                  <input type="text" className="form__field" placeholder="First Name" required value={firstName} onChange={(e) => {
                    e.preventDefault()
                    setfirstName(e.target.value.trim())
                  }} />
                  <label htmlFor="name" className="form__label">First Name</label>
                </div>
              </div>

              <div className="lastname w-100 my-2">
                <div className="form__group field">
                  <input type="text" className="form__field" placeholder="Last Name" required value={lastName} onChange={(e) => {
                    e.preventDefault()
                    setlastName(e.target.value.trim())
                  }} />
                  <label htmlFor="name" className="form__label">Last Name</label>
                </div>
              </div>
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
              {verificationMessage && <p className=' m-0 fw-semibold fs-6 mt-2' style={{ color: "#00008c" }}>{verificationMessage}</p>}


              {/* already have account  */}
              <p className=' mt-2'>Already have an account ? <Link to="/login" className=' fw-semibold text-decoration-none' >log-in</Link></p>
              {/* submit button  */}
              <div  className=" mb-2">
                <button type="submit" className="submitBtn rounded-5">
                  Create
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

      </div>
    </>
  )
}

export default signup