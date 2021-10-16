import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

import styled from 'styled-components'

import 'react-table/react-table.css'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`
const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const Unoccupy = styled.div`
    color: #fff;
    cursor: pointer;
    text-align:center;
`
const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class UnoccupySlot extends Component {
    unoccupySlot = event => {
        event.preventDefault()
        if (window.confirm(
                `Do you want to checkout occupant ${this.props.plateNum}?`,
            )
        ) {
            api.unpark(this.props.id)
        }
    }

    render() {
        return <Unoccupy onClick={this.unoccupySlot}>l e a v e</Unoccupy>
    }
}

class ParkingLotMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkingLot: [],
            columns: [],
            isLoading: false,
        };
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        await api.getParkingLot().then(parkingLot => {
            this.setState({
                parkingLot: parkingLot.data.data,
                isLoading: false,
            })
        })
    }

    render() {
        const { parkingLot, isLoading } = this.state;
        const columns = [
            {
                Header: 'Entry Point',
                accessor: 'entryPoint',
                filterable: true,
                Cell: function(data) {
                  switch(data.original.entryPoint){
                    case 0: return "A";
                    case 1: return "B";
                    case 2: return "C";
                  }
                },
            },
            {
                Header: 'Slot Number',
                accessor: 'number',
                filterable: true,
            },
            {
                Header: 'Slot Size',
                accessor: 'size',
                filterable: true,
                Cell: function(data) {
                  switch(data.original.size){
                    case 0: return "Small";
                    case 1: return "Medium";
                    case 2: return "Large";
                  }
                },
            },
            {
                Header: 'Occupied',
                accessor: 'occupied',
                filterable: true,
                getProps: (state, rowInfo, column) => {
                    return {
                        style: {
                            background: rowInfo && rowInfo.row.occupied ? 'red' : 'green',
                        },
                    };
                  }, Cell: function(data) {
                  if (data.original.occupied){
                    return (
                        <span>
                            <UnoccupySlot id={data.original._id} />
                        </span>
                    )
                  } return "";
              },
            },
            {
                Header: 'Occupant',
                accessor: 'occupant',
                filterable: true,
                Cell: function(data) {
                  if(!data.original.occupant) {
                    return "";
                  }

                  let plateNum = data.original.occupant.plateNum;
                  let carType = "";
                  switch(data.original.occupant.carType){
                    case 0: carType = "Small"; break;
                    case 1: carType =  "Medium"; break;
                    case 2: carType =  "Large"; break;
                  }
                  return `${plateNum} [${carType}]`;

                },
            },
            {
                Header: 'Time In',
                accessor: 'timeIn',
                filterable: true,
                Cell: function(data) {
                  if(!data.original.timeIn) {
                    return "";
                  }

                  let timeIn = new Date(data.original.timeIn);
                  return timeIn.toLocaleString();
                },
            }
        ]

        let showTable = true;
        if (!parkingLot.length) {
            showTable = false;
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={parkingLot}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />)}
                {
                  !showTable && ("Parking lot is empty!")
                }
            </Wrapper>
        );
    }
}

export default ParkingLotMap
