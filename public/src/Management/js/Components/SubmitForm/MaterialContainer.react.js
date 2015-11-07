var React = require('react');
var Actions = require('../../Actions/Actions');

var MaterialContainer = React.createClass({
	render : function(){
		return (
			<div className="pure-u-18-24">
			{
				this.props.list.map(function(item, index){
					return (
						<div key={index} style={{marginBottom : "3%"}}>
							<b className="pure-u-17-24" style={{lineHeight : "31px"}}>{item.name}</b>
							<input className="pure-u-4-24" type="number" value={item.quantity} id={index} onChange={this._updateMaterialQuantity}/>
							<div className="pure-u-1-24"></div>
							<img src="/Calculator/img/misc/deleteBtn.png" className="pure-u-2-24 deleteBtn" onClick={this._deleteEntry.bind(this, index)}/>
						</div>
					)
				}, this)
			}
			</div>
		)
	},

	_deleteEntry : function(index){
		Actions.deleteMaterialEntry(index);
	},

	_updateMaterialQuantity : function(e){
		Actions.updateMaterialQuantity(e.target.id, e.target.value);
	}
});

MaterialContainer.PropTypes = {
	list : React.PropTypes.array
}

module.exports = MaterialContainer;
