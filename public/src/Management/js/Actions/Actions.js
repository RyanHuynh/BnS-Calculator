var AppDispatcher = require('../Dispatchers/AppDispatcher');
var Constants = require('../Utils/Constants');

var Actions = {

	//Recipe grid's actions
	searchRecipe : function(text){
		AppDispatcher.dispatch({
			actionType : Constants.SEARCH_RECIPE,
			searchString : text
		})
	},
	
	getRecipeList: function(category, searchStr){
		AppDispatcher.dispatch({
			actionType : Constants.GET_RECIPE_LIST,
			category : category,
			searchString : searchStr
		})
	},

	updateSelectedRecipe : function(data){
		AppDispatcher.dispatch({
			actionType : Constants.UPDATE_SELECTED_RECIPE,
			item : data || null
		})
	},

	//Recipe submission form's actions
	deleteMaterialEntry : function(index){
		AppDispatcher.dispatch({
			actionType : Constants.DELETE_MATERIAL_ENTRY,
			index : index
		})
	},

	updateMaterialQuantity : function(index, newVal){
		AppDispatcher.dispatch({
			actionType : Constants.UPDATE_MATERIAL_QUANTITY,
			index : index,
			quantity : newVal
		})
	},

	//Recipe CRUD
	updateRecipe : function(info){
		AppDispatcher.dispatch({
			actionType : Constants.UPDATE_RECIPE,
			info : info
		})
	},

	submitRecipe : function(info){
		AppDispatcher.dispatch({
			actionType : Constants.SUBMIT_RECIPE,
			info : info
		})
	},

	deleteRecipe : function(id){
		AppDispatcher.dispatch({
			actionType : Constants.DELETE_RECIPE,
			id : id
		})
	},

	//Material CRUD
	updateMaterial : function(info){
		AppDispatcher.dispatch({
			actionType : Constants.UPDATE_MATERIAL,
			info : info
		})
	},

	submitMaterial : function(info){
		AppDispatcher.dispatch({
			actionType : Constants.SUBMIT_MATERIAL,
			info : info
		})
	},

	//Material Grid's actions
	searchMaterial : function(text){
		AppDispatcher.dispatch({
			actionType : Constants.SEARCH_MATERIAL,
			searchString : text
		})
	},

	getMaterialList : function(searchStr){
		AppDispatcher.dispatch({
			actionType : Constants.GET_MATERIAL_LIST,
			searchString : searchStr
		})
	},

	//Icon CRUD
	uploadIcon : function(info, file){
		AppDispatcher.dispatch({
			actionType : Constants.UPLOAD_ICON,
			info : info,
			file : file
		})
	},

	searchIcon : function(text){
		AppDispatcher.dispatch({
			actionType : Constants.SEARCH_ICON,
			searchString : text
		})
	},

	getIconList : function(type, searchStr){
		AppDispatcher.dispatch({
			actionType : Constants.GET_ICON_LIST,
			type : type,
			searchString : searchStr
		})
	},

	updateSelectedIcon : function(info){
		AppDispatcher.dispatch({
			actionType : Constants.UPDATE_SELECTED_ICON,
			info : info
		})
	},

	//Utility
	backupData : function(){
		AppDispatcher.dispatch({
			actionType : Constants.BACKUP_DATA
		})
	}
}

module.exports = Actions;