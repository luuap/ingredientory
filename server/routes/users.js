const express = require('express');
const User = require('../models/User');

const usersRoute = express.Router();

usersRoute.get('/', async (req, res) => {
  const testQuery = await User.find({});
  res.send(testQuery);

});

function initUsers() {
  User.insertMany(
    [
      { name: 'John doe' },
    ],
    () => console.log('DB seeded with users')
  );
}

module.exports = {
  usersRoute,
  initUsers,
};