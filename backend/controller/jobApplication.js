const express = require("express");
const { sendResponse } = require("../helper");
const JobApplicationModel = require("../model/jobapplication");
const jwt = require("jsonwebtoken");

const jobApplicationRouter = express.Router();

// Decode user_id from token
async function decodeUserId(res, token) {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user_id;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Get all job applications for a user
jobApplicationRouter.get("/", async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader);
    if (!authorizationHeader) {
      console.log("---------------------------------------------------");
      // return sendResponse(res, { message: "Provide token" }, 400);
    }

    const token = authorizationHeader.split(" ")[1];
    const user_uid = await decodeUserId(res, token);
    if (!user_uid) {
      return;
    }
    const jobApplications = await JobApplicationModel.find({ user: user_uid });

    return sendResponse(res, jobApplications);
  } catch (error) {
    return sendResponse(res, { message: error.message }, 500);
  }
});

jobApplicationRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return sendResponse(res, { message: "Provide token" }, 400);
    }
    const token = authorizationHeader.split(" ")[1];
    const user_uid = await decodeUserId(res, token);
    if (!user_uid) {
      return; // decodeUserId sends the response in case of error
    }

    const jobApplication = await JobApplicationModel.findById(id);
    if (!jobApplication) {
      return sendResponse(res, { message: "Job Application not found" }, 404);
    }

    if (jobApplication.user.toString() !== user_uid) {
      return sendResponse(
        res,
        { message: "You are not authorized to access this resource" },
        401
      );
    }

    return sendResponse(res, jobApplication);
  } catch (error) {
    return sendResponse(res, { message: error.message }, 500);
  }
});

// Create a new job application
jobApplicationRouter.post("/", async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return sendResponse(res, { message: "Provide token" }, 400);
    }
    const token = authorizationHeader.split(" ")[1];
    const user_uid = await decodeUserId(res, token);
    if (!user_uid) {
      return; // decodeUserId sends the response in case of error
    }

    const companyData = req.body;
    const jobApplication = await JobApplicationModel.create({
      ...companyData,
      user: user_uid,
    });
    console.log("Job application created:", jobApplication);

    return sendResponse(res, jobApplication);
  } catch (error) {
    // console.error("Error during job application creation:", error.message);
    return sendResponse(res, { message: error.message }, 500);
  }
});

// Update a specific job application by ID
jobApplicationRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyData = req.body;

    const jobApplication = await JobApplicationModel.findByIdAndUpdate(
      id,
      companyData,
      { new: true, runValidators: true } // Return updated document and run validators
    );

    if (!jobApplication) {
      return sendResponse(res, { message: "Job Application not found" }, 404);
    }

    return sendResponse(res, jobApplication);
  } catch (error) {
    return sendResponse(res, { message: error.message }, 500);
  }
});

// Delete a specific job application by ID
jobApplicationRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobApplication = await JobApplicationModel.findByIdAndDelete(id);

    if (!jobApplication) {
      return sendResponse(res, { message: "Job Application not found" }, 404);
    }

    return sendResponse(res, jobApplication);
  } catch (error) {
    return sendResponse(res, { message: error.message }, 500);
  }
});

module.exports = jobApplicationRouter;
