var React = require('react');
var IconDisplay = require('./IconDisplay.react');
var IconSubmit = require('./IconSubmit.react');
var IconInfo = require('./IconInfo.react');

var IconGallery = React.createClass({
	
	componentDidMount: function(){
		
	},
	render : function(){
		return (
			<div id="icon-gallery" style={{height : "100%"}}>
				<IconDisplay />
				<div style={{height : "30%"}}>
					<IconInfo className="pure-u-8-24"/>
					<div className="pure-u-1-24"></div>
					<IconSubmit className="pure-u-15-24"/>
				</div>
			</div>
		)
	}
});

module.exports = IconGallery;