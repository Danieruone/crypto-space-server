const express = require("express");
const app = express();
const Currency = require("../models/currency");
const _ = require("underscore");

// middlewares
const { verifyToken } = require("../middlewares/authentication");

// services
const getCurrenciesListFromCMC = require("../services/getCryptoCurrencies");

app.get("/cryptocurrencies/cmc/list", function (req, res) {
  const params = req.query;
  getCurrenciesListFromCMC({
    start: params.start,
    limit: params.limit,
    convert: params.convert,
  })
    .then(({ data }) => res.json({ ok: true, data }))
    .catch((err) => {
      res.json({
        ok: false,
        message: "Error haciendo la petición a coinmarketcap",
      });
    });
});

app.get("/cryptocurrencies/list", [verifyToken], function (req, res) {
  Currency.find({ user_id: req.user._id }, "user_id name alias enabled").exec(
    (err, currencies) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      Currency.count({ user_id: req.user._id }, (err, count) => {
        res.json({
          ok: true,
          currencies,
          numberOfCurrencies: count,
        });
      });
    }
  );
});

app.post("/currency", [verifyToken], function (req, res) {
  let body = req.body;

  let currency = new Currency({
    user_id: body.user_id,
    name: body.name,
    alias: body.alias,
    enabled: body.enabled,
  });

  currency.save((err, currencyDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      currency: currencyDB,
    });
  });
});

app.put("/currency/:id", [verifyToken], function (req, res) {
  let id = req.params.id;
  // update this parameters
  let body = _.pick(req.body, ["name", "enabled", "alias"]);

  Currency.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, currencyDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        currency: currencyDB,
      });
    }
  );
});

app.delete("/currency/:id", [verifyToken], function (req, res) {
  let id = req.params.id;
  Currency.findByIdAndRemove(id, (err, deletedCurrency) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!deletedCurrency) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Currency not found",
        },
      });
    }
    res.json({
      ok: true,
      deletedCurrency,
    });
  });
});

module.exports = app;
