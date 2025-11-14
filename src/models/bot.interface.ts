export type BotConfig = {
  headless: boolean;
  timeout: number;
} & Partial<{
  viewport: {
    width: number;
    height: number;
  };
}>;

export enum StepAction {
  CLICK = "click",
  FILL = "fill",
  WAIT = "wait",
  NAVIGATE = "navigate",
  VERIFY = "verify",
  ACCEPT_COOKIES = "accept-cookies",
  SECURED_FILL = "secured-fill",
}

export type Step = {
  action: StepAction;
} & Partial<{
  selector: string;
  text: string;
  url: string;
  timeout: number;
  expectedText: string;
  expectedSelector: string;
  optional: boolean;
  // For secured-fill (Adyen) specify the data-cse attribute, e.g. encryptedCardNumber
  fieldId: string;
}>;

export type StepFile = {
  name: string;
  description: string;
  steps: Step[];
};

export type Credentials = {
  email: string;
  password: string;
  phone?: string;
};
