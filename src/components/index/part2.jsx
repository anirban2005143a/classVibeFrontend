import React from 'react'
import '../../css/importedCss.css'
import '../../css/index.css'

import contentImg from '../../assets/email verification.jpg'

const part2 = (props) => {
  return (
    <div id='homePart2' className={`overflow-x-hidden `} style={{ height: `${window.innerHeight}px` }}>
      <div className={`content w-100 ${props.isPart2Visible ? 'visible' : ""} `}>
        <div className="text">
          <div className="heading">my name anirban</div>
          <div className="relatedContent">Lorem ipsum dolor sit amet consectetur adipisicing elit. A excepturi, facilis dolore repudiandae repellat incidunt corporis mollitia dolor aut consectetur odit doloremque id consequuntur porro rem, aliquam fuga explicabo assumenda.</div>
        </div>

        <div className="image">
          <img className=' w-100' src={contentImg} />
        </div>

      </div>
    </div>
  )
}

export default part2