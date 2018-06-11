import * as React from 'react';
export interface StyleInterface {
    hash: string;
    styles: string;
}
export interface StyledPropsInterface {
    children: any;
    className?: string;
    id?: string;
    styles: StyleInterface[];
    tag?: string;
    initCache?: boolean;
}
export interface StyledStateInterface {
    concatenatedStyles: string;
}
export default class Styled extends React.PureComponent<StyledPropsInterface, {}> {
    constructor(props: any);
    render(): JSX.Element;
}
//# sourceMappingURL=index.d.ts.map