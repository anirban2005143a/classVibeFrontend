import React, { useEffect, useStatte } from 'react'
import '../../css/classHome/classListSide.css'

const classListSide = () => {

    useEffect(() => {
        const classIcons = Array.from(document.querySelectorAll("#classListSide .classList .classIcon"))
        const classNames = Array.from(document.querySelectorAll("#classListSide .classList .className"))
        classIcons.forEach((icon, index) => {
            const red = Math.random() * 150 + 20
            const green = Math.random() * 150 + 20
            const blue = Math.random() * 150 + 20
            icon.style.backgroundColor = `rgb(${red} , ${green} , ${blue})`
            classNames[index].style.backgroundColor = `rgba(${red} , ${green} , ${blue} , 0.3)`

        })
    }, [])

    useEffect(() => {
        const classNames = Array.from(document.querySelectorAll("#classListSide .classList .className"))
        classNames.forEach((item) => {
            const color = item.style.backgroundColor.split("(")[1].split(")")[0].split(",")
            const red = color[0]
            const green = color[1]
            const blue = color[2]
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = `rgba(${red} , ${green} , ${blue} , 0.5)`
            })
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = `rgba(${red} , ${green} , ${blue} , 0.3)`
            })
        
        })
    }, [])


    return (
        <>
            <div id="classListSide">
                <div className="classList">
                    <ul className=' p-2 mt-4'>
                        <li><div className='classIcon me-2'>C</div><div className='className'>Computer organization</div></li>
                        <li><div className='classIcon me-2'>D</div><div className='className'>Discrite Mathematics</div></li>
                        <li><div className='classIcon me-2'>D</div><div className='className'>Data Structure</div></li>
                        <li><div className='classIcon me-2'>P</div><div className='className'>Probability and statictics</div></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default classListSide