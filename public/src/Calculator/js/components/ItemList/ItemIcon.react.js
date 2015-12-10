var React = require('react');
var Actions = require('../../actions/Actions');
var ReactPropTypes = React.PropTypes;
var ReactTooltip = require('react-tooltip');
var ItemIcon = React.createClass({
	propTypes : {
		info : ReactPropTypes.object,
		checked : ReactPropTypes.bool
	},
	
	getInitialState : function(){
		return {
			domHeight : "auto"
		}
	},

	componentDidMount: function(){
		var width = this.refs.itemIcon.offsetWidth;
		this.setState({ domHeight : width - 5 + "px" }); //This is the border size and padding of the component
	},

	render : function(){
		return (
			<label >
				<input type="radio" name="recipeIcon" value={this.props.info.name} checked={this.props.checked} readOnly/>
				<img 
					ref="itemIcon" 
					className="icon icon_list"  
					style={{ height : this.state.domHeight, margin : "1%" }} 
					src={ '../img/items/' + this.props.info.icon_url } 
					onClick={this._displayInfo} 
					data-tip={this.props.info.name}
				/>
			</label>
		)
	},

	_displayInfo : function(){
		Actions.showInfo(this.props.info);
	}
})

module.exports = ItemIcon;