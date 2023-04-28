const catchAsyncError = require("../middleware/catchAsyncError");
const ApplyJob = require("../models/applyJobModel");
const Errorhandeler = require("../utility/ErrorHandler");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const { JobPost } = require("../models/jobpostModel");

//apply for the job
exports.applyForJob = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    reasonOfJoin,
    reasonOfChoosingYou,
    cv,
    gender,
    age,
    photo,
    skills,
    deadline,
    minSalary,
    maxSalary,
    education,
    dynamicFields,
    jobpostname,
    jobcategory,
    jobsubcategory,
  } = req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !reasonOfJoin ||
    !reasonOfChoosingYou ||
    !cv ||
    !gender ||
    !age ||
    !photo ||
    !skills ||
    !deadline ||
    !jobpostname ||
    !jobcategory ||
    !jobsubcategory ||
    education.length === 0
  ) {
    return next(new Errorhandeler("Please fill the value properly", 400));
  }

  // check email  isunique or not

  const currentDate = new Date();
  const deadlineMoment = new Date(req.body.deadline);
  const validUntil = new Date(
    deadlineMoment.getFullYear(),
    deadlineMoment.getMonth(),
    deadlineMoment.getDate(),
    23,
    59,
    59,
    999
  );
  let isApplyPrev;
  console.log(deadlineMoment);
  console.log(currentDate);
  if (validUntil > currentDate) {
    isApplyPrev = await ApplyJob.aggregate([
      {
        $match: {
          $and: [
            {
              email: { $eq: email },
            },
            {
              jobpostname: { $eq: req.body.jobpostname },
            },
          ],
        },
      },
    ]);
  } else {
    return next(new Errorhandeler("This Job's Deadline is Over!", 400));
  }

  if (isApplyPrev && isApplyPrev.length !== 0) {
    return next(
      new Errorhandeler("You are Already Applied For This Job!", 400)
    );
  }

  const contentType = cv.split(",").shift().split(";").shift().split(":").pop();
  if (contentType !== "application/pdf") {
    return next(new Errorhandeler("Only pdf is allowed", 400));
  }
  const myCloud = await cloudinary.v2.uploader.upload(cv, {
    folder: "mk_all_cv",
  });
  const myCloud2 = await cloudinary.v2.uploader.upload(photo, {
    folder: "mk_applications_photo",
  });

  // req.body.viewStatus = false;
  // req.body.shortlisted = false;

  const applyjob = await ApplyJob.create({
    name,
    email,
    phone,
    reasonOfJoin,
    reasonOfChoosingYou,
    cv: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    gender,
    age,
    photo: {
      public_id: myCloud2.public_id,
      url: myCloud2.secure_url,
    },
    skills,
    minSalary,
    maxSalary,
    deadline,
    jobpostname,
    jobcategory,
    jobsubcategory,
    education,
    dynamicFields,
  });
  // const applyjob = await ApplyJob.insertOne(req.body);
  res.status(201).json({
    success: true,
    message: "Applied Successfully",
    applyjob,
  });
});

exports.getAllApplicants = catchAsyncError(async (req, res, next) => {
  let subcategoryValue = req.query.subcategory;
  let categoryValue = req.query.category;
  let pageno = Number(req.query.page) || 1;
  let perpage = 10;
  let skipRow = (pageno - 1) * perpage;
  let resData;
  if (subcategoryValue) {
    resData = await ApplyJob.aggregate([
      {
        $facet: {
          total: [
            {
              $match: {
                $and: [
                  { jobcategory: { $eq: categoryValue } },
                  { jobsubcategory: { $eq: subcategoryValue } },
                ],
              },
            },
            { $count: "count" },
          ],
          data: [
            {
              $match: {
                $and: [
                  { jobcategory: { $eq: categoryValue } },
                  { jobsubcategory: { $eq: subcategoryValue } },
                ],
              },
            },
            { $skip: skipRow },
            { $limit: perpage },
          ],
        },
      },
    ]);
  } else if (categoryValue) {
    resData = await ApplyJob.aggregate([
      {
        $facet: {
          total: [
            {
              $match: {
                $and: [{ jobcategory: { $eq: categoryValue } }],
              },
            },
            { $count: "count" },
          ],
          data: [
            {
              $match: {
                $and: [{ jobcategory: { $eq: categoryValue } }],
              },
            },
            { $skip: skipRow },
            { $limit: perpage },
          ],
        },
      },
    ]);
  } else {
    resData = await ApplyJob.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [{ $skip: skipRow }, { $limit: perpage }],
        },
      },
    ]);
  }

  res.status(200).json({
    success: true,
    message: "Product gets successfully",
    resData,
  });
});

// get application by using query for admin
exports.getAllApplicantsByJobPostNameAndStatus = catchAsyncError(
  async (req, res, next) => {
    // let shortlistValue = req.query.shortlist;
    let jobpostnameValue = req.query.jobpostname;
    let keyValue = req.query;
    let pageno = Number(req.params.page) || 1;
    let perpage = 10;
    let skipRow = (pageno - 1) * perpage;
    // let jobpostStatus = JSON.parse(req.query.viewStatus);
    console.log(req.query);
    // get key from object
    let queryKey;
    let queryValue;
    console.log(Object.keys(keyValue).length);
    if (Object.keys(keyValue).length > 1) {
      let entries = Object.entries(keyValue);
      let lastIndex = entries.length - 1;
      let [key, value] = entries[lastIndex];
      queryKey = key;
      queryValue = JSON.parse(value);
    }
    let resData;

    if (jobpostnameValue && Object.keys(keyValue).length > 1) {
      resData = await ApplyJob.aggregate([
        {
          $facet: {
            total: [
              {
                $match: {
                  $and: [
                    { jobpostname: { $eq: jobpostnameValue } },
                    { [queryKey]: { $eq: queryValue } },
                  ],
                },
              },
              { $count: "count" },
            ],
            data: [
              {
                $match: {
                  $and: [
                    { jobpostname: { $eq: jobpostnameValue } },
                    { [queryKey]: { $eq: queryValue } },
                  ],
                },
              },
              { $skip: skipRow },
              { $limit: perpage },
              { $sort: { createdAt: -1 } },
            ],
          },
        },
      ]);
    } else if (jobpostnameValue) {
      resData = await ApplyJob.aggregate([
        {
          $facet: {
            total: [
              {
                $match: {
                  $and: [{ jobpostname: { $eq: jobpostnameValue } }],
                },
              },
              { $count: "count" },
            ],
            data: [
              {
                $match: {
                  $and: [{ jobpostname: { $eq: jobpostnameValue } }],
                },
              },
              { $skip: skipRow },
              { $limit: perpage },
              { $sort: { createdAt: -1 } },
            ],
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      resData,
    });
  }
);

// get subCategory
exports.getAllCategoryAndSubCategory = catchAsyncError(
  async (req, res, next) => {
    try {
      const resData = await ApplyJob.aggregate([
        {
          $project: {
            jobcategory: "$jobcategory",
            subcategories: {
              jobsubcategory: "$jobsubcategory",
            },
          },
        },

        {
          $group: {
            _id: "$jobcategory",
            subcategories: { $addToSet: "$subcategories" },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
      // console.log(res)
      res.status(200).json({
        status: "success",
        resData,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

//delete applicant
exports.deleteApplicants = catchAsyncError(async (req, res, next) => {
  let data = await ApplyJob.findById(req.params.id);

  await cloudinary.v2.uploader.destroy(data?.cv?.public_id);

  await data.remove();
  res.status(200).json({
    success: true,
    message: "Applicants Deleted Successfully!!",
  });
});

exports.getAllFields = catchAsyncError(async (req, res, next) => {
  let resData = await JobPost.aggregate([
    {
      $match: { jobpostname: { $eq: req.params.jobpostname } },
    },
  ]);
  res.status(200).json({
    success: true,
    message: "Product gets successfully",
    resData,
  });
});

//update short listed
//update status
//update Apply
exports.updateApply = catchAsyncError(async (req, res, next) => {
  const updateValue = req.body;

  let data = await ApplyJob.findByIdAndUpdate(req.params.id, updateValue, {
    new: true,
  });

  // data = await ApplyJob.updateOne(
  //   { _id: new ObjectId(req.params.id) },
  //   { $set: { status: req.body.status } }
  // );

  res.status(200).json({
    success: true,
    data,
  });
});

exports.updateNewCV = catchAsyncError(async (req, res, next) => {
  const data = await ApplyJob.updateMany(
    { newApply: true },
    { $set: { newApply: false } }
  );
  res.status(200).json({
    success: true,
    data,
  });
});

exports.getApplicantsBySearching = catchAsyncError(async (req, res, next) => {
  let pageno = Number(req.query.page) || 1;
  let perpage = Number(req.query.limit) || 10;
  let searchValue = req.query.search || 0;
  searchValue = searchValue.replace(/\\/g, ""); // to avoid epecial character
  let skipRow = (pageno - 1) * perpage;
  let resData;

  if (searchValue !== "0") {
    let searchRegex = {
      $regex: searchValue,
      $options: "i",
    };
    let searchQuery = {
      $or: [{ name: searchRegex }, { email: searchRegex }],
    };
    resData = await ApplyJob.aggregate([
      {
        $facet: {
          total: [{ $match: searchQuery }, { $count: "count" }],
          applicants: [
            { $match: searchQuery },
            { $skip: skipRow },
            { $limit: perpage },
          ],
        },
      },
    ]);
  } else {
    resData = await ApplyJob.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          applicants: [{ $skip: skipRow }, { $limit: perpage }],
        },
      },
    ]);
  }
  res.status(200).json({
    success: true,
    resData,
  });
});

// update some key value

exports.updatekeyValue = catchAsyncError(async (req, res, next) => {
  const postData = req.body;
  console.log(typeof postData.interviewCall);

  const data = await ApplyJob.updateOne(
    { _id: req.params.id },
    { $set: postData },
    { upsert: true }
  );
  res.status(200).json({
    success: true,
    data,
  });
});
