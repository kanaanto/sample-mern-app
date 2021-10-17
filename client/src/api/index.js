import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})
// parking lot
export const getParkingLot = () => api.get(`/parking-lot`)
export const generateParkingLot = (payload) => api.post(`/parking-lot/generate`, payload)
export const deleteParkingLot = () => api.delete(`/parking-lot/deleteAll`)
export const getParkingLotSettings = () => api.get(`/parking-lot/settings`)
// parking slots
export const park = (payload) => api.put(`/parking-lot/park`, payload)
export const unpark = (payload) => api.put(`/parking-lot/unpark`, payload)
// occupants
export const getOccupants = () => api.get(`/occupants`)
export const createOccupant = (payload) => api.post(`/occupant`, payload)
export const updateOccupantById = (id, payload) => api.put(`/occupant/${id}`, payload)
export const deleteOccupantById = id => api.delete(`/occupant/${id}`)
export const getOccupantById = id => api.get(`/occupant/${id}`)
export const getOccupantByPlateNum = plateNum => api.get(`/occupant/plateNum/${plateNum}`)

const apis = {
    getParkingLot,
    generateParkingLot,
    deleteParkingLot,
    getParkingLotSettings,
    park,
    unpark,
    getOccupants,
    createOccupant,
    updateOccupantById,
    deleteOccupantById,
    getOccupantById,
    getOccupantByPlateNum
}

export default apis
