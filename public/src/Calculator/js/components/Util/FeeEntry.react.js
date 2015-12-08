var React = require('react');
var Action = require('../../actions/Actions');
var ReactTooltip = require('react-tooltip');
var ReactPropTypes = React.PropTypes;

var FeeEntry = React.createClass({
	propTypes : {
		editable : ReactPropTypes.bool,
		fee : ReactPropTypes.number,
		feeType : ReactPropTypes.string,
		id : ReactPropTypes.number
	},

	getInitialState: function(){

		var fee = this.props.fee;
		var gold = Math.floor(fee / 10000);
		var silver = Math.floor((fee%10000)/100);
		var copper = Math.floor(fee%100);
		return{
			editMode : false,
			gold : gold,
			silver : silver,
			copper : copper
		}
	},

	componentWillReceiveProps : function(nextProps){
		var fee = nextProps.fee;
		var gold = Math.floor(fee / 10000);
		var silver = Math.floor((fee%10000)/100);
		var copper = Math.floor(fee%100);
		this.setState({
			gold : gold,
			silver : silver,
			copper : copper
		})
	},

	render : function(){
		
		return (
			<div className={this.props.className}>
				{ this.props.editable ? 
					<form className="feeEntry" onSubmit={this._onEdit} >
						<input onChange={this._goldInputChanged} type="number" value={this.state.gold} ref="gold" disabled={!this.state.editMode} min="0" className="goldInput"/>
						<img src="../img/misc/goldCoin.png" />

						<input onChange={this._silverInputChanged} type="number" value={this.state.silver} ref="silver" disabled={!this.state.editMode} min="0" max="99"/>
						<img src="../img/misc/silverCoin.png"/>

						<input onChange={this._copperInputChanged} type="number" value={this.state.copper} ref="copper" disabled={!this.state.editMode} min="0" max="99"/><
						img src="../img/misc/copperCoin.png" />

						{ this.state.editMode ? <input type="image" src="../img/misc/pencilr.png"  alt="Submit" data-tip="Click to save !" data-type="error"/> : <input type="image" src="../img/misc/pencilg.png" data-type="info" alt="Submit" data-tip="Click to edit !"/> }
					</form>
				:	<div className="feeEntry">
						{ this.state.gold > 0 ? <div><label>{this.state.gold}</label><img src="../img/misc/goldCoin.png" /></div> : null }
						{ this.state.silver > 0 ? <div><label>{this.state.silver}</label><img src="../img/misc/silverCoin.png" /></div> : null }
						{ ( this.state.copper > 0 || this.props.fee == 0 ) ? <div><label>{this.state.copper}</label><img src="../img/misc/copperCoin.png" /></div> : null }
					</div> 
				}
			</div>
		)
	},

	_onEdit : function(event){
		event.preventDefault();
		this.setState({editMode : !this.state.editMode });

		//On editMode = false, trigger save 
		if(this.state.editMode){
			var totalFee = React.findDOMNode(this.refs.gold).value * 10000 + React.findDOMNode(this.refs.silver).value * 100 + React.findDOMNode(this.refs.copper).value * 1;
			Action.updateFee({
				feeType : this.props.feeType,
				id : this.props.id,
				totalFee : totalFee
			})
		}
	},

	_goldInputChanged : function(event){
		this.setState({
			gold : event.target.value
		})
	},

	_silverInputChanged : function(event){
		this.setState({
			silver : event.target.value
		})
	},

	_copperInputChanged : function(event){
		this.setState({
			copper : event.target.value
		})
	}

});

module.exports = FeeEntry;