import { Page } from "puppeteer";
import { Step } from "../models";
import { sleep } from "../utils";

export class StepsService {
  constructor(private readonly page: Page) {
    //
  }

  async executeStep(step: Step): Promise<boolean> {
    console.log(
      `Executing step: ${step.action} - ${
        step.selector || step.url || step.text || ""
      }`
    );
    try {
      switch (step.action) {
        case "click": {
          return await this.click(step);
        }
        case "fill": {
          return await this.fill(step);
        }
        case "secured-fill": {
          return await this.securedFill(step);
        }
        case "wait": {
          return await this.wait(step);
        }
        case "navigate": {
          return await this.navigate(step);
        }
        case "verify": {
          return await this.verify(step);
        }
        case "accept-cookies": {
          return await this.acceptCookies(step);
        }
        default: {
          throw new Error(`Unknown action: ${step.action}`);
        }
      }
    } catch (error) {
      if (step.optional) {
        console.warn(`Optional step failed: ${error}`);
        return true;
      }
      throw error;
    }
  }

  private async securedFill(step: Step): Promise<boolean> {
    if (!step.text || !step.fieldId) {
      throw new Error("fieldId and text are required for secured-fill action");
    }
    // Adyen secured fields live inside iframes with data-cse attribute matching fieldId
    // We'll look for span[data-cse='encryptedCardNumber'] then its iframe
    const selector = `span[data-cse='${step.fieldId}'] iframe`;
    // Wait for spinner overlay to disappear if present
    try {
      await this.page.waitForFunction(
        () => {
          return !document.querySelector('[data-testid="spinner"]');
        },
        {
          timeout: 10000,
        }
      );
    } catch {
      // Continue even if spinner check times out
    }
    await this.page.waitForSelector(selector, {
      timeout: 15000,
    });
    const frameElement = await this.page.$(selector);
    if (!frameElement) {
      throw new Error(`Secured iframe not found for fieldId: ${step.fieldId}`);
    }
    // Scroll iframe into view in case it's offscreen
    try {
      await this.page.evaluate((el) => {
        return (el as HTMLElement).scrollIntoView({
          block: "center",
        });
      }, frameElement);
    } catch {}
    const frame = await frameElement.contentFrame();
    if (!frame) {
      throw new Error(`Unable to get frame for secured field: ${step.fieldId}`);
    }
    // Focus body or input inside frame
    await frame.waitForSelector("input");
    const input = await frame.$("input");
    if (!input) {
      throw new Error(`Input not found inside secured frame: ${step.fieldId}`);
    }
    await input.focus();
    // For card number strip spaces/non-digits to reduce client-side formatting issues
    let valueToType = step.text;
    if (step.fieldId === "encryptedCardNumber") {
      valueToType = valueToType.replace(/[^0-9]/g, "");
    }
    await input.type(valueToType, {
      delay: 60,
    });
    return true;
  }

  private async click(step: Step): Promise<boolean> {
    if (!step.selector) {
      throw new Error("Selector is required for click action");
    }
    // Support XPath selectors (start with xpath= or //)
    const isXPath =
      step.selector.startsWith("xpath=") || step.selector.startsWith("//");
    let element;
    if (isXPath) {
      const xpath = step.selector.startsWith("xpath=")
        ? step.selector.replace(/^xpath=/, "")
        : step.selector;
      const handle = await this.page.waitForFunction(
        (xp) => {
          const result = document.evaluate(
            xp as string,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          return result.singleNodeValue;
        },
        {
          timeout: 10000,
        },
        xpath
      );
      element = handle?.asElement();
    } else {
      await this.page.waitForSelector(step.selector, {
        timeout: 10000,
      });
      element = await this.page.$(step.selector);
    }
    if (!element) {
      throw new Error(`Element not found: ${step.selector}`);
    }
    try {
      await (
        element as unknown as import("puppeteer").ElementHandle<Element>
      ).click();
    } catch {
      // Fallback to force click via DOM
      await this.page.evaluate((el) => {
        return (el as HTMLElement).click();
      }, element);
    }
    await sleep(500); // Small delay after click
    return true;
  }

  private async fill(step: Step): Promise<boolean> {
    if (!step.selector || step.text === undefined) {
      throw new Error("Selector and text are required for fill action");
    }
    const isXPath =
      step.selector.startsWith("xpath=") || step.selector.startsWith("//");
    let element;
    if (isXPath) {
      const xpath = step.selector.startsWith("xpath=")
        ? step.selector.replace(/^xpath=/, "")
        : step.selector;
      const handle = await this.page.waitForFunction(
        (xp) => {
          const result = document.evaluate(
            xp as string,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          return result.singleNodeValue;
        },
        {
          timeout: 10000,
        },
        xpath
      );
      element = handle?.asElement();
    } else {
      await this.page.waitForSelector(step.selector, {
        timeout: 10000,
      });
      element = await this.page.$(step.selector);
    }
    if (!element) {
      throw new Error(`Element not found: ${step.selector}`);
    }
    // Focus and clear value (works for input/textarea)
    // Scroll into view first to reduce issues with offscreen inputs
    try {
      await this.page.evaluate((el) => {
        return (el as HTMLElement).scrollIntoView({
          block: "center",
        });
      }, element);
    } catch {}
    await element.focus();
    await this.page.evaluate((el) => {
      if ((el as HTMLInputElement).value !== undefined) {
        return ((el as HTMLInputElement).value = "");
      }
    }, element);
    if (step.text && step.text.length > 0) {
      await element.type(step.text, {
        delay: 50,
      });
    }
    return true;
  }

  private async wait(step: Step): Promise<boolean> {
    const timeout = step.timeout || 2000;
    await sleep(timeout);
    return true;
  }

  private async navigate(step: Step): Promise<boolean> {
    if (!step.url) {
      throw new Error("URL is required for navigate action");
    }
    await this.page.goto(step.url, {
      waitUntil: "networkidle2",
    });
    return true;
  }

  private async verify(step: Step): Promise<boolean> {
    if (step.expectedText) {
      const content = await this.page.content();
      if (!content.includes(step.expectedText)) {
        throw new Error(`Expected text not found: ${step.expectedText}`);
      }
    }
    if (step.expectedSelector) {
      const element = await this.page.$(step.expectedSelector);
      if (!element) {
        throw new Error(
          `Expected selector not found: ${step.expectedSelector}`
        );
      }
    }
    return true;
  }

  private async acceptCookies(_step: Step): Promise<boolean> {
    // Specific Flexispot cookie selector
    const flexispotSelector = "#cmpwelcomebtnyes .cmpboxbtn";
    try {
      const flexispotElement = await this.page.$(flexispotSelector);
      if (flexispotElement) {
        await flexispotElement.click();
        console.log("Cookies accepted using Flexispot specific selector");
        await sleep(500);
        return true;
      }
    } catch {
      console.log(
        "Flexispot cookie selector not found, trying alternatives..."
      );
    }
    // Fallback selectors
    const selectors = [
      "#cmpwelcomebtnyes .cmpboxbtn",
      ".cmpboxbtnyes",
      '[id*="cmpwelcomebtnyes"]',
      '[class*="accept"]',
      '[class*="cookie"] [class*="accept"]',
      'button:has-text("Aceptar todo")',
      'button:has-text("Aceptar")',
      ".accept-cookies",
      '[data-testid="accept-cookies"]',
      ".cookie-accept",
      ".consent-accept",
      ".btn-accept",
      ".gdpr-accept",
    ];
    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          // Try different ways to click
          try {
            await Promise.race([
              element.click(),
              new Promise((_, reject) => {
                return setTimeout(() => {
                  return reject(new Error("Click timeout"));
                }, 2000);
              }),
            ]);
          } catch {
            // If direct click fails, try other methods
            await this.page.evaluate((_el) => {
              // el.click();
            }, element);
          }
          console.log(`Cookies accepted using selector: ${selector}`);
          await sleep(500);
          return true;
        }
      } catch {
        // Continue to next selector
      }
    }
    console.log("No cookie acceptance button found, continuing...");
    return true;
  }
}
