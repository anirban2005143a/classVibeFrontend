import React from 'react'

const error = (props) => {
  return (
    <div className=' w-100 h-100 d-flex justify-content-center align-items-center' style={{margin:"80px 0px"}}>
        <div className="error d-flex flex-column align-items-center">
            <div className={`status fw-bolder ${props.status===200 ? 'text-success' : 'text-danger'}`} style={{fontSize:"80px"}} >{props.status}</div>
            <div className="errorMessage fs-2 fw-bold">{props.message}</div>
        </div>
    </div>
  )
}

export default error