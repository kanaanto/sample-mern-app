import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

import styled from 'styled-components'

import 'react-table/react-table.css'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`
const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class UpdateOccupant extends Component {
    updateOccupant = event => {
        event.preventDefault();
        window.location.href = `/occupant/update/${this.props.id}`;
    }

    render() {
        return <Update onClick={this.updateOccupant}>Update</Update>
    }
}

class DeleteOccupant extends Component {
    deleteOccupant = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete this occupant ${this.props.plateNum} permanently?`,
            )
        ) {
            api.deleteOccupantById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteOccupant}>Delete</Delete>
    }
}

class OccupantList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            occupants: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        await api.getOccupants().then(occupants => {
            this.setState({
                occupants: occupants.data.data,
                isLoading: false,
            })
        })
    }
    getCarTypeEq(carType) {
      switch(carType){
        case 0: return "Small";
        case 1: return "Medium";
        case 2: return "Large";
      }
    }

    render() {
        const { occupants, isLoading } = this.state
        const columns = [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Plate Number',
                accessor: 'plateNum',
                filterable: true,
            },
            {
                Header: 'Last Time In',
                accessor: 'lastTimeIn',
                filterable: true,
            },
            {
                Header: 'Last Time Out',
                accessor: 'lastTimeOut',
                filterable: true,
            },
            {
                Header: 'Car Type',
                accessor: 'carType',
                filterable: true,
                Cell: function(data) {
                  switch(data.original.carType){
                    case 0: return "Small";
                    case 1: return "Medium";
                    case 2: return "Large";
                  }
                },
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <UpdateOccupant id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteOccupant id={props.original._id} />
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!occupants.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={occupants}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default OccupantList
