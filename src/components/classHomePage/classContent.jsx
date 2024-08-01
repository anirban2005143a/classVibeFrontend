import React, { useState, useEffect } from 'react'
import '../../css/classHome/classContent.css'
import '../../css/importedCss.css'

const classContent = () => {

  useEffect(() => {
    const menuBtns = Array.from(document.querySelectorAll('#homeContent #classContent .menuOption .btn-17'))

    menuBtns.forEach((item) => {
      const red = Math.random() * 150 + 20
      const green = Math.random() * 150 + 20
      const blue = Math.random() * 150 + 20
      item.style.backgroundColor = `rgb(${red} , ${green} , ${blue})`
    })

  }, [])


  return (
    <>
      <div id="classContent">
        <div className="menuOption">

          <button className="btn-17 mx-3">
            <span className="text-container">
              <span className="text">Stream</span>
            </span>
          </button>
          <button className="btn-17 mx-3">
            <span className="text-container">
              <span className="text">Media</span>
            </span>
          </button>
          <button className="btn-17 mx-3">
            <span className="text-container">
              <span className="text">Exams</span>
            </span>
          </button>
          <button className="btn-17 mx-3">
            <span className="text-container">
              <span className="text">Announcment</span>
            </span>
          </button>
          <button className="btn-17 mx-3">
            <span className="text-container">
              <span className="text">Members</span>
            </span>
          </button>
        </div>
        <div className="menuContent">

        </div>
      </div>
    </>
  )
}

export default classContent