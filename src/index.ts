import express from "express";

import treausryServices from "./services/treasuryServices";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Test NPM Pakcage
async function main() {
  const response = await treausryServices.getTreasuryDataByDate(
    "2025-01-01",
    "2025-06-03"
  );
  console.log(response.length);
}

main();
