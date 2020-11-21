const express = require("express");
const router = express.Router();
const addressModel = require("../models/address");
const { mongo, connection } = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;

connection.once("open", () => {
  gfs = Grid(connection.db, mongo);
});


router.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.send;
        next();
    })
    .get(async(req, res) => {
        const addresses = await addressModel.find({});
        try {
            res.send(addresses);
        }
        catch(e){
            res.status(500).json({ message: e.message });
        }
    })
    .post(async(req, res) => {
        try{
            console.log(req.body)
            let newAddress = new addressModel(req.body);
            await newAddress.save();
            res.json({ message: "Адрес успешно сохранен!" })
        }
        catch(e){
            res.status(500).json(e.messsage);
        }
    });
router.route("/:id")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.send;
        next();
    })
    .put(async(req, res) => {
        try{
            addressModel.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true },
                (err, docs) => {
                  if (!err) res.send({ message: "Адрес успешно изменен!" });
                  else
                    res
                      .status(500)
                      .json({
                        message:
                          "Ошибка при обновлении: " + JSON.stringify(err, undefined, 2),
                      });
                }
              );
        }
        catch(e){
            res.status(500).json(e.message);
        }
    })
    .delete(async(req, res) => {
        try {
            const address = await addressModel.findByIdAndDelete(req.params.id);
            if (!address) res.status(404).send("Такого адреса не существует!");
            res.status(200).send({
              message: "Адрес успешно удален!",
            });
          } catch (err) {
            res.status(500).json({
              message: err.message,
            });
          }
    })

module.exports = router;