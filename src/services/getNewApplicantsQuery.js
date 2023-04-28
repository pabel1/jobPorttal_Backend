const listingByJoin = async (req, DataModel) => {
  try {
    let jobpostnameValue = req.query.jobpostname;

    let resData;

    console.log(jobpostnameValue);
    if (jobpostnameValue) {
      resData = await ApplyJob.aggregate([
        {
          $match: {
            jobpostname: { $eq: jobpostnameValue },
          },
        },

        // {
        //   $lookup: {
        //     from: "jobposts",
        //     localField: "jobPostId",
        //     foreignField: "_id",
        //     as: "jobpost",
        //   },
        // },
        // {
        //   $unwind: "$jobpost",
        // },
        // {
        //   $match: {
        //     "jobpost.jobpostname": "specific_jobpost_name",
        //   },
        // },
        // {
        //   $group: {
        //     _id: "$jobpostname",
        //     totalApplicant: { $sum: 1 },
        //     TotalViews: {
        //       $sum: {
        //         $cond: [{ $eq: ["$viewStatus", true] }, 1, 0],
        //       },
        //     },
        //     TotalNotViews: {
        //       $sum: {
        //         $cond: [{ $eq: ["$viewStatus", false] }, 1, 0],
        //       },
        //     },
        //     TotalShortListed: {
        //       $sum: {
        //         $cond: [{ $eq: ["$cvShortList", true] }, 1, 0],
        //       },
        //     },

        //     Deadline: { $first: "$deadline" },
        //   },
        // },
      ]);
    }

    res.status(200).json({
      success: true,
      // message: "Product gets successfully",
      resData,
    });
    return { status: "success", data: resData };
  } catch (error) {
    return {
      status: "failed",
      data: error.toString(),
      message: "Server side Error",
    };
  }
};
module.exports = listingByJoin;
