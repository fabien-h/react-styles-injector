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
var existingStylesString = '';
// Style tag in the DOM that will store all the styles of the application
var styleTag;
var styleTagContent = '';
var Styled = /** @class */ (function (_super) {
    __extends(Styled, _super);
    function Styled(props) {
        var _this = _super.call(this, props) || this;
        /**
         * If the style tag does not exists, initialize it
         * from the DOM if SSR pre-existed
         * from scratch if no SSR pre-existed
         */
        if (!styleTag) {
            styleTag = document.getElementById('GLOBAL_STYLES');
            if (styleTag) {
                styleTagContent = styleTag.innerHTML;
                existingStylesString = styleTag.dataset['stylesHashes'] || '';
                (existingStylesString.split(',') || []).forEach(function (hash) { return (existingStyles[hash] = true); });
            }
            else {
                styleTag = document.createElement('style');
                styleTag.id = 'GLOBAL_STYLES';
                document.head.appendChild(styleTag);
            }
        }
        _this.state = {
            /**
             * Concatenated list of style per component to check if
             * an update is needed
             */
            concatenatedStyles: ''
        };
        return _this;
    }
    Styled.getDerivedStateFromProps = function (props, state) {
        var styles = props.styles;
        var concatenatedStyles = state.concatenatedStyles;
        var updatedConcatenatedStyles = (styles || [])
            .map(function (style) { return style.hash; })
            .join('');
        if (concatenatedStyles !== updatedConcatenatedStyles) {
            (props.styles || []).forEach(function (style) {
                if (!existingStyles[style.hash]) {
                    existingStyles[style.hash] = true;
                    styleTagContent += style.styles;
                    styleTag.innerHTML = styleTagContent;
                    existingStylesString += "," + style.hash;
                    styleTag.dataset['stylesHashes'] = existingStylesString;
                }
            });
            return {
                concatenatedStyles: updatedConcatenatedStyles
            };
        }
        return null;
    };
    Styled.prototype.render = function () {
        var _a = this.props, children = _a.children, tag = _a.tag, className = _a.className, styles = _a.styles;
        var ComponentTag = tag || 'div';
        var compiledClasseName = [
            className || ''
        ].concat(styles.map(function (style) { return style.hash; })).join(' ');
        return (React.createElement(ComponentTag, { className: compiledClasseName }, children));
    };
    return Styled;
}(React.PureComponent));
exports.default = Styled;
//# sourceMappingURL=index.js.map