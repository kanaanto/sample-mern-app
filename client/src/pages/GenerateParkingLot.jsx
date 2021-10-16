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

class GenerateParkingLot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            plateNum: '',
            carType: '',
        }
    }

    handleChangeInputEntryPointCount = async event => {
      const entryPointCount = event.target.validity.valid
          ? event.target.value
          : this.state.entryPointCount;
      this.setState({ entryPointCount });
    }

    handleChangeInputSlotCount = async event => {
        const slotCount = event.target.validity.valid
            ? event.target.value
            : this.state.slotCount;

        this.setState({ slotCount });
    }

    handleGenerateMap = async () => {
        const { entryPointCount, slotCount } = this.state;
        const payload = { entryPointCount, slotCount };

        if (  window.confirm(
                'Generating a new map will delete previous map and its slots. Continue?',
            )
        ) {
          api.deleteParkingLot();

        await api.generateParkingLot(payload).then(res => {
            window.alert(`Parking lot generated successfully`);
            this.setState({
                entryPointCount: '',
                slotCount: '',
            });
        }).catch(err => {
          window.alert(JSON.stringify(err.response.data.message));
        });
      }
    }

    render() {
        const { entryPointCount, slotCount } = this.state;
        return (
            <Wrapper>
                <Title>Generate Parking Lot Map</Title>

                <Label>Number of Entry Points (min of 3): </Label>
                <InputText
                    type="number"
                    value={entryPointCount}
                    onChange={this.handleChangeInputEntryPointCount}
                    required="true"
                />

                <Label>Number of Slots: </Label>
                <InputText
                    type="number"
                    value={slotCount}
                    onChange={this.handleChangeInputSlotCount}
                />

                <Button onClick={this.handleGenerateMap}>Generate Map</Button>
                <CancelButton href={'/movies/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default GenerateParkingLot
