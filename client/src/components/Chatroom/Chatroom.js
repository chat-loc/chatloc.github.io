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

    const [district, setDistrict] = useState('');
    const [chatData, setChatData] = useState('');

    // SERVER 
    const [resUserDetails, setResUserDetails] = useState([]);

    useEffect(() => {

        let ChatData = localStorage.getItem("chat-loc");
        ChatData = JSON.parse(ChatData);

        let userDetails = ChatData.resUserDetails[0];
        setResUserDetails(userDetails);

        let page;
        let loc = window.location.pathname; // etobicoke-north-district-room
        let districtLoc = new RegExp(/[A-Za-z-.]+-district-room$/); // regex for district room

        page = (districtLoc.test(loc)) ? 'districtLoc' : 'origin' ;
        console.log(page);

        if (page == "districtLoc") {
            setDistrict(userDetails.districtLoc);  
        } else {
            setDistrict(userDetails.origin);
        }
        console.log(resUserDetails);
        console.log(district);

    }, [district, chatData]); // On load event set the data (meaning of empty brackets)

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


    return (

        <>

        <header className="page-header-chat">     
            <h1>Welcome to {district} room</h1>
            <a className="index-link" href="/"><span className="fa fa-home"></span></a>
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