import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({headerTxt}) => (
	<header className="page-header">        
        {headerTxt}
	</header>
)

export default Header;