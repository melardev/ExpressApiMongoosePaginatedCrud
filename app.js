require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const GenericResponseDto = require("./dtos/responses/shared/generic.dto");
const BenchmarkMiddleware = require('./middlewares/benchmark.middleware');
const app = express();
const cors = require('cors');
app.use(BenchmarkMiddleware.benchmark);

require('./config/mongodb.config').configure().then(res => {

    const todosRouter = require('./routes/todos.routes');
    app.use(BenchmarkMiddleware.benchmark);
    app.use(cors());
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.use('/api/todos', todosRouter);


// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.json(GenericResponseDto.buildWithErrorMessages('Something went wrong 5xx ' + err));
    });


}).catch(err => {
    throw err;
});
module.exports = app;
