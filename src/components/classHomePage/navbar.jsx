import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userContext from '../../context/userContext'
import '../../css/navbar.css'
import defaultUserImg from '../../assets/defaultUser.png'
import '../../css/importedCss.css'

const navbar = () => {

    const value = useContext(userContext)
    const nevigate = useNavigate()

    useEffect(() => {
      const arr = Array.from(document.querySelectorAll("#navbar .MenuAndProfile button"))
      arr.forEach((item)=>{
        const red = Math.random() * 100 + 20
        const green = Math.random() * 100 + 20
        const blue = Math.random() * 100 + 20
        item.style.setProperty("--boxShadowColor" , `rgb(${red} , ${green} , ${blue})`)
      })
    }, [])
    

    return (
        <div id='navbar' className=' d-flex justify-content-between w-100 p-2 align-items-center'>
            <div className="name" onClick={() => { nevigate("/") }}>Class Vibe</div>
            <div className="MenuAndProfile px-3">
                <div id="allMenu">
                    <button>
                        <span>Classrooms</span>
                    </button>
                    <button>
                        <span>Ai Assistent</span>
                    </button>
                    <button>
                        <span>Dashboard</span>
                    </button>

                </div>
                <div id="profile">
                    <div className="dropdown w-100">
                        <a
                            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                            id="dropdownUser1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={defaultUserImg}
                                className="rounded-circle w-100"
                                style={{ objectFit: "cover" }}
                            />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow mb-2">
                            <li style={{ cursor: "pointer" }}>
                                <Link className="dropdown-item" to="/user/logIn">
                                    Log in
                                </Link>
                            </li>
                            <li style={{ cursor: "pointer" }} className={`${value.islogout === true ? "d-none" : ""}`}>
                                <Link className="dropdown-item ">
                                    Profile
                                </Link>
                            </li>
                            <li style={{ cursor: "pointer" }}>
                                <hr className="dropdown-divider" />
                            </li>
                            <li className={`${value.islogout === true ? "d-none" : ""}`}>
                                <Link className="dropdown-item">
                                    Sign out
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default navbar