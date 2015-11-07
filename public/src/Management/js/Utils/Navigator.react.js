var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var Actions = require('../Actions/Actions');
var MainStore = require('../Stores/MainStore');

var craftCategories = [
	{ label : "All", value : "all" },
	{ label : "Wood Cutter", value : "woodcutter" },
	{ label : "Handicraft", value : "handicraft" },
	{ label : "Stone Cutter", value : "stonecutter" }
];

var Navigator = React.createClass({
	getInitialState : function(){
		return {
			category : "all",
			searchString : ""
		}
	},

	render : function(){
		var categories = [];
		for(var key in craftCategories){
			var category = craftCategories[key];
			categories.push(<option key={key} value={category.value}>{category.label}</option>);
		}

		return (
			<div className="navigator">
				<Link className="navigator-btn yellow" to={`/form/new`} >New</Link>
				<Link className="navigator-btn yellow" to={`/form/edit`} >Edit</Link>
				<div className="navigator-btn red" onChange={this._deleteRecipe}>Delete</div>
				<div className="navigator-btn yellow" onChange={this._refreshList}>Refresh</div>
				<select onChange={this._updateCategory} value={this.state.category} >{categories}</select>
				<form className="searchBar">
					<input type="text" onChange={this._searchChanged} value={this.state.searchString} placeholder="What are you looking for?"/>
					<div id="searchIcon"></div>
				</form>
			</div>
		)
	},

	_updateCategory : function(event){
		var newCategory = event.target.value;
		this.setState({ category : newCategory });
		Actions.updateCategory(newCategory, this.state.searchString );
	},

	_searchChanged : function(event){
		var newSearchStr = event.target.value;
		this.setState({ searchString : newSearchStr });
		Actions.searchChanged(newSearchStr);
	},

	_deleteRecipe : function(){
		Actions.deleteRecipe();
	},

	_refreshList : function(){
		Actions.updateCategory(this.state.category, this.state.searchString);
	}

});

module.exports = Navigator;