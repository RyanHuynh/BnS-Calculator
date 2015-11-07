var React = require('react');
var Actions = require('../../Actions/Actions');
var Dropzone = require('react-dropzone');
var IconSubmit = React.createClass({
	getInitialState : function(){
		return {
			name : "",
			type : "recipe",
			files : []
		}
	},
	render : function(){
		var me = this;
		var typeList = [
			{
				value : "material",
				display : "Material"
			},
			{
				value : "recipe",
				display : "Recipe"
			}
		]

		function _handleImgSubmit(files){
			me.setState({
				files : files
			})
		}
		return (
			<div className={this.props.className + " frameBorder noselect"} style={{height : "100%", marginTop : "3%"}}>
				<div className="pure-u-14-24">
					<img src="../Calculator/img/misc/iconSubmitTxt.png" style={{marginBottom : "3%"}}/>
					<div className="formEntry">
						<label className="pure-u-6-24">Name:</label>
						<input className="pure-u-16-24" type="text" onChange={this._nameChange} value={this.state.name}/>
					</div>

					<div className="formEntry">
						<label className="pure-u-6-24">Type:</label>
						<select className="pure-u-16-24" onChange={this._typeChange} value={this.state.type}>
						{
							typeList.map(function(item, index){
								return <option key={index} value={item.value} >{item.display}</option>
							}, this)
						}
						</select>
					</div>

					<div className="formEntry">
						<label className="pure-u-6-24">Preview:</label>
						{ this.state.files.length == 0 ?
							<img src='../Calculator/img/misc/deleteBtn.png' style={{width: "15%"}}/> :
							<img src={this.state.files[0].preview} style={{width: "15%"}}/> 
						}
					</div>

					<div className="formEntry">
						<div className="pure-u-10-24 formBtn" onClick={this._uploadIcon} >Upload</div>
						<div className="pure-u-2-24" />
						<div className="pure-u-10-24 formBtn" >Cancel</div>
					</div>



				</div>
				<div className="pure-u-10-24">
					 <Dropzone onDrop={_handleImgSubmit} className="drop-zone-style">
              			<div>Drop or click here to submit files.</div>
            		</Dropzone>
				</div>
			</div>
		)
	},

	_typeChange: function(e){
		this.setState({
			type : e.target.value
		})
	},

	_uploadIcon : function(){
		if(this._isValid()){
			Actions.uploadIcon({
				name : this.state.name,
				type : this.state.type
			},
			this.state.files[0]);
			this._clearForm();
		}
	},

	_nameChange : function(e){
		this.setState({
			name : e.target.value
		})
	},

	_clearForm : function(){
		this.setState({
			name : "",
			type : "recipe",
			files : []
		})
	},

	_isValid : function(){
		if(this.state.name == "")
			return false;
		else if(!this.state.files || this.state.files.length == 0)
			return false;
		else 
			return true;
	}
});

module.exports = IconSubmit;