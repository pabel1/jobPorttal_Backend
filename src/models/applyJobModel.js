const mongoose = require("mongoose");

const applyJobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    reasonOfJoin: {
      type: String,
      required: [true, "Please enter the reason of join with us"],
    },
    reasonOfChoosingYou: {
      type: String,
      required: [true, "Please enter the reason of why we choose you"],
    },
    gender: {
      type: String,
      required: [true, "Please enter Your Gender"],
    },
    age: {
      type: String,
      required: [true, "Please enter Your Age"],
    },
    photo: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    skills: {
      type: String,
      required: [true, "Please enter Your Skills"],
    },
    minSalary: {
      type: Number,
    },
    maxSalary: {
      type: Number,
    },

    cv: {
      url: String,
      public_id: String,
    },
    deadline: {
      type: String,
      required: [true, "Please add the deadline"],
    },
    jobpostname: {
      type: String,
      required: [true, "Please add jobpost name"],
      ref: "jobposts",
    },
    jobcategory: {
      type: String,
      required: [true, "Please add jobcategory name"],
    },
    jobsubcategory: {
      type: String,
      required: [true, "Please add jobcategory name"],
    },
    // dynamicFields: [jobfieldSchema],
    viewStatus: {
      type: Boolean,
      default: false,
    },
    cvMark: {
      type: Number,
      min: Number.MIN_SAFE_INTEGER,
      max: 10,
      default: 0,
    },
    cvShortList: {
      type: Boolean,
      default: false,
    },
    cvWaiting: {
      type: Boolean,
      default: false,
    },
    taskMark: {
      type: Number,
      min: Number.MIN_SAFE_INTEGER,
      max: 10,
      default: 0,
    },
    interViewMark: {
      type: Number,
      min: Number.MIN_SAFE_INTEGER,
      max: 10,
      default: 0,
    },
    interViewComment: {
      type: String,
      default: "N/A",
    },
    newApply: {
      type: Boolean,
      default: true,
    },
    interviewCall: {
      type: Boolean,

      default: false,
    },
    education: [],
    dynamicFields: {},
  },
  { timestamps: true }
);

const ApplyJob = mongoose.model("ApplyJob", applyJobSchema);
// const ApplyJob = mongoose.connection.collection("ApplyJob");
module.exports = ApplyJob;
