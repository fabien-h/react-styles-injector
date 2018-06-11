"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Styled = /** @class */ (function (_super) {
    __extends(Styled, _super);
    function Styled(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Reset the cache if we are server-side and if
         * init is set to true
         */
        if (!isClient && props.initCache) {
            useServerCache = true;
            existingStyles = {};
        }
        return _this;
    }
    Styled.prototype.render = function () {
        var _a = this.props, children = _a.children, tag = _a.tag, className = _a.className, styles = _a.styles;
        var ComponentTag = tag || 'div';
        var compiledClasseName = [
            className || ''
        ].concat(styles.map(function (style) { return style.hash; })).join(' ');
        /**
         * If we are client side, inject the non cached
         * style tags in the header ; then render the children
         */
        if (isClient) {
            styles.forEach(function (style) {
                if (!existingStyles[style.hash]) {
                    existingStyles[style.hash] = true;
                    var styleTag = document.createElement('style');
                    styleTag.id = style.hash;
                    styleTag.innerHTML = style.styles;
                    document.head.appendChild(styleTag);
                }
            });
            return (React.createElement(ComponentTag, { className: compiledClasseName }, children));
        }
        /**
         * If we are server side, inject the style tag
         * with the styles stringyfied inside
         */
        return (React.createElement(React.Fragment, null,
            styles.map(function (style) {
                if (useServerCache && existingStyles[style.hash])
                    return null;
                existingStyles[style.hash] = true;
                return (React.createElement("style", { key: style.hash, id: style.hash, dangerouslySetInnerHTML: { __html: style.styles } }));
            }),
            React.createElement(ComponentTag, { className: compiledClasseName }, children)));
    };
    return Styled;
}(React.PureComponent));
exports.default = Styled;
//# sourceMappingURL=index.js.map