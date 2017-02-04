// app/routes.js

// grab the nerd model we just created
var Routine = require('./models/routine');

    module.exports = function(app) {

        var sonosJson = {};

        app.get('/api/routines', function(req, res) {
            // use mongoose to get all routines in the database
            Routine.find(function(err, routines) {

                // if there is an error retrieving, send the error. 
                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(routines); // return all routines in JSON format
            });
        });

        // route to handle creating goes here (app.post)
        app.post('/api/routines', function (req, res) {

            var routine = new Routine();
            routine.name = req.body.name;
            routine.hour = req.body.hour;
            routine.minute = req.body.minute;
            routine.dayOfWeek = req.body.dayOfWeek;
            routine.message = req.body.message;
            routine.getWeather = req.body.getWeather;
            routine.getQotd = req.body.getQotd;
            console.log('routine = ' + routine);

            routine.save(function(err, routine) {
                if (err) return console.error(err);

                res.json({ message: 'routine created!'});
            });

        });

        // route to handle delete goes here (app.delete)
        app.delete('/api/routines/:routine_id', function(req, res) {
            Routine.remove({
                _id: req.params.routine_id}, function(err,bear) {
                if (err)
                    res.send(err);

                res.json({ message: 'successfully deleted'});
            });

        });

        app.get('/sonosChange', function (req, res) {
             // set timeout as high as possible
             req.socket.setTimeout(Number.MAX_VALUE);

             res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

           
            console.log("hitting the server");
            setInterval(function() {
                constructSSE(res);
            }, 5000);

        });

        function constructSSE(res) {
             console.log('constructing sse');
             if (sonosJson) {
                console.log(sonosJson);
                 res.write('\n');
                 res.write('data: ' + JSON.stringify(sonosJson) + '\n\n');
            }
        }

        app.post('/sonos', function (req, res) {
            console.log("just received message from sonos");
            if (req.body.type == 'transport-state') {
                console.log('updating sonos json');
                sonosJson = req.body.data.state.currentTrack;
                console.log(sonosJson.artist);
                console.log(sonosJson.title);
                
            }
            res.sendStatus(200);
        })

        // frontend routes =========================================================
        // route to handle all angular requests
        // NOTE: you need to place other HTTP requests above this since this is a catch all and will
        // re-route all your requests to the home page.
        app.get('*', function(req, res) {
            console.log("serving up view index.html");
            res.sendFile(__dirname + '/public/views/index.html'); // load our public/index.html file
        });

    };
