import React, { useState, useEffect, useContext } from 'react'
import UserContext from '../../context/userContext';
import { Link } from 'react-router-dom';
import Alert from '../alert';
import Error from '../error';

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
    console.log(value.backendServer, value.forntendServer , `${value.backendServer}/api/auth/checkUser`)
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
    parentElem.querySelector('button').disabled = false
    parentElem.querySelector('button').innerHTML = 'Singup'
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
      document.querySelector('#exampleFormControlPassword').value = ''
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

      <div className='signup w-100 '>

        <div className="heading fs-2 fw-bold text-center " style={{ marginTop: "50px" }}>Create Account</div>

        <div className="formPart mx-auto my-3 p-md-4 p-3 d-flex flex-column justify-content-center rounded-3" style={{ backgroundColor: 'rgb(173 157 255 / 70%)', boxShadow: " 0 0 10px #2b00ff" }}>
          <form className=' my-3' onSubmit={(e) => {
            e.preventDefault()
            e.currentTarget.querySelector('button').innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
            e.currentTarget.querySelector('button').disabled = true
            setverificationMessage(false)
            const password = e.currentTarget.querySelector('#exampleFormControlPassword').value.trim()
            signUp(password, e.currentTarget)
          }}>
            <div className="userName d-flex justify-content-between">
              {/* user firstName  */}
              <div className="mb-3 w-50 me-4">
                <label htmlFor="exampleFormControlFirstName" className="form-label fw-semibold">Firstname</label>
                <input className="form-control" id="exampleFormControlFirstName" placeholder="Enter Firstname" value={firstName} onChange={(e) => {
                  e.preventDefault()
                  setfirstName(e.target.value.trim())
                }} />
              </div>

              {/* userlast name  */}
              <div className="mb-3 w-50 ">
                <label htmlFor="exampleFormControlLastName" className="form-label fw-semibold">Lastname</label>
                <input className="form-control" id="exampleFormControlLastName" placeholder="Enter Lastname" value={lastName} onChange={(e) => {
                  e.preventDefault()
                  setlastName(e.target.value.trim())
                }} />
              </div>
            </div>
            {/* enter email  */}
            <div className="mb-3">
              <label htmlFor="exampleFormControlEmail" className="form-label fw-semibold">Email address</label>
              <input type="email" className="form-control" id="exampleFormControlEmail" placeholder="Enter email" value={email} onChange={(e) => {
                e.preventDefault()
                setemail(e.target.value.trim())
              }} />
            </div>
            {/* enter password  */}
            <div className="mb-3">
              <label htmlFor="exampleFormControlPassword" className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control" id="exampleFormControlPassword" placeholder="Enter password" />
            </div>
            {/* verification alert  */}
            {verificationMessage && <p className=' m-0 fw-semibold fs-6' style={{ color: "#00008c" }}>{verificationMessage}</p>}
            {/* submit button  */}
            <button type="submit" className="btn btn-primary mt-2">Singup</button>
            {/* already have account  */}
            <p className=' mt-3'>Already have an account ? <Link to="/login" className=' fw-semibold text-decoration-none' >log-in</Link></p>

          </form>
        </div>
      </div>
    </>
  )
}

export default signup