var express = require('express');
var router = express.Router();
let City = require('../models/CityModel')

router.get('/list_all', (req, res, next) => {
    res.end("GET req => list_all");
  });
  
  //Them 1 bang ghi vào database
  router.post('/insert_city', (req, res, next) => {
    console.log(`request.body.name = ${req.body.name}`);
    const newCity = new City({
      name: req.body.name,
      cityDescription: req.body.cityDescription
    });
    newCity.save((err) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          messege: `Error is : ${err}`
        });
      }else{
        res.json({
          result: "OK",
          data: {
            name: req.body.name,
            cityDescription: req.body.cityDescription,
            mess: "Them thanh cong"
          }
        })
      }
    })
  });
  
  router.put('/update_a_city', (req, res, next) => {
    res.end("PUT req => update_a_city")
  })
  
  router.delete('/update_a_city', (req, res, next) => {
    res.end("DELETE req => deletedb_a_city")
  })
  
  module.exports = router;