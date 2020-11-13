const express = require("express");
const router = express.Router();
const categoryModel = require("../models/category");

router.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.send;
        next();
    })
    .get(async(req, res) => {
        const categories = await categoryModel.find({});
        try {
            res.send(categories);
        }
        catch(e){
            res.status(500).json({ message: e.message });
        }
    })
    .post(async(req, res) => {
        try{
            let newCategory = new ccategoryModel(req.body);
            await newCategory.save();
            res.json({ message: "Категория успешно сохранена!" })
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
            categoryModel.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true },
                (err, docs) => {
                  if (!err) res.send({ message: "Категория успешно изменена!" });
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
            const category = await categoryModel.findByIdAndDelete(req.params.id);
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

module.exports = router;