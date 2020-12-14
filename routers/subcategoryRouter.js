const express = require("express");
const router = express.Router();
const subcategoryModel = require("../models/subcategory");
const itemModel = require("../models/item")
const { mongo, connection } = require("mongoose");
const Grid = require("gridfs-stream");
const GridFSStorage = require("multer-gridfs-storage");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const MONGOOSE_CONNECTION_KEY = process.env.MONGOOSE_CONNECTION_KEY;
const fs = require("fs");
let gfs;

const deploy = require("../config");

connection.once("open", () => {
  console.log("hello")
    gfs = Grid(connection.db, mongo);
    gfs.collection("subcategories");
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
        const subcategories = await subcategoryModel.find({});
        try {
            res.send(subcategories);
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
            let newCategory = new subcategoryModel({ ...req.body, image: `${process.env.CDN_URL}/${req.file.filename}`, });
            await newCategory.save();
            deploy();
            res.json({ message: "Подкатегория успешно сохранена!" })
        }
        catch(e){
            res.status(500).json(e.messsage);
        }
    });

router.route("/:filename").get(async (req, res) => {
  res.set('Content-Type', 'image/png');
  res.sendFile(path.resolve(__dirname+"/../uploads/"+req.params.filename))
})

router.route("/:id")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.send;
        next();
    })
    .get(async(req,res) => {
      console.log("hell2o")
      const subcategory = await subcategoryModel.find({_id: req.params.id});
      try {
          res.send(subcategory);
      }
      catch(e){
          res.status(500).json({ message: e.message });
      }
    })
    .put(upload.single("file"), async(req, res) => {
        if (!req.file) {
            let old = await subcategoryModel.findById(req.params.id);
            let obj = {
              ...req.body,
              image: old.image
            };
            subcategoryModel.findByIdAndUpdate(
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
            obj = {
              ...req.body,
              image: `${process.env.CDN_URL}/${req.file.filename}`,
              url: req.body.url,
            };
            await subcategoryModel.findByIdAndUpdate(
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
            deploy();
          }
    })
    .delete(async(req, res) => {
        try {
            const category = await subcategoryModel.findByIdAndDelete(req.params.id);
            if (!category) res.status(404).send("Такой категории не существует!");
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
    .get(async(req,res) => {
      const subcategory = await subcategoryModel.find({_id: req.params.id});
      try {
          res.send(subcategory[0]);
      }
      catch(e){
          res.status(500).json({ message: e.message });
      }
    })

module.exports = router;