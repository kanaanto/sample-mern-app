import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class OccupantUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            plateNum: '',
            carType: '',
        }
    }

    handleChangeInputPlateNum = async event => {
        const plateNum = event.target.value
        this.setState({ plateNum })
    }

    handleChangeInputCarType = async event => {
        const carType = event.target.validity.valid
            ? event.target.value
            : this.state.carType

        this.setState({ carType })
    }

    handleUpdateOccupant = async () => {
        const { id, plateNum, carType } = this.state
        const payload = { plateNum, carType }

        await api.updateOccupantById(id, payload).then(res => {
            window.alert(`Occupant updated successfully`)
            this.setState({
                plateNum: '',
                carType: '',
            })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const occupant = await api.getOccupantById(id)

        this.setState({
            plateNum: occupant.data.data.plateNum,
            carType: occupant.data.data.carType,
        })
    }

    render() {
        const { plateNum, carType } = this.state
        return (
          <Wrapper>
              <Title>Update Occupant</Title>

              <Label>Plate Number: </Label>
              <InputText
                  type="text"
                  value={plateNum}
                  pattern="[A-Z]{3}-[0-9]{4}"
                  onChange={this.handleChangeInputPlateNum}
              />

              <Label>Car Type: </Label>
              <InputText
                  type="number"
                  step="0.1"
                  lang="en-US"
                  min="0"
                  max="2"
                  pattern="^[0-2]*$"
                  value={carType}
                  onChange={this.handleChangeInputCarType}
              />

              <Button onClick={this.handleUpdateOccupant}>Update Occupant</Button>
              <CancelButton href={'/occupants'}>Cancel</CancelButton>
          </Wrapper>
        )
    }
}

export default OccupantUpdate
