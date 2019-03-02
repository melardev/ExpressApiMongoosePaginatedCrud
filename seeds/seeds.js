const faker = require('faker');
const Todo = require('../models/todo.model');
require('./../config/mongodb.config').configure().then(res => {

    new Promise((resolve, reject) => {

        Todo.count().then(count => {
            let todosToSeed = 43;
            todosToSeed -= count;

            if (todosToSeed <= 0)
                return resolve();

            const promises = [];
            for (let i = 0; i < todosToSeed; i++) {
                promises.push(Todo.create({
                    title: faker.lorem.words(faker.random.number({min: 2, max: 5})),
                    // you can also use faker.lorem.text()
                    description: faker.lorem.sentences(faker.random.number({min: 5, max: 10})),
                    completed: faker.random.boolean() && faker.random.boolean() // make it harder to be true
                }));
            }
            Promise.all(promises).then(todos => {
                resolve(todos);
            }).catch(err => {
                reject(err);
            })
        }).catch(err => {
            reject(err);
        });
    }).then(res => {
        process.exit(0);
    });


}).catch(err => {
    // throw err;
    console.error(err);
    process.exit(-1);
});