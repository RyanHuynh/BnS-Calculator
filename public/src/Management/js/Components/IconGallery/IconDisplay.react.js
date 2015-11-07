var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var ReactTooltip = require('react-tooltip');
var MainStore = require('../../Stores/MainStore');
var Actions = require('../../Actions/Actions');

var IconDisplay = React.createClass({
	getInitialState : function(){
		return {
			searchString : "",
			type : "all",
			iconList : [],
			selectedIcon : ""
		}
	},

	componentDidMount : function(){
		MainStore.addIconListChangeListener(this._updateIconList);
		MainStore.addSelectedIconChangeListener(this._updateSelectedIcon);
		Actions.getIconList(this.state.type, this.state.searchString);
	},

	componentWillUnmount : function(){
		MainStore.removeIconListChangeListener(this._updateIconList);
		MainStore.removeSelectedIconChangeListener(this._updateSelectedIcon);
	},

	render : function(){
		var me = this;
		var typeList = [
			{
				value : "all",
				display : "All"
			},
			{
				value : "material",
				display : "Material"
			},
			{
				value : "recipe",
				display : "Recipe"
			}
		]
		return (
			<div className="frameBorder noselect" style={{height : "65%", overflowY: "scroll"}}>
				<img src="../Calculator/img/misc/iconDisplayTxt.png" style={{marginBottom : "1%"}}/>
				<div className="navigator">
					<div className="navigator-btn yellow" onClick={this._refreshList} >Refresh</div>
					<a className="navigator-btn yellow" href="#/main" >Home</a>
					<select className="pure-u-16-24" onChange={this._typeChange} value={this.state.type}>
					{
						typeList.map(function(item, index){
							return <option key={index} value={item.value} >{item.display}</option>
						}, this)
					}
					</select>
					<form className="searchBar">
						<input type="text" onChange={this._searchIcon} value={this.state.searchString} placeholder="What are you looking for?"/>
						<div id="searchIcon"></div>
					</form>
				</div>
				<div className="list-wrapper" >
					<ReactTooltip place='right' type='dark' effect='solid' />
					{me.state.iconList.map(function (item, index){
						return <ItemIcon info={item} key={index} checked={item.name == me.state.selectedIcon}/>
					})}
				</div>
			</div>
		)
	},

	_typeChange : function(e){
		this.setState({
			type : e.target.value
		})
		Actions.getIconList(e.target.value, this.state.searchString);
	},

	_refreshList : function(){
		Actions.getIconList(this.state.type, this.state.searchString);
	},

	_updateIconList : function(){
		this.setState({
			iconList : MainStore.getIconList()
		})
	},

	_searchIcon : function(e){
		this.setState({
			searchString : e.target.value
		})
		Actions.searchIcon(e.target.value);
	},

	_updateSelectedIcon : function(){
		var selectedIcon = MainStore.getSelectedIcon();
		this.setState({
			selectedIcon : selectedIcon.name
		})
	}
});

var ItemIcon = React.createClass({
	
	getInitialState : function(){
		return {
			domHeight : "auto"
		}
	},

	componentDidMount: function(){
		
	},

	render : function(){
		return (
			<label>
				<input type="radio" name="recipeIcon" value={this.props.info.name} checked={this.props.checked} readOnly/>
				<img 
					ref="itemIcon" 
					className="icon"					
					src={ '../Calculator/img/items/' + this.props.info.icon_url } 
					onClick={this._selectIcon} 
					data-tip={this.props.info.name}
				/>
			</label>
		)
	},

	_selectIcon : function(){
		Actions.updateSelectedIcon(this.props.info);
	}
})

module.exports = IconDisplay;