'use strict';
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var CountriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    countryDescription: {
        type: String,
        default: ""
    }, create_date: {
        type: Date,
        default: Date.now
    }
})

CountriesSchema.path('name').set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1);
})

module.exports = mongoose.model('Countries', CountriesSchema);