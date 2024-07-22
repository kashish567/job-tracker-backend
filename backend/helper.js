function sendResponse(res, data, statusCode = 200) {
  res.status(statusCode).json({
    message: statusCode === 200 ? "Request successful." : "Request failed.",
    data: data || {},
    error: null,
  });
}

module.exports = {
  sendResponse,
};
