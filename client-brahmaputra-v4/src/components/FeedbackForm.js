import React, { useState, useEffect} from 'react';
import classNames from 'classnames';
import axios from 'axios';

import './css/FeedbackForm.css'
import config from '../config.js'


function FeedbackForm(props){

	const feedbackOpt=[
		'Bad News selection',
		'Inaccurate Summary',
		'Translation Error',
		'No issues, well done!'
	]

	const [feedbackSel,setFeedbackSel]=useState("")


	/*
  	handleChange(event) {
    	this.setState({value: event.target.value});
  	}

  	handleSubmit(event) {
    	event.preventDefault();
		const formData = new FormData();
  		formData.append("username", "finaltest");
  		formData.append("password", "prefinal");
  		formData.append("user_type", 909);

  		axios.post("https://formsubmit.co/poobesh.g@gmail.com", formData).then(res => {
    		console.log(res);
    		console.log(res.data);
  		});
  	}
	*/

	function toggleInArr(arr,index){
		arr[index]=!arr[index]
		console.log(arr)
		return arr
	}

  	return (
		<React.Fragment>
			{props.showFeedback&&<div className="ScreenBlock" onClick={()=>"props.setVisibility(false)"}></div>}
			<div className={classNames("FeedbackForm",{
				"FeedbackFormSel":props.showFeedback
			})}>
				<div className="FeedbackDesc">Tell us what went wrong about
					<div className="FeedbackHeadline">{props.headline}</div>
				</div>
				<div className="FeedbackOptions">
					{feedbackOpt.map(x=>(
						<div className={classNames("FeedbackOpt",
							{"FeedbackOpt-Sel":feedbackSel===x})} onClick={()=>setFeedbackSel(x)}>
							<div className="FeedbackOptText">{x}</div>
						</div>
					))}
				</div>
				<div className="FeedbackCancel" onClick={()=>props.setShowFeedback(false)}>Cancel</div>
				<div className={classNames("FeedbackSubmit",
					{"FeedbackSubmitSel":feedbackSel!==""})}>
					Submit
				</div>
			</div>
		</React.Fragment>
	);
}

export default FeedbackForm;
