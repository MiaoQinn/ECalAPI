import express from "express";
import { writeFile } from "fs/promises";
import treausryServices from "./services/treasuryServices";
import fedReserveServices from "./services/fedReserveServices";
import BLSServices from "./services/blsServices_new";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Test NPM Pakcage
async function mainTresury() {
  const response = await treausryServices.getTreasuryDataByDate(
    "2025-06-17",
    "2025-06-17"
  );

  // write it to local json file for
  try {
    await writeFile("response.json", JSON.stringify(response), "utf-8");
    console.log("JSON saved to response.json");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

async function mainFed() {
  const response = await fedReserveServices.getFedDataByDate(
    "2025-05-25",
    "2025-06-20"
  );

  // write it to local json file for testing
  try {
    await writeFile("response.json", JSON.stringify(response), "utf-8");
    console.log("JSON saved to response.json");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

async function mainBLS() {
  try {
    const response = await BLSServices.getBLSDataByDate(
      "2025-06-01",
      "2025-06-30"
    );
    await writeFile("response.json", JSON.stringify(response), "utf-8");
    console.log("JSON saved to response.json");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

mainBLS();
