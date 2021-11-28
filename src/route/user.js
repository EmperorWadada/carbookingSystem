const express = require('express');
const router = express.Router();
const {
      createUser,
      getAUser,
      getAllUsers,
      deleteUser,
      updateUser
} = require('../controller/user')

const {protect, authorized} = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');
const User = require('../model/User')

router.use(protect)
router.use(authorized('admin'));

router.route('/')
      .post(createUser)
      .get(advancedResult(User), getAllUsers);

router.route('/:id')
      .put(updateUser)
      .delete(deleteUser)
      .get(getAUser);

module.exports = router;