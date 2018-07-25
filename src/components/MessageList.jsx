import React from 'react'
import Message from './Message'

const MessageList = (props) => {
  console.log(props.messages)
  return props.messages.map(message => <Message message={message} />

  ) 
}

export default MessageList
