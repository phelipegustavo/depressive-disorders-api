const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const { port, mongo } = require('./config');
const server = express();

mongoose.connect(`${mongo.driver}://${mongo.user}:${mongo.password}@${mongo.host}${mongo.port?`:${mongo.port}`:''}/${mongo.database}?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(port);