/**
 * Created by asoadmin on 2017-04-28.
 */

var Result = require('../models/result.js');

module.exports.createResult = function (callback) {

    var emptyResult = new Result();
    emptyResult.text = "";
    emptyResult.RedPatients = [];
    emptyResult.OrangePatients = [];
    emptyResult.YellowPatients = [];
    emptyResult.GreenPatients = [];
    emptyResult.BlackPatients = [];

    emptyResult.save(function (error,newResult) {
       if(!error){
           callback(newResult);
       }
       else{
           console.log("Error create result!");
           callback(null);
       }
    });

}