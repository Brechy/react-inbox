/* eslint-disable no-unused-vars */
import React from 'react';
import Message from './Message';

const MessageList = (props) => {
	return props.messages.map(message => <Message 
		message={message} 
		starToggler={props.starToggler}
		toggleMessageSelected={props.toggleMessageSelected}  />

	);
};

export default MessageList;
