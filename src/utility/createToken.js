const jwt = require("jsonwebtoken");
const jwtHandle = async (email, _id) => {
  // console.log(email)
  // console.log(_id)
  const token = jwt.sign(
    {
      email: email,
      userId: _id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "5d",
    }
  );
  return token;
};

module.exports = jwtHandle;
