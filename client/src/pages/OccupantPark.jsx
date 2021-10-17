import React, { Component } from 'react'
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import api from '../api'
import styled from 'styled-components'

const Select = styled.select`
  width: 100%;
  height: 35px;
  background: white;
  color: gray;
  padding-left: 5px;
  font-size: 14px;
  border: none;
  margin-left: 10px;

  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`
const createOption = (label, carType) => ({
  carType,
  label,
  value: label.toUpperCase().replace(/\W/g, ''),
});

const defaultOptions = [
  createOption('', 0)
];

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

class OccupantPark extends Component{
  constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        plateNumList: defaultOptions,
        plateNum: '',
        carType: '',
        entryPoint: '',
        settings: [],
      };
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    await api.getOccupants().then(res => {
      let plateNumList = (res.data.data) ? (res.data.data).map(a => createOption(a.plateNum, a.carType)): {};
      this.setState({
          plateNumList
      })
    });
    await api.getParkingLotSettings().then(res => {
      this.setState({
          settings: res.data.settings,
          isLoading: false,
      })
    });
  }

  handleChangeInputCarType = async event => {
      const carType = event.target.validity.valid
          ? event.target.value
          : this.state.carType;
      this.setState({ carType });
  }

  handleChangeInputEntryPoint = async event => {
      var entryPoint = event.target.validity.valid
          ? event.target.value
          : this.state.carType;
      entryPoint = entryPoint.toUpperCase();
      this.setState({ entryPoint });
  }

  handleChangeInputPlateNum = async (
     newValue: OnChangeValue<Option, false>,
     actionMeta: ActionMeta<Option>
   ) => {
     this.setState({ plateNum: newValue, carType: newValue.carType });
   };

   handleNewOption = (inputValue: string) => {
    const { plateNum, plateNumList } = this.state;
    const newOption = createOption(inputValue.toUpperCase(), -1);

    this.setState({
      plateNumList: [...plateNumList, newOption],
      plateNum: newOption,
    });

  };

  handleOccupantPark = async () => {
    const { plateNum, carType, entryPoint, settings } = this.state;
    //validate entries
    // convert entryPoint to number first and upper case plate numbers
    let entryPointInt = parseInt(entryPoint.toUpperCase().charCodeAt()) - 65; // ascii(64) + index(1)
    let plateNumUC = plateNum.value.toUpperCase();
    const entryPointCount = settings ? settings[0].entryPointCount : 3;

    if (entryPointInt >= entryPointCount){
      window.alert("Invalid entry point. Please check and try again.")
    }
    const payload = { plateNum: plateNumUC, carType, entryPoint: entryPointInt };
    let message = "";
    var occupant = await api.getOccupantByPlateNum(plateNum.value).then(res => {
      if(res.data.success){
        message += `Returning occupant found.`
        return res.data.data;
      }
      return null;
      });

    if (!occupant) {
      let occupantId = "";
      await api.createOccupant(payload).then(res => {
        occupantId = res.data.id;
          message += `Occupant created successfully with ID: ` + res.data.id;
          this.setState({
              plateNum: '',
              carType: '',
              entryPoint: '',
          });
      });
      occupant = await api.getOccupantById(occupantId).then(res => {
        return res.data.data;
      });
    }

      await api.park({ entryPoint: entryPointInt, occupant }).then(res => {
        message += `\nFound slot successfully!`
        this.setState({
          plateNum: '',
          carType: '',
          entryPoint: '',
        });
      });
    window.alert(message);
  }

  render() {
      const { plateNumList, plateNum, carType, entryPoint } = this.state
      return (
          <Wrapper>
              <Title>Occupant Parking</Title>
              <Label>Plate Number: </Label>
              <CreatableSelect
                isClearable
                onChange={this.handleChangeInputPlateNum}
                onCreateOption={this.handleNewOption}
                options={plateNumList}
                value={plateNum}
             />

              <Label>Car Type: </Label>
              <Select
              value={carType}
              onChange={this.handleChangeInputCarType}>
                <option value="0">Small</option>
                <option value="1">Medium</option>
                <option value="2">Large</option>
              </Select>
              <hr/>
              <Label>Entry Point: </Label>
              <InputText
                type="text"
                maxLength={1}
                value={entryPoint}
                onChange={this.handleChangeInputEntryPoint}
              />
              <Button onClick={this.handleOccupantPark}>Park</Button>
              <CancelButton href={'/movies/list'}>Cancel</CancelButton>
          </Wrapper>
      )
  }
}

export default OccupantPark;
