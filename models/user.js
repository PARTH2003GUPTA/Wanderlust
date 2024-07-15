const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose=require("passport-local-mongoose");

const User=mongoose.Schema({
    email:{
        type:String,
        required:true,
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);