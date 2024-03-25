'use strict';

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hi!',
        input: event,
      }
    ),
  };

};
