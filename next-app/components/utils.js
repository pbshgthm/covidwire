'use client';

export const formatDate = (date_str,format="day")=>{
	date_str=date_str.split('T')[0]
	let day_dict=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	let month_dict = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	let date_arr = date_str.split('-');
	let day = new Date(date_str);
	day=day_dict[day.getDay()];
	if(format==="year"){
		return Number(date_arr[2])+' '+month_dict[Number(date_arr[1]) - 1]+' '+date_arr[0]
	}
  	return Number(date_arr[2])+' '+month_dict[Number(date_arr[1]) - 1]+', '+day
}



export const scrollToTop = (animate=true)=>{
	if(animate){
		const c = document.documentElement.scrollTop || document.body.scrollTop;
		if (c > 0) {
			window.requestAnimationFrame(scrollToTop);
			window.scrollTo(0, c - c / 8);
		}
	}
	else(window.scrollTo(0,0));
};

export const urlEncode = (url)=>{
	return url.toLowerCase().replace(/ /g,'+')
}

export const urlDecode = (url)=>{
	return url.split('+').map(x=>x.charAt(0).toUpperCase() + x.slice(1)).join(' ').replace(' And ',' and ')
}

export const preventScroll=(noScroll)=>{
	if(noScroll){
		document.body.style.overflow = "hidden"
	}else{
		document.body.style.overflow = "scroll"
	}
}


export const toggleSaved=(cardData)=>{
	var savedCards=getSaved()
	console.log(savedCards)
	if(cardData.hash in savedCards){
		delete savedCards[cardData.hash];
	}else{
		savedCards[cardData.hash]=cardData;
	}
	localStorage.setItem('testObject2', JSON.stringify(savedCards));
}

export const isSaved=(hash)=>{
	var savedCards=getSaved()
	return (hash in savedCards)
}

export const getSaved=()=>{
	var savedCards = localStorage.getItem('testObject2');
	savedCards=JSON.parse(savedCards);

	if(savedCards===null)return {}
	return savedCards

}
