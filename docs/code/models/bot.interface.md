# models/bot.interface

## Type Aliases

### BotConfig

> **BotConfig** = `object` & `Partial`\<\{ `viewport`: \{ `height`: `number`; `width`: `number`; \}; \}\>

Defined in: models/bot.interface.ts:1

#### Type Declaration

##### headless

> **headless**: `boolean`

##### timeout

> **timeout**: `number`

---

### Credentials

> **Credentials** = `object`

Defined in: models/bot.interface.ts:38

#### Properties

##### email

> **email**: `string`

Defined in: models/bot.interface.ts:39

##### password

> **password**: `string`

Defined in: models/bot.interface.ts:40

##### phone?

> `optional` **phone**: `string`

Defined in: models/bot.interface.ts:41

---

### Step

> **Step** = `object` & `Partial`\<\{ `expectedSelector`: `string`; `expectedText`: `string`; `fieldId`: `string`; `optional`: `boolean`; `selector`: `string`; `text`: `string`; `timeout`: `number`; `url`: `string`; \}\>

Defined in: models/bot.interface.ts:11

#### Type Declaration

##### action

> **action**: `"click"` \| `"fill"` \| `"wait"` \| `"navigate"` \| `"verify"` \| `"accept-cookies"` \| `"secured-fill"`

---

### StepFile

> **StepFile** = `object`

Defined in: models/bot.interface.ts:32

#### Properties

##### description

> **description**: `string`

Defined in: models/bot.interface.ts:34

##### name

> **name**: `string`

Defined in: models/bot.interface.ts:33

##### steps

> **steps**: [`Step`](#step)[]

Defined in: models/bot.interface.ts:35
