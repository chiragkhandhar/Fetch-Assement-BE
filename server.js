const { app, port } = require("./utility/serverSetup")

// Routes Defination
const { addPoints, deductPoints, readPoints } = require('./routes/pointsManipulation');


// Connection
app.listen(port, () => {
    console.log("-------------------------------");
    console.log(`Server started on port: ${port}`);
    console.log("-------------------------------");
    console.log(`URL: http://localhost:${port}/api/routeName`);
    console.log("-------------------------------");
  });

// Add Route
app.post("/api/add", addPoints);

// Deduct Route
app.post("/api/deduct", deductPoints);

// Read Route
app.get("/api/read/:username", readPoints);