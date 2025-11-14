# services/steps.service

## Classes

### StepsService

Defined in: services/steps.service.ts:5

#### Constructors

##### Constructor

> **new StepsService**(`page`): [`StepsService`](#stepsservice)

Defined in: services/steps.service.ts:8

###### Parameters

###### page

`Page`

###### Returns

[`StepsService`](#stepsservice)

#### Properties

##### page

> `private` **page**: `Page`

Defined in: services/steps.service.ts:6

#### Methods

##### acceptCookies()

> `private` **acceptCookies**(`_step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:232

###### Parameters

###### \_step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>

##### click()

> `private` **click**(`step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:102

###### Parameters

###### step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>

##### executeStep()

> **executeStep**(`step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:12

###### Parameters

###### step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>

##### fill()

> `private` **fill**(`step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:148

###### Parameters

###### step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>

##### navigate()

> `private` **navigate**(`step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:206

###### Parameters

###### step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>

##### securedFill()

> `private` **securedFill**(`step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:54

###### Parameters

###### step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>

##### verify()

> `private` **verify**(`step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:214

###### Parameters

###### step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>

##### wait()

> `private` **wait**(`step`): `Promise`\<`boolean`\>

Defined in: services/steps.service.ts:200

###### Parameters

###### step

[`Step`](../models/bot.interface.md#step)

###### Returns

`Promise`\<`boolean`\>
