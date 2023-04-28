const mongoose = require("mongoose");

// Dynamic schema field collection
const jobfieldSchema = new mongoose.Schema(
  {
    fieldlabel: {
      type: String,
      required: true,
    },
    fieldname: {
      type: String,
      required: true,
    },
    fieldtype: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const jobpostSchema = new mongoose.Schema(
  {
    jobpostname: {
      type: String,
      required: [true, "Please enter post name"],
    },
    jobcategory: {
      type: String,
      required: [true, "Please enter post category"],
    },
    jobsubcategory: {
      type: String,
      required: [true, "Please enter post subcategory"],
    },
    jobdescription: {
      type: String,
      required: [true, "Please enter job description"],
    },
    jobqualification: {
      type: String,
      required: [true, "Please enter job qualification"],
    },
    employeestatus: {
      type: String,
      required: [true, "Please enter employeestatus"],
    },
    salary: {
      type: String,
      required: [true, "Please enter job salary"],
    },
    vaccency: {
      type: String,
      required: [true, "Please enter job vaccancy"],
    },
    deadline: {
      type: Date,
      required: [true, "Please enter job deadline"],
    },
    jobPostStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    photo: {
      url: String,
      public_id: String,
    },
    dynamicFields: [jobfieldSchema],
  },

  { timestamps: true }
);

// const JobField = mongoose.model("JobField", jobfieldSchema);
const JobPost = mongoose.model("JobPost", jobpostSchema);

module.exports = { JobPost };
