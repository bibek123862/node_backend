const mongoose = require('mongoose');


// connecting mongo database

mongoose.connect('mongodb://localhost:27017/ClothingRool',
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  }
)
.catch(error => console.error(error));

