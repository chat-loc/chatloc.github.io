import React from 'react';

const Message = ({messages, you}) => {

	// [ {message: "Dont try this at home", name: "anna" }

	let isSentByCurrentUser;
	const {message, name} = messages;

	/*console.log(message);
	console.log(name);
	console.log(you);*/	

	isSentByCurrentUser = (name === you) ? true : false;

	return (
	    isSentByCurrentUser
	    	? (
			      <div className="msg">
			          <span className="user">{name}: </span> {message}
			      </div>
			  )
			  :
			  (
			      <div className="other-msg">
			         <span className="user">{name}: </span> {message}
			      </div>
			  )
	);

}

export default Message;