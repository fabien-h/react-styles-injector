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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
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
            /**
             * Ensure client side and document exists
             */
            if (!document || !document.head)
                return;
            /**
             * Inject in the head only if the element
             * has not already been injected
             */
            return _this.stylesEnsuredAsArray(props.styles).forEach(function (style) {
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
        var _a = this.props, asFragment = _a.asFragment, children = _a.children, className = _a.className, containerRef = _a.containerRef, styles = _a.styles, tag = _a.tag, otherHTMLProps = __rest(_a, ["asFragment", "children", "className", "containerRef", "styles", "tag"]);
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
            if (asFragment) {
                return React.createElement(React.Fragment, null, children);
            }
            return (React.createElement(ComponentTag, __assign({ className: compiledClasseName, ref: containerRef || null }, otherHTMLProps), children));
        }
        /**
         * If we are server side, inject the style tag
         * with the styles stringified in a fragment
         * and we don't add the container ref
         */
        return (React.createElement(React.Fragment, null,
            this.stylesEnsuredAsArray(styles).map(function (style) {
                if (useServerCache && existingStyles[style.hash])
                    return null;
                existingStyles[style.hash] = true;
                return (React.createElement("style", { key: style.hash, dangerouslySetInnerHTML: { __html: style.styles } }));
            }),
            asFragment ? (React.createElement(ComponentTag, __assign({ className: compiledClasseName }, otherHTMLProps), children)) : (children)));
    };
    return Styled;
}(React.PureComponent));
exports.default = Styled;
//# sourceMappingURL=index.js.map