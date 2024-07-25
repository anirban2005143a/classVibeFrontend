import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserContext from "./context/userContext";
import getCookie from './components/functions/getCookie'
import Home from "./components/home";
import Login from "./components/form/login";
import Signup from "./components/form/signup";
import About from "./components/about";
import VideoGroup from "./components/videoGroup";
import VerifyEmail from "./components/verfyandforget/verifyEmail";
import ForgetPassword from "./components/verfyandforget/forgetPassword";

function App() {

  const [islogout, setislogout] = useState(false); //for check logout of not

  const backendServer = import.meta.env.VITE_REACT_BACKEND;
  const forntendServer = import.meta.env.VITE_REACT_FRONTEND
  const authtoken = getCookie("authtoken")
  const userId = getCookie("userId")
  
  console.log(backendServer,forntendServer)

  //set islogout id there is any authtoken and userid both peresent
  useEffect(() => {
    if (!authtoken || !userId) {
      setislogout(true);
    }
  }, []);


  //router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/about",
      element: <About />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/meeting/:id",
      element: <VideoGroup />
    },
    {
      path: "/verify/email",
      element: <VerifyEmail />
    },
    {
      path: "/forget/password",
      element: <ForgetPassword />
    },
  ])

  return (
    <UserContext.Provider value={{
      backendServer,forntendServer, authtoken, userId, islogout, setislogout
    }}>
      <RouterProvider router={router} />
    </UserContext.Provider>

  )
}

export default App
