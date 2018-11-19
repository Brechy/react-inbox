/* eslint-disable no-unused-vars */
import React from 'react';

const Message = props => {
	const toggleSelect = event => {
		props.toggleMessageSelected(props.message);
	};
        console.log("In Message", props)
        const toggleStar = event => {
                props.starToggler(props.message.id);
	}
	console.log('This is the message labels >>>>>>>>>> ', props);
	let labels = props.message.labels;
	if (labels === undefined) {
		labels = [];
	}
	labels = labels.map((label, i) => (
		<span key={i} className="label label-warning">
			{label}
		</span>
	));

	return (
		<div
			className={`row message ${props.message.read ? 'read' : 'unread'} ${
				props.message.selected ? 'selected' : ''
			}`}
		>
			<div className="col-xs-1">
				<div className="row">
					<div className="col-xs-2">
						<input
							type="checkbox"
							checked={!!props.message.selected}
							readOnly={true}
							onClick={toggleSelect}
						/>
					</div>
					<div className="col-xs-2">
						<i
							className={`star fa fa-star${props.message.starred ? '' : '-o'}`}
							onClick={ toggleStar}
						/>
					</div>
				</div>
			</div>
			<div className="col-xs-11">
				{labels}
				<a href="">{props.message.subject} </a>
			</div>
		</div>
	);
};

export default Message;
