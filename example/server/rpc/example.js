var intervalId = {};
var crypto = require('crypto');
// sqllite3 connectivity
var sqlite3 = require('sqlite3').verbose();
var file = "../db/templog.db";

exports.actions = function(req, res, ss) {
  req.use('session');

  return {
    on: function() {

      intervalId = setInterval(function() {
        var db = new sqlite3.Database(file);
        db.all("SELECT * FROM temps where timestamp>datetime('now','-2 hours')  order by timestamp", function(err, rows) {


          if (!err && rows.length > 0) {
            ss.publish.all('ss-example', rows[rows.length - 1].timestamp + " " + rows[rows.length - 1].temp);
          }
          db.close();
        });
      }, 3000);

      console.log("session data: " + JSON.stringify(req.session));
    },
    off: function(reason) {
      console.log("Received reason: %s", reason);
      clearInterval(intervalId);
      setTimeout(function() {
        res("Ignoring SpaceMail");
      }, 2000);
    },
    authenticate: function(user, pass) {
      ss.log.info("User", user, "Pass", pass);
      if (user === 'user' && pass === 'pass') {
        ss.log.info("Successful login");
        req.session.setUserId(user);
        res(true);
      } else {
        ss.log.info("Access denied! The password is user/pass");
        res(false);
      }
    },
    authenticated: function() {
      if (req.session.userId) {
        res(true);
      } else {
        res(false);
      }
    },
    logout: function() {
      req.session.setUserId(null);
      res(true);
    }
  };
}