import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useHistory } from "react-router";

import axios from 'axios';

/* Helps retrieve data from URL*/
import queryString from 'query-string';

// Import Header 
import Header from '../Header/Header';

// Import css
import './Roomlist.css';

// Import images
import ontario from '../../images/toronto.png';



const Roomlist = ({location}) => {

    const ENDPOINT = "localhost:3000";  // Put your heroku website link if deployed. This is the PORT no (endpoint) of the index.js file in "server" dir
    let chatLoc = "";   // will hold all chatLoc details
    let result = "";

    // CHAT DATA
    const [chatParams, setChatParams] = useState(false);
    const [resUserDetails, setResUserDetails] = useState([]);     // [{ districtLoc: "etobicoke-north", name: "luigi", sex: "male", origin: "italy"}]
    const [resFilteredOrigin, setResFilteredOrigin] = useState([]);     // [{id:0303, name: "anna", origin: "italy"} ... 9 more rows]
    const [resFilteredDistrict, setResfilteredDistrict] = useState([]); // [{id:0303, name: "maiken", origin: "georgia"} ... 9 more rows]

    const [userDistrict, setUserDistrict] = useState('');
    const [userName, setUserName] = useState('');
    const [userOrigin, setUserOrigin] = useState('');
    const [userSex, setUserSex] = useState('');


    useEffect (() => {
        chatLoc = localStorage.getItem("chat-loc");
        chatLoc = JSON.parse(chatLoc);

        console.log(chatLoc);

        setResUserDetails(chatLoc.resUserDetails[0]);
        setResFilteredOrigin(chatLoc.resFilteredOrigin[0]);
        setResfilteredDistrict(chatLoc.resFilteredDistrict[0]);

        setChatParams(true);

        setUserDistrict(chatLoc.resUserDetails[0].districtLoc);
        setUserName(chatLoc.resUserDetails[0].name);
        setUserOrigin(chatLoc.resUserDetails[0].origin);
        setUserSex(chatLoc.resUserDetails[0].sex);

        console.log(chatLoc);
        console.log (resUserDetails);

    },[chatParams]);    // Using objects may set off infinite loop here

      // Header text
    const HeaderTxt = () => {
        const html = <div className="header-inner">
                         <h1>Join Logged In Users Now</h1>
                         <Link className="index-link" href="/"><span className="fa fa-home"></span></Link>
                     </div>
        return html;

    }

    const capitalise = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    const lowerCaseNoSpaces = (input) => {
      return ((input).toLowerCase()).replace(" ", "-");
    }

    const upperCaseSomeSpaces = (input) => {
        let val = (input).split('-');
        val.forEach((elm, index, theArray)=> {
            theArray[index] = capitalise(elm);
        });
        return val.join(" ");
    }


    return (

        <>

        <Header headerTxt={HeaderTxt()} /> 

        <main className="roomlist-area">

            <div id="map" className="map-canvas">
                <img src={ontario} alt="Ontario" />
            </div>

            <section className="roomlist">

                <section className="rooms">
                    <a id="districtLink" className="room-btn btn" href={`${userDistrict}-district-room`}>
                          {upperCaseSomeSpaces(userDistrict)} chatroom</a>
                          <hr/>
                    <a id="chatroomLink" className="room-btn btn" href={`${userOrigin}-origin-room`}>
                          {upperCaseSomeSpaces(userOrigin)} chatroom
                    </a>
                </section>

                <section className="joined">

                    <section className="origin">
                        <h2>Users from <span></span>{userOrigin}</h2>
                            <ul className="same-origin">
                            {console.log(resFilteredOrigin)}
                                {resFilteredOrigin.map((origin, i) => 
                                    <li key={i}>
                                        <b className="origin-name">{origin.name} ({origin.sex})</b>
                                        <span className="current-loc">
                                            <em>Currently at</em> :  
                                            <span className="origin-road"> {origin.roadLoc}</span>
                                        </span>
                                    </li>
                                )}
                            </ul>
                    </section>

                    <section className="district">
                        <h2>Users at <span>{userDistrict}</span></h2>

                        <ul className="same-origin">
                            {resFilteredDistrict.map((district, i) => 
                                <li key={i}>
                                      <b className="district-name">{district.name} ({district.sex}) </b>
                                      <span className="current-loc">
                                      <em>Currently at</em> :  
                                      <span className="district-road"> {district.roadLoc}</span>
                                      </span>
                                </li>
                            )}
                        </ul>
                    </section>

                </section>

            </section>

        </main>

        </>

    )

}

export default Roomlist;