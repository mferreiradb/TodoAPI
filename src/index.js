const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers

  const user = users.find((user) => user.username == username )
  
  !user && response.status(400).json({ error: 'Conta não encontrada' })

  request.user = user
  return next()
}

app.get('/users', (request, response) => {
  
  return response.json({users})
});

app.post('/users', (request, response) => {
  const { name, username } = request.body

  users.push({ name, username, id: uuidv4(), todos: []})
  
  return response.status(201).json({msg: "Usuário criado com suesso"})
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;