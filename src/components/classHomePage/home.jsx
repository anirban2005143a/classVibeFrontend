import React, { useState, useEffect } from 'react'
import Navbar from './navbar'
import ClassListSide from './classListSide'
import ClassContent from './classContent'

const home = () => {

  const setHeight = () => {
    const height = document.querySelector("#classContent .menuOption").clientHeight
    document.querySelector("#classContent .menuContent").style.height = `calc(100% - ${height + 2}px)`
  }

  window.addEventListener('resize', () => {
    document.querySelector("#homeContent") ?
      document.querySelector("#homeContent").style.height = `calc(${window.innerHeight}px - 3.5rem)` : ''
    document.querySelector("#classContent .menuOption") &&
      document.querySelector("#classContent .menuContent") ? setHeight() : ''
  })

  useEffect(() => {
    setHeight()
  }, [])


  return (
    <>
      <Navbar />
      <div id="homeContent" className=' bg-body-tertiary d-flex' style={{ height: `calc(${window.innerHeight}px - 3.5rem)` }}>
        <ClassListSide />
        <ClassContent />
      </div>
    </>
  )
}

export default home