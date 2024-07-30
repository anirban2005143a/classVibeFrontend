import React from 'react'
import Part1 from './home/part1'
import Part2 from './home/part2'
import Navbar from './navbar'
import '../css/home.css'

const home1 = () => {
  return (
    <>
      <div className="w-100">
        <Navbar />
        <Part1 />
        <Part2/>
      </div>

    </>

  )
}

export default home1