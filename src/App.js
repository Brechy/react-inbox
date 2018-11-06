import React, {Component} from 'react';
import './App.css';
import Toolbar from './components/Toolbar';
import MessageList from './components/MessageList';
import ComposeForm from './components/ComposeForm'

class App extends Component {
	state = {
			messages: []
		}

	async componentDidMount() {
		const response = await fetch('http://localhost:8082/api/messages')
		const json = await response.json()
		this.setState({messages: json})
	}

	toggleCompose = () => {
		this.setState({composing: !this.state.composing})
	}

	//if message is starred, change state of star from empty to filled in
	toggleStarred = (msgid) => {
        let newMessages = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            let msg = this.state.messages[i]
            if (msg.id === msgid) {
                msg.starred = !msg.starred;
            }
            newMessages.push(msg);
        }
        this.setState({messages: newMessages});
	}

	//get message from collective API when message selected, drop down in inbox to show message

    //post new message to collective API
	async submitMessage(message) {
		const response = await this.request('/api/messages', 'POST', {
			subject: message.subject,
			body: message.body,
		})
		const newMessage = await response.json()

		const messages = [...this.state.messages, newMessage]
		this.setState({
			messages,
			composing: false,
		})
	}
    //change state of message when marked as 'read' 
	async markAsRead() {
		await this.updateMessages({
			"messageIds": this.state.message.filter(message => message.selected).map(message => message.id),
			"command": "read",
			"read": true
		})
		this.setState({
			messages: this.state.messages.map(message => (
				message.selected ? {...message, read: true} : message
			))
		})
	}

	//individual message select icon
	toggleMessageState(message, property) {
		const index = this.state.messages.indexOf(message)
		this.setState({
			messages: [
				...this.state.messages.slice(0, index),
				{...message, [property]: !message[property]},
				...this.state.messages.slice(index + 1)
			]
		})
	}

	toggleMessageSelected = (message) => {
		this.toggleMessageState(message, 'selected')
	}

	//function to toggle select all icon in the toolbar
	toggleSelectAllIcon = () => {
		//setting the initial state of the icon to always be unchecked or not toggled
		let messagesSelected = this.state.messages.filter((message) => {
			return message.selected
		}).length

		let toggled = ''

		if(messagesSelected === this.state.messages.length) {
			//if toggled change icon to checked icon
			toggled = '-check'
		} else if(messagesSelected === 0) {
			toggled = ''
		} else {
			toggled = '-minus'
		}
		return toggled
	}

	//function to change state of messages in inbox to 'selected' or 'checked' if select all button is clicked
	selectAll = () => {
		let messagesSelected = this.state.messages.filter((message) => {
			return message.selected 
		}).length

	    if(messagesSelected === this.state.messages.length) {
			this.setState({
				message: this.state.messages.map((message) => {
					message.selected = false
					return message 
				})
			})
		} else {
			this.setState({
				message: this.state.messages.map((message) => {
					message.selected = true
					return message
				})
			})
		}
	}

	render() {
		return (
			<div className="App">
				<Toolbar
					toggleCompose={this.toggleCompose}
					markAsRead={this.markAsRead}
					markAsUnread={this.markAsUnread}
					toggleSelectAllIcon={this.toggleSelectAllIcon}
					selectAll={this.selectAll}
					messages={this.state.messages}
				/>

				<ComposeForm
					composing={this.state.composing} sendMessage={this.sendMessage}
				/>

				<MessageList
					starToggler={this.toggleStarred}
					messages={this.state.messages}
				/>
			</div>
			);
		}
	}
export default App;
