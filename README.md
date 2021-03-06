# babel-plugin-descend-imports

This plugin helps you to descend specific import statements to the end of the imports block.

### The Problem:
Sometimes, the order of imports in module is important. 
For example when importing css into js (css modules and not only).

If using `MiniCssExtractPlugin`, the order of the css in the bundle will be the order 
of imports. 

#### Example:
ChildComponent.js
```jsx
import React from 'react';
import 'ChildComponent.css';

export function ChildComponent() {}
```

ParentComponent.js
```jsx
import React from 'react';
import 'ParentComponent.css';                       // 👈 here is the problem
import { ChildComponent } from './ChildComponent';  // 👈 child component can override the css

export function ParentComponent() {}
```

`ChildComponent` is imported after the `ParentComponent` css, so if parent wants 
to customize the the child's css, it might be overridden by child's specificity

In order to not take care of this, you can use this plugin, that will move the css imports 
to the end of the imports block. 

## Installation

```sh
yarn add babel-plugin-descend-imports -D
```

## Usage

In babel config (js):

```js
module.exports = {
    plugins: [
        ['babel-plugin-descend-imports', { /* options */ }],
    ],
};
```

### Options

#### `pattern`

Pattern to match the import statement with.

Regex example:

```js
module.exports = {
    plugins: [
        ['babel-plugin-descend-imports', {
            pattern: /\.scss$/               // 👈 will descend the scss imports
        }],
    ],
};
```
