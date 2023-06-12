import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  let token = req.headers.authorization;
  console.log(req.headers);
  if (!token) {
    return res.status(401).json({ error: "No Token Provided" });
  }

  try {
    let decode = jwt.decode(token);
    req.user = decode.id;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default userAuth;
