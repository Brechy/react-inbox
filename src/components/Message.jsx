import React from 'react'

const Message = (props) => {
  console.log(props) //console log your props so you can see what path you need to take
  return (
<div className="row message read">
  <div className="col-xs-1">
    <div className="row">
      <div className="col-xs-2">
        <input type="checkbox" />
      </div>
      <div className="col-xs-2">
        <i className={`star fa fa-star${props.message.starred ? '' : '-o'}`}></i>
      </div>
    </div>
  </div>
  <div className="col-xs-11">
    <span className="label label-warning">dev</span>
    <span className="label label-warning">gschool</span>
    <a href="">
      {props.message.subject} </a>
  </div>
</div>
  )
}

export default Message
