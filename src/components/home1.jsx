import React , {useState , useEffect , useRef} from 'react'
import Part1 from './home/part1'
import Part2 from './home/part2'
import Part3 from './home/part3'
import Footer from './footer'
import '../css/home.css'

const home1 = () => {

  const part1ref = useRef()
  const part2ref = useRef()
  const part3ref = useRef()
  const footerref = useRef()

  const [isPart2Visible, setisPart2Visible] = useState(false)
  const [isPart3Visible, setisPart3Visible] = useState(false)
  const [isFooterVisible, setisFooterVisible] = useState(false)

 window.addEventListener('scroll' , ()=>{
  const part1Height = document.querySelector('#homePart1').clientHeight
  const part2Height = document.querySelector('#homePart2').clientHeight
  const part3Height = document.querySelector('#homePart3').clientHeight

  // console.log(window.scrollY)

    if(window.scrollY >= part1Height * 0.9){
      setisPart2Visible(true)
    }
    if(window.scrollY >= part1Height + part2Height){
      setisPart3Visible(true)
    }
   
 })
 console.log(isPart3Visible)
  return (
    <>
      <div className="w-100 " style={{paddingTop:"5%"}}>
        <Part1 part1ref={part1ref}/>
        <Part2 part2ref={part2ref} isPart2Visible={isPart2Visible} />
        <Part3 part3ref={part3ref} isPart3Visible={isPart3Visible} />
        <Footer footerref={footerref} isFooterVisible={isFooterVisible} />
      </div>

    </>

  )
}

export default home1