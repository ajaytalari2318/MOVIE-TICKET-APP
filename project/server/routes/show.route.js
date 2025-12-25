const express = require('express');
const Show = require('../models/show.model');
const Theatre = require('../models/theatre.model');
const Movie = require('../models/movie.model');
const showRouter = express.Router();

// Partner: Add new show (only for approved theatres)
showRouter.post('/addShow', async (req, res) => {
  try {
    const { theatreId, movieId, createdBy, ...showData } = req.body;
    
    // Verify theatre is approved
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }
    
    if (theatre.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Only approved theatres can add shows'
      });
    }
    
    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Check for conflicting shows (same theatre, screen, date, time)
    const conflictingShow = await Show.findOne({
      theatre: theatreId,
      screenNumber: showData.screenNumber,
      showDate: showData.showDate,
      showTime: showData.showTime,
      status: { $in: ['active', 'housefull'] }
    });
    
    if (conflictingShow) {
      return res.status(400).json({
        success: false,
        message: 'A show already exists at this time for this screen'
      });
    }
    
    const newShow = new Show({
      movie: movieId,
      theatre: theatreId,
      createdBy,
      availableSeats: showData.totalSeats,
      ...showData
    });
    
    await newShow.save();
    
    const populatedShow = await Show.findById(newShow._id)
      .populate('movie', 'title posterURL genre language rating')
      .populate('theatre', 'name location');
    
    res.status(201).json({
      success: true,
      message: 'Show added successfully!',
      show: populatedShow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all shows for a theatre
showRouter.get('/getShowsByTheatre/:theatreId', async (req, res) => {
  try {
    const { theatreId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = { theatre: theatreId };
    
    if (startDate || endDate) {
      query.showDate = {};
      if (startDate) query.showDate.$gte = new Date(startDate);
      if (endDate) query.showDate.$lte = new Date(endDate);
    }
    
    const shows = await Show.find(query)
      .populate('movie', 'title posterURL genre language rating')
      .populate('theatre', 'name location')
      .sort({ showDate: 1, showTime: 1 });
    
    res.json({
      success: true,
      message: 'Shows fetched successfully',
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get shows by movie
showRouter.get('/getShowsByMovie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { city, date } = req.query;
    
    let query = { 
      movie: movieId,
      status: { $in: ['active', 'housefull'] }
    };
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.showDate = { $gte: startDate, $lte: endDate };
    }
    
    const shows = await Show.find(query)
      .populate('movie', 'title posterURL genre language rating')
      .populate('theatre', 'name location totalScreens facilities');
    
    // Filter by city if provided
    let filteredShows = shows;
    if (city) {
      filteredShows = shows.filter(show => 
        show.theatre.location.city.toLowerCase() === city.toLowerCase()
      );
    }
    
    // Group shows by theatre
    const groupedShows = filteredShows.reduce((acc, show) => {
      const theatreId = show.theatre._id.toString();
      if (!acc[theatreId]) {
        acc[theatreId] = {
          theatre: show.theatre,
          shows: []
        };
      }
      acc[theatreId].shows.push(show);
      return acc;
    }, {});
    
    res.json({
      success: true,
      message: 'Shows fetched successfully',
      theatres: Object.values(groupedShows)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get show by ID
showRouter.get('/getShow/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id)
      .populate('movie', 'title posterURL genre language rating description')
      .populate('theatre', 'name location totalScreens facilities contact')
      .populate('createdBy', 'name email');
    
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Show fetched successfully',
      show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update show
showRouter.put('/updateShow/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }
    
    // Don't allow updates if show is completed
    if (show.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed shows'
      });
    }
    
    const updatedShow = await Show.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('movie', 'title posterURL genre language rating')
      .populate('theatre', 'name location');
    
    res.json({
      success: true,
      message: 'Show updated successfully!',
      show: updatedShow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel show
showRouter.put('/cancelShow/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }
    
    if (show.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed shows'
      });
    }
    
    show.status = 'cancelled';
    show.notes = reason ? `Cancelled: ${reason}` : 'Show cancelled';
    await show.save();
    
    res.json({
      success: true,
      message: 'Show cancelled successfully',
      show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete show
showRouter.delete('/deleteShow/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }
    
    // Don't allow deletion if there are bookings
    if (show.bookingStats.totalBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete show with existing bookings. Cancel the show instead.'
      });
    }
    
    await Show.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Show deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get shows by partner (creator)
showRouter.get('/getShowsByPartner/:partnerId', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.query;
    
    let query = { createdBy: partnerId };
    if (status) {
      query.status = status;
    }
    
    const shows = await Show.find(query)
      .populate('movie', 'title posterURL genre language rating')
      .populate('theatre', 'name location')
      .sort({ showDate: -1, showTime: -1 });
    
    res.json({
      success: true,
      message: 'Shows fetched successfully',
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark show as completed (auto-run or manual)
showRouter.put('/completeShow/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }
    
    show.status = 'completed';
    await show.save();
    
    res.json({
      success: true,
      message: 'Show marked as completed',
      show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get upcoming shows (next 7 days)
showRouter.get('/getUpcomingShows', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const shows = await Show.find({
      showDate: { $gte: today, $lte: nextWeek },
      status: { $in: ['active', 'housefull'] }
    })
      .populate('movie', 'title posterURL genre language rating')
      .populate('theatre', 'name location')
      .sort({ showDate: 1, showTime: 1 })
      .limit(50);
    
    res.json({
      success: true,
      message: 'Upcoming shows fetched successfully',
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = showRouter;