var React = require('react');
var SubmitForm = require('./SubmitForm/SubmitForm.react');
var IconGallery = require('./IconGallery/IconGallery.react');

var EditView = React.createClass({

	getInitialState : function(){
		return {
			mode : this.props.params.mode
		}
	},
	
	render : function(){
		return (
			<div id="editView-wrapper" className="pure-g">
				<SubmitForm mode={this.state.mode}/>
			</div>
		)
	}
});

module.exports = EditView;