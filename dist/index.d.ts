import * as React from 'react';
interface StyleInterface {
    hash: string;
    styles: string;
}
interface StyledPropsInterface {
    children: any;
    className?: string;
    containerRef?: any;
    id?: string;
    styles: StyleInterface[];
    tag?: string;
}
interface StyledStateInterface {
    concatenatedStyles: string;
}
export default class Styled extends React.PureComponent<StyledPropsInterface, StyledStateInterface> {
    containerRef: HTMLElement;
    constructor(props: StyledPropsInterface);
    static getDerivedStateFromProps(props: StyledPropsInterface, state: StyledStateInterface): {
        concatenatedStyles: string;
    } | null;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map