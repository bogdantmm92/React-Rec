/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	var MainApp = React.createClass({
    getInitialState: function() {
      return {
        seekTime: -1,
      };
    },

    loadSession: function() {
      var sessionId = this.refs.sessionInput.value;
      app.ReactRec.loadSession(sessionId);

      this.setState({seekTime: -1});
    },

    goToTime: function() {
      var seekTime = parseInt(this.refs.timeInput.value);
      this.setState({seekTime: seekTime});
    },

    renderDev: function() {
      return (
        <div>
          { this.renderNormal() }
          { this.renderReactRec() }
        </div>
      );
    },

    // componentDidUpdate() {
    //   if (ReactRec.DEV) {
    //     // var stateAtTime = ReactRec.getStateAtTime(this.state.seekTime);
    //     // ComponenTree.injectState(this.refs.todo, stateInTime);
    //   }
    // }

    renderReactRec: function() {
      return (
        <div>
          <input type="text" ref="sessionInput" />
          <span onClick={() => this.loadSession() }>Load session</span>
          <input type="text" ref="timeInput"/>
          <span onClick={() => this.goToTime() }>Go to time</span>
        </div>
      );
    },

    renderNormal: function() {
      return (
        <div>
          <app.TodoApp model={this.props.model} ref="todo" />
        </div>
      );
    },

    render: function() {
      var content = app.ReactRec.DEV ? this.renderDev() : this.renderNormal();
      return content;
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
