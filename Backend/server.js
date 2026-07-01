const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);

app.get("/", (req, res) => {
  res.send("🏏 Vicket Backend Running");
});

const matchRoutes = require("./routes/matchRoutes");
app.use("/api/matches", matchRoutes);

const requestRoutes = require("./routes/requestRoutes");
app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 5000;

const notificationRoutes =
    require("./routes/notificationRoutes");

    const invitationRoutes =
    require("./routes/invitationRoutes");

    app.use(
    "/api/invitations",
    invitationRoutes
);







app.use(
    "/api/notifications",
    notificationRoutes
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
