function handleResponseSuccess(res, status, message, dataRes) {
  return res.status(status).json({
    status: status,
    message: message,
    data: dataRes,
  });
}

function handleResponseFailure(res, status, message) {
  return res.status(status).json({
    status: status,
    message: message,
  });
}

module.exports = {
  handleResponseSuccess,
  handleResponseFailure,
};
