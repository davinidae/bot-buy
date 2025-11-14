import { ShoppingBot } from "./bot";
import { credentials as envCredentials } from "./config";
import { validateCredentials } from "./utils";

async function main(): Promise<void> {
  const bot = new ShoppingBot();
  try {
    if (!validateCredentials(envCredentials)) {
      console.error("Missing credentials in .env file");
      process.exit(1);
    }
    await bot.init();
    const loginStepFile = ["clients", process.env.CLIENT, "login.json"].join(
      "/"
    );
    await bot.runStepFile(loginStepFile, envCredentials);
    const purchaseStepFile = [
      "clients",
      process.env.CLIENT,
      "purchase.json",
    ].join("/");
    await bot.executePurchase(envCredentials, purchaseStepFile);
    console.log("Bot execution completed successfully");
  } catch (error) {
    console.error("Bot execution failed:", error);
  } finally {
    await bot.close();
  }
}

process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...");
  return process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  return process.exit(0);
});

main().catch(console.error);
