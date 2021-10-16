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

class OccupantCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            plateNum: '',
            carType: '',
            entryPoint: '',
        }
    }

    handleChangeInputPlateNum = async event => {
        const plateNum = event.target.value;
        this.setState({ plateNum });
    }

    handleChangeInputCarType = async event => {
        const carType = event.target.validity.valid
            ? event.target.value
            : this.state.carType;
        this.setState({ carType });
    }

    handleChangeInputEntryPoint = async event => {
        const entryPoint = event.target.validity.valid
            ? event.target.value
            : this.state.carType;
        this.setState({ entryPoint });
    }

    handleCreateOccupant = async () => {
        const { plateNum, carType, entryPoint } = this.state;
        const payload = { plateNum, carType, entryPoint };
        let occupantId = "";
        await api.createOccupant(payload).then(res => {
          occupantId = res.data.id;
            window.alert(`Occupant created successfully with ID: ` + res.data.id);
            this.setState({
                plateNum: '',
                carType: '',
                entryPoint: '',
            });
        });

        const occupant = await api.getOccupantById(occupantId).then(res => {
          return res.data.data;
        });

        if(entryPoint) {
          await api.park({ entryPoint, occupant }).then(res => {
            window.alert(`Occupant parked successfully`);
            this.setState({
                plateNum: '',
                carType: '',
                entryPoint: '',
            });
          });
        }
    }

    render() {
        const { plateNum, carType, entryPoint } = this.state
        return (
            <Wrapper>
                <Title>Create Occupant</Title>

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
                    step="0"
                    min="0"
                    max="2"
                    pattern="^[0-2]*$"
                    value={carType}
                    onChange={this.handleChangeInputCarType}
                />
                <hr/>
                <Label>Entry Point: </Label>
                <InputText
                  type="number"
                  step="0"
                  min="0"
                  value={entryPoint}
                  onChange={this.handleChangeInputEntryPoint}
                />
                <Button onClick={this.handleCreateOccupant}>Create Occupant</Button>
                <CancelButton href={'/movies/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default OccupantCreate
