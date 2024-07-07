import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    setCountries,
    setSelectedCountry,
    setCity,
    setPlacesTraveled,
    addPlaceTraveled,
    deletePlaceTraveled,
    editPlaceTraveled
} from '../../slices/travelSlice';

const CountrySelect = ({ selectedCountry, onChange }) => {
    const dispatch = useDispatch();
    const countries = useSelector((state) => state.travel.countries);

    useEffect(() => {
        fetch(
            "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        )
            .then((response) => response.json())
            .then((data) => {
                dispatch(setCountries(data.countries));
            });
    }, [dispatch]);

    return (
        <Select
            options={countries}
            value={selectedCountry}
            onChange={onChange}
        />
    );
};

function SelectCounty() {
    const dispatch = useDispatch();
    const selectedCountry = useSelector((state) => state.travel.selectedCountry);
    const city = useSelector((state) => state.travel.city);
    const placesTraveled = useSelector((state) => state.travel.placesTraveled);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/tracker?userId=${userId}`);
                dispatch(setPlacesTraveled(response.data.places));
            } catch (error) {
                console.error('Error fetching places:', error);
            }
        };
        fetchPlaces();
    }, [userId, dispatch]);

    // ADD 
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedCountry && city) {
            const newPlace = `${selectedCountry.label}, ${city}`;
            try {
                await axios.post('http://localhost:8000/tracker', {
                    userId,
                    newPlace
                });
                dispatch(addPlaceTraveled(newPlace));
                dispatch(setSelectedCountry(null));
                dispatch(setCity(''));
            } catch (error) {
                console.error('Error adding place:', error);
            }
        }
    };

    // DELETE place
    const handleDelete = async (index) => {
        try {
            const response = await axios.delete(`http://localhost:8000/tracker/${userId}/places/${index}`);
            if (response.data.success) {
                dispatch(deletePlaceTraveled(index));
            } else {
                console.error('Failed to delete place:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    };

    // UPDATE
    const handleEdit = async (index) => {
        const newCity = prompt('Enter new city name:');
        if (newCity) {
            try {
                const response = await axios.put(`http://localhost:8000/tracker/${userId}/places/${index}`, {
                    newCity
                });
                if (response.data.success) {
                    const currentPlace = placesTraveled[index];
                    const currentCountry = currentPlace.split(', ')[0];
                    const newPlace = `${currentCountry}, ${newCity}`;
                    dispatch(editPlaceTraveled({ index, newPlace }));
                } else {
                    console.error('Failed to update place:', response.data.message);
                }
            } catch (error) {
                console.error('Error updating place:', error);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Container >
            <Form className='travel_form' onSubmit={handleSubmit} style={{ backgroundColor: "white" }}>
                <CountrySelect
                    selectedCountry={selectedCountry}
                    onChange={(value) => dispatch(setSelectedCountry(value))}
                />
                <input
                    className='travel_input'
                    type="text"
                    placeholder='city ...'
                    value={city}
                    onChange={(e) => dispatch(setCity(e.target.value))}
                />
                <button className="travel_btn" type="submit">Submit</button>
                <div>
                    <div className='travel_center'>
                        <h3 style={{ display: 'flex', justifyContent: "center" }}>Places Traveled</h3>
                        <ul className='travel_list'>
                            {placesTraveled.map((place, index) => (
                                <li key={index}>
                                    {place}
                                    <button className="travel_btn yellow" onClick={() => handleEdit(index)}>Edit</button>
                                    <button className="travel_btn red" onClick={() => handleDelete(index)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="btn btn-success" onClick={handlePrint}>Print page where you have been</button>
                </div>
                <br />
            </Form>
        </Container>
    );
}

export default SelectCounty;
