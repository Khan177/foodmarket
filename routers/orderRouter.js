const express = require("express");
const router = express.Router();
const orderModel = require("../models/order");
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
        const orders = await orderModel.find({});
        console.log(orders)
        try {
            res.send(orders);
        }
        catch(e){
            res.status(500).json({ message: e.message });
        }
    })
    .post(async(req, res) => {
        try{
            let newAddress = new orderModel(req.body);
            await newAddress.save();
            res.json({ message: "Заявка успешно сохранен!" })
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
    .get(async(req, res) => {
        const order = await orderModel.findOne({_id: req.params.id});
        try {
            res.send(order);
        }
        catch(e){
            res.status(500).json({ message: e.message });
        }
    })
    .put(async(req, res) => {
      try{
        const order = await orderModel.findOne({_id: req.params.id})
        order.status = 1-order.status
        orderModel.findByIdAndUpdate(
            req.params.id,
            { $set: order },
            { new: true },
            (err, docs) => {
              if (!err) res.send({ message: "Заявка успешно изменен!" });
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
    .delete(async(req,res) => {
        try {
            const category = await orderModel.findByIdAndDelete(req.params.id);
            if (!category) res.status(404).send("Такой категории не существует!");
            res.status(200).send({
              message: "Заказ успешно удален!",
            });
          } catch (err) {
            res.status(500).json({
              message: err.message,
            });
          }
    });


module.exports = router;