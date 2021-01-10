const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sunny:ks43125818@boilerplate.gbgbh.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(()=> console.log('MongoDB connected!'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send("Hello, Node.js!"));
app.listen(port, () => console.log(`Example App listening on port ${port}!`));