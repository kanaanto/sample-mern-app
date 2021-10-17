const Occupant = require('../models/occupant-model')

createOccupant = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide info',
        })
    }

    const occupant = new Occupant(body);
    if (!occupant) {
        return res.status(400).json({ success: false, error: err })
    }

    occupant
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: occupant._id,
                message: 'Occupant created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Occupant not created!',
            })
        })
}
// could do more refactoring along with updateOccupantByPlateNum
updateOccupantById = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Occupant.findOne({ _id: req.params.id }, (err, occupant) => { // todo: find via plate number
        if (err) {
            return res.status(404).json({
                err,
                message: 'updateOccupantById() : Occupant not found!',
            })
        }
        occupant.carType = body.carType
        occupant.lastTimeOut = body.lastTimeOut
        occupant.lastTimeIn = body.lastTimeIn
        occupant.plateNum = body.plateNum
        occupant
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: occupant._id,
                    message: 'updateOccupantById() : Occupant updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'updateOccupantById() : Occupant not updated!',
                })
            })
    })
}

updateOccupantByPlateNum = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Occupant.findOne({ plateNum: req.params.plateNum }, (err, occupant) => { // todo: find via plate number
        if (err) {
            return res.status(404).json({
                err,
                message: 'updateOccupantByPlateNum() : Occupant not found!',
            })
        }
        occupant.carType = body.carType
        occupant.timeIn = body.timeIn
        occupant.timeOut = body.timeOut
        occupant.plateNum = body.plateNum
        occupant
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: occupant._id,
                    message: 'updateOccupantByPlateNum() : Occupant updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'updateOccupantByPlateNum() : Occupant not updated!',
                })
            })
    })
}

deleteOccupant = async (req, res) => {
    await Occupant.findOneAndDelete({ _id: req.params.id }, (err, occupant) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!occupant) {
            return res
                .status(404)
                .json({ success: false, error: `deleteOccupant() : Occupant not found!` })
        }

        return res.status(200).json({ success: true, data: occupant })
    }).clone().catch(err => console.log(err))
}

getOccupantById = async (req, res) => {
    await Occupant.findOne({ _id: req.params.id }, (err, occupant) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!occupant) {
            return res
                .status(200)
                .json({ success: false, error: `getOccupantById() : Occupant not found!` })
        }
        return res.status(200).json({ success: true, data: occupant })
    }).clone().catch(err => console.log(err))
}

getOccupantByPlateNum = async (req, res) => {
    await Occupant.findOne({ plateNum: req.params.plateNum }, (err, occupant) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!occupant) {
            return res
                .status(200)
                .json({ success: false, error: `getOccupantByPlateNum() : Occupant not found!` })
        }
        return res.status(200).json({ success: true, data: occupant })
    }).catch(err => console.log(err))
}

getOccupants = async (req, res) => {
    await Occupant.find({}, (err, occupants) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!occupants.length) {
            return res
                .status(404)
                .json({ success: false, error: `getOccupants() : Empty list` })
        }
        return res.status(200).json({ success: true, data: occupants })
    }).clone().catch(err => console.log(err))
}

module.exports = {
    createOccupant,
    updateOccupantById,
    updateOccupantByPlateNum,
    deleteOccupant,
    getOccupants,
    getOccupantById,
    getOccupantByPlateNum
}
