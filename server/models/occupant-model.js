const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Occupant = new Schema(
    {
      carType: { type: Number, required: true }, // 0 - S, 1 - M, 2 - L
      lastTimeIn: { type: String, required: false },
      lastTimeOut: { type: String, required: false },
      plateNum: { type: String, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('occupant', Occupant)
