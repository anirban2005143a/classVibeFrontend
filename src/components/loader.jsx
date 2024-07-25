import React from 'react'

const loader = () => {
    return (
        <div className="loader position-absolute z-2 w-100 h-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default loader