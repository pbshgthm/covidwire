import React, { useState, useEffect} from 'react';
import classNames from 'classnames';
import axios from 'axios';

import './css/FeedbackForm.css'


function FeedbackForm(props){

	const feedbackOpt=[
		'Love this piece!',
		'Translation error',
		'Inaccurate summary',
		'Curation could be better'
	];

	const [feedbackSel,setFeedbackSel]=useState("")

	useEffect(()=>{
		setFeedbackSel("")
	},[props.showFeedback])



	function sendFormData(){
		if(feedbackSel==="")return;
		props.setShowFeedback(false)
		axios({
	        method: 'post',
	        url: "https://us-central1-covidwire.cloudfunctions.net/v4_feedback_slack",
	        data: {
				"Feedback":feedbackSel,
				"Id":props.cardData.hash,
				'Region':props.cardData.region,
				'Language':props.cardData.lang,
			},
    	}).then(res => {
    		console.log(res,res.data)
  		});
	}

  	return (
		<React.Fragment>
			{props.showFeedback&&<div className="ScreenBlock" onClick={()=>props.setShowFeedback(false)}></div>}
			<div className={classNames("FeedbackForm",{
				"FeedbackFormSel":props.showFeedback
			})}>
				<div className="FeedbackDesc">Tell us your feedback</div>
				<div className="FeedbackOptions">
					{feedbackOpt.map(x=>(
						<div key={x} className={classNames("FeedbackOpt",
							{"FeedbackOpt-Sel":feedbackSel===x})} onClick={()=>setFeedbackSel(x)}>
							<div className="FeedbackOptText">{x}</div>
						</div>
					))}
				</div>
				<div className="FeedbackCancel" onClick={()=>props.setShowFeedback(false)}>Cancel</div>
				<div onClick={()=>sendFormData()} className={classNames("FeedbackSubmit",
					{"FeedbackSubmitSel":feedbackSel!==""})}>
					Submit
				</div>
			</div>
		</React.Fragment>
	);
}

export default FeedbackForm;
