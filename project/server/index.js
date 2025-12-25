const express=require('express');
const dbConfig=require('./dbConfig.js')
const dotEnv=require('dotenv')
const cors=require('cors')
dotEnv.config();

const app=express()
dbConfig.connectDB()

const userRoutes=require('./routes/user.route.js')
const movieRoutes=require('./routes/movie.route.js')
const theatreRoutes=require('./routes/theatre.route.js')
const showRouter=require('./routes/show.route.js')
app.use(express.json()); 

app.use(cors({
  origin: ["http://localhost:5173", "https://bookingmyshows.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));


app.use('/api/auth',userRoutes)
app.use('/api/movie',movieRoutes)
app.use('/api/theatre',theatreRoutes)
app.use('/api/show',showRouter);

app.listen(8001,()=>
{
    console.log('server started');
})

app.get('/',(req,res)=>
{
    res.send('Hello Server!') 
}) 