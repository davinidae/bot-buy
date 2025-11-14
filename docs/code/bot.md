# bot

## Classes

### ShoppingBot

Defined in: bot.ts:11

#### Constructors

##### Constructor

> **new ShoppingBot**(): [`ShoppingBot`](#shoppingbot)

###### Returns

[`ShoppingBot`](#shoppingbot)

#### Properties

##### browser

> `private` **browser**: `Browser` \| `null` = `null`

Defined in: bot.ts:12

##### page

> `private` **page**: `Page` \| `null` = `null`

Defined in: bot.ts:13

##### stepsService

> `private` **stepsService**: [`StepsService`](services/steps.service.md#stepsservice) \| `null` = `null`

Defined in: bot.ts:14

#### Methods

##### acceptCookies()

> `private` **acceptCookies**(): `Promise`\<`void`\>

Defined in: bot.ts:142

###### Returns

`Promise`\<`void`\>

##### close()

> **close**(): `Promise`\<`void`\>

Defined in: bot.ts:201

###### Returns

`Promise`\<`void`\>

##### executePurchase()

> **executePurchase**(`credentials`, `purchaseStepFile`): `Promise`\<`boolean`\>

Defined in: bot.ts:191

###### Parameters

###### credentials

[`Credentials`](models/bot.interface.md#credentials)

###### purchaseStepFile

`string`

###### Returns

`Promise`\<`boolean`\>

##### getPage()

> **getPage**(): `Page` \| `null`

Defined in: bot.ts:208

###### Returns

`Page` \| `null`

##### init()

> **init**(): `Promise`\<`void`\>

Defined in: bot.ts:16

###### Returns

`Promise`\<`void`\>

##### login()

> **login**(`credentials`): `Promise`\<`boolean`\>

Defined in: bot.ts:102

###### Parameters

###### credentials

[`Credentials`](models/bot.interface.md#credentials)

###### Returns

`Promise`\<`boolean`\>

##### runStepFile()

> **runStepFile**(`stepFilePath`, `credentials`): `Promise`\<`void`\>

Defined in: bot.ts:47

###### Parameters

###### stepFilePath

`string`

###### credentials

[`Credentials`](models/bot.interface.md#credentials)

###### Returns

`Promise`\<`void`\>

##### verifyLogin()

> `private` **verifyLogin**(): `Promise`\<`boolean`\>

Defined in: bot.ts:156

###### Returns

`Promise`\<`boolean`\>
