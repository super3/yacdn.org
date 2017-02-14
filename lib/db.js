'use strict';

// get external modules
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// get internal config
var config = require('../config.js');

// setup mongo
mongoose.connect('mongodb://' + config.mongoHost + ':' +
 config.mongoPort + '/' + config.mongoName);

// define cache schema
var cacheSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  url: String,
  fileSize: Number,
  sha256: String
});
var cacheModel = mongoose.model('cacheModel', cacheSchema);
module.exports.cacheModel = cacheModel;

// create thread
function createThread(thread, callback) {

  var image  = new imageModel({
    imageId: thread.imageId,
    threadId: thread.threadId,
    author: thread.author,
    fileName: thread.fileName,
    title: thread.title,
    comment: thread.comment,
    firstPost: thread.firstPost
  });

  image.save(callback);

}

module.exports.createThread = createThread;
