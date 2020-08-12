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

const OMIT_FIELDS = ['_id', 'createdOn', 'updatedOn'];

const expectResponse = (response, dataProperty = 'data') => {
  expect(response).to.have.property('body');
  expect(response.body).to.have.property(dataProperty);
  return response.body[dataProperty];
};

const omitWriterFields = (writer) => {
  const idOmitted = {
    ...omit(writer, ...OMIT_FIELDS),
    books: writer.books.map((b) => omit(b, '_id')),
  };
  return idOmitted;
};

describe('/writer', async () => {
  const writerRequest = supertest.agent(app);
  let writerId = '';

  before(async () => {
    await db.get(WRITER.COLLECTION).drop();
  });

  it('Should return empty writer\'s collection', async () => {
    const response = await writerRequest.get('/writer').expect(200);
    const data = expectResponse(response);
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
    expect(writer).to.have.property('_id');
    writerId = writer._id;
    expect(writer).to.have.property('books');
    const idOmitted = omitWriterFields(writer);
    expect(idOmitted).to.deep.equal(VALID_WRITER);
  });

  it('Should find recently created writer', async () => {
    const response = await writerRequest
      .get(`/writer/${writerId}`)
      .expect(200);
    const results = expectResponse(response, 'results');
    expect(results).to.lengthOf(1);
    const [writer] = results;
    expect(omitWriterFields(writer)).to.deep.equal(VALID_WRITER);
  });
});
