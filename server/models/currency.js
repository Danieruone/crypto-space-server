const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CurrencySchema = new Schema({
  user_id: {
    type: String,
    require: [true, "user_id is required"],
  },
  name: {
    type: String,
    require: [true, "currency name is required"],
  },
  alias: {
    type: String,
    require: [true, "currency alias is required"],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Currency", CurrencySchema);
