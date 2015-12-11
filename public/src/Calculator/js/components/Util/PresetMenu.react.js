var React = require('react');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');
var Menu = require('../../lib/react-menu');
var Modal = require('boron/DropModal');
Menu.injectCSS();
var MenuTrigger = Menu.MenuTrigger;
var MenuOptions = Menu.MenuOptions;
var MenuOption = Menu.MenuOption;

var PresetMenu = React.createClass({
	getInitialState : function(){
		return {
			name : "",
			type : "new",
			passphrase : "",
			presetName : ""
		}
	},
	componentDidMount : function(){
		Store.addPresetChangedListener(this._updatePreset);
	},
	componentWillUnmount : function(){
		Store.removePresetChangedListener(this._updatePreset);
	},
	render : function(){
		return (
		<div className="presetMenu">
			<b >Preset: </b>&nbsp;
			<p style={{minWidth : 100}} >{this.state.presetName != "" ? this.state.presetName : "None is selected"}</p>
			<Menu >
				<MenuTrigger>
				</MenuTrigger>
				<MenuOptions >
					<MenuOption onSelect={this._showModal.bind(this, "new")}>
						Create New Preset
					</MenuOption>

					<MenuOption onSelect={this._showModal.bind(this, "load")}>
						Load Preset
					</MenuOption>
					{this.state.presetName != "" ? 
						<MenuOption onSelect={this._savePreset}>
							Save Preset
						</MenuOption> : ""
					}
				</MenuOptions>
			</Menu>
			<Modal ref="modal" className="presetModal">
            	<h1>{this.state.type == "new"? "Create New Preset" : "Load Preset"}</h1>
				<input type="text" value={this.state.name} onChange={this._updateName} placeholder="Name"/>
				<input type="text" value={this.state.passphrase} onChange={this._updatePassphrase} placeholder="Passphrase (optional)"/>
				<span className="divider" />
				{this.state.type == "new" ?
					<span className="presetFormBtn submitBtn" onClick={this._submitPreset}>Submit</span> : 
					<span className="presetFormBtn submitBtn" onClick={this._loadPreset}>Load</span> 
				}
            	<span className="presetFormBtn cancelBtn" onClick={this._hideModal}>Close</span>
       		</Modal>
		</div>
		);
	},
	_showModal: function(type){
		this.setState({
			name : "",
			passphrase : "",
			type : type
		});
        this.refs.modal.show();
    },
    _hideModal: function(){
        this.refs.modal.hide();
    },
    _submitPreset : function(){
    	if(this.state.name.trim() != ""){
	    	Actions.submitPreset(this.state.name, this.state.passphrase);
	    	this.refs.modal.hide();
	    }
    },
    _loadPreset : function(){
    	if(this.state.name.trim() != ""){
	    	Actions.loadPreset(this.state.name, this.state.passphrase);
	    	this.refs.modal.hide();
	    }
    },
    _savePreset : function(){
    	Actions.savePreset(this.state.presetName);
    	this.refs.modal.hide();
    },
    _updateName : function(event){
    	var name = event.target.value;
    	this.setState({
    		name : name
    	})
    },
    _updatePassphrase : function(event){
    	var pass = event.target.value;
    	this.setState({
    		passphrase : pass
    	})
    },
    _updatePreset : function(name){
    	this.setState({
    		presetName : name
    	})
    }

});
module.exports = PresetMenu;