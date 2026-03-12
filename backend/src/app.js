import express from 'express';
import userLoginRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'
import sosRoutes from './routes/sos.route.js'
import safePlaceRoute from "./routes/safeplace.route.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Server running ");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import alertRoute from "./routes/alert.route.js";

app.all("/voice", (req, res) => {
  res.set("Content-Type", "text/xml");
  const name = req.query.name || "The user";
  res.send(`
<Response>
    <Say voice="alice">
        Emergency alert. ${name} may be in danger. Please check immediately and view for the location send through sms and email.
    </Say>
</Response>
`);
});

app.use("/api/auth", userLoginRoute);
app.use("/api/users", userRoutes);

app.use("/api/alerts", alertRoute);
app.use("/api/sos", sosRoutes);

app.use("/api/safeplaces", safePlaceRoute);

export default app;