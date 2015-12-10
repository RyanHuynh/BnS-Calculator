var React = require('react');
var RecipeGrid = require('./Recipe/RecipeGrid.react');
var MaterialGrid = require("./Material/MaterialGrid.react");

var MainView = React.createClass({
	render : function(){
		return (
			<div id="mainView-wrapper">
				<RecipeGrid />
				<MaterialGrid />
			</div>
		)
	}
});

module.exports = MainView;