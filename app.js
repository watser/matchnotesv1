var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var jsonfile = require('jsonfile');

server.listen(80);

io.on('connection', function (socket) {
  socket.on('refresh', function (data) {
    // console.log('page refreshed');
    jsonfile.readFile('data/data.json', function (err, data) {
      // console.log(data);
      var note_container = [];
      // console.log(data);
      for(var i=0; i < data.rounds.length; i++) {
        var obj = data.rounds[i];
        note_container.push(obj);
      }
      // console.log(note_container);
      socket.emit('load_notes', note_container);
    });
  });

  socket.on('write_note', function (data) {
    console.log(data);
    function appendJSONFile(obj) {
      var configFile = fs.readFileSync('data/data.json');
      var config = JSON.parse(configFile);
      // console.log(config.rounds.round);
      for(var a=0;a < config.rounds.length;a++) {
        if(config.rounds[a].round == data.round) {
          var newID = config.rounds[a].notes.length;
          newID++;
          config.rounds[a].notes.push({id: newID, asd: data.note})
          var configJSON = JSON.stringify(config);
          fs.writeFileSync('data/data.json', configJSON)
          console.log('written to data.json on round:' + data.round + 'with note ID:' + newID);
        }
      }
      // config.rounds.round[data.round].push(obj);
      // console.log(config);
    }
    appendJSONFile(data);
    // console.log('Written to data/data.json!');
  });

//   socket.on('get_notes', function (data) {
//     var curRound = data;
//     jsonfile.readFile('data/data.json', function (err, data) {
//       var note_container = [];
//       // for(var i=0; i < data.rounds[i].notes.length; i++) {
//       //   console.log(data.rounds);
//       //   // var obj = data.rounds.round;
//       //   // console.log(data.rounds[i].notes[i].asd);
//       //   // note_container.push(obj);
//       // }
//         // var selectedRound = data.rounds.filter(function(note) { return note.round == curRound.id});
//         // console.log(selectedRound);
//       console.log(data.rounds);
//       for(var prop in data.rounds){
//         if(data.rounds.round.hasOwnProperty(prop)){
//           // if(data.rounds[prop] === curRound)
//           console.log('werkt');
//         }
//       }
//         // for(var i=0; i < selectedRound.notes.length;i++) {
//         //   console.log(selectedRound.notes[i]);
//         // }
//       // for(var i=0; i < selectedRound.notes.length;i++) {
//       //   console.log(selectedRound.notes.asd);
//       // }
//       // console.log(selectedRound);
//       // data.rounds.forEach(function(e){
//       //   // console.log(e.notes);
//       //   e.notes.forEach(function(getNotes) {
//       //     console.log(getNotes);
//       //   })
//       //   // note_container.push(e.notes)
//       // });
//       socket.emit('render_notes', note_container)
//     });
//   })
  socket.on('get_notes', function (roundId) {
    jsonfile.readFile('data/data.json', function (err, data) {
      function filter() {
        for(var a=0;a < data.rounds.length;a++) {
          if(data.rounds[a].round == roundId.id){
            var note_array = [], note_array_content = {};
            for(var i=0;i < data.rounds[a].notes.length;i++) {
              // console.log(data.rounds[a].notes[i].asd);
              var id = data.rounds[a].notes[i].id;
              var note = data.rounds[a].notes[i].asd;
              note_array.push({note: note});
            }
          }
        }
        socket.emit('render_notes', note_array)
        console.log("Sending client current round notes.");
      };
      filter();
    });
  });
});

var routes = require('./routes/index');
var users = require('./routes/users');
// var data = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
// app.use('/data', data)

app.get('/data', function(req, res){
  res.send('hello world'); //replace with your data here
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
