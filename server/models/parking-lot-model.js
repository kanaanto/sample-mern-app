const mongoose = require('mongoose')
const Schema = mongoose.Schema

const parkingLot = new Schema(
    {
        entryPointCount: { type: Number, required: true },
        slotCount: { type: Number, required: true },
        slotPerEntry: { type: [], required: true },
        slotMap: { type: [], required: true }
    },
    { timestamps: true },
)

const parkingSlot = new Schema(
    {
        occupied: { type: Boolean, required: true },
        size: { type: Number, required: true }, // 0 - SP, 1 - MP, 2 - LP
        occupant: { type: {}, required: false },
        number: { type: Number, required: true },
        timeIn: { type: String, required: false },
        entryPoint : { type: Number, required: true }
    },
    { timestamps: true },
)

const ParkingLot = mongoose.model('parking-lot', parkingLot);
const ParkingSlot = mongoose.model('parking-slot', parkingSlot);

module.exports = { ParkingLot, ParkingSlot }
