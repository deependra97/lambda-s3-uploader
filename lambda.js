'use strict';

var AWS = require('aws-sdk');

// Set uploadPassword here if you want uploads to require a password
// NOTE: setting this to a non-blank value also requires that you set "require_pass" to 1 on app.js
var uploadPassword = "";

var s3Bucket = new AWS.S3( { params: {Bucket: 'test-bucket-singapore-1'} } );

exports.handler = (event, context, callback) => {
  if(!uploadPassword || uploadPassword == event.passphrase) {
    var fileContents = new Buffer(event.contents.substr(event.contents.indexOf(',')), 'base64');
    var ctype = "";
    switch (event.name.substr(event.name.lastIndexOf('.')+1)) {
        case "gif":
            ctype = "image/gif";
            break;
        case "jpg":
            ctype = "image/jpeg";
            break;
        case "png":
            ctype = "image/png";
            break;
        case "json":     
            ctype = "application/json";
            break;
        case "js":
            ctype = "application/javascript";
            break;
        default: 
            ctype = "text/plain";
    };
    var data = {
      Key: event.name,
      Body: fileContents,
      ContentEncoding: 'base64',
      ContentType: ctype
    };
    s3Bucket.putObject(data, function(err, data){
        if (err) {
          console.log(err);
          console.log('Error uploading data: ', data);
        } else {
          console.log('Data successfully uploaded');
        }
    });
  } else {
    context.fail('Passphrase incorrect');
  }
};
