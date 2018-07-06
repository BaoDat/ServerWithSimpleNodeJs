'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cityDescription: {
        type: String,
        default: ""
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['available', 'unavailable']
        }],
        default: ['available']
    },
    imagUrl:{
        type: String
    },
    countriesID: Schema.ObjectId

});
// a setter
CitySchema.path('name').set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1);
});
module.exports = mongoose.model('City', CitySchema);