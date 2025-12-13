const express = require('express')
const movie = require('../models/movie.model.js')

const movieRouter = express.Router();

movieRouter.post('/add-movies', async (req, res) => {
  try {
    const newMovies = await movie.insertMany(req.body); // req.body must be an array
    res.status(201).json({
      success: true,
      message: 'Movies added successfully!',
      movies: newMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


movieRouter.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params; // movie id from URL
        const updateData = req.body; // fields to update

        const updatedMovie = await movie.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // return updated doc & validate schema
        );

        if (!updatedMovie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found',
            });
        }

        res.json({
            success: true,
            message: 'Details updated successfully!',
            movie: updatedMovie,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


movieRouter.get('/allMovies', async (req, res) => {
  try {
    const allMovies = await movie.find();

    res.status(200).json({
      success: true,
      message: 'Movies fetched successfully!',
      movies: allMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while fetching movies',
    });
  }
});


movieRouter.get('/movieById/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const findMovie = await movie.findById(id);

    if (!findMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie fetched successfully!',
      movie: findMovie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while fetching movie',
    });
  }
});

movieRouter.delete('/deleteMovie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMovie = await movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully!',
      movie: deletedMovie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while deleting movie',
    });
  }
});




module.exports = movieRouter;
