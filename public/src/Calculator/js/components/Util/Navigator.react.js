var React = require('react');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');

var craftCategories = [
	{ label : "All", value : "all" },
	{ label : "Acquired Taste", value : "cooker" },
	{ label : "Green Thumbs", value : "havester" },
	{ label : "Herbside Service", value : "herbalist" },
	{ label : "The Earthseers", value : "charm" },
	{ label : "The Fish Network", value : "fisher" },
	{ label : "The Forgekeepers", value : "weaponsmith" },
	{ label : "The Merry Potters", value : "ceramics" },
	{ label : "The Prospector's Union", value : "miner" },
	{ label : "The Radiant Ring", value : "handicraft" },
	{ label : "The Silver Cauldron", value : "medicine" },
	{ label : "The Stonecutters", value : "stonecutter" },
	{ label : "The Trappers Alliance", value : "hunter" },
	{ label : "The Tree Fellers", value : "woodcutter" },
	{ label : "Soul Wardens", value : "bopae" },
	{ label : "My Crafts", value : "favourite" }
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
			<div id="navigator">
				<select onChange={this._updateCategory} value={this.state.category} >{categories}</select>
				<form className="searchBar">
					<input className="pure-u-20-24" type="text" placeholder="What are you looking for?" onChange={this._searchChanged} value={this.state.searchString} />
					<div className="pure-u-3-24" id="searchIcon"></div>
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
	}

});

module.exports = Navigator;