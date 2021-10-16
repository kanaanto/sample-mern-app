
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ParkingLotMap, GenerateParkingLot, OccupantList, OccupantCreate, OccupantUpdate } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/parking-lot" exact component={ParkingLotMap} />
                <Route path="/parking-lot/generate" exact component={GenerateParkingLot} />
                <Route path="/occupants" exact component={OccupantList} />
                <Route path="/occupant/create" exact component={OccupantCreate} />
                <Route
                    path="/occupant/update/:id"
                    exact
                    component={OccupantUpdate}
                />
            </Switch>
        </Router>
    )
}

export default App
