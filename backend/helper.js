function sendResponse(res, data, statusCode = 200) {
  if (!res.headersSent) {
    // console.log(`Sending response with status ${statusCode}:`, data);
    res.status(statusCode).json({
      message: statusCode === 200 ? "Request successful." : "Request failed.",
      data: data || null,
      error: statusCode !== 200 ? data : null,
    });
  } else {
    console.error("Headers already sent.");
  }
}

module.exports = {
  sendResponse,
};
