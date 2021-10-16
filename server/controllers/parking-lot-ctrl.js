const { ParkingLot, ParkingSlot } = require('../models/parking-lot-model')
const Occupant = require('../models/occupant-model')

const MIN_SLOT_COUNT = 6;
const MIN_ENTRY_PT_COUNT = 3;

// one time
generateParkingLot = async (req, res) => {
  const body = req.body;
  if (!body || !body.entryPointCount) {
    return res.status(400).json({
      success: false,
      message: 'You must provide at least an entry point count value',
    })
  }

  if (body.entryPointCount < MIN_ENTRY_PT_COUNT) {
    return res.status(400).json({
      success: false,
      message: 'Entry points must be more than 2!',
    })
  }
  let entryPointCount = parseInt(body.entryPointCount);
  // randomize slotCount and slotSizes if unavailable
  let max = entryPointCount * MIN_SLOT_COUNT;
  let slotCount = body.slotCount ? body.slotCount : Math.floor(Math.random() * (max - MIN_SLOT_COUNT + 1)) + MIN_SLOT_COUNT;
  let slotSizes = body.slotSizes ? body.slotSizes : Array.from(
    {
      length: slotCount
    }, () => Math.floor(Math.random() * 3));

  // set number of slots per entry point
  let closestValue = Math.ceil(slotCount / entryPointCount);
  let excessValue = closestValue * entryPointCount - slotCount; //(slotCount % entryPointCount) - 1;
  let slotPerEntry = new Array(entryPointCount).fill(closestValue);

  // append excess value to the last entry point
  if (excessValue != 0) {
    slotPerEntry[slotPerEntry.length - 1] = closestValue - excessValue;
  }

  var parkingSlots = [];
  var slotMap = [];
  var slotNumber = 1;
  for (var entryPoint = 0; entryPoint < slotPerEntry.length; entryPoint++) {
    var currentArray = [];
    for (var slot = 0; slot < slotPerEntry[entryPoint]; slot++){
      parkingSlots.push(new ParkingSlot({ // create slots
        entryPoint,
        occupied: false,
        occupant: {},
        timeIn: "",
        size: slotSizes[slotNumber-1],
        number: slotNumber
      }));
      currentArray.push(slotNumber++); // build map/matrix
    }
    slotMap.push(currentArray);
    console.log(entryPoint+1 + "[" + currentArray + "]");
  }
  // mass parking slot insertion
  ParkingSlot.insertMany(parkingSlots)
    .then(() => {
      return res.status(200).json({
        success: true,
        parkingSlots,
        slotCount,
        entryPointCount,
        slotPerEntry,
        message: 'generateParkingLot() : Parking lot created!',
      })
   })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: 'generateParkingLot() : Parking lot not created because ' + error,
      })
    });

    // save settings
    const settings = new ParkingLot({
      entryPointCount,
      slotCount,
      slotPerEntry,
      slotMap
    });

    settings
        .save()
        .then(() => {})
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'generateParkingLot() : Parking lot settings not created because ' + error,
            })
        });
}

deleteParkingLot = async (req, res) => {
  // delete all parking slots
  ParkingSlot.deleteMany({}, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err
      })
    }
  }).catch(err => console.log(err))
  // delete settings
  ParkingLot.deleteMany({}, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err
      })
    }
  }).catch(err => console.log(err))

  return res.status(200).json({
    success: true,
    message: "deleteParkingLot() : Parking lot deleted!"
  })
}

getParkingSlots = (req, res) => {
  ParkingSlot.find({}, (err, parkingSlots) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err
      })
    }
    if (!parkingSlots.length) {
      return res
        .status(404)
        .json({
          success: false,
          message: `getParkingSlots() : Empty list`
        })
    }
    return res.status(200).json({
      success: true,
      data: parkingSlots
    })
  }).catch(err => console.log(err))
}

const occupySlot = async (req, res) => {
  const body = req.body // req.body should contain: entryPoint, occupant
  if (!body) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a body to update',
    })
  }
  // validate occupant - shouldn't be currently occupying other slots... physically impossible
  if(!await validateOccupant(body.occupant)){
    return res.status(404).json({success: false, message: `occupySlot() : it's physically impossible to occupy several slots my guy`});
  }
  // get available slot
  let availableSlot = await getClosestAvailableSlot(parseInt(body.entryPoint), body.occupant);
  // update parking slot
  try {
    const data = {
      entryPoint: body.entryPoint,
      occupant: body.occupant,
      occupied: true,
      timeIn: new Date().toISOString(),
    };
    let results = await updateParkingSlot(data, availableSlot);
    return res.status(200).json({success: true, message: `occupySlot() : Slot [${availableSlot}] is now occupied!`});
  } catch(err){
    return res.status(404).json({success: false,  message: `occupySlot() : Error in updating slot [${availableSlot}] because ` + err});
  }
}
// todo: update lastTimein and lastTimeout after unoccupy
const unoccupySlot = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a body to update',
    })
  }
  const parkingSlot = await ParkingSlot.findOne({number: body.slotNumber}).exec();
  const occupant = new Occupant(body.occupant);
  // calculate charges
  try {
    let totalCharge = await calculateCharge(occupant, parkingSlot);
    // update parking slot
    let results = await updateParkingSlot({
      occupied: false,
      occupant: {},
      timeIn: ""
    }, body.slotNumber);
    return res.status(200).json({
      success: true,
      message: `unoccupySlot() : Slot [${body.slotNumber}] is now unoccupied!`,
      totalCharge
    });
  } catch (err) {
      return res.status(404).json({success: false,  message: `unoccupySlot() : Error in calculating charges and updating slot [${availableSlot}] because ` + err});
  }

}

const updateParkingSlot = async (body, slotNumber) => {
  ParkingSlot.findOne({
    number: slotNumber
  }, (err, parkingSlot) => {
    if (err) {
      console.log('updateParkingSlot() : error! ' + err);
      throw Error(err);
    }

    parkingSlot.occupant = body.occupant
    parkingSlot.occupied = body.occupied
    parkingSlot.timeIn = body.timeIn
    parkingSlot.save(function (err) {
      if(err) {
        console.log('updateParkingSlot() : error! ' + err);
        throw Error(err);
      }
    })
  });
}

const validateOccupant = async (occupant) => {
  const slot = await ParkingSlot.findOne({"occupant._id" : occupant._id}).exec();
  if(slot) { // currently occupying a slot
    return false;
  }
  return true;
}

const getParkingSlotById = async (req, res) => {
  ParkingSlot.findOne({
    _id: req.params.id
  }, (err, parkingSlot) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err
      })
    }

    if (!parkingSlot) {
      return res
        .status(404)
        .json({
          success: false,
          message: `getParkingSlotById() : Parking slot not found!`
        })
    }
    return res.status(200).json({
      success: true,
      data: parkingSlot
    })
  }).catch(err => console.log(err))
}

const getClosestAvailableSlot = async (entryPoint, occupant) => {
  let allowedSizes = [2];
  switch (occupant.carType) {
    case 0: allowedSizes.push(0);
    case 0,1: allowedSizes.push(1);
  }
  const settings = await ParkingLot.find({}).exec();
  var availableSlots = await ParkingSlot.find({ size: { $in: allowedSizes }, occupied: false }).select({ number: 1, _id: 0}).sort({number: "asc"}).exec();
  availableSlots = availableSlots.map(slot => slot.number); // extract slot numbers
  console.log("slotPerEntry: " + settings[0].slotPerEntry);
  console.log("slotCount: " + settings[0].slotCount);
  console.log("entryPointCount: " + settings[0].entryPointCount);
  console.log("availableSlots: " + availableSlots);
  console.log("allowedSizes: " + allowedSizes);
  console.log("entryPoint: " + entryPoint);
  // starting point is based on entry point
  return breadthFirstSearch(settings[0].slotMap, [entryPoint, 0], availableSlots);
}

const breadthFirstSearch = (grid, pivot, availableSlots) => {
  let children = (pivot, grid) => {
    let connectedCells = [
      [pivot[0] - 1, pivot[1]],
      [pivot[0], pivot[1] - 1],
      [pivot[0] + 1, pivot[1]],
      [pivot[0], pivot[1] + 1]
    ];

    const validCells = connectedCells.filter((cell) => (
        cell[0] >= 0 && cell[0] < grid.length
        && cell[1] >= 0 && cell[1] < grid[0].length)
    )

    return validCells.filter(
      (cell) => (grid[cell[0]][cell[1]] !== grid[pivot[0]][pivot[1]])
    )
  }

  let visited = new Set();
  let queue = [];
  queue.push(pivot);

  while (queue.length) {
    let current = queue.shift();
    visited.add(current.toString())
    const [x,y] = current.toString().split(",");
    let currentValue = grid[x][y];
    if (availableSlots.includes(currentValue)){
      return currentValue;
    }

    for (let child of children(current, grid)) {
      if (!visited.has(child.toString())){
        queue.push(child);
      }
    }
  }
}

const getDiffHours = (fromDate, toDate) => {
  return Math.ceil(Math.abs(fromDate.getTime() - toDate.getTime()) / 3600000);
}

const calculateCharge = (occupant, parkingSlot) => {
  const size = parkingSlot.size;
  const timeIn = new Date(parkingSlot.timeIn);
  const timeOut = new Date();
  const currentDiffHours = getDiffHours(timeIn, timeOut);
  console.log("currentDiffHours: " + currentDiffHours);
  // case where occupant is a returning occupant
  if (occupant.lastTimeIn && occupant.lastTimeOut){
    let lastTimeOut = new Date(occupant.lastTimeOut);
    let lastTimeIn = new Date(occupant.lastTimeIn);
    let prevDiffHours = getDiffHours(lastTimeIn, lastTimeOut);
    console.log("prevDiffHours: " + prevDiffHours);
    let sumDiffHours = prevDiffHours + currentDiffHours;
    console.log("sumDiffHours: " + sumDiffHours);

    if (getDiffHours(lastTimeOut, timeIn) == 1){ // occupant was only away less than an hour
      return getHourlyValue(size, sumDiffHours) - getHourlyValue(size, prevDiffHours); // subtract previous payment
    }
  }
  return getHourlyValue(size, currentDiffHours);
}

const getHourlyValue = (size, hours) => {
  var sum = 40;
  if (hours <= 3) {
    return sum;
  } else if (hours <= 24){
    hours -= 3;
  }

  if (hours >= 24) {
    var days = Math.floor(hours / 24);
    sum = 5000 * days;
    hours = Math.abs(hours - (24 * days));
  }

  switch (size){
    case 0: sum += 20 * hours; break;
    case 1: sum += 60 * hours; break;
    case 2: sum += 100 * hours; break;
  }
  console.log("sum: " + sum);
  return sum;
}

module.exports = {
  generateParkingLot,
  deleteParkingLot,
  getParkingSlots,
  occupySlot, // park
  unoccupySlot, // unpark
}
