var React = require('react');
var Utils = require('../../Utils/Utils');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var MaterialContainer = require('./MaterialContainer.react');
var Select = require('react-select');
var SubmitStore = require('../../Stores/SubmitStore');
var MainStore = require('../../Stores/MainStore');
var Actions = require('../../Actions/Actions');

var SubmitForm = React.createClass({

	getInitialState : function(){
		if(this.props.mode == "edit"){
			var item = MainStore.getSelectedRecipe();
			var fee = item.craftFee;
			var gold = Math.floor(fee / 10000);
			var silver = Math.floor((fee%10000)/100);
			var copper = Math.floor(fee%100);
			return {
				info : item,
				goldVal : gold,
				silverVal : silver,
				copperVal : copper,
				timeUnit : 1,
			}
		}
		else 
			return {
				info : {
					category : "stonecutter"
				},
				timeUnit : 1,
				goldVal : 0,
				silverVal : 0,
				copperVal : 0
			}
	},

	componentDidMount: function(){
		SubmitStore.addMaterialListChangeListener(this._updateMaterialList);
		SubmitStore.addMaterialQuantityChangeListener(this._updateMaterialQuantity);
	},

	componentWillUnmount : function(){
		SubmitStore.removeMaterialListChangeListener(this._updateMaterialList);
		SubmitStore.removeMaterialQuantityChangeListener(this._updateMaterialQuantity);
	},

	render : function(){
		var timeOut;
		function getMaterialOpts(input, callback){
			if(timeOut)
				clearTimeout(timeOut);
			timeOut = setTimeout(function(){
				var keyword = "" + input;
				$.ajax({
					url : "/getMaterial",
					type : 'POST',
					data : {keyword :  keyword},
					dataType : "json",
					cache: false,
					success : function(data){
						callback(null,{
							options : data.data
						})
					}.bind(this)
				})
			}, 500);
		}

		var info = this.state.info;
		return (
			<div id="submitForm" className="frameBorder">
				<img src="/Calculator/img/misc/recipeTxt.png" style={{marginBottom : "2%"}}/>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Name:</label>
					<input type="text" onChange={this._updateName} value={info.name} placeholder="Recipe Name" className="pure-u-18-24" />
				</div>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Category:</label>
					<select className="pure-u-18-24" onChange={this._updateCategory} value={info.category}>
					{
						Utils.CATEGORY_DROPDOWN.map(function(item, index){
							return <option key={index} value={item.value} >{item.label}</option>
						}, this)
					}
					</select>
				</div>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Craft Time:</label>
					<div className="pure-u-18-24">
						<input className="pure-u-15-24" type="text" onChange={this._updateCraftTime} value={(info.duration / this.state.timeUnit) || 0} placeholder="Craft Duration" />
						<div className="pure-u-1-24"></div>
						<select className="pure-u-8-24" value={this.state.timeUnit} onChange={this._timeUnitChange}>
						{
							Utils.TIME_UNIT.map(function(item, index){
								return <option key={index} value={item.value} >{item.label}</option>
							})
						}
						</select>
					</div>
				</div>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Quantity:</label>
					<input type="text" onChange={this._updateQuantity} value={info.quantity} placeholder="Quantity" className="pure-u-18-24" />
				</div>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Craft Fee:</label>
					<div className="pure-u-18-24">
						<div className="pure-u-8-24">
							<input value={this.state.goldVal} onChange={this._updateCraftFee} className="pure-u-18-24" type="number" min="0" name="gold"/>
							<img className="pure-u-6-24" src="/Calculator/img/misc/goldCoin.png" />
						</div>

						<div className="pure-u-8-24">
							<input value={this.state.silverVal} onChange={this._updateCraftFee} className="pure-u-18-24" type="number" min="0" max="99" name="silver"/>
							<img className="pure-u-6-24" src="/Calculator/img/misc/silverCoin.png"/>
						</div>

						<div className="pure-u-8-24">
							<input value={this.state.copperVal} onChange={this._updateCraftFee} className="pure-u-18-24" type="number" min="0" max="99" name="copper"/><
							img className="pure-u-6-24" src="/Calculator/img/misc/copperCoin.png" />
						</div>
					</div>
				</div>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Materials:</label>
					<div className="pure-u-18-24">
						<Select className="pure-u-15-24" onChange={this._updateMaterialInput} asyncOptions={ getMaterialOpts } value=""/>
						<div className="pure-u-1-24"></div>
						<div className="pure-u-8-24 formBtn" onClick={this._addMaterial} >Add</div>
					</div>
				</div>

				{ 
					info.materials && info.materials.length >= 0 ? 
					<div className="formEntry pure-g" >
						<label className="pure-u-6-24"></label>
						<MaterialContainer list={info.materials}/>
					</div>
					: null
				}

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Icon URL:</label>
					<input onChange={this._updateIconurl} type="text" value={info.icon_url} placeholder="Icon URL" className="pure-u-18-24" />
				</div>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Description:</label>
					<textarea onChange={this._updateDescription} value={info.description} placeholder="Description" className="pure-u-18-24" style={{height : 200}} />
				</div>

				<div className="formEntry pure-g" style={{marginBottom : "0"}}>
					<label className="pure-u-6-24"></label>
					{
						this.props.mode == "edit" ? <div className="pure-u-8-24 formBtn" onClick={this._updateRecipe} >Save</div> : <div className="pure-u-8-24 formBtn" onClick={this._submitRecipe} >Submit</div> 
					}
					<div className="pure-u-2-24" ></div>
					<a className="pure-u-8-24 formBtn" href="#/main">Cancel</a>
				</div>
			</div>
		)
	},

	_updateName : function(e){
		var info = this.state.info;
		info.name = e.target.value;
		this.forceUpdate();
	},

	_updateQuantity: function(e){
		var info = this.state.info;
		info.quantity = e.target.value;
		this.forceUpdate();
	},

	_updateCategory : function(e){
		var info = this.state.info;
		info.category = e.target.value;
		this.forceUpdate();
	},

	_updateCraftFee : function(e){
		var newFeeObj = {};
		newFeeObj[ e.target.name + "Val"] = e.target.value
		this.setState(newFeeObj);
	},

	_updateCraftTime : function(e){
		var info = this.state.info;
		info.duration = e.target.value * this.state.timeUnit;
		this.forceUpdate();
	},

	_updateDescription : function(e){
		var info = this.state.info;
		info.description = e.target.value;
		this.forceUpdate();
	},

	_addMaterial : function(){
		var materialList = this.state.info.materials || [];
		materialList.push(this.state.selectedMaterial);
		this.state.info.materials = materialList;
		this.forceUpdate();
	},

	_timeUnitChange : function(e){
		this.setState({
			timeUnit : e.target.value
		})
	},

	_updateMaterialInput : function(val, src){
		this.setState({
			selectedMaterial : src[0].info
		})
	},

	_updateMaterialList : function(){
		var index = SubmitStore.getDeletedMaterialEntryIndex();
		var list = this.state.info.materials;
		list.splice(index, 1);
		this.forceUpdate();
	},

	_updateMaterialQuantity : function(){
		var updatedMaterial = SubmitStore.getUpdatedMaterial();
		var currentMaterialList = this.state.info.materials;
		currentMaterialList[updatedMaterial.index]["quantity"] = updatedMaterial.quantity;	
		this.forceUpdate();
	},

	_updateIconurl : function(e){
		var info = this.state.info;
		info.icon_url = e.target.value;
		this.forceUpdate();
	},

	_updateRecipe: function(){
		var newInfo = this.state.info;
		var docId = newInfo.docId;
		delete newInfo.docId;
		//Update craft fee
		var newCraftFee = this.state.goldVal * 10000 + this.state.silverVal * 100 + this.state.copperVal * 1;
		newInfo.craftFee = newCraftFee;
		var data = {};
		data[docId] = newInfo;
		Actions.updateRecipe(data);
	},

	_submitRecipe : function(){
		var newInfo = this.state.info;
		var newCraftFee = this.state.goldVal * 10000 + this.state.silverVal * 100 + this.state.copperVal * 1;
		newInfo.craftFee = newCraftFee;
		Actions.submitRecipe(newInfo);
		this._clearForm();
	},

	_clearForm : function(){
		this.setState({
			info : {
				category : "stonecutter",
				description : ""
			},
			timeUnit : 1,
			goldVal : 0,
			silverVal : 0,
			copperVal : 0
		})
	}
});

module.exports = SubmitForm;