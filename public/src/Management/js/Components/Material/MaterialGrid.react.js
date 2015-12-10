var React = require('react');

var Actions = require('../../Actions/Actions');
var MainStore = require('../../Stores/MainStore');
var FeeEntry = require('../../Utils/FeeEntry.react');

var ReactBsTable  = require('react-bootstrap-table');
var DataSet = ReactBsTable.TableDataSet; //import TableDataSet
var Header = ReactBsTable.TableHeaderColumn;
var Table = ReactBsTable.BootstrapTable;

var MaterialGrid = React.createClass({
	getInitialState: function(){
		return {
			searchString : "",
			data : [],
			mode : "new",
			name : "",
			icon : ""
		}
	},

	componentDidMount: function(){
		MainStore.addMaterialListChangeListener(this._updateMaterialList);
		Actions.getMaterialList(this.state.searchString);
	},

	componentWillUnmount : function(){
		MainStore.removeMaterialListChangeListener(this._updateMaterialList);
	},

	render : function(){
		var me = this;
		function feeFormat(cell,row){
			return <FeeEntry editable={false} fee={cell} />
		}
		function durationFormat(cell, row){
			var h = parseInt(cell / 3600);
			var m = parseInt((cell%3600) / 60);
			var s = parseInt(cell%60);
			return (h > 0 ? h + "h" : "") + (m > 0 ? m + "m" : "") + (s > 0 ? s + "s" : "");
		}
		function iconFormat(cell,row){
			if(!cell)
				return;
			var iconURL = '../Calculator/img/items/' + cell;
			return <img src={iconURL} className='gridIcon'/>
		}
		
		function onRowSelect(cellData){
			me._selectedData = cellData;
		}
		var selectRowProp = {
			mode: "radio",
			clickToSelect: true,
			bgColor: "#613DCC",
			onSelect : onRowSelect,
			hideSelectColumn: true
		};

		var options = {
			sizePerPage : 5
		};
		return (
			<div>
				<div className="frameBorder noselect pure-u-20-30 gridView" >
					<img src="/Calculator/img/misc/materialTxt.png" />
					<div className="navigator">
						<div className="navigator-btn yellow" onClick={this._newMaterial} >New</div>
						<div className="navigator-btn yellow" onClick={this._editMaterial} >Edit</div>
						<div className="navigator-btn yellow" onClick={this._refreshList} >Refresh</div>
						<form className="searchBar">
							<input type="text" onChange={this._searchChange} value={this.state.searchString} placeholder="What are you looking for?"/>
							<div id="searchIcon"></div>
						</form>
					</div>
					<Table data={this.state.data} hover={true} pagination={true} height="280" selectRow={selectRowProp} options={options}>
						<Header dataField="id" dataAlign="center" isKey={true} width="50px">ID</Header>
						<Header className="gridIcon" dataField="icon_url" width="50px" dataAlign="center" dataFormat={iconFormat} >Icon</Header>
						<Header dataField="name" dataSort={true}>Name</Header>						
					</Table>
				</div>
				<div className="pure-u-1-30"></div>

				<MaterialEdit 
					id="materialEditForm" 
					className="frameBorder noselect pure-u-9-30" 
					style={{height : 458 }} 
					name={this.state.name} 
					icon={this.state.icon}
					mode={this.state.mode}
					docId={this._selectedData ? this._selectedData.docId : ""}
				/>
			</div>
		)
	},

	_selectedData : null,

	_newMaterial : function(){
		this._clearForm();
	},

	_editMaterial : function(){
		this.setState({
			mode : "edit"
		})
		var selectedData = this._selectedData;
		this.setState({
			name : selectedData.name,
			icon : selectedData.icon_url
		})
	},
	_refreshList : function(){
		Actions.getMaterialList(this.state.searchString);
		this._clearForm();
	},
	_updateMaterialList : function(){
	 	this.setState({
	 		data : MainStore.getMaterialList()
	 	})
	 },

	_searchChange : function(e){
		this.setState({
			searchString : e.target.value
		})
		Actions.searchMaterial(e.target.value);
	},

	_clearForm : function(){
		this._selectedData = null;
		this.setState({
			mode : "new",
			name : "",
			icon : ""
		})
	}, 
});


var MaterialEdit = React.createClass({
	getInitialState: function(){
		return {
			mode : "new",
			name : "",
			icon : ""
		}
	},
	componentWillReceiveProps : function(nextProps){
		this.setState({
			mode : nextProps.mode,
			name : nextProps.name,
			icon : nextProps.icon
		})
	},
	render : function(){
		return (
			<div className={this.props.className} id={this.props.id} style={this.props.style}>
				<img src="/Calculator/img/misc/materialTxt.png" />
				<div className="formEntry pure-g" style={{marginTop : 20}}>
					<label className="pure-u-6-24">Name:</label>
					<input type="text" placeholder="Material name" className="pure-u-18-24" value={this.state.name} onChange={this._updateMaterialName}/>
				</div>

				<div className="formEntry pure-g" >
					<label className="pure-u-6-24">Icon URL:</label>
					<input type="text" placeholder="Icon url" className="pure-u-18-24" value={this.state.icon} onChange={this._updateMaterialIcon} />
				</div>

				<div className="formEntry pure-g" style={{marginBottom : "0"}}>
				<label className="pure-u-6-24"></label>
					{ this.state.mode == "new" ? 
						<div className="pure-u-8-24 formBtn" onClick={this._submitMaterial}>Submit</div> :
						<div className="pure-u-8-24 formBtn" onClick={this._updateMaterial}>Update</div>
					}
					<div className="pure-u-2-24" ></div>
					<div className="pure-u-8-24 formBtn">Clear</div> 
				</div>
			</div>
		)
	},

	_submitMaterial : function(){
		Actions.submitMaterial({
			name : this.state.name,
			icon_url : this.state.icon
		})
		this._clearForm();
	},

	_updateMaterial : function(){
		var data = {};
		var docId = this.props.docId;
		data[docId] = {
			name : this.state.name,
			icon_url : this.state.icon
		}
		Actions.updateMaterial(data)
		this._clearForm();
	},

	_updateMaterialIcon: function(e){
		this.setState({
			icon : e.target.value
		})
	},

	_updateMaterialName : function(e){
		this.setState({
			name : e.target.value
		})
	},

	_clearForm : function(){
		this.setState({
			mode : "new",
			name : "",
			icon : ""
		})
	}, 
})
module.exports = MaterialGrid;