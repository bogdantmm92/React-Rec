var app = app || {};

(function () {
  'use strict';

  app.ReactRec = {
    DEV: true,
    sessionRef: null,
    sessionsRef: null,
    statesList: [],
    init: function() {
      this.sessionsRef = new Firebase('https://react-rec.firebaseio.com/sessions');
      this.sessionRef = this.sessionsRef.push();
    },

    saveState: function(state) {
      !this.DEV && this.sessionRef.push(JSON.stringify(state));
    },

    loadSession: function(sessionId, cb) {
      var sessionRef = new Firebase('https://react-rec.firebaseio.com/sessions').child(sessionId);
      var statesList = this.statesList = [];
      sessionRef.on("value", (snap) => {
        snap.forEach(function(sessionSnap) {
          statesList.push(sessionSnap.val());
        });
        cb(statesList);
      });
    },

    getStateAtTime: function(time) {
      return this.statesList[time];
    },
  };
})();
