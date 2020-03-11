const handleSuccess = (id, errors) => {
  return { id: id, errors: { msg: JSON.stringify(errors) } };
};

module.exports = { handleSuccess };
