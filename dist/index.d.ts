import * as React from 'react';
export interface StyleInterface {
    hash: string;
    styles: string;
}
export interface StyledPropsInterface {
    className?: string;
    id?: string;
    children: React.ReactNode;
    styles: StyleInterface[] | StyleInterface;
    tag?: string;
    initCache?: boolean;
    containerRef?: (element: HTMLElement) => void;
    onClick?: () => void;
}
export default class Styled extends React.PureComponent<StyledPropsInterface, {}> {
    constructor(props: any);
    /**
     * If only one style is passed, enclose in an array
     */
    private stylesEnsuredAsArray;
    private injectStyles;
    render(): JSX.Element;
}
//# sourceMappingURL=index.d.ts.map