/* eslint-disable no-unused-vars */
import React from 'react';

const Message = (props) => {

	const toggleSelect = (event) => {
		event.preventDefault();
		this.props.toggleMessagSelected(this.props.message);
	};

	return (
		<div className={`row message ${props.message.read ? 'read' : 'unread'}`}>
			<div className="col-xs-1">
				<div className="row">
					<div className="col-xs-2">
						<input 
							type="checkbox"
							checked={this.props.message.toggleSelect}
							onClick={toggleSelect}
						/>
					</div>
					<div className="col-xs-2">
						<i
							className={`star fa fa-star${props.message.starred ? '' : '-o'}`} onClick={(() => {props.starToggler(props.message.id);})}></i>
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
	);
};

export default Message;
