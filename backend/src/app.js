import express from 'express';
import userLoginRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
const app = express();

app.get('/', (req, res) => {
  res.send("Server running ");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", userLoginRoute);

export default app;