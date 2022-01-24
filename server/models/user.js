const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  name: {
    type: String,
    require: [true],
  },
  email: {
    type: String,
    unique: true,
    require: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });
module.exports = mongoose.model("User", UserSchema);
