
let localChatDB = {
	"north-etobicoke-room" : []
};

let humanisedTime = '';

// Get reference to form and message list
const $msgForm = document.getElementById('sendMsg');
const $msgList = document.getElementById('messages'); 

// Get username and room of the user in hidden input coming 
// through sessions
const name = (document.getElementById('userName')).value;
const room = (document.getElementById('userRoom')).value;


console.log (name, room);


const connect = (name, chatRoom) => {	// called from connect.js

	const room = chatRoom;

	const $msgForm = document.getElementById('sendMsg');
	const $msgList = document.getElementById('messages'); 

	const socket = io.connect('/tech');

	// Moniker and room are the most important details when connecting
	socket.emit('join', {name, room});

	// When user makes connection, inform other users
	socket.on('user-connected', data => {
		logged({
			'msgList' : $msgList,
			'state' : 'online',
			'name' : data.name
		});
	});

	// When user disconnects, inform other users
	socket.on('user-disconnected', data => {
		logged({
			'msgList' : $msgList,
			'state' : 'offline',
			'name' : data.name
		});
	});
}

connect(name, room);

// Listen to submission of chat and then emit message in room (everyone inc. you)
/*$msgForm.addEventListener('submit', (e) => { 
	e.preventDefault();	// prevent default action

	// neutralise XSS attack and eliminate unnecessary whitespace
	let chatMsg = sanitiseHTML(($textbox.value).trim());	

	// On 'emit message' (which happens when user submits form), save details in object
	// then pass as props to server

	const userDetails =  {
		userMoniker,
		chatMsg,
		room,
		humanisedTime
	};

	// socket.emit('message', {chatMsg, room});	
	socket.emit('message', {...userDetails});	

	$textbox.value = '';	// clear textbox

	let isTyping = document.querySelector('.is-typing');
	if (isTyping !== null) {
		isTyping.remove();	// remove any notorious lingering '.is-typing'
	}

});
*/
