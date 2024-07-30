import React from 'react'
import '../css/footer.css'

const footer = (props) => {
  return (
    <div id="footer" className={`${props.isFooterVisible ? 'visible' : ""} bg-black`} style={{height:`${Math.max(window.innerHeight*0.7 , 300)}px`}}>
        
    </div>
  )
}

export default footer