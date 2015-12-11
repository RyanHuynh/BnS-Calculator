var React = require('react');
var Calculator = require('./Calculator/Calculator.react');
var ItemList = require('./ItemList/ItemList.react');
var Navigator = require('./Util/Navigator.react');
var PresetMenu = require('./Util/PresetMenu.react');
var ReactTooltip = require('react-tooltip');
var ReactPropTypes = React.PropTypes;
var Actions = require('../actions/Actions');
var ReactToastr = require("react-toastr");
var Store = require('../stores/Store');
var ToastContainer = ReactToastr.ToastContainer;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

var App = React.createClass({
	componentDidMount: function(){
		Store.addMsgChangedListener(this.displayMsg);	
		Actions.updateCategory("all", "");
	},
	componentWillUnmount : function(){
		Store.removeMsgChangedListener(this.displayMsg);
	},
	render : function(){
		return (
			<div>
				<PresetMenu />
				<div className="pure-g">
					<div className="pure-u-15-30" >
						<Navigator />
						<ItemList />
					</div>
					<div className="pure-u-1-30" ></div>
					<Calculator className="pure-u-12-30" />
				</div>
				<ToastContainer ref="toastContainer"
	                toastMessageFactory={ToastMessageFactory}
	                className="toast-bottom-right"
	            />
			</div>
		)
	},
	displayMsg : function(status, msg){
		this.refs.toastContainer[status](
			msg,
			"",
			{
				timeout : 5000,
				extendendTimeout : 10000
			}
		)
	}
});

module.exports = App;