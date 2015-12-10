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
			passphrase : ""
		}
	},
	render : function(){
		return (
		<div className="presetMenu">
			<b >Preset: </b>&nbsp;
			<p onClick={this.showModal}>None is selected</p>
			<Menu >
				<MenuTrigger>
				</MenuTrigger>
				<MenuOptions >
					<MenuOption onSelect={this._showModal}>
						Create New Preset
					</MenuOption>

					<MenuOption onSelect={this._showModal}>
						Load Preset
					</MenuOption>

					<MenuOption onSelect={this._showModal}>
						Save Preset
					</MenuOption>
				</MenuOptions>
			</Menu>
			<Modal ref="modal" className="presetModal">
            	<h1>Create new preset</h1>
            	<div>
					<label>Name:</label>
					<input type="text" value={this.state.name} onChange={this._updateName}/>
				</div>
				<div>
					<label>Passphrase (optional):</label>
					<input type="text" value={this.state.passphrase} onChange={this._updatePassphrase}/>
				</div>
				<button onClick={this._submitPreset}>Submit</button>
            	<button onClick={this._hideModal}>Close</button>
       		</Modal>
		</div>
		);
	},
	_showModal: function(){
		this.setState({
			name : "",
			passphrase : ""
		});
        this.refs.modal.show();
    },
    _hideModal: function(){
        this.refs.modal.hide();
    },
    _submitPreset : function(){
    	Actions.submitPreset(this.state.name, this.state.passphrase);
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
    }

});
module.exports = PresetMenu;