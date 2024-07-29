import React, { useState, useEffect, useContext } from 'react'
import UserContext from '../../context/userContext';
import { Link } from 'react-router-dom';
import Alert from '../alert';
import Error from '../error';
import '../../css/signup.css'
import '../../css/importedCss.css'
import AdImg from '../../assets/colorWheel.png'

const login1 = () => {

    return (
        <>
            <div className=' w-100 position-absolute h-100' id="login" >
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
                    <div className="heading">Welcome Back</div>
                    <div className="form w-100">
                        <form className=' mx-auto d-flex flex-column align-items-center' onSubmit={(e) => {
                            e.preventDefault()
                            e.currentTarget.querySelector('button').innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
                            e.currentTarget.querySelector('button').disabled = true
                            const password = e.currentTarget.querySelector('#exampleFormControlInput2').value.trim()
                            loginUser(password, e.currentTarget)
                        }}>



                            <div className="email w-100 my-2">
                                <div className="form__group field">
                                    <input type="email" className="form__field" placeholder="Email" required value={email} onChange={(e) => {
                                        e.preventDefault()
                                        setemail(e.target.value.trim())
                                    }} />
                                    <label for="name" className="form__label">Email</label>
                                </div>
                            </div>
                            <div className="password w-100 my-2">
                                <div className="form__group field">
                                    <input type="password" className="form__field" placeholder="Password" required />
                                    <label for="name" className="form__label">Password</label>
                                </div>
                            </div>
                            {/* verification alert  */}
                            {forgotPassword && <p className=' m-0 my-2 fw-normal text-danger fs-6' >Forgot password ? <span className=' text-primary' onMouseOver={addhoverEffect} onMouseLeave={removehoverEffect} onClick={changePassword} style={{ cursor: "pointer", fontWeight: "400" }}>Change</span></p>}
                            {/* create account  */}
                            <p className=' my-2'>Don't have any account ? <Link to="/signup" className=' text-decoration-none' onMouseOver={addhoverEffect} onMouseLeave={removehoverEffect} style={{ fontWeight: 400 }}>Create account</Link></p>
                            {/* submit button  */}
                            <div type="submit" className="submitBtn my-3">
                                <button id="submitBtn">
                                    Create
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default login1