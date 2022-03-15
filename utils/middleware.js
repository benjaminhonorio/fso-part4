const jwt = require("jsonwebtoken");
const config = require("./config");

const errorHandler = (error, request, response, next) => {
  console.log(error);
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  let token = request.get("authorization");
  if (token && token.toLowerCase().startsWith("bearer ")) {
    token = token.substring(7);
  } else {
    return response.status(401).json({ error: "missing or invalid token" });
  }
  const decodedToken = jwt.verify(token, config.SECRET);
  request.token = decodedToken;
  next();
};

module.exports = { errorHandler, tokenExtractor };
