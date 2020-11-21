//import dependencies
const path = require("path");
require("dotenv").config({
    path:path.resolve(
        process.cwd(),
        '.env'
    )
});
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT;
const MONGOOSE_CONNECTION_KEY = process.env.MONGOOSE_CONNECTION_KEY;
const GridFSStorage = require("multer-gridfs-storage");
const GridFS = require("gridfs-stream");
const multer = require("multer");
const crypto = require("crypto");
const addressRouter = require("./routers/addressRouter");
const categoryRouter = require("./routers/categoryRouter");
const subcategoryRouter = require("./routers/subcategoryRouter");
const itemRouter = require("./routers/itemRouter");
const orderRouter = require("./routers/orderRouter");

//express app configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/addresses", addressRouter);
app.use("/categories", categoryRouter);
app.use("/subcategories", subcategoryRouter);
app.use("/items", itemRouter);
app.use("/orders", orderRouter);

mongoose.connect(MONGOOSE_CONNECTION_KEY, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

//db file upload configuration


//run express app
app.listen(PORT, () => {
    console.log(`Server is running in port ${ PORT }`);
});