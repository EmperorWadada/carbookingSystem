const express = require('express');
const router = express.Router();
const {
      createCar, 
      getAllCars,
      deleteACar,
      getSingleCar,
      updateCarInfo,
      uploadPhonto
} = require('../controller/car');
const Car = require('../model/Car');

const {protect, authorized} = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');

router.route('/').get(advancedResult(Car), getAllCars);

router.use(protect);
router.use(authorized('admin'))

router.route('/')
      .post(createCar)

router.route('/:id')
      .delete(deleteACar)
      .get(getSingleCar)
      .put(updateCarInfo);

router.use('/photo/:carId', uploadPhonto)

module.exports = router;