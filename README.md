# RSI - React Styles Injector

`React Styles Injector` is a [React](https://reactjs.org/) component that injects scoped styles into the DOM. Client and server side ready. Plays well with [pcss-loader for webpack](https://github.com/fabien-h/pcss-loader).

Table of Contents
------------

- [Basic example](#basic-example)
- [Properties](#properties)
    - [`tag`: string](#property-tag-string)
    - [`id`: string](#property-id-string)
    - [`styles`: object or array of objects](#property-styles-object-or-array-of-objects)
    - [`className`: string](#property-classname-string)
    - [`initCache`: boolean](#property-initcache-boolean)
    - [`containerRef`: function](#property-containerref-function)
- [Dev mode width `NODE_ENV`](#dev-mode-width-node_env)

Basic example
------------
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

Install with `npm i -S react-styles-injector`.

```JavaScript
import React from 'react';
import Styled from 'react-styles-injector';

export default class MyView extends React.Component {
    render() {
        const styles = {
            hash: '_7945a685fd09caf339a73a4023ae8b56',
            styles: `
                body {
                    background: #00c
                }
                ._7945a685fd09caf339a73a4023ae8b56 {
                    background: #c00
                }
            `
        };

        return (
            <Styled styles={styles} tag='main' id='main'>
                My view
            </Styled>
        );
    }
}
```

This code produces two tags:

```JavaScript
<main id='main' class='_7945a685fd09caf339a73a4023ae8b56'>
    My view
</main>

and

<style>
    body {
        background: #00c
    }
    ._7945a685fd09caf339a73a4023ae8b56 {
        background: #c00
    }
</style>
```

- The `main` tag is in the standard HTML flow.
- Client-side, the style tag is injected into the `head`.
- Server side, the style tag is injected into the `body`, next to the `main` tag.

Properties
------------
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

### Property `tag`: string
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

The default tag for your component is `div`.

You can change this by passing the tag argument as a string. Example: `aside`, `main`, `button`...

### Property `id`: string
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

An `id` for the HTML tag.

### Property `styles`: object or array of objects
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

Styles objects must have the following structure:

```JavaScript
{
    hash: string
    styles: string
}
```

The component uses the `hash` as its class name.

To compose styles, you can pass more than one style object. Multiple `style` tags are injected, and the component has multiple classes.

### Property `className`: string
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

A string that is added to the classe(s) from the styles. Can be one ar several classes; separated by a space.

### Property `initCache`: boolean
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

This property is used server side only. It helps with rendering time optimization time and HTML weight. The idea is to inject the each `style` tag once pet hash.

- If you add `initCache` to the root component of your application, each time you use an instance of the injector, the hashes of the styles are cached and won’t be injected again.
- If you omit `initCache` completely, the injector injects the `style` tags for each instance.
- If you add `initCache` multiple times, it resets the cache each time it encounters the property.

> Caching cannot be the default behavior because the renderer server side may not be stateless and no styles would be injected in the next render.

### Property `containerRef`: function
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

If you need a reference to the actual DOM element for the component container, you can pass a `containerRef` function.

```JavaScript
    <Styled
        styles={{}}
        tag='main'
        id='mainContainer'
        containerRef={element => (this.containerRef = element)}
    >
        ...
```

In the parent of the `Styled` component, `this.containerRef` will be a reference to the DOM `main #mainContainer` html element.

Dev mode width `NODE_ENV`
------------
<sup>[back to ToC &uarr;](#table-of-contents)</sup>

If you pass `development` to the `NODE_ENV` environment variable, `react-styled-injector` starts in dev mode. It means that the injector re-inject more aggressively the styles in the `head` it should solve some rendering issues with [react HMR](https://github.com/gaearon/react-hot-loader)
