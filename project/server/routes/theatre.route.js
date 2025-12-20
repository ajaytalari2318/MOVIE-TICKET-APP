// server/routes/theatre.route.js - Enhanced Version
const express = require('express');
const Theatre = require('../models/theatre.model');
const theatreRouter = express.Router();

// Partner: Add theatre request
theatreRouter.post('/addTheatre', async (req, res) => {
  try {
    const theatreData = {
      ...req.body,
      status: 'pending'
    };
    
    const newTheatre = new Theatre(theatreData);
    await newTheatre.save();
    
    res.status(201).json({
      success: true,
      message: 'Theatre request submitted successfully! Waiting for admin approval.',
      theatre: newTheatre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all theatres (for admin)
theatreRouter.get('/getAllTheatres', async (req, res) => {
  try {
    const theatres = await Theatre.find()
    
    res.status(200).json({
      success: true,
      message: 'Theatres fetched successfully',
      theatres: theatres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Theatres data not found',
    });
  }
});

// Get theatres by owner (for partner)
// Get theatre by ID (for admin/partner/public)
theatreRouter.get('/getTheatresByOwner/:emailId', async (req, res) => {
  try {
    const { emailId } = req.params;
    const theatres = await Theatre.find({ "contact.email": emailId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Theatres fetched successfully',
      theatres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch theatres',
    });
  }
});



// Get approved theatres only (for public)
theatreRouter.get('/getApprovedTheatres', async (req, res) => {
  try {
    const theatres = await Theatre.find({ status: 'approved' })
      .populate('owner', 'name')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      message: 'Approved theatres fetched successfully',
      theatres: theatres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved theatres',
    });
  }
});

// Admin: Approve theatre
theatreRouter.put('/approveTheatre/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;
    
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: null
      },
      { new: true }
    ).populate('owner', 'name email');
    
    if (!updatedTheatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Theatre approved successfully!',
      theatre: updatedTheatre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin: Reject theatre
theatreRouter.put('/rejectTheatre/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, reason } = req.body;
    
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: adminId,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('owner', 'name email');
    
    if (!updatedTheatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Theatre rejected',
      theatre: updatedTheatre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update theatre (only by owner, and resets to pending if approved)
theatreRouter.put('/updateTheatre/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If theatre was approved and being edited, reset to pending
    const theatre = await Theatre.findById(id);
    if (theatre.status === 'approved') {
      updateData.status = 'pending';
      updateData.approvedBy = null;
      updateData.approvedAt = null;
    }
    
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTheatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }
    
    res.json({
      success: true,
      message: theatre.status === 'approved' 
        ? 'Theatre updated! Pending admin approval again.' 
        : 'Theatre updated successfully!',
      theatre: updatedTheatre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete theatre
theatreRouter.delete('/deleteTheatre/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTheatre = await Theatre.findByIdAndDelete(id);
    
    if (!deletedTheatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Theatre deleted successfully!',
      theatre: deletedTheatre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = theatreRouter;