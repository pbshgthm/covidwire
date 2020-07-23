import React from 'react';
import axios from 'axios';

class FeedbackForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

	const formData = new FormData();
  	formData.append("username", "wuddup");
  	formData.append("password", "parrot");
  	formData.append("user_type", 23);

  	axios.post("https://formsubmit.co/poobesh.g@gmail.com", formData).then(res => {
    	console.log(res);
    	console.log(res.data);
  	});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form" action="https://smartforms.dev/submit/5f1a030d7fc3ac0d4d29853e"
method="POST">
        <label>
          Essay:
          <textarea name="sdsd" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default FeedbackForm;
