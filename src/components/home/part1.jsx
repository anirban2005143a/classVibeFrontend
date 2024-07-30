import React from 'react'
import '../../css/importedCss.css'
import '../../css/home.css'

const part1 = () => {
    return (
        <div id='homePart1' className=' overflow-x-hidden' style={{ height: `${window.innerHeight - 50}px` }}>
            <div className="frontBox w-100">
                <div className="maincontent">
                    <div className="heading p-2">Class Vibe</div>
                    <div className="content px-2 pb-3">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi adipisci porro repellat sint soluta saepe quae
                    </div>
                    <div className="StartButton">
                        <button className="btn-53 rounded-3 z-0 mx-auto">
                            <div className="original">Get Started</div>
                            <div className="letters">
                                <span>E</span>
                                <span>X</span>
                                <span>P</span>
                                <span>L</span>
                                <span>O</span>
                                <span>R</span>
                                <span>E</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default part1