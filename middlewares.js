const { User } = require("./db.js");
const config = require("./config.js");

function userRoute(req, res, next) {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, config.content.JWT_PASS);
  const { userName } = decodedToken;
  User.findOne({
    userName,
  })
    .then((value) => {
      if (value) {
        next(); // Call next() when the user is found
      } else {
        return res.status(403).json({
          msg: "No access without login",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        msg: "Internal server error",
      });
    });
}

module.exports = userRoute;
