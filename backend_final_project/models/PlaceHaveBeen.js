import mongoose from 'mongoose';

const placeHaveBeenSchema = new mongoose.Schema(
    {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    places: [{
        type: String
    }],
    }, 
    { timestamps: true },
);

const Places = mongoose.model('PlaceHaveBeen', placeHaveBeenSchema);
export default Places;
