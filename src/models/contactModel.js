const mongoose = require("mongoose");
const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    description: {
      type: String,
      required: [true, "Please enter your description"],
    },

    __v: false,
  },
  { timestamps: true }
);

const ContactModel = mongoose.model("Contact", contactSchema);

module.exports = ContactModel;
