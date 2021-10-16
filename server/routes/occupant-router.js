const express = require('express')

const OccupantCtrl = require('../controllers/occupant-ctrl')

const router = express.Router()

router.post('/occupant', OccupantCtrl.createOccupant)
router.put('/occupant/:id', OccupantCtrl.updateOccupantById)
router.put('/occupant/plateNum/:plateNum', OccupantCtrl.updateOccupantByPlateNum)
router.delete('/occupant/:id', OccupantCtrl.deleteOccupant)
router.get('/occupant/:id', OccupantCtrl.getOccupantById)
router.get('/occupant/plateNum/:plateNum', OccupantCtrl.getOccupantByPlateNum)
router.get('/occupants', OccupantCtrl.getOccupants)

module.exports = router
