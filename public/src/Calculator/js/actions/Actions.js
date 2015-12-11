var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {
	updateCategory : function(category, searchStr){
		AppDispatcher.dispatch({
			actionType : Constants.UPDATE_CATEGORY,
			category : category,
			searchString : searchStr
		})
	},

	searchChanged : function(text){
		AppDispatcher.dispatch({
			actionType : Constants.SEARCH_CHANGE,
			searchString : text
		})
	},

	showInfo : function(data){
		AppDispatcher.dispatch({
			actionType : Constants.DISPLAY_INFO,
			data : data
		})
	},

	updateFee: function(data){
		AppDispatcher.dispatch({
			actionType : Constants.UPDATE_FEE,
			feeType : data.feeType,
			id : data.id,
			totalFee : data.totalFee
		})
	},

	editFavourite : function(id, state){
		AppDispatcher.dispatch({
			actionType : Constants.EDIT_FAVOURITE,
			id : id,
			state : state
		})
	},

	submitPreset: function(name, passphrase){
		AppDispatcher.dispatch({
			actionType : Constants.SUBMIT_PRESET,
			name : name,
			passphrase : passphrase
		})
	},

	loadPreset: function(name, passphrase){
		AppDispatcher.dispatch({
			actionType : Constants.LOAD_PRESET,
			name : name,
			passphrase : passphrase
		})
	},

	savePreset: function(presetName){
		AppDispatcher.dispatch({
			actionType : Constants.SAVE_PRESET,
			preset_name : presetName
		})
	}
}

module.exports = Actions;