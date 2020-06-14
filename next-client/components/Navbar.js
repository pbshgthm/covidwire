import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Link from "next/link";

import {useRouter} from "next/router"

function Navbar(){

	let navLinks=['home','hope','sections','support','about'];
	let location=useRouter();
	const [navSel,setNavSel]=useState('');

	useEffect(()=>{
		const path=location.pathname.split('/')[1];
		console.log(path)
		setNavSel(path)
	},[location])


	return(
		<div className="Navbar">
			{navLinks.map(x=>(
				<Link key={"nav-"+x} href={"/"+x}>
					<img alt={"Nav-"+x} src={"/assets/"+x+"-nav.png"} className={classNames("NavbarIcons",{"NavbarIcons-Sel":navSel===x})}/>
				</Link>
			))}
		</div>
	)
}

export default Navbar;
