// db-query.js

// db config
var mongo = require('mongodb').MongoClient;
// var db_url = 'mongodb://localhost:27017/url-shortner';
var db_url = 'mongodb://kchan:99341@ds023530.mlab.com:23530/url-shortner';

// check if original url exists in db
function isOrginalURLExists(original_url, cb) {
    // connect to mongodb and get the data back
    mongo.connect(db_url, function(err, db) {
        // throw error if any
        if(err) {
            throw err;
        }
        // get the collection
        var url = db.collection('url');
        url.find({
            original_url : original_url
        }).toArray(function(err, doc) {
            if(err) {
                throw err;
            }
            // close the connection
            db.close();
            // check if data found
            if(doc.length !== 0) {
                cb(doc);
            } else {
                cb(false);
            }
        });
        
    });
}

// check if the short_url already exists in db
function isShortURLExists(short_url, callback) {
    // connect to mongodb and get the data back
    mongo.connect(db_url, function (err, db) {
        if(err) {
            throw err;
        }
        // get the collection
        var url = db.collection('url');
        url.find({
            short_url: short_url
        }).toArray(function(err, doc) {
            if(err) {
                throw err;
            }
            // close the db connection
            db.close();
            if(doc.length !== 0) {
                callback(doc);
            } else {
                callback(false);
            }
        });
    });
}

// Create new entry in database for original url
function createURL(original_url, short_url) {
    
    var obj = {
        original_url: original_url,
        short_url: short_url
    }
    
    mongo.connect(db_url, function(err, db) {
        
        if(err) {
            throw err;
        }
        var url = db.collection('url');
        url.insert(obj, function(err, data) {
            if(err) {
                throw err;
            }
            console.log('one url inserted, ',JSON.stringify(data));
            db.close();
        });
    });
}

// export the functions
module.exports = {
    isShortURLExists: isShortURLExists,
    isOrginalURLExists: isOrginalURLExists,
    createURL: createURL
}