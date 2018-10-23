# RSI - React Styles Injector

`React Styles Injector` is a [React](https://reactjs.org/) component that injects scoped styles into the DOM. Client and server ready.

It plays well with [pcss-loader for webpack](https://github.com/fabien-h/pcss-loader) to generate scoped styles for PCSS, SASS or plain CSS.

## Table of Contents

- [About the `styles` objects](#about-the-styles-objects)
- [Basic example](#basic-example)
- [Properties](#properties)
  - [`tag`: string](#property-tag-string)
  - [`id`: string](#property-id-string)
  - [`styles`: object or array of objects](#property-styles-object-or-array-of-objects)
  - [`className`: string](#property-classname-string)
  - [`initCache`: boolean](#property-initcache-boolean)
  - [`containerRef`: function](#property-containerref-function)
  - [`asFragment`: function](#property-asFragment-boolean)
- [Dev mode width `NODE_ENV`](#dev-mode-width-node_env)

## About the `styles` objects

<sup>[back to ToC &uarr;](#table-of-contents)</sup>

The scoped styles are objects with CSS as strings in a `styles` key and the hash of that string in a `hash` key. For example:

```JavaScript
const styles = {
    hash: `_01d51083ede2680bfccfbc70b067a28e`
    styles: `
        body {
            color: #c00;
        }
        ._01d51083ede2680bfccfbc70b067a28e {
            color: #00c;
        }
        ._01d51083ede2680bfccfbc70b067a28e > h1 {
            color: #0c0;
        }
    `
};
```

The hash is injected as the class of the enclosing tag. It is used to make sure that we inject the same CSS only once if you reuse your component and that the styles are properly scoped. As you can see, you can also use unscoped CSS (the `body` part).

> CSS class cannot start with a digit. So the hash is preceded by an underscore in my example. But you can also produce hashes with letters to have a valid class.

You can have an array of styles objects.

```JavaScript
const styles = [
    {
        hash: `_5dfg35fsd0g3df540g3df54g0df33gsd`
        styles: `...`
    },
    {
        hash: `_6fds87gsfd68g7fds687gfdgs8fd79g8`
        styles: `...`
    },
];
```

The class of the enclosing tag will be a concatenation of all the `hash` keys.

> Writing all your styles with a greater than sign in front of it (`>`) by default is a good practice. In the previous example, the styles apply only the h1 that are direct children of our component. If there is another h1 (ok, bad example, but you get the idea) in a sub sub subcomponent that someone else put in your main component, it does not inherit the styling.

## Basic example

<sup>[back to ToC &uarr;](#table-of-contents)</sup>

Install with `npm i -S react-styles-injector`.

```JavaScript
import React from 'react';
import Styled from 'react-styles-injector';

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

export default class MyView extends React.Component {
    render() {
        return (
            <Styled styles={styles}>
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

## Properties

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

### Property `asFragment`: function

<sup>[back to ToC &uarr;](#table-of-contents)</sup>

If you pass `asFragment={true}`, there will be no enclosing tag around the children. All the other properties except for `styles` will be ignored.

```JavaScript
    <Styled
        styles={{}}
        asFragment={true}
    >
        ...
```

## Dev mode width `NODE_ENV`

<sup>[back to ToC &uarr;](#table-of-contents)</sup>

If you pass `development` to the `NODE_ENV` environment variable, `react-styled-injector` starts in dev mode. It means that the injector re-inject more aggressively the styles in the `head` it should solve some rendering issues with [react HMR](https://github.com/gaearon/react-hot-loader)
