var express = require('express');
var app = express();
var fs = require('fs');
var im = require('imagemagick');

var srcImage = __dirname + "/source_images/xyz.png";
console.log(srcImage)
var desPath = __dirname + "/destination_images/";
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
app.use(urlencodedParser)
app.use(bodyParser.json())
app.use("/static", express.static('source_images'));

var port = 4000;

app.get('/', function(req, res) {
    res.json({
        "message": "Connected successfully"
    });
});


app.get('/image-info', function(req, res) {

    im.identify(srcImage, function(err, features) {
        if (err) {
            console.log(err);
            return res.send({
                err: err
            })
        }
        res.json({
            "images_data": features
        });
    });
});


app.get('/image/readmetadata', function(req, res) {
    im.readMetadata(srcImage, function(err, metadata) {
        if (err) throw err;
        res.json({
            "metadata": metadata
        });
    });
});

app.get('/image/resize', function(req, res) {
    var optionsObj = {
        srcPath: srcImage,
        dstPath: desPath + "xyz_lowquality.png",
        quality: 0.6,
        width: 400
    };
    im.resize(optionsObj, function(err, stdout){
        if (err) throw err;
        res.json({
            "message": "Resized Image successfully"
        });
    });
});

app.get('/image/convert', function(req, res) {
    var optionsObj = [srcImage, '-resize', '250x250', desPath + 'xyz_small.png'];
    im.convert(optionsObj, function(err, stdout){
        if (err) throw err;
        res.json({
            "message": "Converted Image successfully"
        });
    });
});

app.get('/image/crop', function(req, res) {
    var optionsObj = {
        srcPath: srcImage,
        dstPath: desPath + 'xyz_cropped.jpg',
        width: 800,
        height: 600,
        quality: 1,
        gravity: "North"
    };
    im.crop(optionsObj, function(err, stdout){
        if (err) throw err;
        res.json({
            "message": "cropped Image successfully"
        });
    });
});


app.listen(port);
console.log('Node listening on port %s', port);