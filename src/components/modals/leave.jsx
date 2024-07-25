import React from 'react'

const leave = (props) => {
  return (
    <div className="modal fade" id="exampleModalLeave" tabIndex="-1" aria-labelledby="exampleModalLeaveLabel" aria-hidden="true">
  <div className="modal-dialog ">
    <div className="modal-content bg-danger-subtle">
      <div className="modal-header">
        <h1 className="modal-title fs-5 fw-bold" id="exampleModalLeaveLabel">Want to continue ?</h1>
      </div>
      <div className="modal-body">
        You will be removed by this meeting.
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={(e)=>{
            e.preventDefault()
            props.disconnectClient()
        }}>Continue</button>
      </div>
    </div>
  </div>
</div>
  )
}

export default leave