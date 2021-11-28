const express = require('express');
const { getAllDrivers, 
      createDriver,
      getDriverById,
      UpdateDriverDetails,
      DeleteADriver,
      updatePhoto
} = require('../controller/driver');
const router = express.Router();

const {protect, authorized} = require('../middleware/auth');

router.use(protect);
router.use(authorized('admin', 'driver'));

router.route('/')
      .get(getAllDrivers)
      .post(createDriver);

router.route('/:id')
      .get(getDriverById)
      .put(UpdateDriverDetails)
      .delete(DeleteADriver);

router.route('/photo/:driverId').put(updatePhoto)

module.exports = router;