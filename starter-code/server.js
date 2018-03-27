// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require('./models');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

// get all todos
app.get('/api/todos', function index(req, res) {
  db.Todo.find({}, function(errrrrr, data) {
    res.json({todos: data});
  })
});

// create new todo
app.post('/api/todos', function create(req, res) {
  //console.log(req.body);
  // create todo in database using req.body

  db.Todo.create(req.body, function(err, data) {
    res.json(data);
  })

  // send todo back as the response

});

// get one todo
app.get('/api/todos/:id', function show(req, res) {
  var todoId = req.params.id;
  db.Todo.findOne({ _id: todoId }, function (err, foundTodo) {
    foundTodo.task = req.body.task;
    foundTodo.description = req.body.description;
    res.json(foundTodo);
  })
});

// update todo
app.put('/api/todos/:id', function update(req, res) {
// find object with id - findOne
// update object -
// save to db
// get todo id from url params (`req.params`)
  var todoId = req.params.id;

  // find todo in db by id
  db.Todo.findOne({ _id: todoId }, function(err, foundTodo) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // update the todos's attributes
      foundTodo.task = req.body.task;
      foundTodo.description = req.body.description;

      // save updated todo in db
      foundTodo.save(function(err, savedTodo) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(savedTodo);
        }
      });
    }
  });


//   db.Todo.findOne({ _id: todoId }, function (err, foundTodo) {
//     var todoId = req.params.id;
//     // update todo's attributes
//     foundTodo.task = req.body.task;
//     foundTodo.description = req.body.description;
//   });
//   // save updated todo in db
//   foundTodo.save(function(err, savedTodo) {
//     res.json(savedTodo);
//   });
//
// });
//
// // delete todo
// app.delete('/api/todos/:id', function destroy(req, res) {

});



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});
