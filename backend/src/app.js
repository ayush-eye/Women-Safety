import express from 'express';
import userLoginRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'


const app = express();

app.get('/', (req, res) => {
  res.send("Server running ");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", userLoginRoute);
app.use("/api/users",userRoutes);

export default app;