const mongoose = require('mongoose');

const url = require('./config');


//exports as an object with the mongoCio
exports.mongoConnection = () => {
 return mongoose.connect(url.mongo_url, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
}
