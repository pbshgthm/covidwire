'use client';

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

function Navbar(){
	let navLinks=['home','hope','sections','blog','about'];
	let pathname = usePathname();
	const [navSel,setNavSel]=useState('');

	useEffect(()=>{
		const path = pathname.split('/')[1] || 'home';
		setNavSel(path);
	},[pathname])

	return(
		<div className="Navbar">
			{navLinks.map(x=>(
				<Link className="NavbarButtons" key={"nav-"+x} href={"/"+x}>
					<img alt={"Nav-"+x} src={`/assets/${x}-nav.png`} className={classNames("NavbarIcons",{"NavbarIcons-Sel":navSel===x})}/>
				</Link>
			))}
		</div>
	)
}

export default Navbar;
