const CommonCardanoTransactions = require("../controllers/commonCardanoTransaction.controller");

module.exports = function (app) {
  app.post(
    "/snapbrillia/cardano-common-transaction/transfer-ada",
    CommonCardanoTransactions.transferAda
  );
};
