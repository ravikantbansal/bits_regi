// model/blacklistedToken.js
const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
