import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countries: [],
  selectedCountry: null,
  city: '',
  placesTraveled: []
};

const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setPlacesTraveled: (state, action) => {
      state.placesTraveled = action.payload;
    },
    addPlaceTraveled: (state, action) => {
      state.placesTraveled.push(action.payload);
      state.placesTraveled.sort((a, b) => {
        const countryA = a.split(', ')[0];
        const countryB = b.split(', ')[0];
        return countryA.localeCompare(countryB);
      });
    },
    deletePlaceTraveled: (state, action) => {
      state.placesTraveled.splice(action.payload, 1);
    },
    editPlaceTraveled: (state, action) => {
      const { index, newPlace } = action.payload;
      state.placesTraveled[index] = newPlace;
    }
  }
});

export const {
  setCountries,
  setSelectedCountry,
  setCity,
  setPlacesTraveled,
  addPlaceTraveled,
  deletePlaceTraveled,
  editPlaceTraveled
} = travelSlice.actions;

export default travelSlice.reducer;
