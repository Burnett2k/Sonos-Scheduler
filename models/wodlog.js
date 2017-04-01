// app/models/routine.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('WodLog', {
    wodname : {type : String, default: ''},
    timeCompleted: {type : Date},
    numOfReps: { type : Number, default 0}
});