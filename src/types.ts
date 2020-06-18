// Export from pcss-loader
// https://github.com/fabien-h/pcss-loader
export interface IStyle {
  hash: string;
  styles: string;
}

export interface IStyledProps {
  // Class
  className?: string;
  containerRef?: () => void;
  // Id
  id?: string;
  // React content of the node
  children?: React.ReactNode;
  // Export from pcss-loader
  styles?: IStyle[] | IStyle;
  // Set the tag of the container
  tag?: string;
  // If true, init and reset the cache for existing styles
  initCache?: boolean;
  // Click event
  onClick?: () => void;
  // Option to make the element return a fragment without enclosing tag
  asFragment?: boolean;
  // Inlined styles in js
  inlinedJSStyles?: object;
}
