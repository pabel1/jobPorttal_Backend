// internal import
const catchAsyncError = require("../middleware/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");
const ContactModel = require("../models/contactModel");

// create contact
exports.createContact = catchAsyncError(async (req, res, next) => {
  const { name, phone, email, description } = req.body;
  if (!name || !phone || !email || !description) {
    return next(new Errorhandeler("Please fill the value properly", 400));
  }
  const contact = await ContactModel.create({
    name,
    phone,
    email,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Message Sent Successfully!!",
    contact,
  });
});

// get all contacts
exports.getAllContacts = catchAsyncError(async (req, res, next) => {
  const contacts = await ContactModel.find();
  if (!contacts) {
    return next(new Errorhandeler("Contacts not Found", 400));
  }
  res.status(200).json({
    success: true,
    contacts,
  });
});
