import React from 'react';

import Message from './Message/Message'

const Messages = ( {messages, name} ) => {

	console.log(messages);	// [{ message: "here we go again", name: "anna" }]
	console.log(name);	// anna
	
	return (
		<>
		{messages.map((message, i) => 
			<li key={i}>
				<Message messages={message} you={name} />
			</li>
		)}
		</>
	)
};

export default Messages;