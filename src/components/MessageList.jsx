/* eslint-disable no-unused-vars */
import React from 'react';
import Message from './Message';

const MessageList = (props) => {
	return props.messages.map(message => <Message 
		message={message} 
		toggleExpanded={props.toggleExpanded}
		starToggler={props.starToggler}
		markAsRead={props.markAsRead}
		toggleMessageSelected={props.toggleMessageSelected}  />

	);
};

export default MessageList;
