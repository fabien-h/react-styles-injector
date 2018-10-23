import * as React from 'react';
declare var NODE_ENV: string;

// Export from pcss-loader
// https://github.com/fabien-h/pcss-loader
export interface StyleInterface {
	hash: string;
	styles: string;
}

export interface StyledPropsInterface {
	// Class
	className?: string;
	// Id
	id?: string;
	// React content of the node
	children: React.ReactNode;
	// Export from pcss-loader
	styles: StyleInterface[] | StyleInterface;
	// Set the tag of the container
	tag?: string;
	// If true, init and reset the cache for existing styles
	initCache?: boolean;
	// The DOM element corresponding to the container
	containerRef?: (element: HTMLElement) => void;
	// Click event
	onClick?: () => void;
	// Option to make the element return a fragment without enclosing tag
	asFragment?: boolean;
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

// Tell if the mode is development
// Has to be set in NODE_ENV
let isDev = false;
try {
	// Has to be in a try catch because
	// NODE_ENV may be not replaced or defined
	isDev = NODE_ENV === 'development';
} catch (error) {}

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

		/**
		 * If we are client side in production mode
		 * inject the styles only once in the constructor
		 */
		if (isClient && !isDev) this.injectStyles(props);
	}

	/**
	 * If only one style is passed, enclose in an array
	 */
	private stylesEnsuredAsArray = (
		styles: StyleInterface[] | StyleInterface
	): StyleInterface[] => {
		if (Array.isArray(styles)) return styles;
		return [styles];
	};

	private injectStyles = (props: StyledPropsInterface): void => {
		/**
		 * Ensure client side and document exists
		 */
		if (!document || !document.head) return;
		/**
		 * Inject in the head only if the element
		 * has not already been injected
		 */
		return this.stylesEnsuredAsArray(props.styles).forEach(style => {
			if (!existingStyles[style.hash]) {
				existingStyles[style.hash] = true;
				let styleTag = document.createElement('style');
				styleTag.id = style.hash;
				styleTag.innerHTML = style.styles;
				(document.head as HTMLHeadElement).appendChild(styleTag);
			}
		});
	};

	public render(): JSX.Element {
		const {
			asFragment,
			children,
			className,
			containerRef,
			styles,
			tag,
			...otherHTMLProps
		} = this.props;
		const ComponentTag = tag || 'div';
		const compiledClasseName = [
			className || '',
			...this.stylesEnsuredAsArray(styles).map(style => style.hash)
		]
			.join(' ')
			.trim();

		if (isClient) {
			/**
			 * In dev mode, try to inject at each render since the
			 * styles may have changed following a hot module replacement
			 */
			if (isDev) this.injectStyles(this.props);

			if (asFragment) {
				return <>{children}</>;
			}

			return (
				<ComponentTag
					className={compiledClasseName}
					ref={containerRef || null}
					{...otherHTMLProps}
				>
					{children}
				</ComponentTag>
			);
		}

		/**
		 * If we are server side, inject the style tag
		 * with the styles stringified in a fragment
		 * and we don't add the container ref
		 */
		return (
			<>
				{this.stylesEnsuredAsArray(styles).map(style => {
					if (useServerCache && existingStyles[style.hash]) return null;
					existingStyles[style.hash] = true;
					return (
						<style
							key={style.hash}
							dangerouslySetInnerHTML={{ __html: style.styles }}
						/>
					);
				})}
				{asFragment ? (
					<ComponentTag className={compiledClasseName} {...otherHTMLProps}>
						{children}
					</ComponentTag>
				) : (
					children
				)}
			</>
		);
	}
}
