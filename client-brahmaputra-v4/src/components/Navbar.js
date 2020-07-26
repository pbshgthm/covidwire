import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link,useLocation } from "react-router-dom";

import './css/Components.css'

function Navbar(){
	let navLinks=['home','hope','sections','blog','about'];
	let location = useLocation();
	const [navSel,setNavSel]=useState('');

	useEffect(()=>{
		const path=location.pathname.split('/')[1];
		setNavSel(path)
	},[location])

	return(
		<div className="Navbar">
			{navLinks.map(x=>(
				<Link className="NavbarButtons" key={"nav-"+x} to={"/"+x}>
					<img alt={"Nav-"+x} src={require('../assets/'+x+'-nav.png')} className={classNames("NavbarIcons",{"NavbarIcons-Sel":navSel===x})}/>
				</Link>
			))}
		</div>
	)
}

export default Navbar;
