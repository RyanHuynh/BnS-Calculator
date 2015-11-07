var React = require('react');
var RecipeInfo = require('./RecipeInfo.react');
var MaterialInfo = require('./MaterialInfo.react');
var ResultInfo = require('./ResultInfo.react');
var Store = require('../../stores/Store');
var ReactPropTypes = React.PropTypes;

var Calculator = React.createClass({

	getInitialState : function(){
		return {
			recipeInfo : {},
			materialInfo : null,
			selectedMaterial : "",
			selectedMaterialQuantity : 0,
			craftFee : 0,
			materialCost : 0,
			itemFee : 0,
			itemQuantity : 0
		}
	},

	componentDidMount : function(){
		Store.addInfoChangedListener(this._onInfoUpdated);
		Store.addMaterialFeeChangedListener(this._onMaterialFeeChanged);
		Store.addItemFeeChangedListener(this._onItemFeeChanged);
	},

	componentWillUnmount : function(){
		Store.removeInfoChangedListener(this._onInfoUpdated);
		Store.removeMaterialFeeChangedListener(this._onMaterialFeeChanged);
		Store.removeItemFeeChangedListener(this._onItemFeeChanged);
	},

	render : function(){
		var craftCost = this.state.materialCost + this.state.craftFee;
		var totalProfit = this.state.itemFee * this.state.itemQuantity - craftCost;
		var profitEA = parseInt(totalProfit / this.state.itemQuantity);
		var profitRatio = parseInt(totalProfit / this.state.craftDuration * 60);
		return (
			<div id="calculator-wrapper" className={this.props.className}>
				<RecipeInfo info={this.state.recipeInfo} itemFee={this.state.itemFee}/>
				{this.state.materialInfo ? <MaterialInfo list={this.state.materialInfo} /> : null}
				<ResultInfo 
					craftCost={craftCost} 
					profit={totalProfit > 0 ? totalProfit  : 0} 
					profitEA={profitEA > 0 ? profitEA : 0} 
					profitRatio={profitRatio > 0 ? profitRatio : 0} 
				/>
			</div>
		)
	},

	_onInfoUpdated : function(){
		var itemInfo = Store.getItemInfo();
		var currentItemFee = Store.getItemFee(itemInfo.id);
		var totalMaterialCost = this._getTotalMaterialCost(itemInfo.materials);
		
		this.setState({
			recipeInfo : itemInfo,
			materialInfo : itemInfo.materials,
			craftFee : itemInfo.craftFee,
			craftDuration : itemInfo.duration,
			itemId : itemInfo.id,
			itemFee : currentItemFee,
			itemQuantity : itemInfo.quantity,
			materialCost : totalMaterialCost
		});
	},

	_onItemFeeChanged : function(){
		this.setState({
			itemFee : Store.getItemFee(this.state.itemId)
		})
	},

	_onMaterialFeeChanged : function(){
		this.setState({
			materialCost : this._getTotalMaterialCost(this.state.materialInfo)
		});
	},

	_getTotalMaterialCost : function(materials){
		var cost = 0;
		if(materials){
			for(var i = 0; i < materials.length; i++){
				var mat = materials[i];
				var quantity = mat.quantity;
				var matCost = Store.getMaterialFee(mat.id);
				cost += matCost * quantity;
			}
		}
		return cost;
	}
});

module.exports = Calculator;