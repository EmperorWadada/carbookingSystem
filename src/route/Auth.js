const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth');

const {
        registerUser,
        loginUser,
        currentUser,
        logout,
        updatePassword,
        updateUserDetails,
        forgotPassword,
        resetPassword
    } = require('../controller/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/currentuser').post(protect, currentUser);
router.get('/logout', logout);
router.put('/updatepassword', protect, updatePassword)
router.put('/updateuserinfo', protect, updateUserDetails);
router.post('/forgotPassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);


module.exports = router;