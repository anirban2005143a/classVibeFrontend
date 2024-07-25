import React from 'react'

const alert = (props) => {
    return (
        props.isDisplay && <div className={` z-2 alert alert-${props.mode} position-fixed top-0 w-100`} role="alert">
            {props.message}
        </div>
    )
}

export default alert