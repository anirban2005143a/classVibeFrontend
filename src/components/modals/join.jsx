import React, { useContext, useState, useEffect } from 'react'
import UserContext from "../../context/userContext";

const join = () => {
    const value = useContext(UserContext);

    const [inputRoomNo, setinputRoomNo] = useState('')

    //function to check room exist or not
    const checkRoom = async (formElem) => {
        const res = await fetch(`${value.backendServer}/api/room/check`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                'roomno': inputRoomNo,
            })
        })

        const data = await res.json()
        console.log(data)
        formElem.querySelector('button.close').disabled = false
        formElem.querySelector('button.submit').disabled = false
        formElem.querySelector('button.submit').innerHTML = 'Enter'
        setinputRoomNo('')
        return data.isExist
    }

    //function to redirect the streamming page
    const redirect = async () => {
        const encodedId = btoa(inputRoomNo)
        //redirecting to the streaming page
        window.open(`/meeting/${encodedId}`, '_blank')
    }

    //alert incorrect room no
    const alert = () => {
        document.querySelector('.modal-content').classList.add('bg-danger-subtle')
        document.querySelector('.modal-content').querySelector('.modal-header').querySelector('h1').innerHTML = 'Incorrect Room id'
    }

    return (
        <div className="modal fade" id="exampleModalJoin" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Enter Room Id</h1>
                    </div>
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        e.currentTarget.querySelector('button.close').disabled = true
                        e.currentTarget.querySelector('button.submit').disabled = true
                        e.currentTarget.querySelector('button.submit').innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
                        await checkRoom(e.currentTarget) ? redirect() : alert()
                    }}>
                        <div className="modal-body">

                            <div className="container">
                                <input required className="form-control" id="exampleFormControlInput1" placeholder="Room Id" value={inputRoomNo} onChange={(e) => {
                                    e.preventDefault()
                                    setinputRoomNo(e.target.value.trim())
                                }} style={{ boxShadow: 'none' }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary close" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary submit" >Enter</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default join