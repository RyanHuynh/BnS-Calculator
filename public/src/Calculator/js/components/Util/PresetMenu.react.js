var React = require('react');
var Menu = require('react-menu');
var Modal = require('boron/FlyModal');
Menu.injectCSS();
var MenuTrigger = Menu.MenuTrigger;
var MenuOptions = Menu.MenuOptions;
var MenuOption = Menu.MenuOption;

var PresetMenu = React.createClass({
	showModal: function(){
        this.refs.modal.show();
    },
    hideModal: function(){
        this.refs.modal.hide();
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
					<MenuOption onSelect={this.showModal}>
						Create New Preset
					</MenuOption>

					<MenuOption onSelect={this.showModal}>
						Load Preset
					</MenuOption>

					<MenuOption onSelect={this.showModal}>
						Save Preset
					</MenuOption>
				</MenuOptions>
			</Menu>
			<Modal ref="modal">
            	<h2>this is dialog</h2>
            	<button onClick={this.hideModal}>Close</button>
       		</Modal>
		</div>
		);
	}
});
module.exports = PresetMenu;