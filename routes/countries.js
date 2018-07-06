var router = global.router
var Countries = require('../models/CountriesModel')

router.post('/insert_new_country', (request, response, next) => {
    const queryCondition = {
        name: new RegExp('^' + request.body.name.trim() + '$', "i")
    }
    console.log(`request.body.name = ${request.body.name}`);


    Countries.find(queryCondition).limit(1).exec((err, resultCountry) => {
        if (err) {
            response.json({
                result: "Failed",
                data: [],
                mess: "Error is : " + err
            })
        } else {
            if (resultCountry.length > 0) {
                response.json({
                    result: "Failed",
                    mess: "Country is exist !!!"
                })
            } else {
                const newCountry = new Countries({
                    name: request.body.name,
                    countryDescription: request.body.countryDescription
                });
                newCountry.save((err, addedCountry) => {
                    if (err) {
                        response.json({
                            result: "Failed"
                        })
                    } else {
                        request.json({
                            result: "OK",
                            data: addedCountry,
                            mess: "Insert new country successfully"
                        })
                    }
                })
            }
        }

    })
})

module.exports = router;