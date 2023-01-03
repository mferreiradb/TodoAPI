const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [
	{'name': 'Mauricio', 'username': 'mferreiradb', id: uuidv4(), todos: [
		{title: 'Test', deadline: '2023-01-05', done: false, id: uuidv4(), createdAt: new Date('2023-01-01')},
	]},
];

function checksExistsUserAccount(request, response, next) {
	const {username} = request.headers;

	const user = users.find((user) => user.username == username );
  
	!user && response.status(400).json({ error: 'Conta não encontrada' });

	request.user = user;
	return next();
}

app.get('/users', checksExistsUserAccount, (request, response) => {
  
	return response.json({users});
});

app.post('/users', (request, response) => {
	const { name, username } = request.body;
	const user = users.some((user) => user.username == username);

	if(user) {
		return response.status(400).json({error: 'Conta já registrada'});
	} else {
		users.push({ name, username, id: uuidv4(), todos: []});
		return response.status(201).json({msg: 'Usuário criado com suesso'});
	}
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
	const { user } = request;

	return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
	const { title, deadline } = request.body;
	const { user } = request;

	user.todos.push({title, deadline: new Date(deadline), done: false, id: uuidv4(), createdAt: new Date()});

	return response.status(201).json({msg: 'Tarefa criada'});
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
	const { id } = request.params;
	const { title, deadline } = request.body;
	const { user } = request;
	const todo = user.todos.find((todo)=> todo.id == id);

	if (todo) {
		todo.title = title;
		todo.deadline = deadline;
		return response.status(201).json({msg: 'Tarefa atualizada', todo});
	} else {
		return response.status(400).json({msg: 'Tarefa não encontrado'});
	}
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { id } = request.params;
	const todo = user.todos.find((todo) => todo.id == id);

	if (todo) {
		todo.done = true;
		return response.status(201).json({msg: 'Tarefa atualizada', todo});
	} else {
		return response.status(400).json({msg: 'Tarefa não encontrado'});	
	}
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
	// Complete aqui
});

module.exports = app;