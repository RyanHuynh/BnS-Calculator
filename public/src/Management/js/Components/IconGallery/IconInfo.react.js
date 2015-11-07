var React = require('react');
var MainStore = require('../../Stores/MainStore');

var IconInfo = React.createClass({
	getInitialState : function(){
		return {
			name : "",
			icon_url : "",
			type : ""
		}
	},

	componentDidMount : function(){
		MainStore.addSelectedIconChangeListener(this._updateSelectedIcon);
	},

	componentWillUnmount : function(){
		MainStore.removeSelectedIconChangeListener(this._updateSelectedIcon);
	},
	render : function(){
		return (
			<div className={this.props.className + " frameBorder"}  style={{height : "100%", marginTop : "3%"}}>
				<img src="../Calculator/img/misc/iconSubmitTxt.png" style={{marginBottom : "3%"}}/>
				<div className="formEntry">
					<label className="pure-u-8-24">Name:</label>
					<p className="pure-u-16-24">{this.state.name}</p>
				</div>
				<div className="formEntry">
					<label className="pure-u-8-24">Type:</label>
					<p className="pure-u-16-24">{this.state.type}</p>
				</div>
				<div className="formEntry">
					<label className="pure-u-8-24">Icon URL:</label>
					<p className="pure-u-16-24">{this.state.icon_url}</p>
				</div>
				<div className="formEntry">
					<label className="pure-u-8-24">Icon Preview:</label>
					{
						this.state.icon_url != "" ?
						<img src={ "../Calculator/img/items/" + this.state.icon_url } className="pure-u-16-24" style={{width : "26%"}}/> : null
					}
				</div>
			</div>
		)
	},

	_updateSelectedIcon : function(){
		var selectedIcon = MainStore.getSelectedIcon();
		this.setState({
			name : selectedIcon.name,
			icon_url : selectedIcon.icon_url,
			type : selectedIcon.type
		})
	}
});

module.exports = IconInfo;