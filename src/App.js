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

	render() {
		return (
			<div className="App">
				<Toolbar
					toggleCompose={this.toggleCompose}
					markAsRead={this.markAsRead}
					markAsUnread={this.markAsUnread}
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
