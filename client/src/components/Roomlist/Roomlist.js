import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router";

import axios from 'axios';

/* Helps retrieve data from URL*/
import queryString from 'query-string';

// Import Header 
import Header from '../Header/Header';

// Import css
import './Roomlist.css';


const roomlist = () => {

      // Header text
      const HeaderTxt = () => {
          const html = <div className="header-inner">
                            <h1>Join Logged In Users Now</h1>
                            <a className="index-link" href="/"><span className="fa fa-home"></span></a>
                      </div>
            return html;

      }

      return (

            <>

            <Header headerTxt={HeaderTxt()} /> 

            <main className="roomlist-area">

                  <div id="map" className="map-canvas"></div>

                  <section className="roomlist">

                        <section className="rooms">
                              <a id="districtLink" className="room-btn btn" href=""> chatroom</a>
                              <hr/>
                              <a id="chatroomLink" className="room-btn btn" href=""> chatroom</a>
                        </section>

                        <section className="joined">

                              <section className="origin">
                                    <h2>Users from <span></span></h2>

                                    <ul className="same-origin">
                                          <li>
                                                <b className="origin-name"></b>
                                                <span className="current-loc">
                                                      <em>Currently at</em>: 
                                                      <span className="origin-road"></span>
                                                </span>
                                          </li>
                                    </ul>
                              </section>

                              <section className="district">
                                    <h2>Users at <span></span></h2>

                                    <ul className="same-origin">
                                          <li>
                                                <b className="district-name"> () </b>
                                                <span className="current-loc">
                                                      <em>Currently at</em>: 
                                                      <span className="district-road"></span>
                                                </span>
                                          </li>
                                    </ul>
                              </section>

                        </section>

                  </section>

            </main>

            </>

      )

}

export default roomlist;
