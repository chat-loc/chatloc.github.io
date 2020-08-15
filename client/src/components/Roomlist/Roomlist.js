import React, { useState, useEffect } from 'react';

// Import Header 
import Header from '../Header/Header';

// Import css
import './Roomlist.css';
import '../../styles/header.css';
import '../../styles/header.responsive.css';
import './Roomlist.responsive.css'

// Import images
import ontario from '../../images/toronto.png';


const Roomlist = ({location}) => {

    // CHAT DATA
    const [chatParams, setChatParams] = useState(false);
    const [resUserDetails, setResUserDetails] = useState([]);     // [{ districtLoc: "etobicoke-north", name: "luigi", sex: "male", origin: "italy"}]
    const [resFilteredOrigin, setResFilteredOrigin] = useState([]);     // [{id:0303, name: "anna", origin: "italy"} ... 9 more rows]
    const [resFilteredDistrict, setResfilteredDistrict] = useState([]); // [{id:0303, name: "maiken", origin: "georgia"} ... 9 more rows]

    const [userDistrict, setUserDistrict] = useState('');
    const [userOrigin, setUserOrigin] = useState('');

    const [loginID, setLoginID] = useState('');


    useEffect (() => {

        let queryID = window.location.search;
        let params = new URLSearchParams(queryID);
        
        queryID = params.get('id');

        setLoginID(queryID);


        let chatLoc = "";   // will hold all chatLoc details

        chatLoc = localStorage.getItem(queryID);
        chatLoc = JSON.parse(chatLoc);

        console.log(chatLoc);

        setResUserDetails(chatLoc.resUserDetails[0]);
        setResFilteredOrigin(chatLoc.resFilteredOrigin[0]);
        setResfilteredDistrict(chatLoc.resFilteredDistrict[0]);

        setChatParams(true);

        setUserDistrict(chatLoc.resUserDetails[0].districtLoc);
        setUserOrigin(chatLoc.resUserDetails[0].origin);

        console.log(chatLoc);
        console.log (resUserDetails);

    },[chatParams, loginID]);    // Using objects may set off infinite loop here

      // Header text
    const HeaderTxt = () => {
        const html = <div className="header-inner">
                         <h1>Join Logged In Users Now</h1>
                         <a className="index-link" href="/"><span className="fa fa-home"></span></a>
                     </div>
        return html;

    }

    const capitalise = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
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
                    <a id="districtLink" className="room-btn btn" href={`chatroom?id=${loginID}&room=${userDistrict}-district-room`}>
                          {upperCaseSomeSpaces(userDistrict)} chatroom</a>
                          <hr/>
                    <a id="chatroomLink" className="room-btn btn" href={`chatroom?id=${loginID}&room=${userOrigin}-origin-room`}>
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
