"use strict";

const mongoose = require("mongoose");

require("./order");
require("./product");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://pikachu:2s#Mbx1xZ#6gtSsO!*XG@ds159563.mlab.com:59563/online-shop", { useMongoClient: true });
