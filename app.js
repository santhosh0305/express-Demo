const express = require('express');
const test = express();
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${test.get('env')}`);

test.use(express.json());
test.use(express.urlencoded({extended: true}));
test.use(express.static('public'));
test.use(helmet());
test.use(logger);
test.use(morgan('tiny'));

const courses = [
    {id: 1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'},
];

test.get('/', (req, res) => {
    res.send('Hello world ..!!!!!');
})

test.get('/api/courses', (req, res) => {
    res.send(courses);
})


test.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('Invalid Id provided');
    }
    res.send(course);
})

test.post('/api/courses', (req, res) => {
    if(!req.body.name || req.body.name.length < 3){
        return res.status(404).send('The name is required and alteast 3 characters long!')
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
})

test.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Invalid id provided!');

    course.name = req.body.name
    res.send(course)
})

test.delete('/api/courses/:id', (req, res) => {
    const course  =  courses.find(c => c.id === parseInt(req.params.id))
    if(!course) { 
        return res.status(404).send('The course with the given id is not found!')
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course)
})


const port = process.env.PORT || 3000
test.listen(port, () => console.log(`listening on port ${port}..`))
