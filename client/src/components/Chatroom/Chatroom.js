import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Moment from 'react-moment';
import ScrollToBottom from 'react-scroll-to-bottom';

// Import css
import './Chatroom.css';
import '../../styles/header.css';
import '../../styles/header.responsive.css';
import './Chatroom.responsive.css';

// Images
import moon from '../../images/moon.svg';
import sun from '../../images/sun.svg';

let socket;

const Chatroom = ({location}) => {

    const [room, setRoom] = useState('');
    const [name, setName] = useState('');

    const [socketJustConnectedMsg, setSocketJustConnectedMsg] = useState(false);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [chatData, setChatData] = useState('');
    const [loadedChats, setLoadedChats] = useState([]);

    const [light, setLight] = useState('');
    const [modeImage, setModeImage] = useState(moon);   // Start out with moon as image
    const [typing, setTyping] = useState([]);  


    // SERVER 
    const [resUserDetails, setResUserDetails] = useState([]);

    const ENDPOINT = "localhost:5003";  // Put your heroku website link if deployed. This is the PORT no (endpoint) of the index.js file in "server" dir

    const [loginID, setLoginID] = useState('');


    // Determine if chatroom is for district or origin
    const capitalise = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }


    useEffect(() => {

        let queryID = window.location.search;
        let params = new URLSearchParams(queryID);
        
        queryID = params.get('id');

        // console.log("QUERY ID : ", queryID);

        setLoginID(queryID);

        // console.log(queryID);

        // 1. Fetch user details from local storage (which has been fetched from DB and stored in login / reg page)
        let ChatData = localStorage.getItem(queryID);
        ChatData = JSON.parse(ChatData);

        // console.log("CHATDATA : ", ChatData);

        let userDetails = ChatData.resUserDetails[0];
        setResUserDetails(userDetails);

        // console.log("USER DETAILS : ", userDetails);

        let page;
        let loc = params.get('room'); // etobicoke-north-district-room
        let districtLoc = new RegExp(/[A-Za-z-.]+-district-room$/); // regex for district room

        // 2. Determine the room
        page = (districtLoc.test(loc)) ? 'districtLoc' : 'origin' ;
        // console.log(page);

        let name = userDetails.name;
        let room = "";

        if (page == "districtLoc") {
            room = userDetails.districtLoc;
            setRoom(room);  
        } else {
            room = userDetails.origin;
            setRoom(room);
        }

        setName(name);

        // console.log(name);
        // console.log(userDetails);
        // console.log("ROOM AND NAME TO BE PASSED TO SOCKET : ", name, room);


        // SOCKET 

        // This is the PORT no (endpoint) of the index.js file in "server" dir
        socket = io(ENDPOINT);  

        // 4. When user joins, emit message
        socket.emit('join', { name, room });

        return () => {  /*VERY IMPORTANT. SERVER SOCKET WILL NOT RESPOND WITHOUT THIS*/
            socket.emit('disconnect');  /*Thus the ideal event for disconnecting*/
            socket.off();
        }

    }, [ENDPOINT, location.search]); // On load event set the data (meaning of empty brackets)


    useEffect(() => {
        
        //  3a. When page loads, fetch old chats from DB. Socket.io is not an ideal because user first has to emit
        // Old chats are needed right away; thus axios is the solution 

        /*[ { dateCreated: 2020-08-12T06:50:32.969Z,
            _id: 5f33991968a20d423c818989,
            msg: 'test this',
            room: 'etobicoke-north',
            name: 'andrea',
            __v: 0 },
            ...
        ]*/

        axios.post("http://localhost:5003/user/chatroom", {
            params : {
                room
            }
        })
        .then(response => {
            // console.log(response.data);``
            if (response.data) {
                setLoadedChats (response.data);  // Load all chats
            }

        });
    },[room])

    // 3b. Load chats 
    const loadChats = () => {

        let msg;

        const chatMsg = loadedChats.map((message, i) => {

            msg = (name === message.name) ? "msg" : "other-msg"; 

            return (
                <li key={i}>
                    <div className={msg}>
                        <span className="user">{message.name} : </span>{message.msg} 
                        <Moment className="chat-stamp" format="LLL">
                            {message.dateCreated}
                        </Moment>
                    </div>
                </li>
            )
        })

        return chatMsg;
    }

    useEffect(() => {

        // 5. Coming back from server: 'user-connected' is an exposed function coming from BROADCAST.EMIT in server.
        // Thus, when user makes connection, display a welcome message to the others

        socket.once("user-connected", (data) => { // this message is local to this response and not the state message

            // alert("User Connected");

            // console.log("DATA FROM 'user-connected' RESPONSE : ", data);  // name: kodesektor, connected: connected

            const {name, connected} = data;
            setSocketJustConnectedMsg(`${name} just ${connected}`);
            // console.log(messages);

        }); 

        socket.once("user-disconnected", name => {
            // alert(name);
            setTyping([]);  // remove 'is-typing' on disconnect
            setSocketJustConnectedMsg(`${name} just disconnected`);
        });

        /* 6. Response from server after user sends a message: Add the chat to the 'messages' state array*/
        // message: {user: users.name, text: message}

        socket.once('sendMessage', (data) => {
            // {message: message, timestamp: 2020-08-14T01:28:24.913Z, dateTime: 2020-08-14T03:37:53.389+00:00, name: name}
            // console.log("DATA FROM 'sendMessage' RESPONSE : ", data);   

            // Chat sound for only user

            let chatname = (data.name);

           /* if (name && chatname) {
                if (name != chatname) {    // Notify if other users send chat
                    const chatSound = new Audio ("/sounds/swiftly.mp3");    // keep sound in public folder to work
                    chatSound.play();
                }
            }*/

            setMessages([...messages, data]);  // Add new chat to existing current chats
        });

        // console.log(messages);  // [ {message: "Dont try this at home", name: "anna" }]


        // 10b. 'Typing...' response from socket
        socket.once("typing", (data) => {
            // { user: "sofia", msg: "some text" }
            setTyping(data);  // Add new chat to existing current chats

        });

    }, [message, typing]);


    // 7. When user types and submits, pass message to socket to be stored in DB
    const sendMessage = (event) => {

        event.preventDefault();

        if (message) {

            const userDetails =  {
                message,
                room,
                name
            };

            /*Emit message stored in 'message' state (from onchange event on the input) 
            to socket*/
            socket.emit('message', userDetails);    // will respond 'sendMessage'

            setMessage(''); // clear state that holds message; in other words, clear textbox
           
        }
    }


    // 8. When user hits a message, the 'message' state changes which refreshes this component 
    // thus the current chats (saved in 'messages' array, get called)

    const displayChats = () => {

        let msg;

        const chatMsg = messages.map((message, i) => {

            msg = (name === message.name) ? "msg" : "other-msg"; 

            return (
                <li key={i}>
                    <div className={msg}>
                        <span className="user">{message.name} : </span>{message.msg} 
                        <time className='chat-stamp' dateTime={message.dateTime}>{message.timestamp}</time>
                    </div>
                </li>
            )
        })

        return chatMsg;
    }


    // 9. Light / dark settings 

    const mode = (e) => {
        e.preventDefault();
        
        (light === 'darkmode') ? setModeImage(moon) : setModeImage(sun);   // toggle image
        (light === 'darkmode') ? setLight('') : setLight('darkmode');   // toggle darkmode
    }


    // 10a. Typing logic

    const type = e => {
        let msg = e.target.value;
        if (e.which !== 13) {    // Listen to keyup except 'Enter'
            socket.emit('typing', {user:name, msg});
        } 
    } 


    // 10c. Display the 'whoever is typing' message

    const isTyping = () => {

        // typing state { user: "sofia", msg: "some text" }

        // console.log(typing);

        if (typing.user) {

            let user = typing.user;
            user = user.charAt(0).toUpperCase() + user.slice(1);

            return (
                <b className="is-typing">
                    <span><span className="other-user">{user}</span> is typing ...</span>
                </b>
            )

        }

    }


    return (

        <>

        <section className={`chatwrap ${light}`}>

            <header className="page-header-chat">     
                <h1>Welcome to {room} room</h1>
                <a className="index-link" href="/"><span className="fa fa-home"></span></a>
                {socketJustConnectedMsg ?
                    <span className="just-connected">{socketJustConnectedMsg}</span>
                    : ''}
            </header>

            <section className="light-setting">
                <button className={`light ${light}`} onClick={e => mode(e)}>
                    <img src={modeImage} alt={modeImage}className="mode-image"/>
                </button>
            </section>

            <section id="chat-pane" className={`chat-pane ${light}`}>
                <ScrollToBottom className="messages">
                    <ol id="old-messages" className="old messages">{loadChats()}</ol>
                    <ol>{displayChats()}</ol>
                </ScrollToBottom>
                {isTyping()}

                <form id="sendMsg" className="sendMsg">
                    <input type="text" className="msgTextbox" id="txt" autoComplete="off" placeholder="Type message..." name="txt" autoFocus    
                        value={message}
                        onChange={({ target: { value } }) => setMessage(value)}
                        onKeyUp={(event) => type(event)}
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}/>
   
                    <input type="submit" name="" id="Send" value="Send" className="button-send-message"
                        onClick={e => sendMessage(e)}/>
                </form>

            </section>

        </section>

        </>

    )

}

export default Chatroom;