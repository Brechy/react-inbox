/* eslint-disable no-unused-vars */
import React from 'react';

const Toolbar = props => {
        console.log("Toolbar", props)
	let unreadMessageCount = props.messages.filter(message => !message.read)
		.length;
	let selectedMessageCount = props.messages.filter(message => message.selected)
		.length;

	return (
		<div className="row toolbar">
			<div className="col-md-12">
				<p className="pull-right">
					<span className="badge badge">{unreadMessageCount}</span>
					unread {unreadMessageCount === 1 ? 'message' : 'messages'}
				</p>

				<a className="btn btn-danger" onClick={props.toggleCompose}>
					<i className={'fa fa-plus'} />
				</a>

				<button className="btn btn-default">
					<i
						className={`fa fa${props.toggleSelectAllIcon()}-square-o`}
						onClick={() => props.selectAll()}
					/>
				</button>

				<button className="btn btn-default" onClick={props.markAsRead}>
					Mark As Read
				</button>

				<button className="btn btn-default" onClick={props.markAsUnread}>
					Mark As Unread
				</button>

				<select onChange={(e) => {props.applyLabel(e.target.value);e.target.value=""}} className="form-control label-select">
					<option value="">Apply label</option>
					<option value="dev">dev</option>
					<option value="personal">personal</option>
					<option value="gschool">gschool</option>
				</select>

				<select onChange={(e) => {props.removeLabel(e.target.value);e.target.value=""}} className="form-control label-select">
					<option value="">Remove label</option>
					<option value="dev">dev</option>
					<option value="personal">personal</option>
					<option value="gschool">gschool</option>
				</select>

				<button className="btn btn-default">
					<i className="fa fa-trash-o" />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;
