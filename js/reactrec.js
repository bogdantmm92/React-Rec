var app = app || {};

(function () {
  'use strict';

  app.ReactRec = {
    DEV: false,
    sessionRef: null,

    statesList: [],
    init: function() {
      var sessionsRef = new Firebase('https://react-rec.firebaseio.com/sessions');
      this.sessionRef = sessionsRef.push();
    },

    saveState: function(state) {
      !this.DEV && this.sessionRef.push(JSON.stringify(state));
    },

    loadSession: function(sessionId) {
      var sessionRef = new Firebase('https://react-rec.firebaseio.com/sessions').child(sessionId);
      var statesList = this.statesList = [];
      sessionRef.on("value", (snap) => {
        snap.forEach(function(sessionSnap) {
          statesList.push(sessionSnap.val());
       });
      });
    },

    getStateAtTime: function(time) {
      return this.statesList[time];
    },
  };
})();
