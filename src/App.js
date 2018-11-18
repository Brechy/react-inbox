import React, { Component } from 'react';
import './App.css';
import Toolbar from './components/Toolbar';
import MessageList from './components/MessageList';
import ComposeForm from './components/ComposeForm';

class App extends Component {
	state = { messages: [] };

	toggleProperty(message, property) {
		const index = this.state.messages.indexOf(message);
		this.setState({
			messages: [
				...this.state.messages.slice(0, index),
				{ ...message, [property]: !message[property] },
				...this.state.messages.slice(index + 1)
			]
		});
	}

	handleToggleSelected = message => {
		this.toggleProperty(message, 'selected');
	};

	componentDidMount = async () => {
		await this.getDataFromAPI();
	};
	getDataFromAPI = async () => {
		const messagesJson = await fetch('http://localhost:8082/api/messages');
		let messages = await messagesJson.json();
		console.log('coming from API === ', messages);
		this.setState({ messages });
	};

	//post new message to collective API
	submitMessage = async () => {
		const subject = document.querySelector('#subject').value;
		const body = document.querySelector('#body').value;
		//TODO: need to add error checking to use this response
		const response = await fetch('http://localhost:8082/api/messages', {
			method: 'POST',
			headers: {
				Accept: 'appication/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subject,
				body
			})
		});
		this.showComposeTemplate();
	};

	toggleStarred = async message => {
		message.starred = !message.starred;
		this.setState(this.state.messages.concat(message));
		let postData = {
			command: 'star',
			messageIds: [message.id]
		};
		const messagesJson = await fetch('http://localhost:8082/api/messages', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(postData)
		});

		let messages = await messagesJson.json();
		this.setState({ messages });
	};

	selectedMessage = message => {
		message.selected = !message.selected;
		this.setState(this.state.messages.concat(message));
	};

	markAsRead = async message => {
		let postData = {
			command: 'read',
			read: true,
			messageIds: [message.id]
		};
		const messagesJson = await fetch('http://localhost:8082/api/messages', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(postData)
		});
		let messages = await messagesJson.json();
		console.log('Came back from the patch and parsed json and got: ', messages);
		this.setState({ messages });
	};

	markAsUnread = async message => {
		let postData = {
			command: 'read',
			read: false,
			messageIds: [message.id]
		};
		const messagesJson = await fetch('http://localhost:8082/api/messages', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(postData)
		});
		let messages = await messagesJson.json();
		console.log('Came back from the patch and parsed json and got: ', messages);
		this.setState({ messages });
	};

	// if message is starred, change state of star from empty to
	toggleStarred = msgid => {
		let newMessages = [];
		for (let i = 0; i < this.state.messages.length; i++) {
			let msg = this.state.messages[i];
			if (msg.id === msgid) {
				msg.starred = !msg.starred;
			}
			newMessages.push(msg);
		}
		this.setState({ messages: newMessages });
	};

	updateStarred = async message => {
		const messagesJSON = await fetch('http://localhost:8082/api/messages', {
			method: 'PATCH',
			body: JSON.stringify({
				messageIds: [message.id],
				command: 'star',
				star: message.starred
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		this.toggleProperty(message, 'starred');
	};

	toggleCompose = () => {
		this.setState({ composing: !this.state.composing });
	};

	// const messagesJSON = await fetch('http://localhost:8082/api/messages', {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content Type': 'application/json',
	// 		'Accept': 'application/json',
	// 	},
	// 	body: JSON.stringify(PostData)
	// })

	//change state of message when marked as 'read'
	// markAsRead = async messages => {
	// 	let postData = {
	// 		command: 'read',
	// 		read: !message.read,
	// 		messageIds: [message.id]
	// 	};
	// 	const messagesJSON = await fetch('http://localhost:8082/api/messages', {
	// 		method: 'PATCH',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Accept: 'application/json'
	// 		},
	// 		body: JSON.stringify(postData)
	// 	});
	// 	let messages = await messagesJSON.json();
	// 	this.setState({ messages });
	// };

	// markAsUnread = async message => {
	// 	let postData = {
	// 		command: 'read',
	// 		read: message.read,
	// 		messageIds: [message.id]
	// 	};
	// 	const messagesJson = await fetch('http://localhost:8082/api/messages', {
	// 		method: 'PATCH',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Accept: 'application/json'
	// 		},
	// 		body: JSON.stringify(postData)
	// 	});
	// 	let messages = await messagesJson.json();
	// 	this.setState({ messages });
	// };

	//individual message select icon
	toggleMessageState(message, property) {
		const index = this.state.messages.indexOf(message);
		this.setState({
			messages: [
				...this.state.messages.slice(0, index),
				{ ...message, [property]: !message[property] },
				...this.state.messages.slice(index + 1)
			]
		});
	}

	toggleMessageSelected = message => {
		this.toggleMessageState(message, 'selected');
	};

	//function to toggle select all icon in the toolbar
	toggleSelectAllIcon = () => {
		//setting the initial state of the icon to always be unchecked or not toggled
		let messagesSelected = this.state.messages.filter(message => {
			return message.selected;
		}).length;

		let toggled = '';

		if (messagesSelected === this.state.messages.length) {
			//if toggled change icon to checked icon
			toggled = '-check';
		} else if (messagesSelected === 0) {
			toggled = '';
		} else {
			toggled = '-minus';
		}
		return toggled;
	};

	//function to change state of messages in inbox to 'selected' or 'checked' if select all button is clicked
	selectAll = () => {
		let messagesSelected = this.state.messages.filter(message => {
			return message.selected;
		}).length;

		if (messagesSelected === this.state.messages.length) {
			this.setState({
				message: this.state.messages.map(message => {
					message.selected = false;
					return message;
				})
			});
		} else {
			this.setState({
				message: this.state.messages.map(message => {
					message.selected = true;
					return message;
				})
			});
		}
	};

	render() {
		return (
			<div className="App">
				<Toolbar
					starred={this.state.toggleStarred}
					toggleCompose={this.toggleCompose}
					markAsRead={this.markAsRead}
					markAsUnread={this.markAsUnread}
					toggleSelectAllIcon={this.toggleSelectAllIcon}
					selectAll={this.selectAll}
					messages={this.state.messages}
				/>

				<ComposeForm
					composing={this.state.composing}
					sendMessage={this.sendMessage}
				/>

				<MessageList
					starToggler={this.updateStarred}
					messages={this.state.messages}
					toggleMessageSelected={this.toggleMessageSelected}
				/>
			</div>
		);
	}
}

export default App;
