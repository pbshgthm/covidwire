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

	useEffect(()=>{
		setFeedbackSel("")
	},[props.showFeedback])

	function sendFormData(){
		axios.post("https://us-central1-covidwire.cloudfunctions.net/feedback_via_slack", {
			"Feedback":feedbackSel,
			"Id":props.cardData.hash,
			'Region':props.cardData.region,
			'Language':props.cardData.lang,
			'Headline':props.cardData.headline,
		}).then(res => {
    		console.log(res,res.data)
  		});
	}

  	return (
		<React.Fragment>
			{props.showFeedback&&<div className="ScreenBlock" onClick={()=>"props.setVisibility(false)"}></div>}
			<div className={classNames("FeedbackForm",{
				"FeedbackFormSel":props.showFeedback
			})}>
				<div className="FeedbackDesc">Tell us what went wrong about
					<div className="FeedbackHeadline">{'"'+props.cardData.headline+'"'}</div>
				</div>
				<div className="FeedbackOptions">
					{feedbackOpt.map(x=>(
						<div className={classNames("FeedbackOpt",
							{"FeedbackOpt-Sel":feedbackSel===x})} onClick={()=>setFeedbackSel(x)}>
							<div className="FeedbackOptText">{x}</div>
						</div>
					))}
				</div>
				<div className="FeedbackCancel" onClick={()=>props.setShowFeedback()}>Cancel</div>
				<div onClick={()=>sendFormData()} className={classNames("FeedbackSubmit",
					{"FeedbackSubmitSel":feedbackSel!==""})}>
					Submit
				</div>
			</div>
		</React.Fragment>
	);
}

export default FeedbackForm;
