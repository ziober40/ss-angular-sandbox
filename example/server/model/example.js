//des describes the model and has the middleware
//chan is a channel on which to post the updated model object

var names = ['Tom','Dick','Harry'];
var sqlite3 = require('sqlite3').verbose();
var file = "../db/templog.db";

exports.make = function(des,chan,ss) {
  des.use('session')
  des.use('client.auth');



  return {
    //must have a poll function for now. may have other update models
    poll: function(p) {
        var db = new sqlite3.Database(file);
        db.all("SELECT * FROM temps where timestamp>datetime('now','-24 hours')  order by timestamp", function(err, rows) {  
  
        var lastOne = '';

        if(rows){
          lastOne = rows[rows.length-1].timestamp + " " + rows[rows.length-1].temp;
        }else{
          lastOne = err;
        }

        db.close();

      var d = new Date();
      var obj = {
        hash: Math.floor(d.getSeconds() / 5.0), //only update every 5 seconds even though polled every second
        hasBall: names[Math.floor(Math.random()*3-0.001)],
        leadingBy: Math.floor(Math.random()*100),
        serverTime: d.toString(),
        preferredName: p.name,
        lastOne: lastOne,
        fromLast24hours: JSON.stringify(rows)
      };
      chan(obj);

      });
    }
  };
};
