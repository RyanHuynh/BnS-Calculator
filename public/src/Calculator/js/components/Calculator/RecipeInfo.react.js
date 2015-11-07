var React = require('react');
var Actions = require('../../actions/Actions');
var FeeEntry =require('../Ultil/FeeEntry.react');
var Constants = require('../../constants/Constants');
var ReactTooltip = require('react-tooltip');
var ReactPropTypes = React.PropTypes;

var RecipeInfo = React.createClass({

	propTypes : {
		info : ReactPropTypes.object
	},
	render : function(){
		var info = this.props.info;
		var duration = info.duration;
		var favourite = info.favourite;
		var h = parseInt(duration / 3600);
		var m = parseInt((duration%3600) / 60);
		var s = parseInt(duration%60);

		var imgsrc = "img/misc/" + ( favourite ? "" : "un" ) + "favourite.png";
		var dataTip= !favourite ? "Add to favourite." : "Remove from favourite."
		var dataType = !favourite ? "light" : "warning"

		var durationStr = (h > 0 ? h + " hr" : "") + (m > 0 ? m + " min" : "") + (s > 0 ? s + " sec" : "");
		return (
			<div id="recipeSection">
				<div id="recipe_header">
					<div id="recipeTxt" className="sectionTxt" ></div>
					<img className="favouriteIcon" src={imgsrc} onClick={this._editFavourite} data-tip={dataTip} data-type="info" />
				</div>
				<div id="description">
					<div>
						<img src={'../img/items/' + info.icon_url} alt="recipe" className="bigIcon" />
						<div style={{color : "white"}} dangerouslySetInnerHTML={{__html: info.description}}></div>
					</div>
				</div>
				<div id="recipeInfo">
					<div className="entry">
						<b className="infoText" >Name:</b>
						<p >{info.name}</p>
					</div>
					<div className="entry">
						<b className="infoText" >Quantity:</b>
						<p>{info.quantity}</p>
					</div>
					<div className="entry">
						<b className="infoText" >Craft time:</b>
						<p>{durationStr}</p>
					</div>
					<div className="entry">
						<b className="infoText" >Market price ( .ea ):</b>
						<FeeEntry editable={true} feeType={Constants.ITEM_FEE} id={this.props.info.id} fee={this.props.itemFee}/>
					</div>
					<div className="entry">
						<b className="infoText" >Craft fee:</b>
						<FeeEntry editable={false} fee={info.craftFee} />
					</div>
				</div>
			</div>
		)
	},
	_editFavourite : function(){
		Actions.editFavourite(this.props.info.id, !this.props.info.favourite);
	}
});

module.exports = RecipeInfo;