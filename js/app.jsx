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
				sessions: [],
      };
    },

		componentDidMount: function() {
      var sessions = []
			var that = this;
      app.ReactRec.sessionsRef.on("value", (snap) => {
        snap.forEach(function(sessionSnap) {
          sessions.push(sessionSnap.key());
       });
			//  that.setState({sessions: sessions.slice(sessions.length - 1 - 20)});
			 that.setState({sessions: sessions});
      });
		},
    loadSession: function(sessionId) {
      // var sessionId = this.refs.sessionInput.getDOMNode().value;
      app.ReactRec.loadSession(sessionId);

      this.setState({seekTime: -1});
    },

    goToTime: function() {
      var seekTime = parseInt(this.refs.timeInput.getDOMNode().value);
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

    componentDidUpdate() {
      var stateAtTime = app.ReactRec.getStateAtTime(this.state.seekTime);
      if (app.ReactRec.DEV && stateAtTime) {
        stateAtTime = JSON.parse(stateAtTime);
        window.rct.injectState(this.refs.todo, stateAtTime.state);
      }
    },

		renderSession: function(data) {
			return (
				<li onClick={() => this.loadSession(data)}><a href="#">{data}</a></li>
			);
		},
    renderReactRec: function() {
      return (
        <div className="controls">
					<div className="dropup">
						<button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
						  Choose session
						  <span className="caret"></span>
						</button>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
							{ this.state.sessions.map((data) => this.renderSession(data)) }
						</ul>
					</div>
          <input type="text" ref="timeInput"/>
          <span onClick={() => this.goToTime() }>Go to time</span>
        </div>
      );
    },

    renderNormal: function() {
      var model = this.props.model;
      var stateAtTime = app.ReactRec.getStateAtTime(this.state.seekTime);

      if (app.ReactRec.DEV && stateAtTime) {
        stateAtTime = JSON.parse(stateAtTime);
        model = stateAtTime.model;
      }

      return (
        <div>
          <app.TodoApp model={model} ref="todo" />
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
