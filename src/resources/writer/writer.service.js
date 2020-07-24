const _ = require('lodash');

const db = require('db');
const constants = require('app.constants');

const validateSchema = require('./writer.schema');

const service = db.createService(
  constants.DATABASE_DOCUMENTS.WRITERS,
  { validateSchema });

const addId = (obj) => ({ ...obj, _id: service.generateId() });

service.createWriter = async (writer) => {
  const writerToCreate = {
    ...writer,
    books: writer.books.map(addId),
  };
  return service.create(writerToCreate);
};

service.getWriterById = async (_id) => {
  return service.find({ _id });
}

service.updateWriter = async (_id, newData) => {
  return service.update({ _id }, (oldData) => {
    return { ...oldData, ...newData };
  });
};

service.deleteWriter = async (_id) => {
  return service.remove({ _id });
};

service.addWriterBooks = async (_id, books) => {
  return service.update({ _id }, (writer) => {
    const booksToAdd = books.map(addId);
    return { ...writer, books: [...writer.books, ...booksToAdd] };
  });
};

service.deleteWriterBook = async (_id, bookId) => {
  return service.update({ _id }, (writer) => {
    return { ...writer, books: writer.books.filter((b) => b._id !== bookId) };
  });
};

service.replaceWriterBooks = async (_id, books) => {
  return service.update({ _id }, (writer) => {
    const booksToAdd = books.map(addId);
    return { ...writer, books: booksToAdd };
  });
};

service.listing = async ({ pageNumber, documentsInPage, sortBy, sortOrder }) => {
  const sortOrderToNumber = (str) => str === 'asc' ? 1 : -1;
  return service
    .find({}, {
      perPage: parseInt(documentsInPage, 10),
      page: parseInt(pageNumber, 10),
      sort: { [sortBy]: sortOrderToNumber(sortOrder) }
    });
};

service.getAll = async () => {
  return service.find({});
}

service.truncate = async () => {
  return service.remove({});
}

module.exports = service;
