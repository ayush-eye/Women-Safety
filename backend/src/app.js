import express from 'express';
import userLoginRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'
import sosRoutes from './routes/sos.route.js'

const app = express();

app.get('/', (req, res) => {
  res.send("Server running ");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


import alertRoute from './routes/alert.route.js';


app.get("/voice", (req, res) =>
{
    res.type("text/xml");

    res.send(`
        <Response>
            <Say voice="alice">
                Emergency alert. The user may be in danger. Please check immediately.
            </Say>
        </Response>
    `);
});


app.use("/api/auth", userLoginRoute);
app.use("/api/users",userRoutes);

app.use("/api/alerts", alertRoute);
app.use("/api/sos",sosRoutes);

export default app;