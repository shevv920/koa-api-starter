const { omit } = require('lodash');
const supertest = require('supertest');
const { expect } = require('chai');

const server = require('app');
const db = require('tests/db');
const { WRITER } = require('tests/constants');

// const writerSchema = require('./writer.schema');

const app = server.listen();

const VALID_WRITER = {
  firstName: 'Ivan',
  lastName: 'Ivanov',
  age: 42,
  books: [
    {
      title: 'Memories',
      genre: 'poem',
    },
  ],
};

const expectResponseData = (response) => {
  expect(response).to.have.property('body');
  expect(response.body).to.have.property('data');
  const { data } = response.body;
  return data;
};

describe('/writer', async () => {
  const writerRequest = supertest.agent(app);

  before(async () => {
    await db.get(WRITER.COLLECTION).drop();
  });

  it('Should return empty writer\'s collection', async () => {
    const response = await writerRequest.get('/writer').expect(200);
    expect(response).to.have.property('body');
    expect(response.body).to.have.property('data');
    const { data } = response.body;
    expect(data).to.deep.equal([]);
  });

  it('Should return error on attempt to create invalid writer', async () => {
    const response = await writerRequest.post('/writer').expect(400);
    expect(response).to.have.property('body');
    expect(response.body).to.have.property('errors');
    const { errors } = response.body;
    expect(errors).to.deep.equal({ writer: ['"writer" is required'] });
  });

  it('Should return created valid writer', async () => {
    const response = await writerRequest
      .post('/writer')
      .send({ writer: VALID_WRITER })
      .expect(200);
    expect(response).to.have.property('body');
    const writer = response.body;
    expect(writer).to.have.property('books');
    const idOmitted = {
      ...omit(writer, '_id'),
      books: writer.books.map((b) => omit(b, '_id')),
    };
    expect(idOmitted).to.deep.equal(VALID_WRITER);
  });

  it('Should return results with recently created writer', async () => {
    const response = await writerRequest
      .get('/writer')
      .expect(200);
    const data = expectResponseData(response);

    console.log(data);
  });
});
