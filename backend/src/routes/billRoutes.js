const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getBills, createBill } = require('../controllers/billController');

router.use(protect);
router.use(roleCheck('HOSPITAL'));

router.get('/', getBills);
router.post('/', createBill);

module.exports = router;