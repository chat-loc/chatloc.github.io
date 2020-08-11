import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router";

import axios from 'axios';

/* Helps retrieve data from URL*/
import queryString from 'query-string';

// Import Header 
import Header from '../Header/Header';

// Import css
import './Chatroom.css';

// Images
import moon from '../../images/moon.svg';
import sun from '../../images/sun.svg';

const Chatroom = ({location}) => {

    const [chatData, setChatData] = useState();

    // SERVER 
    const [resUserDetails, setResUserDetails] = useState([]);

    useEffect(() => {

        let ChatData = localStorage.getItem("chat-loc");
        ChatData = JSON.parse(ChatData);

        let userDetails = ChatData.resUserDetails[0];
        setResUserDetails(userDetails);

        console.log(resUserDetails);

    }, []);

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


    return (

        <>

        <header className="page-header-chat">     
            <h1>Welcome to {resUserDetails.districtLoc} room</h1>
            <a class="index-link" href="/"><span class="fa fa-home"></span></a>
        </header>

        <section id="chat-pane" className="chat-pane">

            <ol id="messages" className="messages">
                <ol id="old-messages" className="old messages">
                
                </ol>
            </ol>

            <form id="sendMsg" className="sendMsg">
                <input type="text" className="msgTextbox" id="txt" autoComplete="off" placeholder="Type message..." name="txt" autoFocus/>
                <input type="hidden" name="userRoom" id="userName" value=""/>    
                <input type="hidden" name="userRoom" id="userRoom" value=""/>    
                <input type="submit" name="" id="Send" value="Send" className="button-send-message"/>
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