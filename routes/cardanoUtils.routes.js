const CardanoUtils = require("../controllers/cardanoUtils.controller");

module.exports = function (app) {
  app.post(
    "/snapbrillia/cardano-utils/inject-signature",
    CardanoUtils.injectSignature
  );
};
