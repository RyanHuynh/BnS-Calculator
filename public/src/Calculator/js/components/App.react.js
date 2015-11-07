var React = require('react');
var Calculator = require('./Calculator/Calculator.react');
var ItemList = require('./ItemList/ItemList.react');
var Navigator = require('./Navigator.react');
var ReactTooltip = require('react-tooltip');
var ReactPropTypes = React.PropTypes;
var Actions = require('../actions/Actions');

var App = React.createClass({
	componentDidMount: function(){
		Actions.updateCategory("all", "");
	},
	render : function(){
		return (
			<div className="pure-g">
				<div className="pure-u-15-30" >
					<Navigator />
					<ItemList />
				</div>
				<div className="pure-u-1-30" ></div>
				<Calculator className="pure-u-12-30" />
			</div>
		)
	}
});

module.exports = App;