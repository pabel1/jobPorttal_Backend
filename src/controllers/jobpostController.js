// external import
const cloudinary = require("cloudinary");

// internal import
const catchAsyncError = require("../middleware/catchAsyncError");
const { JobPost } = require("../models/jobpostModel");
const Errorhandeler = require("../utility/ErrorHandler");

// create job post
exports.createJob = catchAsyncError(async (req, res, next) => {
  const {
    jobpostname,
    jobcategory,
    jobsubcategory,
    jobdescription,
    employeestatus,
    salary,
    vaccency,
    jobqualification,
    deadline,
    dynamicFields,
    photo,
  } = req.body;
  if (
    !jobpostname ||
    !jobcategory ||
    !jobsubcategory ||
    !jobdescription ||
    !employeestatus ||
    !salary ||
    !vaccency ||
    !jobqualification ||
    !deadline ||
    !photo
  ) {
    return next(new Errorhandeler("Please fill the value properly", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(photo, {
    folder: "mk_JobPostPhoto",
  });
  const jobpost = await JobPost.create({
    jobpostname,
    jobcategory,
    jobsubcategory,
    jobdescription,
    jobqualification,
    employeestatus,
    salary,
    vaccency,
    jobqualification,
    deadline,
    dynamicFields,
    photo: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Job Post Created Successfully",
    jobpost,
  });
});

// get all job posts
exports.getAllJobPosts = catchAsyncError(async (req, res, next) => {
  let jobposts = await JobPost.find().sort({ createdAt: -1 });
  if (!jobposts) {
    return next(new Errorhandeler("No Jobs Available", 404));
  }
  res.status(200).json({
    success: true,
    jobposts,
  });
});

// get all job post by joining

exports.getAllJobPost = catchAsyncError(async (req, res, next) => {
  let resData;

  resData = await JobPost.aggregate([
    // {
    //   $match: {
    //     jobpostname: { $eq: jobpostnameValue },
    //   },
    // },

    {
      $lookup: {
        from: "applyjobs",
        localField: "jobpostname",
        foreignField: "jobpostname",
        as: "applyJobDetails",
      },
    },

    //  {
    //    $group: {
    //      _id: "$jobpostname",
    //      totalApplicant: { $sum: 1 },
    //      TotalViews: {
    //        $sum: {
    //          $cond: [{ $eq: ["$viewStatus", true] }, 1, 0],
    //        },
    //      },
    //      TotalNotViews: {
    //        $sum: {
    //          $cond: [{ $eq: ["$viewStatus", false] }, 1, 0],
    //        },
    //      },
    //      TotalShortListed: {
    //        $sum: {
    //          $cond: [{ $eq: ["$cvShortList", true] }, 1, 0],
    //        },
    //      },
    //      Deadline: { $first: "$deadline" },
    //    },
    //  },

    {
      $group: {
        _id: "$jobpostname",
        totalApplications: { $sum: { $size: "$applyJobDetails" } },
        totalShortlist: {
          $sum: {
            $size: {
              $filter: {
                input: "$applyJobDetails",
                as: "application",
                cond: { $eq: ["$$application.cvShortList", true] },
              },
            },
          },
        },
        totalViewCV: {
          $sum: {
            $size: {
              $filter: {
                input: "$applyJobDetails",
                as: "application",
                cond: { $eq: ["$$application.viewStatus", true] },
              },
            },
          },
        },
        totalNotViewCV: {
          $sum: {
            $size: {
              $filter: {
                input: "$applyJobDetails",
                as: "application",
                cond: { $eq: ["$$application.viewStatus", false] },
              },
            },
          },
        },
        interviewCall: {
          $sum: {
            $size: {
              $filter: {
                input: "$applyJobDetails",
                as: "application",
                cond: { $eq: ["$$application.interviewCall", true] },
              },
            },
          },
        },
        newCV: {
          $sum: {
            $size: {
              $filter: {
                input: "$applyJobDetails",
                as: "application",
                cond: { $eq: ["$$application.newApply", true] },
              },
            },
          },
        },
        Deadline: { $first: "$deadline" },
        active: { $first: "$jobPostStatus" },
        publishDate: { $first: "$createdAt" },
        jobId: { $first: "$_id" },
        jobdescription: { $first: "$jobdescription" },
        jobqualification: { $first: "$jobqualification" },
        jobcategory: { $first: "$jobcategory" },
        jobsubcategory: { $first: "$jobsubcategory" },
        employeestatus: { $first: "$employeestatus" },
        vaccency: { $first: "$vaccency" },
        salary: { $first: "$salary" },
        photo: { $first: "$photo" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json({
    success: true,
    // message: "Product gets successfully",
    resData,
  });
});

//update job posts
exports.updateJobPost = catchAsyncError(async (req, res, next) => {
  const {
    jobpostname,
    jobdescription,
    jobqualification,
    jobcategory,
    jobsubcategory,
    deadline,
    photo,
    employeestatus,
    vaccency,
    salary,
    base64,
  } = req.body;
  let jobpost = await JobPost.findById(req.params.id);
  if (!jobpost) {
    return next(new Errorhandeler("No Jobs Available", 404));
  }

  await cloudinary.v2.uploader.destroy(jobpost?.photo?.public_id);

  // Adding updated image to cloudinary
  const urlRegex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  const myCloud = await cloudinary.v2.uploader.upload(
    urlRegex.test(photo) ? base64 : photo,
    {
      folder: "mk_JobPostPhoto",
    }
  );

  let data = await JobPost.findByIdAndUpdate(
    req.params.id,
    {
      jobpostname,
      jobdescription,
      jobqualification,
      jobcategory,
      jobsubcategory,
      deadline,
      photo: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      employeestatus,
      vaccency,
      salary,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data,
  });
});

// delete job post
exports.deleteJobPost = catchAsyncError(async (req, res, next) => {
  let jobpost = await JobPost.findById(req.params.id);
  if (!jobpost) {
    return next(new Errorhandeler("No Jobs Available", 404));
  }

  await cloudinary.v2.uploader.destroy(jobpost?.photo?.public_id);

  await jobpost.remove();
  res.status(200).json({
    success: true,
    message: "Jobpost Deleted Successfully!!",
    jobpost,
  });
});
