const express=require('express')
const Theatre=require('../models/theatre.model')
const theatreRouter=express.Router();


theatreRouter.post('/addTheatre',async(req,res)=>
{
try {
    const newTheatre=await Theatre.insertMany(req.body)
    res.status(201).send(
        {
         success:true,
         message:'Theatre added successfully!',
         theatre:newTheatre,
        }
    );
} catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
}
})

theatreRouter.get('/getAllTheatres',async(req,res)=>
{
    try {
        const theatres=await Theatre.find();
        res.status(201).json(
            {
                success:true,
                message:'Theatres fetched successfully',
                theatres:theatres,
            }
        )
    } catch (error) {
        res.status(500).json(
            {
               success:false,
                message:'Theatres data not found',
            }
        )
    }
})

module.exports=theatreRouter