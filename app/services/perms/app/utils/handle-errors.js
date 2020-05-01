const handleErrors = (id, errors) => {
  return { id: id, errors: { msg: JSON.stringify(errors) } };
};

module.exports = { handleErrors };
