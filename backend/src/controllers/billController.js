const Bill = require('../models/Bill');

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ hospital: req.user._id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBill = async (req, res) => {
  try {
    const { patientName, service, amount } = req.body;
    const bill = await Bill.create({
      hospital: req.user._id,
      patientName,
      service,
      amount
    });
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};