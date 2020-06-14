import {useEffect,useState} from 'react'
import {urlEncode,scrollToTop} from '../components/utils.js'
import config from '../components/config.js'
import Link from 'next/link'




function SectionsPage(){

	function regCorr(x){
		let commonDict={
			"Global":"World",
			"National":"India"
		}
		return (x in commonDict)?commonDict[x]:x
	}

	useEffect(()=>{
		scrollToTop()
	},[])

	return(
		<div>
			<div className="PageTitle">Sections</div>
			<div className="SectionCategory">Domains</div>
			<div className="SectionImageHolder">
				{config.domain.map(x=>(
					<Link key={"section-"+x} href={"sections/"+urlEncode(x)}>
						<div className="SectionCard">
							<img className="SectionImage" src={"/assets/sections/"+x+".jpg"} alt={x}/>
							<div className="SectionName">{x}</div>
						</div>
					</Link>)
				)}
			</div>
			<div className="SectionCategory">Regions</div>
			<div className="SectionImageHolder">
				{config.region.map(x=>(
					<Link key={"section-"+regCorr(x)} href={"sections/"+urlEncode(regCorr(x))}>
						<div className="SectionCard">
							<img className="SectionImage" src={"assets/sections/"+regCorr(x)+".jpg"} alt={regCorr(x)}/>
							<div className="SectionName">{regCorr(x)}</div>
						</div>
					</Link>)
				)}
			</div>
			<div className="BottomSpace"></div>
		</div>
	)
}

export default SectionsPage;
