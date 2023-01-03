const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [
	{
		name: 'Mauricio',
		username: 'mferreiradb',
		id: uuidv4(),
		todos: [
			{
				title: 'Test',
				deadline: '2023-01-05',
				done: false,
				id: uuidv4(),
				created_at: new Date('2023-01-01'),
			},
		],
	},
];

function checksExistsUserAccount(request, response, next) {
	const { username } = request.headers;

	const user = users.find((user) => user.username == username);

	if (!user) {
		response.status(404).json({ error: 'User not found' });
	}

	request.user = user;
	return next();
}

app.post('/users', (request, response) => {
	const { name, username } = request.body;
	const user = users.some((user) => user.username == username);

	if (user) {
		return response.status(400).json({ error: 'Conta já registrada' });
	} else {
		users.push({ id: uuidv4(), name, username, todos: [] });
		const userCreated = users.find((user) => user.username == username);
		return response.status(201).json(userCreated);
	}
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
	const { user } = request;

	return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { title, deadline } = request.body;

	const todo = {
		id: uuidv4(),
		title,
		done: false,
		deadline: new Date(deadline),
		created_at: new Date(),
	};

	user.todos.push(todo);

	return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { title, deadline } = request.body;
	const { id } = request.params;

	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo) {
		return response.status(404).json({ error: 'Todo not found' });
	}
	todo.title = title;
	todo.deadline = new Date(deadline);
	return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { id } = request.params;
	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo) {
		return response.status(404).json({ msg: 'Todo not found' });
	}
	todo.done = true;
	return response.json(todo);
	
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { id } = request.params;
	const todo = user.todos.find((todo) => todo.id == id);

	if (!todo) {
		return response.status(404).json({ msg: 'Todo not found' });
	}
	todo.done = true;
	return response.status(204).send('Tarefa excluída com sucesso');
});

module.exports = app;
