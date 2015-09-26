/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	var MainApp = React.createClass({
		render: function () {
			return <app.TodoApp model={this.props.model}/>
		}
	});

	var model = new app.TodoModel('react-todos');

	function render() {
		React.render(
			<MainApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
