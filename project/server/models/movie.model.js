const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
    {
        title:
        {
            type: String,
            required: true
        },
         language:
        {
            type: String,
            required: true
        },
        genre:
        {
            type: String,
            required: true,
        },
        posterURL:
        {
            type: String,
            required: true
        },
        description:
        {
            type: String
        },
         releaseDate:
        {
            type: Date,
            required: true,
        },
        rating:
        {
            type: Number,
            min: 0,
            max: 10
        }
    },
    { timestamps: true }
)

const movie = mongoose.model('movies', movieSchema);
module.exports = movie 