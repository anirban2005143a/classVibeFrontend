import React , {useState , useEffect , useRef} from 'react'
import Part1 from './index/part1'
import Part2 from './index/part2'
import Part3 from './index/part3'
import Footer from './footer'
import '../css/index.css'

const index = () => {

  const part1ref = useRef()
  const part2ref = useRef()
  const part3ref = useRef()
  const footerref = useRef()

  const [isPart2Visible, setisPart2Visible] = useState(false)
  const [isPart3Visible, setisPart3Visible] = useState(false)
  const [isFooterVisible, setisFooterVisible] = useState(false)

 window.addEventListener('scroll' , ()=>{
  const part1Height = document.querySelector('#indexPart1').clientHeight
  const part2Height = document.querySelector('#indexPart2').clientHeight
  const part3Height = document.querySelector('#indexPart3').clientHeight

  // console.log(window.scrollY)

    if(window.scrollY >= part1Height * 0.8){
      setisPart2Visible(true)
    }
    if(window.scrollY >= part1Height + part2Height){
      setisPart3Visible(true)
    }
    if(window.scrollY >= part1Height + part2Height + (part3Height * 0.75)){
      setisFooterVisible(true)
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

export default index