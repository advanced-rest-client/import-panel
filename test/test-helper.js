const DataTestHelper = {};

DataTestHelper.getFile = function(file) {
  return fetch(file).then(response => {
    if (!response.ok) {
      throw new Error('File ' + file + ' is unavailable');
    }
    return response.text();
  });
};
