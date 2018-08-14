"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// Hashmap containing the hash of all the already injected styles
var existingStyles = {};
/**
 * If the server cache is not initialized, the renderer will add
 * a style tag per component. If the server cache is initialized
 * and reset each time the root component is rendered, only the
 * styles that have not already been injected will be.
 */
var useServerCache = false;
// Tell is the code is executed client side or server side
var isClient = !!(typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement);
// Tell if the mode is development
// Has to be set in NODE_ENV
var isDev = false;
try {
    // Has to be in a try catch because
    // NODE_ENV may be not replaced or defined
    isDev = NODE_ENV === 'development';
}
catch (error) { }
var Styled = /** @class */ (function (_super) {
    __extends(Styled, _super);
    function Styled(props) {
        var _this = _super.call(this, props) || this;
        /**
         * If only one style is passed, enclose in an array
         */
        _this.stylesEnsuredAsArray = function (styles) {
            if (Array.isArray(styles))
                return styles;
            return [styles];
        };
        _this.injectStyles = function (props) {
            _this.stylesEnsuredAsArray(props.styles).forEach(function (style) {
                /**
                 * Inject in the head only if the element
                 * has not already been injected
                 */
                if (!existingStyles[style.hash]) {
                    existingStyles[style.hash] = true;
                    var styleTag = document.createElement('style');
                    styleTag.id = style.hash;
                    styleTag.innerHTML = style.styles;
                    document.head.appendChild(styleTag);
                }
            });
        };
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
        if (isClient && !isDev)
            _this.injectStyles(props);
        return _this;
    }
    Styled.prototype.render = function () {
        var _a = this.props, styles = _a.styles, className = _a.className, children = _a.children, id = _a.id, tag = _a.tag, containerRef = _a.containerRef;
        var ComponentTag = tag || 'div';
        var compiledClasseName = [
            className || ''
        ].concat(this.stylesEnsuredAsArray(styles).map(function (style) { return style.hash; })).join(' ')
            .trim();
        if (isClient) {
            /**
             * In dev mode, try to inject at each render since the
             * styles may have changed following a hot module replacement
             */
            if (isDev)
                this.injectStyles(this.props);
            return (react_1.default.createElement(ComponentTag, { id: id || '', ref: containerRef || null, className: compiledClasseName }, children));
        }
        /**
         * If we are server side, inject the style tag
         * with the styles stringyfied in a fragment
         */
        return (react_1.default.createElement(react_1.default.Fragment, null,
            this.stylesEnsuredAsArray(styles).map(function (style) {
                if (useServerCache && existingStyles[style.hash])
                    return null;
                existingStyles[style.hash] = true;
                return (react_1.default.createElement("style", { key: style.hash, dangerouslySetInnerHTML: { __html: style.styles } }));
            }),
            react_1.default.createElement(ComponentTag, { id: id || '', className: compiledClasseName }, children)));
    };
    return Styled;
}(react_1.default.PureComponent));
exports.default = Styled;
//# sourceMappingURL=index.js.map