'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var databaseConfig = require('../configs/database');

mongoose.connect(databaseConfig.url, function (err, res) {
    if (err) {
        console.log('Connection to Mongodb failed. Connection status:' + err.message);
    }
});

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


var imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    extension: {
        type: String,
        required: true
    },
    size: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    isRemoved: {
        type: Boolean,
        default: false,
        required: true
    }
});

var historySchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    isRemoved: {
        type: Boolean,
        default: false,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});


var userModel = mongoose.model('User', userSchema);
var imageModel = mongoose.model('Image', imageSchema);
var historyModel = mongoose.model('History', historySchema);


module.exports = {
    imageModel: imageModel,
    userModel: userModel,
    historyModel: historyModel,
    mongooseConnection: imageModel.db
};
