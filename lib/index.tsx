import * as React from 'react';

export interface StyleInterface {
  hash: string;
  styles: string;
}

export interface StyledPropsInterface {
  children: any;
  // Will be added to the classnames from the styles hashes
  className?: string;
  // Set the ID of the container
  id?: string;
  styles: StyleInterface[];
  // Set the tag of the container
  tag?: string;
  // If true, reset the cache for existing styles
  initCache?: boolean;
}

export interface StyledStateInterface {
  concatenatedStyles: string;
}

// Hashmap containing the hash of all the already injected styles
let existingStyles: { [key: string]: boolean } = {};

/**
 * If the server cache is not initialized, the renderer will add
 * a style tag per component. If the server cache is initialized
 * and reset each time the root component is rendered, only the
 * styles that have not already been injected will be.
 */
let useServerCache: boolean = false;

// Tell is the code is executed client side or server side
const isClient: boolean = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export default class Styled extends React.PureComponent<
  StyledPropsInterface,
  {}
> {
  constructor(props) {
    super(props);

    /**
     * Reset the cache if we are server-side and if
     * init is set to true
     */
    if (!isClient && props.initCache) {
      useServerCache = true;
      existingStyles = {};
    }
  }

  public render(): JSX.Element {
    const { children, tag, className, styles } = this.props;
    const ComponentTag = tag || 'div';
    const compiledClasseName = [
      className || '',
      ...styles.map(style => style.hash)
    ].join(' ');

    /**
     * If we are client side, inject the non cached
     * style tags in the header ; then render the children
     */
    if (isClient) {
      styles.forEach(style => {
        if (!existingStyles[style.hash]) {
          existingStyles[style.hash] = true;
          let styleTag = document.createElement('style');
          styleTag.id = style.hash;
          styleTag.innerHTML = style.styles;
          document.head.appendChild(styleTag);
        }
      });
      return (
        <ComponentTag className={compiledClasseName}>{children}</ComponentTag>
      );
    }

    /**
     * If we are server side, inject the style tag
     * with the styles stringyfied inside
     */
    return (
      <>
        {styles.map(style => {
          if (useServerCache && existingStyles[style.hash]) return null;
          existingStyles[style.hash] = true;
          return (
            <style
              key={style.hash}
              id={style.hash}
              dangerouslySetInnerHTML={{ __html: style.styles }}
            />
          );
        })}
        <ComponentTag className={compiledClasseName}>{children}</ComponentTag>
      </>
    );
  }
}
