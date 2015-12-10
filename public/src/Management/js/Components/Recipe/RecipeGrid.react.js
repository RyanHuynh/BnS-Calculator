var React = require('react');
var Utils = require('../../Utils/Utils');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var Actions = require('../../Actions/Actions');
var MainStore = require('../../Stores/MainStore');
var FeeEntry = require('../../Utils/FeeEntry.react');

var ReactBsTable  = require('react-bootstrap-table');
var DataSet = ReactBsTable.TableDataSet; //import TableDataSet
var Header = ReactBsTable.TableHeaderColumn;
var Table = ReactBsTable.BootstrapTable;

var RecipeGrid = React.createClass({
	getInitialState: function(){
		return {
			data : []
		}
	},

	componentDidMount: function(){
		MainStore.addRecipeListChangeListener(this._updateRecipeList);
		Actions.getRecipeList("all", "" );
	},

	componentWillUnmount : function(){
		MainStore.removeRecipeListChangeListener(this._updateRecipeList);
	},

	render : function(){
		function feeFormat(cell,row){
			if(!cell)
				return;
			return <FeeEntry editable={false} fee={cell} />
		}
		function durationFormat(cell, row){
			if(!cell)
				return;
			var h = parseInt(cell / 3600);
			var m = parseInt((cell%3600) / 60);
			var s = parseInt(cell%60);
			return (h > 0 ? h + "h" : "") + (m > 0 ? m + "m" : "") + (s > 0 ? s + "s" : "");
		}
		function iconFormat(cell,row){
			if(!cell)
				return;
			var iconURL = '../Calculator/img/items/' + cell;
			return <img src={iconURL} className='gridIcon'/>
		}
		function descriptionFormat(cell, row){
			if(!cell)
				return;
			cell = cell.replace(/(<([^>]+)>)/ig,"");
			if(cell.length > 70)
				return cell.substr(0, 70) + "...";
			else 
				return cell;
		}
		function nameFormat(cell, row){
			if(!cell)
				return;
			if(cell.length > 25)
				return cell.substr(0, 25) + "...";
			else 
				return cell;
		}
		function onRowSelect(cellData){
			Actions.updateSelectedRecipe(cellData);
		}
		var selectRowProp = {
			mode: "radio",
			clickToSelect: true,
			bgColor: "#613DCC",
			onSelect: onRowSelect,
			hideSelectColumn: true
		};

		var options = {
			sizePerPage : 5
		};

		return (
			<div className="frameBorder noselect gridView" style={{marginBottom : "1%"}}>
				<img src="/Calculator/img/misc/recipeTxt.png" />
				<Navigator />
				<Table data={this.state.data} hover={true} pagination={true} height="280" selectRow={selectRowProp} options={options}>
					<Header dataField="id" dataAlign="center" isKey={true} width="50px">ID</Header>
					<Header className="gridIcon" dataField="icon_url" width="50px" dataAlign="center" dataFormat={iconFormat} >Icon</Header>
					<Header dataField="name" dataFormat={nameFormat} width="250px" dataSort={true}>Name</Header>
					<Header dataField="category" dataAlign="left" width="120px" dataSort={true} >Category</Header>
					<Header dataField="duration" dataAlign="center" width="120px" dataSort={true} dataFormat={durationFormat} >Craft time</Header>
					<Header dataField="craftFee" dataAlign="right" width="170px" dataSort={true} dataFormat={feeFormat} >Craft Fee</Header>
					<Header dataField="quantity" dataAlign="center" width="100px" dataSort={true}>Quantity</Header>
					<Header dataField="description" dataFormat={descriptionFormat} >Description</Header>
				</Table>
			</div>
		)
	},

	_updateRecipeList : function(){
	 	this.setState({
	 		data : MainStore.getRecipeList()
	 	})
	}
});

var Navigator = React.createClass({
	getInitialState : function(){
		return {
			category : "all",
			searchString : ""
		}
	},

	render : function(){
		var categories = [];
		for(var key in Utils.CATEGORY_DROPDOWN){
			var category = Utils.CATEGORY_DROPDOWN[key];
			categories.push(<option key={key} value={category.value}>{category.label}</option>);
		}

		return (
			<div className="navigator">
				<a className="navigator-btn yellow" href="#/form/new" >New</a>
				<a className="navigator-btn yellow" href="#/form/edit" >Edit</a>
				<div className="navigator-btn red" onClick={this._deleteRecipe}>Delete</div>
				<div className="navigator-btn yellow" onClick={this._refreshList}>Refresh</div>
				<a className="navigator-btn yellow" href="#/gallery" >Icon Gallery</a>
				<div className="navigator-btn yellow" href="#/gallery" onClick={this._backupData}>Backup</div>
				<select onChange={this._updateCategory} value={this.state.category} >{categories}</select>
				<form className="searchBar">
					<input type="text" onChange={this._searchRecipe} value={this.state.searchString} placeholder="What are you looking for?"/>
					<div id="searchIcon"></div>
				</form>
			</div>
		)
	},

	_updateCategory : function(event){
		var newCategory = event.target.value;
		this.setState({ category : newCategory });
		Actions.getRecipeList(newCategory, this.state.searchString );
	},

	_searchRecipe : function(event){
		var newSearchStr = event.target.value;
		this.setState({ searchString : newSearchStr });
		Actions.searchRecipe(newSearchStr);
	},

	_deleteRecipe : function(){
		var info = MainStore.getSelectedRecipe();
		Actions.deleteRecipe(info.docId);
	},

	_refreshList : function(){
		Actions.getRecipeList(this.state.category, this.state.searchString);
	},

	_backupData : function(){
		Actions.backupData();
	}

});

module.exports = RecipeGrid;