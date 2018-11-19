/* eslint-disable no-unused-vars */
import React from 'react';

const ComposeForm = (props) => {

	const submitMessage = (event) => {
		event.preventDefault();
		const subject = document.querySelector("#subject").value;
		const body = document.querySelector("#body").value;
		props.sendMessage({
			subject,
			body
		});
		document.querySelector("#subject").value = "";
		document.querySelector("#body").value = "";
	};
	return (
		<form className={`form-horizontal well ${props.composing ? '' : 'hidden'}`} onSubmit={submitMessage}>
			<div className="form-group">
				<div className="col-sm-8 col-sm-offset-2">
					<h4>Compose Message</h4>
				</div>
			</div>
			<div className="form-group">
				<label htmlFor="subject" className="col-sm-2 control-label">Subject</label>
				<div className="col-sm-8">
					<input type="text" className="form-control" id="subject" placeholder="Enter a subject" name="subject">
					</input>
				</div>
			</div>
			<div className="form-group">
				<label htmlFor="body" className="col-sm-2 control-label">Body</label>
				<div className="col-sm-8">
					<textarea name="body" id="body" className="form-control"></textarea>
				</div>
			</div>
			<div className="form-group">
				<div className="col-sm-8 col-sm-offset-2">
					<button className="btn btn-primary" onClick={submitMessage}>Send</button>
				</div>
			</div>
		</form>
	);
};
export default ComposeForm;
