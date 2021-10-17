import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

class Links extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    OO Parking Lot
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/parking-lot" className="nav-link">
                                Show Parking Lot
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/parking-lot/generate" className="nav-link">
                                *Generate New Map*
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/occupant/create" className="nav-link">
                                Park
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/occupants" className="nav-link">
                                List Occupants
                            </Link>
                        </Item>

                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links
