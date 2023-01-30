const QuadraticVotingAndFundingController = require("../controllers/quadraticVotingAndFunding.controller");

module.exports = function (app) {
  app.post(
    "/snapbrillia/quadratic-funding/pay-for-fund-initiation",
    QuadraticVotingAndFundingController.payForFundInitiation
  );
  app.post(
    "/snapbrillia/quadratic-funding/initiate-fund",
    QuadraticVotingAndFundingController.initiateFund
  );
  app.post(
    "/snapbrillia/quadratic-funding/register-project",
    QuadraticVotingAndFundingController.registerProject
  );
  app.post(
    "/snapbrillia/quadratic-funding/donate-to-project",
    QuadraticVotingAndFundingController.donateToProject
  );
};
