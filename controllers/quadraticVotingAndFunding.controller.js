const {
  getInputUtxos,
  hexToBech32Address,
  pathToScripts,
  pathToRepo,
  formatCliTransaction,
  bech32ToPubKey,
} = require("../shared/utils");
const { exec } = require("child_process");

const payForFundInitiation = async (req, res) => {
  const { rawUTxOs, changeAddress } = req.body;
  try {
    const { txIn } = getInputUtxos(rawUTxOs, 31200000);
    const formatedChangeAddress = hexToBech32Address(changeAddress);
    exec(
      "bash " +
        `${pathToScripts}/pay-for-fund-initiation.sh ` +
        txIn +
        " " +
        formatedChangeAddress,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {
        if (err) {
          return res.json({ err: err, success: false });
        }
        if (stderr) {
          return res.json({ stderr: stderr, success: false });
        }
        if (stdout) {
          const tx = JSON.parse(stdout);
          const formatedTx = formatCliTransaction(tx.unsignedTx);
          return res.json(formatedTx);
        }
      }
    );
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const initiateFund = async (req, res) => {
  const { deadline } = req.body;
  try {
    exec(
      "bash " + `${pathToScripts}/initiate-fund.sh ` + deadline,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {}
    );
    return res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const registerProject = async (req, res) => {
  const { projectName, requestedAmount, changeAddress, rawUTxOs } = req.body;
  try {
    const { txIn, txOut } = getInputUtxos(rawUTxOs, 3500000);
    const bech32Address = hexToBech32Address(changeAddress);
    const pubKeyAddress = bech32ToPubKey(bech32Address);
    exec(
      "bash " +
        `${pathToScripts}/register-project.sh ` +
        `"${projectName}"` +
        " " +
        requestedAmount +
        " " +
        bech32Address +
        " " +
        pubKeyAddress +
        " " +
        txIn +
        " " +
        txOut,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {
        if (err) {
          return res.json({ err: err, success: false });
        }
        if (stderr) {
          return res.json({ stderr: stderr, success: false });
        }
        if (stdout) {
          const tx = JSON.parse(stdout);
          const formatedTx = formatCliTransaction(tx.unsignedTx);
          return res.json(formatedTx);
        }
      }
    );
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const donateToProject = async (req, res) => {
  const { projectTokenName, donationAmount, changeAddress, rawUTxOs } =
    req.body;
  try {
    const { txIn, txOut } = getInputUtxos(rawUTxOs, 3500000);
    const bech32Address = hexToBech32Address(changeAddress);
    const pubKeyAddress = bech32ToPubKey(bech32Address);
    exec(
      "bash " +
        `${pathToScripts}/donate-to-project.sh ` +
        projectTokenName +
        " " +
        donationAmount +
        " " +
        pubKeyAddress +
        " " +
        bech32Address +
        " " +
        txIn +
        " " +
        txOut,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {
        if (err) {
          return res.json({ err: err, success: false });
        }
        if (stderr) {
          return res.json({ stderr: stderr, success: false });
        }
        if (stdout) {
          const tx = JSON.parse(stdout);
          const formatedTx = formatCliTransaction(tx.unsignedTx);
          return res.json(formatedTx);
        }
      }
    );
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = {
  initiateFund,
  registerProject,
  donateToProject,
  payForFundInitiation,
};
