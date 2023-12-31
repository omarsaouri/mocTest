const verifyData = (CNE, username, subscription) => {
  if (!CNE) return { state: false, msg: "CNE IS required" };
  if (!username) return { state: false, msg: "username  IS required" };
  if (
    subscription !== "free" &&
    subscription !== "premium" &&
    subscription !== "pro"
  )
    return { state: false, msg: "wrong subs value" };
  return { state: true, msg: "" };
};

const verificationMiddleware = (req, res, next) => {
  let { CNE, username, subscription } = req.body;
  let { state, msg } = verifyData(CNE, username, subscription);
  if (state) return next();
  res.status(400).send(msg);
};

module.exports = {
  verifyData,
  verificationMiddleware,
};
