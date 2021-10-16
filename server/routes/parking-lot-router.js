const express = require('express')

const ParkingLotCtrl = require('../controllers/parking-lot-ctrl')

const router = express.Router()
// parking lot
router.post('/parking-lot/generate', ParkingLotCtrl.generateParkingLot)
router.delete('/parking-lot/deleteAll', ParkingLotCtrl.deleteParkingLot)
router.get('/parking-lot', ParkingLotCtrl.getParkingSlots)
// parking slot
router.put('/parking-lot/park', ParkingLotCtrl.occupySlot)
router.put('/parking-lot/unpark', ParkingLotCtrl.unoccupySlot)

module.exports = router
