import express from "express";
import { writeFile } from "fs/promises";
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
    "2025-05-25",
    "2025-06-03"
  );

  // write it to local json file for testing
  try {
    await writeFile("response.json", JSON.stringify(response), "utf-8");
    console.log("JSON saved to response.json");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

main();
