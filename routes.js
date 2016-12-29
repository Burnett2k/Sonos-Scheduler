// app/routes.js

// grab the nerd model we just created
var Routine = require('./models/routine');

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/routines', function(req, res) {
            console.log("in routes.js");
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

            console.log('request = ' + req);
            var routine = new Routine();
            routine.name = req.body.name;
            routine.hour = req.body.hour;
            routine.minute = req.body.minute;
            routine.dayOfWeek = req.body.dayOfWeek;
            console.log('routine = ' + routine);

            routine.save(function(err, routine) {
                if (err) return console.error(err);//res.send(err);

                //res.json({ message: 'routine created!'});
            });

        });


        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendFile(__dirname + '/public/views/index.html'); // load our public/index.html file
        });

    };
