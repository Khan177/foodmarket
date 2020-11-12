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

console.log(MONGOOSE_CONNECTION_KEY)

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gfs;
mongoose
  .connect(MONGOOSE_CONNECTION_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    gfs = GridFS(conn.connection.db, mongoose.mongo);
    gfs.collection("uploads");
  });


const storage = new GridFSStorage({
    url: MONGOOSE_CONNECTION_KEY,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
            return reject(err);
            }
            const filename = buf.toString("hex") + path.extname(file.originalname);
            const fileInfo = {
            filename: filename,
            bucketName: "uploads",
            };
            resolve(fileInfo);
        });
        });
    },
});

const upload = multer({ storage });

app.listen(PORT, () => {
    console.log(`Server is running in port ${ PORT }`);
});
