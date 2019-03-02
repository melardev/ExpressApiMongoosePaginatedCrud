const Todo = require('./../models/todo.model');
const TodoResponseDto = require('./../dtos/responses/todos/todo.dto');
const GenericResponseDto = require("../dtos/responses/shared/generic.dto");

// Melardev ! Melardev! your video tutorials are overcomplicated!
// Sure, they have to be, this is not a hello-word copy paste thing from the official docs ....
// if you still want the dead simple and useless example take a look at getAllSimple functions at the end of this file

exports.getAll = (req, res, next) => {
    Promise.all([
        Todo.find({})
            .limit(Number(req.pageSize))
            .skip(Number(req.skip)).sort({createdAt: 'desc'}),
        Todo.count()])
        .then(results => {
            const todos = results[0];
            const totalTodosCount = results[1];
            return res.json(TodoResponseDto.buildPagedList(todos, req.page, req.pageSize, totalTodosCount, req.baseUrl));
        }).catch(err => {
        throw err;
    });
};


exports.getCompleted = (req, res, next) => {
    Promise.all([
        Todo.find({completed: true})
            .limit(Number(req.pageSize))
            .skip(Number(req.skip)).sort({createdAt: 'desc'}),
        Todo.count({completed: true})])
        .then(results => {
            const todos = results[0];
            const totalTodosCount = results[1];
            return res.json(TodoResponseDto.buildPagedList(todos, req.page, req.pageSize, totalTodosCount, req.baseUrl));
        }).catch(err => {
        throw err;
    });
};

exports.getPending = (req, res, next) => {
    Promise.all([
        Todo.find({completed: false})
            .limit(Number(req.pageSize))
            .skip(Number(req.skip)).sort({createdAt: 'desc'}),
        Todo.count({completed: false})])
        .then(results => {
            const todos = results[0];
            const totalTodosCount = results[1];
            return res.json(TodoResponseDto.buildPagedList(todos, req.page, req.pageSize, totalTodosCount, req.baseUrl));
        }).catch(err => {
        throw err;
    });
};

exports.getById = (req, res, next) => {
    Todo.findById(req.params.id).then(todo => {
        if (todo == null)
            return res.status(404).json(GenericResponseDto.buildWithErrorMessages('Todo not found'));
        return res.json(TodoResponseDto.buildDetails(todo.toJSON()));
    }).catch(err => {
        return res.json(GenericResponseDto.buildWithErrorMessages(err.message));
    });
};

exports.create = function (req, res, next) {
    const {title, description, completed} = req.body;
    Todo.create({title, description, completed}).then(todo => {
        return res.json(GenericResponseDto.buildSuccessWithDtoAndMessages(TodoResponseDto.buildDetails(todo), 'Todo created successfully'));
    }).catch(err => {
        return res.json(GenericResponseDto.buildWithErrorMessages(err.message));
    });
};

exports.update = function (req, res, next) {

    Todo.findById(req.params.id).then(todo => {
        if (todo == null)
            return res.status(404).json(GenericResponseDto.buildWithErrorMessages('Todo not found'));
        const {title, description, completed} = req.body;

        todo.title = title;
        todo.set('description', description);
        todo.set('completed', completed);

        todo.save().then(todo => {
            return res.json(GenericResponseDto.buildSuccessWithDtoAndMessages(TodoResponseDto.buildDetails(todo), 'Todo updated successfully'));
        }).catch(err => {
            return res.json(GenericResponseDto.buildWithErrorMessages(err.message));
        });
    }).catch(err => {
        return res.json(GenericResponseDto.buildWithErrorMessages(err.message));
    });
};

exports.delete = function (req, res, next) {
    Todo.findById(req.params.id).then(todo => {
        if (todo == null)
            return res.status(404).json(GenericResponseDto.buildWithErrorMessages('Todo not found'));

        todo.delete().then(result => {
            return res.json(GenericResponseDto.buildSuccessWithMessages('Todo deleted successfully'));
        }).catch(err => {
            return res.json(GenericResponseDto.buildWithErrorMessages(err.message));
        });
    });
};

exports.deleteAll = function (req, res, next) {
    Todo.remove({}).then(result => {
        return res.json(GenericResponseDto.buildSuccessWithMessages('Todos deleted successfully'));
    }).catch(err => {
        return res.json(GenericResponseDto.buildWithErrorMessages(err.message));
    });
};


// Simple
exports.getAllSimple = (req, res, next) => {
    Todo.query('orderBy', 'created_at', 'DESC').fetchAll({
        debug: process.env.DEBUG,
        columns: ['id', 'title', 'completed', 'created_at', 'updated_at']
    }).then(results => {
        const todos = results.serialize();
        return res.json(todos);
    }).catch(err => {
        throw err;
    });
};


exports.getCompletedSimple = (req, res, next) => {
    Todo.query(queryBuilder => {
        queryBuilder.orderBy('created_at', 'DESC');
        queryBuilder.where('completed', '=', false)
    }).fetchAll({
        debug: process.env.DEBUG,
        columns: ['id', 'title', 'completed', 'created_at', 'updated_at']
    }).then(todos => {
        return res.json(todos.serialize());
    }).catch(err => {
        throw err;
    });
};

exports.getPendingSimple = (req, res, next) => {
    Todo.query(queryBuilder => {
        queryBuilder.orderBy('created_at', 'DESC');
        queryBuilder.where('completed', '=', false)
    }).fetchAll({
        debug: process.env.DEBUG,
        columns: ['id', 'title', 'completed', 'created_at', 'updated_at']
    }).then(todos => {
        return res.json(todos.serialize());
    }).catch(err => {
        throw err;
    });
};

exports.getByIdSimple = (req, res, next) => {
    Todo.where('id', req.params.id).fetch({
        debug: process.env.DEBUG || true,
    }).then(todo => {
        if (todo == null)
            return res.status(404).json({message: 'not found'});
        else
            return res.json(todo.toJSON());
    }).catch(err => {
        return res.json({message: err.message});
    });
};