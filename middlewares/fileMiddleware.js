const fs = require("fs");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.deleteFileOnRemove = catchAsync(async (req, res, next) => {
  if (!req.Model) {
    return next(new AppError("Model not set on request object", 500));
  }
  console.log("req.Model:", req.Model);

  const document = await req.Model.findById(req.params.id);
  if (!document) {
    return next(new AppError("No document found with that ID", 404));
  }

  if (!document.filePath) {
    console.log("No file path found on this document, skipping file deletion.");
    return next();
  }

  console.log("document.filePath:", document.filePath);
  if (document.filePath) {
    const filePath = path.join(__dirname, "../public/", document.filePath);
    console.log("filePath:", filePath);

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      return next(new AppError("Error deleting file: " + error.message, 500));
    }
  }

  next();
});

exports.updateFileOnEdit = catchAsync(async (req, res, next) => {
  if (!req.Model) {
    return next(new AppError("Model not set on request object", 500));
  }

  const document = await req.Model.findById(req.params.id);
  if (!document) {
    return next(new AppError("No document found with that ID", 404));
  }

  if (req.file && document.filePath) {
    const oldFilePath = path.join(__dirname, "../public", document.filePath);

    try {
      if (fs.existsSync(oldFilePath)) {
        await fs.promises.unlink(oldFilePath);
      }
    } catch (error) {
      return next(
        new AppError("Error deleting old file: " + error.message, 500)
      );
    }

    // Update document with the new file path
    if (req.file) {
      document.filePath = req.file.path;
      await document.save();
    }
  }

  next();
});
