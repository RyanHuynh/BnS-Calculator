var AppDispatcher = require('../Dispatchers/AppDispatcher');
var Constants = require('../Utils/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var RECIPE_LIST_CHANGED = "recipe list changed";
var MATERIAL_LIST_CHANGED = "material list changed";
var ICON_LIST_CHANGED = "icon list changed";
var ICON_CHANGED = "icon changed";

var _recipeList = [];
var _copiedRecipeList = [];
var _materialList = [];
var _copiedMaterialList = [];
var _iconList = [];
var _copiedIconList = [];
var _selectedRecipe = {};
var _selectedIcon = null;
//Get new item list on new category, then filter result by  current search string.
function getRecipeList(category, searchStr){
	$.ajax({
		url: '/getRecipeList',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : {data : category},
		success : function(data){
			if(data.data){
				_recipeList = data.data;
				_copiedRecipeList = _recipeList.slice();
				searchRecipe(searchStr);
			}
		}
	})
}

//Filter out result base on current search string
function searchRecipe(searchStr){
	var newItemList = [];
	var regexPattern = new RegExp("[a-zA-Z0-9]*" + searchStr + "[a-zA-Z0-9]*", "i");

	for(var i = 0; i < _copiedRecipeList.length ; i++){
		var entry = _copiedRecipeList[i];
		var name = entry.name;
		var icon_url = entry.icon_url;
		var description = entry.description;
		var category = entry.category;

		if(regexPattern.test(name))
			newItemList.push(entry);
		else if (regexPattern.test(icon_url))
			newItemList.push(entry);
		else if (regexPattern.test(category))
			newItemList.push(entry);
		else if (regexPattern.test(description))
			newItemList.push(entry);
	}

	_recipeList = newItemList;
	MainStore.emitRecipeListChange();
}

function updateSelectedRecipe(recipe){
	_selectedRecipe = recipe;
}

//Material related functions
function getMaterialList(searchStr){
	$.ajax({
		url: '/getMaterialList',
		dataType: 'json',
		type : 'GET',
		cache : false,
		success : function(resp){
			_materialList = resp.data;
			_copiedMaterialList = _materialList.slice();
			
			//Filter the result by search string.
			searchMaterial(searchStr);
		},
		error : function(){

		}
	})
}

function searchMaterial(searchStr){
	var newItemList = [];
	var regexPattern = new RegExp("[a-zA-Z0-9]*" + searchStr + "[a-zA-Z0-9]*", "i");

	for(var i = 0; i < _copiedMaterialList.length ; i++){
		var entry = _copiedMaterialList[i];
		var name = entry.name;
		var icon_url = entry.icon_url;
		if(regexPattern.test(name))
			newItemList.push(entry);
		else if (regexPattern.test(icon_url))
			newItemList.push(entry);
	}

	_materialList = newItemList;
	MainStore.emitMaterialListChange();
}

//Icon
function getIconList(type, searchStr){
	$.ajax({
		url: '/getIconList',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : {data : type},
		success : function(data){
			if(data.data){
				_iconList = data.data;
				_copiedIconList = _iconList.slice();
				searchIcon(searchStr);
			}
		}
	})
}
function searchIcon(searchStr){
	var newItemList = [];
	var regexPattern = new RegExp("[a-zA-Z0-9]*" + searchStr + "[a-zA-Z0-9]*", "i");

	for(var i = 0; i < _copiedIconList.length ; i++){
		var entry = _copiedIconList[i];
		var name = entry.name;
		if(regexPattern.test(name))
			newItemList.push(entry);
	}

	_iconList = newItemList;
	MainStore.emitIconListChange();
}

function updateSelectedIcon(info){
	_selectedIcon = info;
	MainStore.emitSelectedIconChange();
}

function backupData(){
	$.ajax({
		url : '/backupData',
		type : 'GET',
		success : function(resp){
			
		}
	})
}
var MainStore = assign({}, EventEmitter.prototype, {

	getRecipeList : function(){
		return _recipeList;
	},

	getMaterialList : function(){
		return _materialList;
	},

	getIconList : function(){
		return _iconList;
	},

	getSelectedRecipe : function(){
		return _selectedRecipe;
	},

	getSelectedIcon : function(){
		return _selectedIcon;
	},

	emitRecipeListChange : function(){
		this.emit(RECIPE_LIST_CHANGED);
	},
	addRecipeListChangeListener : function(callback){
		this.on(RECIPE_LIST_CHANGED, callback);
	},
	removeRecipeListChangeListener : function(callback){
		this.removeListener(RECIPE_LIST_CHANGED, callback);
	},

	emitMaterialListChange : function(){
		this.emit(MATERIAL_LIST_CHANGED);
	},
	addMaterialListChangeListener : function(callback){
		this.on(MATERIAL_LIST_CHANGED, callback);
	},
	removeMaterialListChangeListener : function(callback){
		this.removeListener(MATERIAL_LIST_CHANGED, callback);
	},

	emitIconListChange : function(){
		this.emit(ICON_LIST_CHANGED);
	},
	addIconListChangeListener : function(callback){
		this.on(ICON_LIST_CHANGED, callback);
	},
	removeIconListChangeListener : function(callback){
		this.removeListener(ICON_LIST_CHANGED, callback);
	},

	emitSelectedIconChange : function(){
		this.emit(ICON_CHANGED);
	},
	addSelectedIconChangeListener : function(callback){
		this.on(ICON_CHANGED, callback);
	},
	removeSelectedIconChangeListener : function(callback){
		this.removeListener(ICON_CHANGED, callback);
	},

})

AppDispatcher.register(function(action){
	switch (action.actionType){
		case Constants.GET_RECIPE_LIST:
			var category = action.category;
			var searchStr = action.searchString;
			if(category && (searchStr || searchStr == "") )
				getRecipeList(category, searchStr);
			break;

		case Constants.SEARCH_RECIPE:
			searchRecipe(action.searchString);
			break;

		case Constants.UPDATE_SELECTED_RECIPE : 
			updateSelectedRecipe(action.item);
			break;

		case Constants.GET_MATERIAL_LIST :
			getMaterialList(action.searchString);
			break;

		case Constants.SEARCH_MATERIAL: 
			searchMaterial(action.searchString);
			break;

		case Constants.GET_ICON_LIST :
			getIconList(action.type, action.searchString);
			break;

		case Constants.SEARCH_ICON: 
			searchIcon(action.searchString);
			break;

		case Constants.UPDATE_SELECTED_ICON:
			updateSelectedIcon(action.info);
			break;
		
		case Constants.BACKUP_DATA:
			backupData();
			break;
	}
});

module.exports = MainStore;