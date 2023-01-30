const { injectSingleSignature } = require("../shared/utils");

const injectSignature = async (req, res) => {
  const { constructedTransactionCBOR, signature } = req.body;
  try {
    const signedTx = injectSingleSignature(
      constructedTransactionCBOR,
      signature
    );
    res.json(signedTx);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = {
  injectSignature,
};
