var router = global.router;
var fs = require('fs');
let City = require('../models/CityModel')
var mongoose = require('mongoose');


// Lay ra tat ca ban ghi
router.get('/list_all', (req, res, next) => {
    City.find({}, { name: 1 }).limit(100).exec((err, resultCity) => {
        if (err) {
            res.json({
                ressult: 'failed',
                data: [],
                mess: 'Error is: ' + err
            })
            return;
        }
        res.json({
            result: "OK",
            data: resultCity,
            count: resultCity.length,
            mess: "Query list of city successfully"
        })
    })
});

router.get('/infor_City', (request, response) => {
    if (!request.query.name) {
        response.json({
            result: "Failed",
            data: [],
            mess: 'Please input name City !!!'
        });
    }
    let queryCondition = {
        // name: new RegExp(request.query.name, 'i')       //tuong tu cau Where name like %abc% trong sql
        name: new RegExp('^' + request.query.name + '$', "i"), // phai dung voi ten cua thanh pho trong database
    };

    const limit = parseInt(request.query.limit) > 0 ? parseInt(request.query.limit) : 100;
    City.find(queryCondition).limit(limit).sort({ name: 1 }).select({
        name: 1,
        foodDescription: 1,
        created_date: 1,
        status: 1
    }).exec((err, resultCity) => {
        if (err) {
            response.json({
                result: "Failed",
                data: [],
                mess: "Error is : " + err
            })
            return;
        }
        else if (resultCity.length > 0) {
            response.json({
                result: 'OK',
                data: resultCity,
                count: resultCity.length,
                mess: "Find successfully"
            })
        } else {
            response.json({
                result: "Not found",
                mess: "Not found"
            })
        }
    })
})

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
        } else {
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

router.put('/update_a_city', (request, response, next) => {
    let conditions = {}     //Dieu kien de update
    if (mongoose.Types.ObjectId.isValid(request.body.city_id) == true) {
        console.log("truoc: " + conditions._id)
        conditions._id = mongoose.Types.ObjectId(request.body.city_id)
        console.log("sau: " + conditions._id)
    } else {
        response.json({
            result: "failed",
            data: {},
            messege: "You must enter city_id to update"
        });
    }
    let newValues = {};
    if (request.body.name && request.body.name.length > 2 ) {
        newValues.name = request.body.name;
        // newValues.cityDescription = request.body.cityDescription;
    }

    //Update image
    if (request.body.image_name && request.body.image_name.length > 0) {
        //Ex: http://localhost:3001/open_image?image_name=upload_e2312e497df8c230b4896fa3b43bb543.jpg
        const serverName = require("os").hostname();
        const serverPort = require("../app").settings.port;
        newValues.imageUrl = `${serverName}:${serverPort}/open_image?image_name=${request.body.image_name}`
    }

    const options = {
        new: true, // return the modified document rather than the original.
        multi: true
    }
    if (mongoose.Types.ObjectId.isValid(request.body.country_id) == true) {
        newValues.countriesID = mongoose.Types.ObjectId(request.body.country_id);
    }
    City.findOneAndUpdate(conditions._id, { $set: newValues }, options, (err, updatedCity) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Cannot update existing city.Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: updatedCity,
                messege: "Update city successfully"
            });
        }
    });
});

router.delete('/delete_a_city', (request, response, next) => {
    response.end("DELETE req => deletedb_a_city")
});

router.post('/upload_images', (request, response, next) => {
    let formidable = require('formidable');
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10 MB
    form.multiples = true;
    form.parse(request, (err, fields, files) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Cannot upload images.Error is : ` + err
            });
        }

        var arrayOfFiles = [];
        if (files[""] instanceof Array) {
            arrayOfFiles = files[""];
        } else {
            arrayOfFiles.push(files[""]);
        }
        if (arrayOfFiles.length > 0) {
            var fileNames = [];
            arrayOfFiles.forEach((eachFile) => {
                // fileNames.push(eachFile.path)
                fileNames.push(eachFile.path.split('\\')[1]);
            });
            response.json({
                result: "ok",
                data: fileNames,
                numberOfImages: fileNames.length,
                messege: "Upload images successfully"
            });
        } else {
            response.json({
                result: "failed",
                data: {},
                numberOfImages: 0,
                messege: "No images to upload !"
            });
        }
    });
});

router.get('/open_image', (request, response, next) => {
    let imageName = 'uploads/' + request.query.image_name;
    fs.readFile(imageName, (err, imageData) => {
        if (err) {
            request.json({
                result: 'Failed',
                mess: 'Can not read image. Err ' + err
            })
            return;
        }
        response.writeHead(200, { 'Content-Type': 'image/jpeg' });
        response.end(imageData)
    })
})

module.exports = router;