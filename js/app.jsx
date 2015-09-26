/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

    var MainApp = React.createClass({
        getInitialState: function () {
            return {
                seekTime: -1,
                playing: false,
                states: [],
                sessions: [],
            };
        },
        componentDidMount: function() {
            this.interval = setInterval(this.tick, 1000);
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
        loadSession: function (sessionId) {
            //var sessionId = this.refs.sessionInput.getDOMNode().value;
            var that = this;
            app.ReactRec.loadSession(sessionId, (states) => {
                that.setState({states: states});
            });

            this.setState({seekTime: 0});
        },

        goToTime: function () {
            var seekTime = parseInt(this.refs.timeInput.getDOMNode().value);
            this.setState({seekTime: seekTime});
        },

        tick: function () {
            if (this.state.playing) {
                if(this.state.seekTime >= this.state.states.length){
                    this.setState({
                        playing: false,
                        seekTime: 0
                    })
                } else {
                    this.setState({seekTime: this.state.seekTime + 1});
                }
            }
            console.log(this.state.playing + " " + this.state.seekTime);
        },
        componentWillUnmount: function () {
            clearInterval(this.interval);
        },
        togglePlay: function (event) {
            this.setState({playing: !this.state.playing})
        },

        renderDev: function () {
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
				<button className="playButton" onClick={() => this.togglePlay() }>{this.state.playing ? "Pause" : "Play"}</button>
        <input className="slider" type="range" data-slider-min="0" data-slider-max={this.state.states.length} data-slider-step="1"
               value={this.state.seekTime} onChange={this.onSliderChange}/>
						 <div className="dropup sessionChooser">
	        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
	        Choose session
	        <span className="caret"></span>
	        </button>
	        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
	        { this.state.sessions.map((data) => this.renderSession(data)) }
	        </ul>
        </div>
    	</div>
    );
    },

        onSliderChange: function (event){
            this.setState({
                seekTime: event.target.value
            });
        },

        renderNormal: function () {
            var model = this.props.model;
            var stateAtTime = app.ReactRec.getStateAtTime(this.state.seekTime);

            if (app.ReactRec.DEV && stateAtTime) {
                stateAtTime = JSON.parse(stateAtTime);
                model = stateAtTime.model;
            }

            return (
                <div>
                    <app.TodoApp model={model} ref="todo"/>
                </div>
            );
        },

        render: function () {
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
