var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var MainView = require('./Components/MainView.react');
var Gallery = require('./Components/IconGallery/IconGallery.react');

var App = React.createClass({
	render : function(){
		return (
			<div style={{height : "100%"}}>
				{React.cloneElement(this.props.children || <div />, { key:this.props.location })}
	        </div>
		)
	}
})
ReactDOM.render((
	<Router>
		<Route path="/" component={App}>
			<Route path="" component={MainView} />
			<Route path="gallery" component={Gallery} />
			<Route path="*" component={MainView} />
		</Route>
	</Router>
	), document.getElementById('content'));

