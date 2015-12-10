var React = require('react');
var ReactDOM = require('react-dom');
var ItemIcon = require('./ItemIcon.react');
var Store = require('../../stores/Store');
var Actions = require('../../actions/Actions');
var ReactTooltip = require('react-tooltip');

var ItemList = React.createClass({
	getInitialState : function(){
		return {
			domHeight : "auto",
			items : Store.getItemList(),
			selectedItem : "",
			calculatorLoaded : false
		}
	},

	componentWillUnmount : function(){
		Store.removeListChangedListener(this._onListChanged);
		Store.removeInfoChangedListener(this._onItemSelected);
	},
	componentDidMount: function(){
		Store.addListChangedListener(this._onListChanged);
		Store.addInfoChangedListener(this._onItemSelected);

		var width = ReactDOM.findDOMNode(this).offsetWidth;
		this.setState({ domHeight : width - 30 + "px" }); //This is the border size and padding of the component
	},

	render : function(){
		var me = this;
		return (
			<div id="list-wrapper" style={{ minHeight : me.state.domHeight }}>
				<ReactTooltip place='right' type='dark' effect='solid' />
				{me.state.items.map(function (item, index){
					return <ItemIcon info={item} key={index} checked={item.name == me.state.selectedItem}/>
				})}
			</div>
		)
	},

	_onListChanged : function(){
		var items = Store.getItemList();
	  	this.setState({
	  		items : items
  		});

  		//Pick the first icon in the list to display. (only on initial load)
  		if(!this.state.calculatorLoaded){
  			Actions.showInfo(items[0]);
  			this.setState({
  				selectedItem : items[0].name,
  				calculatorLoaded : !this.state.calculatorLoaded
  			})
  		}
	},

	_onItemSelected : function(){
		var selectedItem = Store.getItemInfo();
		this.setState({
			selectedItem : selectedItem.name
		})
	}
});

module.exports = ItemList;