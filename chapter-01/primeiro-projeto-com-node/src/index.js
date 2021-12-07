const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

/** 
 * CPF - string
 * Name - string
 * ID - uuid
 * Statement - []
*/

const customers = [];

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: 'Customer not found' })
  }

  request.customer = customer;

  return next();
}

// Criar conta
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const customer = customers.some(customer => customer.cpf === cpf);

  if (customer) {
    return response.status(400).json({ error: 'Customer already exists' });
  }

  customers.push({
    id: uuid(),
    cpf,
    name,
    amount: 0,
    statement: [],
  });

  return response.status(201).json({ message: 'Account created' });
});

// Extrato da conta bancaria
app.get('/statement/', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.status(200).json(customer.statement);
});

// Deposito
app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { amount, description } = request.body;

  const statementOperation = {
    id: uuid(),
    amount,
    description,
    created_at: new Date(),
    type: 'credit',
  }

  customer.amount = amount;
  customer.statement.push(statementOperation);

  return response.status(201).json(statementOperation);
});

// Saque
app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { amount } = request.body;

  if(amount > customer.amount) {
    return response.status(400).json({ error: 'insufficient funds' });
  }

  customer.amount -= amount;

  const statementOperation = {
    id: uuid(),
    amount,
    created_at: new Date(),
    type: 'withdraw',
  }

  customer.statement.push(statementOperation);

  return response.status(201).json(statementOperation);
});

// Extrato por data
app.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date).toDateString();

  const statement = customer.statement.filter(statement =>
    statement.created_at.toDateString() === dateFormat
  );

  return response.status(200).json(statement);
});

// Atualizar dados da conta
app.put('/account', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { name } = request.body;

  customer.name = name;

  return response.status(200).json(customer);
});

// Obter dados da conta
app.get('/account', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.status(200).json(customer);
});

// Remover conta bancaria
app.delete('/account', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  customers.splice(customer, 1);

  return response.status(200).json(customers);
});

app.listen(3333);