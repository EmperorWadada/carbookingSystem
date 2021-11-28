const express = require('express');
const router = express.Router();
const {getAllPassengers,
        getSinglePassenger,
        createPassenger,
        updatePassenger,
        deletePassenger,
        newBooking,
        editBooking,
        deletLastItem
    } = require('../controller/passenger')
const {protect, authorized} = require('../middleware/auth');

router.use('/booking/new', newBooking);
router.route('/booking/editbooking').put(protect, authorized('passenger', 'admin'), editBooking);
router.route('/booking/deletebooking').delete(protect, authorized('admin', 'passenger'), deletLastItem);

const Passenger = require('../model/Passenger')
const advancedResult = require('../middleware/advancedResult');

router.route('/')
      .get(advancedResult(Passenger), getAllPassengers)
      .post(protect, createPassenger); 

router.use(protect),
router.use(authorized('passenger', 'admin'),)
router.route('/:id')
      .get(getSinglePassenger)
      .put(updatePassenger)
      .delete(deletePassenger);



module.exports = router;