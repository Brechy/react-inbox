import React, { Component } from 'react';
import './App.css';
import Toolbar from './components/Toolbar';
import MessageList from './components/MessageList';
import ComposeForm from './components/ComposeForm';

const propForCommand = {
	'addLabel': 'label',
	'removeLabel': 'label',
	'read': 'read',
	'star': 'starred'
}

const inThatEveryoneWants = (e, l) => l.filter(x => x === e).length > 0

const sanitizeMessages = (messages) => {
	return messages.map(({id, body, labels, read, starred, subject}) => ({
		id,
		body: `${body}`,
		labels: (l => { if (l === undefined) {return []} return l})(labels),
		read: !!read,
		starred: !!starred,
		selected: false,
		expanded: false,
		subject: `${subject}`
	}))
}

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
		this.snapshotTransientSetState({ messages });
	};

	snapshotTransientSetState = (state) => {
		const snapshot = this.snapshotTransient();
		console.log("previously selected", snapshot);
		this.setState(state);
		this.restoreTransient(snapshot);
	}
	snapshotTransient = () => ({
		selected: this.state.messages.filter(({selected}) => selected).map(({id}) => id),
		expanded: this.state.messages.filter(({expanded}) => expanded).map(({id}) => id),
	})
	restoreTransient = (snapshot) => {
		this.setState({
			messages: this.state.messages.map(m => Object.assign(m, {
				selected: inThatEveryoneWants(m.id, snapshot.selected),
				expanded: inThatEveryoneWants(m.id, snapshot.expanded),
			}))
		})
	}

	//post new message to collective API
	sendMessage = async ({subject, body}) => {
		const response = await fetch('http://localhost:8082/api/messages', {
			method: 'POST',
			headers: {
				Accept: 'appication/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subject,
				body,

			})
		});
		this.setState({composing: false});
		return this.getDataFromAPI();
	};

	selectedMessage = message => {
		message.selected = !message.selected;
		this.setState(this.state.messages.concat(message));
	};


        changePropertyForMessageIds = async (messages, command, state) => {
		let postData = {
			command: command,
			messageIds: messages
		};
		postData[propForCommand[command]] = state;
		const messagesJson = await fetch('http://localhost:8082/api/messages', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(postData)
		});
		let rmessages = await messagesJson.json();
		console.log('Came back from the patch and parsed json and got: ', rmessages);
		this.snapshotTransientSetState({ messages: sanitizeMessages(rmessages) });
        }
	changePropertyForSelected = async (command, state) => this.changePropertyForMessageIds(this.state.messages.filter(m => !!m.selected).map(m => m.id), command, state)

	markAsStarred = async () => this.changePropertyForSelected('star', true)
	markAsUnstarred = async () => this.changePropertyForSelected('star', false)
	toggleStarred = async (message) => this.changePropertyForMessageIds([message], 'star', !message.starred)
	markAsRead = async () => this.changePropertyForSelected('read', true);
	markMessageAsRead = async (msg) => this.changePropertyForMessageIds([msg.id], 'read', true);
	markAsUnread = async () => this.changePropertyForSelected('read', false);
	applyLabel = async (label) => this.changePropertyForSelected('addLabel', label);
	removeLabel = async (label) => this.changePropertyForSelected('removeLabel', label);

	deleteMessages = async () => this.changePropertyForSelected('delete', null)

	toggleExpanded = (message) => {
                console.log("toggle expanded", message.id)
		const expanded = this.state.messages.filter(({expanded}) => expanded).map(({id}) => id)
console.log(expanded);
		let convert = (m) => {
			let expandme = m.id === message.id;
			return Object.assign(m, {expanded: expandme})
		}
		if (expanded.length > 0 && expanded[0] === message.id) {
			console.log("convert will be always false")
			convert = m => Object.assign(m, {expanded: false})
		}
		this.setState({messages: this.state.messages.map(convert)})
	}

	// if message is starred, change state of star from empty to
	//toggleStarred = msgid => {
	//	let newMessages = [];
	//	for (let i = 0; i < this.state.messages.length; i++) {
	//		let msg = this.state.messages[i];
	//		if (msg.id === msgid) {
	//			msg.starred = !msg.starred;
	//		}
	//		newMessages.push(msg);
	//	}
	//	this.setState({ messages: newMessages });
	//};

	//updateStarred = async message => {
	//	const messagesJSON = await fetch('http://localhost:8082/api/messages', {
	//		method: 'PATCH',
	//		body: JSON.stringify({
	//			messageIds: [message.id],
	//			command: 'star',
	//			star: message.starred
	//		}),
	//		headers: {
	//			'Content-Type': 'application/json',
	//			Accept: 'application/json'
	//		}
	//	});
	//	this.toggleProperty(message, 'starred');
	//};

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

		let setSelected = true;
		if (messagesSelected === this.state.messages.length) {
			setSelected = false;
		}

		this.setState({messages: this.state.messages.map(m => Object.assign(m, {selected: setSelected}))})
	};

	render() {
		return (
			<div className="App">
				<Toolbar
					starred={this.toggleStarred}
					toggleCompose={this.toggleCompose}
					markAsRead={this.markAsRead}
					markAsUnread={this.markAsUnread}
					toggleSelectAllIcon={this.toggleSelectAllIcon}
					selectAll={this.selectAll}
					applyLabel={this.applyLabel}
					deleteMessages={this.deleteMessages}
					removeLabel={this.removeLabel}
					messages={this.state.messages}
				/>

				<ComposeForm
					composing={this.state.composing}
					sendMessage={this.sendMessage}
				/>

				<MessageList
					starToggler={this.toggleStarred}
					messages={this.state.messages}
					toggleExpanded={this.toggleExpanded}
					markAsRead={this.markMessageAsRead}
					toggleMessageSelected={this.toggleMessageSelected}
				/>
			</div>
		);
	}
}

export default App;
