var React = require('react');
var ReactPropTypes = React.PropTypes;
var FeeEntry = require('../Util/FeeEntry.react');
var Constants = require('../../constants/Constants');
var Store = require('../../stores/Store');
var MaterialInfo = React.createClass({

	propTypes : {
		list : ReactPropTypes.array
	},

	getInitialState : function(){
		//Select the first item in material list.
		var list = this.props.list;
		return {
			currentMaterialIconURL : list[0].icon_url,
			currentMaterialName : list[0].name,
			currentMaterialQuantity : list[0].quantity,
			currentMaterialId : parseInt(list[0].id),
			currentMaterialFee : Store.getMaterialFee(list[0].id)
		}
	},

	componentDidMount : function(){
		Store.addMaterialFeeChangedListener(this._onMaterialFeeChanged);
	},

	componentWillUnmount  : function(){
		Store.removeMaterialFeeChangedListener(this._onMaterialFeeChanged);
	},

	componentWillReceiveProps: function(nextProps){
		//Check new materials list, re-select a material if current selected doesn't exist in the new list
		var newList = nextProps.list;
		var found = false;
		for(var i = 0; i < newList.length; i++){
			if(newList[i].name == this.state.currentMaterialName){
				found = true;
				return;
			}
		}
		if(!found)
			this._materialChanged(newList[0]);
	},

	render : function(){
		var list = this.props.list;
		var me = this;
		return (
			<div id="materialSection" >
				<div id="materialTxt" className="sectionTxt"></div>
				<div id="materialIcon">
				{
					list.map(function(item, index){
						return (
							<label key={index}>
								<input type="radio" name="materialGrp" checked={me.state.currentMaterialName == item.name} readOnly/>
								<img src={ '../img/items/' + item.icon_url} onClick={me._materialChanged.bind(me, item)}/>
							</label>
						)
					})
				}
				</div>
				<div id="materialInfo">
					<img src={'../img/items/' + this.state.currentMaterialIconURL} className="bigIcon" style={{marginTop : "10px"}}/>
					<div>
						<div className="entry">
							<b className="infoText" >Name:</b>
							<p>{this.state.currentMaterialName}</p>
						</div>
						<div className="entry">
							<b className="infoText" >Quantity:</b>
							<p>{this.state.currentMaterialQuantity}</p>
						</div>
						<div className="entry">
							<b className="infoText" >Market price ( .ea ):</b>
							<FeeEntry editable={true} feeType={Constants.MATERIAL_FEE} id={this.state.currentMaterialId} fee={this.state.currentMaterialFee}/>
						</div>
					</div>
				</div>
			</div>
		)
	},

	_materialChanged : function(item){
		this.setState({
			currentMaterialIconURL : item.icon_url,
			currentMaterialName : item.name,
			currentMaterialQuantity : item.quantity,
			currentMaterialId : parseInt(item.id), //REMOVE THIS PARSE
			currentMaterialFee : Store.getMaterialFee(item.id)
		})
	},

	_onMaterialFeeChanged : function(){
		this.setState({
			currentMaterialFee : Store.getMaterialFee(this.state.currentMaterialId)
		})
	}
});

module.exports = MaterialInfo;
