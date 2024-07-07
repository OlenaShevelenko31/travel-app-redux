import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET - /tracker - get all places where have been traveled
router.get('/', async (req, res) => {
    const userId = req.query.userId; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ places: user.places });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /tracker - adding places to existing iser
router.post('/', async (req, res) => {
    const { newPlace } = req.body;
    const userId = req.body.userId; 

    try {
        const user = await User.findByIdAndUpdate(userId, {
            $push: { places: newPlace }
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Place added successfully', user });
    } catch (error) {
        console.error('Error adding place:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Delete
router.delete('/:userId/places/:index', async (req, res) => {
    const userId = req.params.userId;
    const index = req.params.index;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Remove the place at the specified index from the places array
        user.places.splice(index, 1);
        await user.save();

        res.json({ success: true, message: 'Place deleted successfully', user });
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT (udate)
router.put('/:userId/places/:index', async (req, res) => {
    const userId = req.params.userId;
    const index = req.params.index;
    const newCity = req.body.newCity;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentPlace = user.places[index];
        const currentCountry = currentPlace.split(', ')[0]; 
        const newPlace = `${currentCountry}, ${newCity}`; 

        user.places[index] = newPlace; 
        await user.save();

        res.json({ success: true, message: 'Place updated successfully', user });
    } catch (error) {
        console.error('Error updating place:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
  
export default router;
