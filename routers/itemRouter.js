const express = require("express");
const router = express.Router();
const itemModel = require("../models/item");
const { mongo, connection } = require("mongoose");
const Grid = require("gridfs-stream");
const GridFSStorage = require("multer-gridfs-storage");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const MONGOOSE_CONNECTION_KEY = process.env.MONGOOSE_CONNECTION_KEY;
let gfs;

connection.once("open", () => {
    gfs = Grid(connection.db, mongo);
    gfs.collection("items");
});

const upload = multer({
  dest: "uploads/"
});

router.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.send;
        next();
    })
    .get(async(req, res) => {
        const items = await itemModel.find({});
        try {
            res.send(items);
        }
        catch(e){
            res.status(500).json({ message: e.message });
        }
    })
    .post(upload.single("file"), async(req, res) => {
        if (!req.file || Object.keys(req.body).length === 0)
            res.status(500).json({
              message: "Не все поля заполнены!",
            });
        try{
            let newItem = new itemModel({ ...req.body, image: `${req.protocol}://${req.get("host")}${req.originalUrl}/${req.file.filename}`, });
            await newItem.save();
            res.json({ message: "Подкатегория успешно сохранена!" })
        }
        catch(e){
            res.status(500).json(e.messsage);
        }
    });

router.route("/:filename").get(async (req, res) => {
  res.set('Content-Type', 'image/png');
  res.sendFile(path.resolve(__dirname+"/../uploads/"+req.params.filename))
    });

router.route("/:id")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.send;
        next();
    })
    .put(upload.single("file"), async(req, res) => {
        if (!req.file) {
            let old = await itemModel.findById(req.params.id);
            let obj = {
              ...req.body,
              image: old.image
            };
            itemModel.findByIdAndUpdate(
              req.params.id,
              { $set: obj },
              { new: true },
              (err, docs) => {
                if (err)
                  res.status(500).json({
                    message:
                      "Ошибка при обновлении: " + JSON.stringify(err, undefined, 2),
                  });
                else res.send(docs);
              }
            );
          } else {
            const old = await itemModel.findById(req.params.id);
            let filename = old.image.split("/");
            fs.unlinkSync(`uploads/${filename[filename.length-1]}`)
            obj = {
              ...req.body,
              image: `${req.protocol}://${req.get("host")}/${
                req.originalUrl.split("/")[1]
              }/${req.file.filename}`,
              url: req.body.url,
            };
            await itemModel.findByIdAndUpdate(
              req.params.id,
              { $set: obj },
              { new: true },
              (err, docs) => {
                if (err)
                  res.status(500).json({
                    message:
                      "Ошибка при обновлении: " + JSON.stringify(err, undefined, 2),
                  });
                else res.send(docs);
              }
            );
          }
    })
    .delete(async(req, res) => {
        try {
            const item = await itemModel.findByIdAndDelete(req.params.id);
            if (!item) res.status(404).send("Такой категории не существует!");
            let filename = item.image.split("/");
            fs.unlinkSync(`uploads/${filename[filename.length-1]}`)
            res.status(200).send({
              message: "Направление успешно удалено!",
            });
          } catch (err) {
            res.status(500).json({
              message: err.message,
            });
          }
    })

    router.route("/by_id/:id")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.send;
        next();
    })
    .get(async(req, res) => {
      const item = await itemModel.findOne({ _id: req.params.id });
      try {
          res.send(item);
      }
      catch(e){
          res.status(500).json({ message: e.message });
      }
  })

module.exports = router;