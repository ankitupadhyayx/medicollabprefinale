// Create a file: backend/debug.js
const authController = require('./src/controllers/authController');
const hospitalController = require('./src/controllers/hospitalController');
const recordController = require('./src/controllers/recordController');
const adminController = require('./src/controllers/adminController');
const appointmentController = require('./src/controllers/appointmentController');

console.log('📋 Auth Controller:', Object.keys(authController));
console.log('📋 Hospital Controller:', Object.keys(hospitalController));
console.log('📋 Record Controller:', Object.keys(recordController));
console.log('📋 Admin Controller:', Object.keys(adminController));
console.log('📋 Appointment Controller:', Object.keys(appointmentController));