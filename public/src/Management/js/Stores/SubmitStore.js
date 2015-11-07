var AppDispatcher = require('../Dispatchers/AppDispatcher');
var Constants = require('../Utils/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var MainStore = require('./MainStore');

var MATERIAL_LIST_CHANGED = "material list changed";
var MATERIAL_QUANTITY_CHANGED = "material quantity changed";

var _deletedMaterialEntryIndex = -1;
var _updatedMaterial = {};


function updateRecipe(info){
	var encodedData = $.param(info);
	$.ajax({
		url: '/updateRecipe',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : encodedData,
		success : function(data){
			
		},
		error : function(){

		}
	})
}


function submitRecipe(info){
	var encodedData = $.param(info);
	$.ajax({
		url: '/submitRecipe',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : encodedData,
		success : function(data){
			
		},
		error : function(){

		}
	})
}

function deleteRecipe(index){
	$.ajax({
		url: '/deleteRecipe',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : { id : index },
		success : function(data){
			
		},
		error : function(){

		}
	})
}

function updateMaterial(info){
	var encodedData = $.param(info);
	$.ajax({
		url: '/updateMaterial',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : encodedData,
		success : function(data){

		},
		error : function(){

		}
	})
}

function submitMaterial(info){
	var encodedData = $.param(info);
	$.ajax({
		url: '/submitMaterial',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : encodedData,
		success : function(data){
	
		},
		error : function(){

		}
	})
}

//Handle Icon Submission
function uploadIcon(info, file){
	var formData = new FormData();
	formData.append('name', info.name);
	formData.append('type', info.type);
	formData.append('image', file);
	$.ajax({
		url: '/uploadIcon',
		dataType: 'json',
		type : 'POST',
		cache : false,
		data : formData,
		processData: false,
    	contentType: false,
		success : function(data){
	
		},
		error : function(){

		}
	})
}

var SubmitStore = assign({}, EventEmitter.prototype, {
	
	getDeletedMaterialEntryIndex : function(){
		return _deletedMaterialEntryIndex;
	},

	getUpdatedMaterial : function(){
		return _updatedMaterial;
	},

	emitMaterialListChange : function(){
		this.emit(MATERIAL_LIST_CHANGED)
	},
	addMaterialListChangeListener : function(callback){
		this.on(MATERIAL_LIST_CHANGED, callback);
	},
	removeMaterialListChangeListener : function(callback){
		this.removeListener(MATERIAL_LIST_CHANGED, callback)
	},

	emitMaterialQuantityChange : function(){
		this.emit(MATERIAL_QUANTITY_CHANGED);
	},
	addMaterialQuantityChangeListener : function(callback){
		this.on(MATERIAL_QUANTITY_CHANGED, callback);
	},
	removeMaterialQuantityChangeListener : function(callback){
		this.removeListener(MATERIAL_QUANTITY_CHANGED, callback)
	},
});

AppDispatcher.register(function(action){
	switch (action.actionType){
		case Constants.DELETE_MATERIAL_ENTRY:
			_deletedMaterialEntryIndex = action.index;
			SubmitStore.emitMaterialListChange();
			break;

		case Constants.UPDATE_MATERIAL_QUANTITY:
			_updatedMaterial ={
				index : action.index,
				quantity : action.quantity
			}
			SubmitStore.emitMaterialQuantityChange();
			break;

		case Constants.UPDATE_RECIPE:
			updateRecipe(action.info);
			break;

		case Constants.SUBMIT_RECIPE:
			submitRecipe(action.info);
			break;
		case Constants.DELETE_RECIPE:
			deleteRecipe(action.id);
			break;

		case Constants.UPDATE_MATERIAL:
			updateMaterial(action.info);
			break;

		case Constants.SUBMIT_MATERIAL:
			submitMaterial(action.info);
			break;

		case Constants.UPLOAD_ICON:
			uploadIcon(action.info, action.file);
			break;
	}
});

module.exports = SubmitStore;