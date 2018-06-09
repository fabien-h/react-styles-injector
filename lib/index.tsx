import * as React from 'react';

interface StyleInterface {
  hash: string;
  styles: string;
}

interface InjectorPropsInterface {
  children: any;
  className?: string;
  id?: string;
  styles: StyleInterface[];
  tag?: string;
}

interface InjectorStateInterface {
  concatenatedStyles: string;
}

// Hashmap containing the hash of all the already injected styles
let existingStyles: { [key: string]: boolean } = {};
let existingStylesString: string = '';

// Style tag in the DOM that will store all the styles of the application
let styleTag: HTMLStyleElement;
let styleTagContent: string = '';

/**
 * If the style tag does not exists, initialize it
 * from the DOM if SSR pre-existed
 * from scratch if no SSR pre-existed
 */
function initInjector(): void {
  styleTag = document.getElementById('GLOBAL_STYLES') as HTMLStyleElement;

  if (styleTag) {
    styleTagContent = styleTag.innerHTML;
    existingStylesString = styleTag.dataset['stylesHashes'] || '';
    (existingStylesString.split(',') || []).forEach(
      hash => (existingStyles[hash] = true)
    );
  } else {
    styleTag = document.createElement('style');
    styleTag.id = 'GLOBAL_STYLES';
    document.head.appendChild(styleTag);
  }
}

export default class Injector extends React.PureComponent<
  InjectorPropsInterface,
  InjectorStateInterface
> {
  constructor(props: InjectorPropsInterface) {
    super(props);
    if (!styleTag) initInjector();
    this.state = {
      /**
       * Concatenated list of style per component to check if
       * an update is needed
       */
      concatenatedStyles: ''
    };
  }

  /**
   * Reset the cache and init again
   *
   * @memberOf Injector
   */
  public static clearInjectorCache = (): void => {
    // Reset all the data
    existingStyles = {};
    existingStylesString = '';
    styleTagContent = '';
    // Init
    initInjector();
  };

  static getDerivedStateFromProps(
    props: InjectorPropsInterface,
    state: InjectorStateInterface
  ) {
    const { styles } = props;
    const { concatenatedStyles } = state;
    const updatedConcatenatedStyles: string = (styles || [])
      .map(style => style.hash)
      .join('');

    if (concatenatedStyles !== updatedConcatenatedStyles) {
      (props.styles || []).forEach(style => {
        if (!existingStyles[style.hash]) {
          existingStyles[style.hash] = true;
          styleTagContent += style.styles;
          styleTag.innerHTML = styleTagContent;
          existingStylesString += `,${style.hash}`;
          styleTag.dataset['stylesHashes'] = existingStylesString;
        }
      });

      return {
        concatenatedStyles: updatedConcatenatedStyles
      };
    }

    return null;
  }

  public render(): JSX.Element {
    const { children, tag, className, styles } = this.props;
    const ComponentTag = tag || 'div';
    const compiledClasseName = [
      className || '',
      ...styles.map(style => style.hash)
    ].join(' ');

    return (
      <ComponentTag className={compiledClasseName}>{children}</ComponentTag>
    );
  }
}
