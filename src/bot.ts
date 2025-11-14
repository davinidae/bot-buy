import { Browser, Page } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { StepsService } from "./services/steps.service";
import { Credentials } from "./models";
import { botConfig } from "./config";
import { readStepFile, sleep } from "./utils";

puppeteerExtra.use(stealthPlugin());

export class ShoppingBot {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private stepsService: StepsService | null = null;

  async init(): Promise<void> {
    console.log("Init Flexispot bot...");
    this.browser = await puppeteerExtra.launch({
      headless: botConfig.headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--disable-blink-features=AutomationControlled",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ],
    });
    this.page = await this.browser.newPage();
    if (botConfig.viewport) {
      await this.page.setViewport({
        width: botConfig.viewport.width,
        height: botConfig.viewport.height,
      });
    }
    // Additional stealth measures
    await this.page.evaluateOnNewDocument(() => {
      return Object.defineProperty(navigator, "webdriver", {
        get: () => {
          return undefined;
        },
      });
    });
    this.stepsService = new StepsService(this.page);
    console.log("Flexispot bot initialised successfully");
  }

  async runStepFile(
    stepFilePath: string,
    credentials: Credentials
  ): Promise<void> {
    if (!this.page || !this.stepsService) {
      throw new Error("Bot not initialised. Call initialise() first.");
    }
    console.log(`Running step file: ${stepFilePath}`);
    const stepFile = readStepFile(stepFilePath);
    console.log(`Executing ${stepFile.name}: ${stepFile.description}`);
    for (const step of stepFile.steps) {
      // Replace template variables with actual credentials
      let processedStep = {
        ...step,
      };
      const applyVars = (value: string) => {
        return value
          .replace("{{EMAIL}}", credentials.email)
          .replace("{{PASSWORD}}", credentials.password)
          .replace(
            "{{PHONE_NUMBER}}",
            process.env.PHONE_NUMBER || credentials.phone || ""
          )
          .replace("{{FIRST_NAME}}", process.env.FIRST_NAME || "")
          .replace("{{LAST_NAME}}", process.env.LAST_NAME || "")
          .replace("{{STREET_ADDRESS}}", process.env.STREET_ADDRESS || "")
          .replace("{{POSTAL_CODE}}", process.env.POSTAL_CODE || "")
          .replace("{{CITY}}", process.env.CITY || "")
          .replace("{{PROVINCE}}", process.env.PROVINCE || "")
          .replace("{{DISCOUNT_CODE}}", process.env.DISCOUNT_CODE || "")
          .replace(
            "{{DISCOVERY_SOURCE}}",
            process.env.DISCOVERY_SOURCE || "Google"
          )
          .replace("{{CARD_NUMBER}}", process.env.CARD_NUMBER || "")
          .replace("{{CARD_EXPIRY}}", process.env.CARD_EXPIRY || "")
          .replace("{{CARD_CVC}}", process.env.CARD_CVC || "")
          .replace(
            "{{CARD_HOLDER}}",
            process.env.CARD_HOLDER ||
              (
                (process.env.FIRST_NAME || "") +
                " " +
                (process.env.LAST_NAME || "")
              ).trim()
          );
      };
      if (typeof processedStep.text === "string") {
        processedStep.text = applyVars(processedStep.text);
      }
      if (typeof processedStep.selector === "string") {
        processedStep.selector = applyVars(processedStep.selector);
      }
      await this.stepsService.executeStep(processedStep);
      await sleep(500); // Small delay between steps
    }
  }

  async login(credentials: Credentials): Promise<boolean> {
    if (!this.page) {
      throw new Error("Bot not initialised");
    }
    console.log("Starting Flexispot login process...");
    try {
      // Navigate to login page
      await this.page.goto("https://www.flexispot.es/", {
        waitUntil: "networkidle2",
      });
      // Accept cookies if present
      await this.acceptCookies();
      // Fill email
      await this.page.type(
        'input[type="text"][autocomplete="off"]',
        credentials.email
      );
      // Fill password
      await this.page.type(
        'input[type="password"][autocomplete="new-password"]',
        credentials.password
      );
      // Click login button
      await this.page.click("button.login-button");
      // Wait for possible navigation or page update
      await sleep(1000);
      // Verify login by checking for user-specific elements
      const isLoggedIn = await this.verifyLogin();
      if (isLoggedIn) {
        console.log("Flexispot login successful");
      } else {
        console.log("Flexispot login verification failed");
      }
      return isLoggedIn;
    } catch (error) {
      console.error("Login process failed:", error);
      return false;
    }
  }

  private async acceptCookies(): Promise<void> {
    try {
      // Try the specific Flexispot cookie button
      const cookieButton = await this.page?.$("#cmpwelcomebtnyes .cmpboxbtn");
      if (cookieButton) {
        await cookieButton.click();
        console.log("Flexispot cookies accepted");
        await sleep(500);
      }
    } catch {
      console.log("Cookie acceptance not needed or failed");
    }
  }

  private async verifyLogin(): Promise<boolean> {
    if (!this.page) return false;
    // Check for user-specific elements that indicate successful login
    const loginIndicators = [
      ".header-user-icon", // User icon in header
      '[class*="user"]', // Classes containing "user"
      ".my-account", // My account link
      ".logout", // Logout button
    ];
    for (const selector of loginIndicators) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          // Check if the element indicates logged-in state
          const textContent = await this.page.evaluate((el) => {
            return el.textContent;
          }, element);
          if (textContent && textContent.toLowerCase().includes("logout")) {
            return true;
          }
          return true; // If element exists, assume logged in
        }
      } catch {
        // Continue checking other selectors
      }
    }
    // Check page content for login indicators
    const content = await this.page.content();
    const loggedInTexts = ["logout", "cerrar sesión", "mi cuenta", "perfil"];
    return loggedInTexts.some((text) => {
      return content.toLowerCase().includes(text.toLowerCase());
    });
  }

  async executePurchase(
    credentials: Credentials,
    purchaseStepFile: string
  ): Promise<boolean> {
    console.log("Starting Flexispot purchase process...");
    await this.runStepFile(purchaseStepFile, credentials);
    console.log("Flexispot purchase completed successfully");
    return true;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log("Browser closed");
    }
  }

  getPage(): Page | null {
    return this.page;
  }
}
