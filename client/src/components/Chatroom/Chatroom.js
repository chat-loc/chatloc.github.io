import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router";

import axios from 'axios';

/* Helps retrieve data from URL*/
import queryString from 'query-string';

// Import Header 
import Header from '../Header/Header';

// Import css
import '../form.css';

// Images
import torontoMap from '../../images/torontoMap.png';

const Chatroom = ({location}) => {

    useEffect(() => {

    });

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

        <header class="page-header">     
            <h1>Welcome to {{header}} room</h1>
            <a class="index-link" href="/"><span class="fa fa-home"></span></a>
        </header>

        <section id="chat-pane" class="chat-pane">

            <ol id="messages" class="messages">
                <ol id="old-messages" class="old messages">
                
                </ol>
            </ol>
            <!-- Form: Input field, send button, 
                     Messages: ordered list -->
            <form id="sendMsg" class="sendMsg">
                <input type="text" class="msgTextbox" id="txt" autocomplete="off" placeholder="Type message..." name="txt" autofocus>
                <input type="hidden" name="userRoom" id="userName" value="{{user}}">    {{!-- User name --}}
                <input type="hidden" name="userRoom" id="userRoom" value="{{room}}">    {{!-- Passed to server to fetch chats for particular room --}}
                <input type="submit" name="" id="Send" value="Send" class="button-send-message">
            </form>
        </section>

        <div>
            <p id="moon">
                <img src="/images/moon.svg" alt="" class="night-mode-image">
            </p>

            <p id="sun" class="hidden">
                <img src="/images/sun.svg" alt="" class="night-mode-image">
            </p>
        </div>

        </>

    )


}

export default Chatroom;