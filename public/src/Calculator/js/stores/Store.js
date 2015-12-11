var AppDispatcher = require('../dispatchers/AppDispatcher');
var Actions = require('../actions/Actions');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');	
var assign = require('object-assign');

var LIST_CHANGED_EVENT = 'changed';
var INFO_CHANGED_EVENT = 'info_changed';
var MATERIAL_FEE_CHANGED = 'material_fee_changed';
var ITEM_FEE_CHANGED = 'item_fee_changed';
var MSG_CHANGED = 'massage changed';
var PRESET_CHANGED = 'preset has changed.'

var LIMIT_DISPLAY = 100;
var _itemList = [];
var _copiedList = []; //This is used to remember old data for searching.
var _itemInfo = {};

var _materialFeeList = JSON.parse(localStorage.getItem('material')) || {}; //keep track of materials for fast edit.
var _itemFeeList = JSON.parse(localStorage.getItem('item')) || {}; //keep track of item for fast edit.

var _favouriteList = JSON.parse(localStorage.getItem('favourite')) || {};

var _currentPresetId = null;

//Get new item list on new category, then filter result by  current search string.
function updateCategory(category, searchStr){
	if(category == "favourite"){
		var idList = [];
		for(id in _favouriteList){
			if(_favouriteList[id] == true)
				idList.push(id);
		}

		$.ajax({
			url: 'api/getCustomItemList',
			dataType: 'json',
			type : 'POST',
			cache : false,
			data : {data : JSON.stringify(idList)},
			success : function(data){
				if(data.data){
					_itemList = data.data;
					_copiedList = _itemList.slice();
					filterBySearch(searchStr);
				}
			},
			error : function(){

			}
		})
	}
	else {
		$.ajax({
			url: 'api/getItemList',
			dataType: 'json',
			type : 'POST',
			cache : false,
			data : {data : category},
			success : function(data){
				if(data.data){
					_itemList = data.data;
					_copiedList = _itemList.slice();
					filterBySearch(searchStr);
				}
			},
			error : function(){

			}
		})
	}
}

//Filter out result base on current search string
function filterBySearch(value){
	var newItemList = [];
	var regexPattern = new RegExp("[a-zA-Z0-9]*" +  value + "[a-zA-Z0-9]*", "i");

	for(var i = 0; i < _copiedList.length ; i++){
		var entry = _copiedList[i];
		var name = entry.name;
		if(regexPattern.test(name))
			newItemList.push(entry);
		if(newItemList.length == LIMIT_DISPLAY)
			break;
	}

	_itemList = newItemList;
	Store.emitListChanged();

}

function infoForRecipe(recipe){
	_itemInfo = recipe;
	_itemInfo.favourite = _favouriteList[_itemInfo.id] || false;

	if(recipe.materials){
		var materialsList = recipe.materials;
		for(var i = 0; i < materialsList.length; i++){
			var material = materialsList[i];
			var id = material.id;
			if(!_materialFeeList[id])
				_materialFeeList[id] = 0;
		}
	}
	if(!_itemFeeList[recipe.id])
		_itemFeeList[recipe.id] = 0;
	Store.emitInfoChanged();
}

//Update material fee
function updateMaterialFee(id, totalFee){
	_materialFeeList[id] = totalFee;
	localStorage.setItem('material', JSON.stringify(_materialFeeList));
	Store.emitMaterialFeeChanged();
}

//Update item fee
function updateItemFee(id, totalFee){
	_itemFeeList[id] = totalFee;
	localStorage.setItem('item', JSON.stringify(_itemFeeList));
	Store.emitItemFeeChanged();
}

function updateFavourite(id, state){
	_favouriteList[id] = state;
	localStorage.setItem('favourite', JSON.stringify(_favouriteList));
	_itemInfo.favourite = state;
	Store.emitInfoChanged();
}

//Preset
function submitPreset(name, passphrase){
	$.ajax({
		url: 'api/submitPreset',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : {
			name : name,
			passphrase : passphrase
		},
		success : function(data){
			if(data.status == "success"){
				_currentPresetId = data["sys_id"];
				Store.emitPresetChanged(name);
			}
			Store.emitMsg(data.status, data.message);
		},
		error : function(){
			Store.emitMsg(data.status, data.message);
		}
	})
}

function loadPreset(name, passphrase){
	$.ajax({
		url: 'api/loadPreset',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : {
			name : name,
			passphrase : passphrase
		},
		success : function(data){
			if(data.status == "success"){
				_currentPresetId = data["sys_id"];
				_itemFeeList = data["record"]["item"] != "" ? JSON.parse(data["record"]["item"]) : {};
				_materialFeeList  = data["record"]["material"] != "" ? JSON.parse(data["record"]["material"]) : {};
				localStorage.setItem('item', JSON.stringify(_itemFeeList));
				localStorage.setItem('material', JSON.stringify(_materialFeeList));
				Store.emitInfoChanged();
				Store.emitPresetChanged(name);
			}
			Store.emitMsg(data.status, data.message);
		},
		error : function(){
			Store.emitMsg(data.status, data.message);
		}
	})
}

function savePreset(){
	$.ajax({
		url: 'api/savePreset',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : {
			sys_id : _currentPresetId,
			data : {
				item : JSON.stringify(_itemFeeList),
				material : JSON.stringify(_materialFeeList)
			}
		},
		success : function(data){
			Store.emitMsg(data.status, data.message);
		},
		error : function(){
			Store.emitMsg(data.status, data.message);
		}
	})
}

var Store = assign({}, EventEmitter.prototype, {

	getItemInfo : function(){
		return _itemInfo;
	},

	getItemFee : function(id){
		return _itemFeeList[id];
	},

	getItemList : function(){
		return _itemList;
	},

	getMaterialFee : function(id){
		return _materialFeeList[id];
	},

	addListChangedListener : function(callback){
		this.on(LIST_CHANGED_EVENT, callback);
	},

	removeListChangedListener : function(callback){
		this.removeListener(LIST_CHANGED_EVENT, callback);
	},

	addInfoChangedListener : function(callback){
		this.on(INFO_CHANGED_EVENT, callback);
	},

	removeInfoChangedListener : function(callback){
		this.removeListener(INFO_CHANGED_EVENT, callback);
	},

	addMaterialFeeChangedListener : function(callback){
		this.on(MATERIAL_FEE_CHANGED, callback);
	},

	removeMaterialFeeChangedListener : function(callback){
		this.removeListener(MATERIAL_FEE_CHANGED, callback);
	},

	addItemFeeChangedListener : function(callback){
		this.on(ITEM_FEE_CHANGED, callback);
	},

	removeItemFeeChangedListener : function(callback){
		this.removeListener(ITEM_FEE_CHANGED, callback);
	},

	addMsgChangedListener : function(callback){
		this.on(MSG_CHANGED, callback);
	},

	removeMsgChangedListener : function(callback){
		this.removeListener(MSG_CHANGED, callback);
	},

	addPresetChangedListener : function(callback){
		this.on(PRESET_CHANGED, callback);
	},

	removePresetChangedListener : function(callback){
		this.removeListener(PRESET_CHANGED, callback);
	},

	emitListChanged : function(){
		this.emit(LIST_CHANGED_EVENT);
	},

	emitInfoChanged : function(){
		this.emit(INFO_CHANGED_EVENT);
	},

	emitMaterialFeeChanged : function(){
		this.emit(MATERIAL_FEE_CHANGED);
	},

	emitItemFeeChanged : function(){
		this.emit(ITEM_FEE_CHANGED);
	},

	emitMsg : function(status, msg){
		this.emit(MSG_CHANGED, status, msg);
	},

	emitPresetChanged : function(name){
		this.emit(PRESET_CHANGED, name);
	}


});

AppDispatcher.register(function(action){
	var category,searchStr,data;
	switch(action.actionType){
		case Constants.UPDATE_CATEGORY:
			category = action.category;
			searchStr = action.searchString;
			if(category && (searchStr || searchStr == "") )
				updateCategory(category, searchStr);
			break;

		case Constants.SEARCH_CHANGE:
			searchStr = action.searchString;
			if(searchStr || searchStr == "")
				filterBySearch(searchStr);
			break;

		case Constants.DISPLAY_INFO:
			data = action.data;
			if(data)
				infoForRecipe(data);
			break;

		case Constants.UPDATE_FEE:
			if(action.feeType == Constants.MATERIAL_FEE){
				updateMaterialFee(action.id, action.totalFee);
				break;
			}
			else if(action.feeType == Constants.ITEM_FEE){
				updateItemFee(action.id, action.totalFee);
				break;
			}

		case Constants.EDIT_FAVOURITE:
			updateFavourite(action.id, action.state);
			break;

		case Constants.SUBMIT_PRESET:
			submitPreset(action.name, action.passphrase);
			break;

		case Constants.LOAD_PRESET:
			loadPreset(action.name, action.passphrase);
			break;

		case Constants.SAVE_PRESET: 
			savePreset(action.preset_name);
			break;
	}

})

module.exports = Store;
