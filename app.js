var qbws = require('qbws');
var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

app.set('port', (process.env.PORT || 5000));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

////////////////////////////////////
//MIDDLEWARE////////////////////////
////////////////////////////////////

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
// app.use('/', routes);
// app.use('/users', users);

////////////////////////////////////
//ROUTES////////////////////////////
////////////////////////////////////

app.get('/support', function(req, res) {
	console.log("Accessing support route");
});

app.get('/debug', function(req, res) {
	var builder = require('xmlbuilder');

    var requestID = 111;
    var vendorName = 'Bob the builder';
    var refNumber = 222;
    var amt = 333;


    var billAddRequestObj = {
        QBXML: {
        	"?qbxml": "version=13.0",
            QBXMLMsgsRq: {
                "@onError": "stopOnError",
                BillAddRq: {
                    "@requestID": requestID.toString(),
                    BillAdd: {
                        VendorRef: {
                            FullName: vendorName
                        },
                        RefNumber: refNumber,
                        itemLineAdd: {
                            amount: amt
                        }
                    }
                }
            }
        }
    };

    var requestXML = builder.create(billAddRequestObj, {version: '1.0', encoding: 'UTF-8'}).end();

    console.log(requestXML);
})

////////////////////////////////////
//SERVER SETUP//////////////////////
////////////////////////////////////

//qbws takes care of linking the server to the soap at '/wsdl'...
//The server must get passd to qbws.run(server) so that it knows
//where to listen

var server = http.createServer(app);
qbws.run(server);

//module.exports = app;
