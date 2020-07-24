
// First connect to socket
const socket = io.connect('/tech');

let localChatDB = {
	"north-etobicoke-room" : []
};

let humanisedTime = '';

// Get reference to form and message list
const $msgForm = document.getElementById('sendMsg');
const $msgList = document.getElementById('messages'); 
let $textbox = document.getElementById('txt');


// Get username and room of the user in hidden input coming 
// through sessions
const name = (document.getElementById('userName')).value;
const room = (document.getElementById('userRoom')).value;



console.log (name, room);

const timeHumanise = () => {
	let date = new Date();	// get date now
	let day = date.getDate();	// get day

	let hr = date.getHours();	// hours
	let min = date.getMinutes();	// mins
	let sec = date.getSeconds();	// secs 

	let AMPM = (hr >= 12) ? 'PM' : 'AM';

	// Prefix with '0' if second is less than 10
	(sec) = (sec.toString().length == '1') ? ('0' + sec) : sec;
	(min) = (min.toString().length == '1') ? ('0' + min) : min;
	return `<time class='chat-stamp' datetime='${hr}-${min}-${sec}'>${hr}:${min}:${sec} ${AMPM}</time>`;
}

const sanitiseHTML = function (str) {
	let temp = document.createElement('div');	// create new div
	temp.textContent = str;	// populate with string using safe 'textContent' JS set property
	return temp.innerHTML;	// return stripped HTML
};

const meVsThey = (othername) => {
	return (name == othername) ? true : false;
}

const triggerScroll = () => {
	const $chatPane = $msgList;
	$chatPane.scrollTop = $chatPane.scrollHeight;
}

// PRINT '<USER> HAS CONNECTED' TO OTHER USERS
const logged = ({msgList, state, name}) => {
	// Check if it is 'connected' or 'disconnected' event that was fired
	let connected = (state === 'online') ? 'connected' : 'disconnected';

	const newMsg = document.createElement('li');	// create new li to append
	newMsg.classList.add('joined');	// style
	msgList.appendChild(newMsg);	// append HTML 
	// Display logged message
	newMsg.innerHTML= `<span><span class="other-user">${name.toUpperCase()}</span> has ${connected}</span>`;	
}


const loadChatHTML = (chat, msgList, notme) => {

	const newMsg = document.createElement('li');	// create li tag

	msgList.appendChild(newMsg);	// append message
	// append in human readable format
	// let $msgHTML = `<span class="user">${msgName}: </span>  ${msg.message} - ${timeHumanise()}`;
	let $msgHTML = chat;
	newMsg.innerHTML = $msgHTML;

	if (notme) {
		// newMsg.querySelector('div').classList.add('msg');
		const newmsg = newMsg.querySelectorAll('.msg');
		const newothermsg = newMsg.querySelectorAll('.other-msg');

		for (let i = 0; i < newmsg.length; i++) {   
			newmsg[i].classList.remove('msg');
		    newmsg[i].classList.add('other-msg');
		        
		};
		for (let i = 0; i < newothermsg.length; i++) {    
		    newothermsg[i].classList.add('msg');		        
		};
	} 

	console.log(localChatDB);

}


const connect = (name, chatRoom) => {	// called from connect.js

	const room = chatRoom;

	const $msgForm = document.getElementById('sendMsg');
	const $msgList = document.getElementById('messages'); 

	// 1a. First thing is to send a 'join' transmitting event to server. This is 
	// done on load event (and precedes the logic for the form submit event) for 
	// the sole reason to announce presence in the room to other users

	// Moniker and room are the most important details when connecting
	// Send details to server first,
	socket.emit('join', {name, room});

	// 1b. Coming back from server: 'user-connected' an exposed function coming from BROADCAST.EMIT in server.
	// Thus, when user makes connection, display a welcome message to the others
	socket.on('user-connected', data => {
		logged({
			'msgList' : $msgList,
			'state' : 'online',
			'name' : data.name
		});
	});

	// 1c. When user disconnects, inform other users
	socket.on('user-disconnected', data => {
		logged({
			'msgList' : $msgList,
			'state' : 'offline',
			'name' : data.name
		});
	});

	// 2a. After displaying message in the previous step, the next is to load the 
	// chats from the DB
	socket.on('load-chats', (data) => {

		let notme = (meVsThey(data.otherName));	// personal styling

		if ((data.chats) != undefined) {
			localChatDB = data;	// Store the chat Array locally on connection

			(data.chats[room]).forEach( (chat, indx) => {

				loadChatHTML(chat['$msgHTMLDB'], $msgList, notme);

				if (indx == ((data.chats).length) - 1) {
					triggerScroll();	// Scroll to the end on last iteration
				}
			});
		}
	});


};

//1. Send 'Welcome Message to others on load of page', load chats for user
connect(name, room);


// 2a Listen to submission of chat and then emit message in room (everyone inc. you)
$msgForm.addEventListener('submit', (e) => { 
	e.preventDefault();	// prevent default action

	// neutralise XSS attack and eliminate unnecessary whitespace
	let chatMsg = sanitiseHTML(($textbox.value).trim());	

	// 2b. On 'emit message' (which happens when user submits form), save details in object
	// then pass as props to server to distinguish you vs them

	const userDetails =  {
		chatMsg,
		room,
		/*humanisedTime*/
	};

	// socket.emit('message', {chatMsg, room});	
	socket.emit('message', {...userDetails});	

	$textbox.value = '';	// clear textbox

	let isTyping = document.querySelector('.is-typing');
	/*if (isTyping !== null) {
		isTyping.remove();	// remove any notorious lingering '.is-typing'
	}*/

});

// 2c. Catch the exposed data from server response from 2b. event
// (i.e. submission of the form)

socket.on('message', (data) => {
	// Compare if the username emitted is the same as that which was collected
	// from user input in dialogue modal form

	let my = (meVsThey(data.otherName)) ? '' : 'other-';  // create new class for others
	let msgName = (meVsThey(data.otherName)) ? 'You' : data.otherName;

	const msgClass = (`${my}msg`); // li class
	
	let msgHTML = `<span class="user">${msgName}: </span>  ${data.message} - ${timeHumanise()}`;
	let $msgHTMLDB = `<div class='${msgClass}'>${msgHTML}</div>`;

	// 2d. Populate chats for every page submission. (Nothing to do with server for now)
	loadChatHTML($msgHTMLDB, $msgList);	// Populate page with chats
	triggerScroll();

	console.log(room);
	// First save chat to local DB (as per the assignment requirement)
	// localChatDB["chats"][room].push({$msgHTMLDB});

	// Now save to server database 
	// socket.emit('save-chat', {localChatDB});

});

