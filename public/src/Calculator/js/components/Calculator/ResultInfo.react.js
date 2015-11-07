var React = require('react');
var FeeEntry = require('../Ultil/FeeEntry.react');
var ReactPropTypes = React.PropTypes;

var ResultInfo = React.createClass({

	propTypes : {
		craftCost : ReactPropTypes.number,
		profit : ReactPropTypes.number,
		profitRatio : ReactPropTypes.number,
		profitEA : ReactPropTypes.number
	},

	render : function(){
		return (
			<div id="resultSection" >
				<div id="resultTxt" className="sectionTxt"></div>
				<div id="resultInfo">
					<div className="entry">
						<b className="infoText" >Craft cost:</b>
						<FeeEntry editable={false} fee={this.props.craftCost}/>
					</div>
					<div className="entry">
						<b className="infoText" >Total Profit:</b>
						<FeeEntry editable={false} fee={this.props.profit} />
					</div>
					<div className="entry">
						<b className="infoText" >Profit ( .ea ):</b>
						<FeeEntry editable={false} fee={this.props.profitEA} />
					</div>
					<div className="entry">
						<b className="infoText" >Profit ratio ( per min ):</b>
						<FeeEntry editable={false} fee={this.props.profitRatio}/>
					</div>
				</div>
			</div>
		)
	},
});

module.exports = ResultInfo;