const {
  TransactionUnspentOutput,
  Transaction,
  TransactionWitnessSet,
  Vkeywitnesses,
  Address,
  BaseAddress,
} = require("@emurgo/cardano-serialization-lib-nodejs");
const os = require("os");

const pathToRepo = `${os.homedir()}/quadraticvoting`;

const pathToScripts = `${pathToRepo}/scripts`;

const getInputUtxos = (rawUtxos, lovelaceAmount) => {
  try {
    let txIn = "";
    let txOut = "";
    let totalLovelace = lovelaceAmount + 500000;
    for (const rawUtxo of rawUtxos) {
      if (totalLovelace > 0) {
        const utxo = TransactionUnspentOutput.from_bytes(
          Buffer.from(rawUtxo, "hex")
        );
        const output = utxo.output();
        const multiasset = output.amount().multiasset();
        if (multiasset) {
          continue;
        }
        const amount = output.amount().coin().to_str();
        const input = utxo.input();
        const txHash = Buffer.from(
          input.transaction_id().to_bytes(),
          "utf8"
        ).toString("hex");
        const txIndex = input.index();
        txIn += `"--tx-in ${txHash}#${txIndex}" `;
        totalLovelace -= parseInt(amount);
        if (totalLovelace < 0) {
          break;
        }
      }
    }
    return {
      txIn: txIn,
      txOut: txOut,
    };
  } catch (err) {
    throw new Error(err);
  }
};

// vkeyWitness should be deserialized from cbor to a TransactionWitnessSet
// get lists signatures and put it in list. then loop through the list and add it to the transaction
const signQVFTransaction = (transactionCBOR, vKeyWitness, signedTx) => {
  let vKeyArray = [];
  const cliTx = Transaction.from_bytes(Buffer.from(signedTx, "hex"));
  const vKeyAmount = cliTx.witness_set().vkeys().len();
  for (let i = 0; i < vKeyAmount; i++) {
    vKeyArray.push(cliTx.witness_set().vkeys().get(i));
  }
  const tx = Transaction.from_bytes(Buffer.from(transactionCBOR, "hex"));
  let transactionWitnessSet = tx.witness_set();
  const txVkeywitness = TransactionWitnessSet.from_bytes(
    Buffer.from(vKeyWitness, "hex")
  );
  let txVkeys = Vkeywitnesses.new();
  const projectOwnerSignature = txVkeywitness.vkeys().get(0);
  txVkeys.add(projectOwnerSignature);
  vKeyArray.forEach((cliTxVkey) => {
    txVkeys.add(cliTxVkey);
  });
  transactionWitnessSet.set_vkeys(txVkeys);
  const signedTransaction = Transaction.new(tx.body(), transactionWitnessSet);
  return signedTransaction.to_bytes();
};

const hexToBech32Address = (hexAddress) => {
  const walletAddress = Address.from_bytes(
    Buffer.from(hexAddress, "hex")
  ).to_bech32();
  return walletAddress;
};

const formatCliTransaction = (transactionCbor) => {
  const txCli = Transaction.from_bytes(Buffer.from(transactionCbor, "hex"));
  const txBody = txCli.body();
  let witnessSet = txCli.witness_set();
  const constructedTx = Transaction.new(txBody, witnessSet);
  const txCbor = Buffer.from(constructedTx.to_bytes()).toString("hex");
  return txCbor;
};

const injectSingleSignature = (transactionCBOR, vKeyWitness) => {
  const tx = Transaction.from_bytes(Buffer.from(transactionCBOR, "hex"));
  let transactionWitnessSet = tx.witness_set();
  const txVkeywitness = TransactionWitnessSet.from_bytes(
    Buffer.from(vKeyWitness, "hex")
  );
  transactionWitnessSet.set_vkeys(txVkeywitness.vkeys());
  const signedTransaction = Transaction.new(tx.body(), transactionWitnessSet);
  const txCbor = Buffer.from(signedTransaction.to_bytes()).toString("hex");
  return txCbor;
};

const bech32ToPubKey = (bech32Address) => {
  const pkh = BaseAddress.from_address(Address.from_bech32(bech32Address))
    .payment_cred()
    .to_keyhash();

  const pubKeyAddress = Buffer.from(pkh.to_bytes()).toString("hex");
  return pubKeyAddress;
};

module.exports = {
  getInputUtxos,
  signQVFTransaction,
  hexToBech32Address,
  pathToRepo,
  pathToScripts,
  formatCliTransaction,
  injectSingleSignature,
  bech32ToPubKey,
};
