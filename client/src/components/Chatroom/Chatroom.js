import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';

import Messages from '../Messages/Messages';


// Import css
import './Chatroom.css';

// Images
import moon from '../../images/moon.svg';
import sun from '../../images/sun.svg';

let socket;

const Chatroom = ({location}) => {

    const [room, setRoom] = useState('');
    const [name, setName] = useState('');

    const [socketName, setSocketName] = useState('');
    const [socketConnected, setSocketConnected] = useState('');
    const [socketJustConnectedMsg, setSocketJustConnectedMsg] = useState(false);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [chatData, setChatData] = useState('');

    // SERVER 
    const [resUserDetails, setResUserDetails] = useState([]);

    const ENDPOINT = "localhost:5003";  // Put your heroku website link if deployed. This is the PORT no (endpoint) of the index.js file in "server" dir

    const [loginID, setLoginID] = useState('');


    // Determine if chatroom is for district or origin
    const capitalise = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // "etobicoke-north" => "Etobicoke North" (Used for the heading in the chatroom)
    const upperCaseSomeSpaces = (input) => {
        let val = (input).split('-');
        val.forEach((elm, index, theArray)=> {
            theArray[index] = capitalise(elm);
        });
        return val.join(" ");
    }


    useEffect(() => {

        let queryID = window.location.search;
        let params = new URLSearchParams(queryID);
        
        queryID = params.get('id');

        console.log("QUERY ID : ", queryID);

        setLoginID(queryID);

        // console.log(queryID);

        // 1. Fetch use details from local storage (which has been fetched from DB and stored in login / reg page)
        let ChatData = localStorage.getItem(queryID);
        ChatData = JSON.parse(ChatData);

        console.log("CHATDATA : ", ChatData);

        let userDetails = ChatData.resUserDetails[0];
        setResUserDetails(userDetails);

        console.log("USER DETAILS : ", userDetails);

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

        console.log(name);

        console.log(userDetails);
        console.log("ROOM AND NAME TO BE PASSED TO SOCKET : ", name, room);


        // SOCKET 

        // This is the PORT no (endpoint) of the index.js file in "server" dir
        socket = io(ENDPOINT);  

        // When user joins, emit message
        socket.emit('join', { name, room });

        return () => {  /*VERY IMPORTANT. SERVER SOCKET WILL NOT RESPOND WITHOUT THIS*/
            socket.emit('disconnect');  /*Thus the ideal event for disconnecting*/
            socket.off();
        }

    }, [ENDPOINT, location.search]); // On load event set the data (meaning of empty brackets)


    /*Response from server after user sends a message: Add the chat to the 'messages' state array*/
    // message: {user: users.name, text: message}
    useEffect(() => {

        // 1b. Coming back from server: 'user-connected' is an exposed function coming from BROADCAST.EMIT in server.
        // Thus, when user makes connection, display a welcome message to the others

        socket.on("user-connected", (data) => { // this message is local to this response and not the state message

            // alert("User Connected");

            console.log("DATA FROM 'user-connected' RESPONSE : ", data);  // name: kodesektor, connected: connected

            const {name, connected} = data;

            setSocketName(name);
            setSocketConnected(connected);
            setSocketJustConnectedMsg(`${name} just ${connected}`);
            console.log(messages);

        }); 

        socket.on('sendMessage', (data) => {
            console.log("DATA FROM 'sendMessage' RESPONSE : ", data);   // { message: "Don't try this at thome", name: "luigi" }

            setMessages([...messages, data]);  
        });
        console.log(messages);  // [ {message: "Dont try this at home", name: "anna" }]

    }, [message, messages]);



    // When user types and submits, pass in message
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
            socket.emit('message', userDetails);

            setMessage('');
            console.log(messages);
           
        }
    }


    return (

        <>

        <header className="page-header-chat">     
            <h1>Welcome to {room} room</h1>
            <a className="index-link" href="/"><span className="fa fa-home"></span></a>
            {socketJustConnectedMsg ?
                <span className="just-connected">{socketJustConnectedMsg}</span>
                : ''}
        </header>

        <section id="chat-pane" className="chat-pane">

            <ol id="messages" className="messages">
                <ol id="old-messages" className="old messages">
                </ol>
                <Messages messages={messages} name={name}/>
            </ol>

            <form id="sendMsg" className="sendMsg">
                <input type="text" className="msgTextbox" id="txt" autoComplete="off" placeholder="Type message..." name="txt" autoFocus    
                        value={message}
                        onChange={({ target: { value } }) => setMessage(value)}
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}/>

                <input type="hidden" name="userRoom" id="userName" value=""/>    
                <input type="hidden" name="userRoom" id="userRoom" value=""/>    
                <input type="submit" name="" id="Send" value="Send" className="button-send-message"
                        onClick={e => sendMessage(e)}/>
            </form>

        </section>

        <section className="light-setting">
            <p id="moon">
                <img src={moon} alt="night time chat" className="night-mode-image"/>
            </p>

            <p id="sun" className="hidden">
                <img src={sun} alt="day time chat" className="night-mode-image"/>
            </p>
        </section>

        </>

    )

}

export default Chatroom;