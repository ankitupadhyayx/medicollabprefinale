const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { 
    getHospitals, 
    updateHospitalStatus, 
    getDisputes, 
    resolveDispute,
    getStats, 
    getAuditLogs 
} = require('../controllers/adminController');

router.use(protect);
router.use(roleCheck('ADMIN'));

router.get('/hospitals', getHospitals);
router.patch('/hospitals/:id/status', updateHospitalStatus);

router.get('/disputes', getDisputes);
router.patch('/disputes/:id/resolve', resolveDispute);

router.get('/stats', getStats);
router.get('/audit', getAuditLogs);

module.exports = router;