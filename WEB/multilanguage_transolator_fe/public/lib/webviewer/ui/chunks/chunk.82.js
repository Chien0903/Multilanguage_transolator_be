(window.webpackJsonp=window.webpackJsonp||[]).push([[82],{1990:function(e,t,n){"use strict";n.r(t);n(19),n(11),n(13),n(8),n(14),n(10),n(9),n(12),n(16),n(15),n(20),n(18);var r=n(0),a=n.n(r),l=n(428),i=n(44),o=n(5),c=n(76);n(1754);function u(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,l,i,o=[],c=!0,u=!1;try{if(l=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=l.call(n)).done)&&(o.push(r.value),o.length!==t);c=!0);}catch(e){u=!0,a=e}finally{try{if(!c&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(u)throw a}}return o}}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return s(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var f=function(e){var t=e.closeModal,n=e.addLinkHandler,s=e.existingLink,f=u(Object(r.useState)(s),2),m=f[0],d=f[1],b=u(Object(l.a)(),1)[0],y=function(){n(m),t()};return a.a.createElement(c.a,{className:"Modal LinkModal","data-element":o.a.CONTENT_EDIT_LINK_MODAL,onMouseDown:t},a.a.createElement("div",{className:"container",onMouseDown:function(e){return e.stopPropagation()}},a.a.createElement("div",{className:"header-container"},a.a.createElement("div",{className:"header"},a.a.createElement("label",null,b("link.insertLink")),a.a.createElement(i.a,{img:"icon-close",onClick:t,title:"action.close"}))),a.a.createElement("div",{className:"tab-panel"},a.a.createElement("div",{className:"panel-body"},a.a.createElement("div",{className:"add-url-link"},a.a.createElement("form",{onSubmit:y},a.a.createElement("label",{htmlFor:"urlInput",className:"inputLabel"},b("link.enterUrlAlt")),a.a.createElement("div",{className:"linkInput"},a.a.createElement("input",{id:"urlInput",className:"urlInput",value:m,autoFocus:!0,onChange:function(e){return d(e.target.value)}})))))),a.a.createElement("div",{className:"divider"}),a.a.createElement("div",{className:"footer"},a.a.createElement(i.a,{className:"ok-button",dataElement:"linkSubmitButton",label:b("action.link"),onClick:y,disabled:!m.length}))))},m=n(3),d=n(6),b=n(2);function y(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,l,i,o=[],c=!0,u=!1;try{if(l=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=l.call(n)).done)&&(o.push(r.value),o.length!==t);c=!0);}catch(e){u=!0,a=e}finally{try{if(!c&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(u)throw a}}return o}}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var v=function(){var e=y(Object(d.e)((function(e){return[m.a.isElementOpen(e,o.a.CONTENT_EDIT_LINK_MODAL),m.a.getContentBoxEditor(e)]})),2),t=e[0],n=e[1],l=Object(d.d)(),i="";n&&(i=n.hyperlink);var c=Object(r.useCallback)((function(){l(b.a.closeElement(o.a.CONTENT_EDIT_LINK_MODAL)),n&&n.blur()}),[n]),u=Object(r.useCallback)((function(e){n&&(n.insertHyperlink(e),n.blur())}),[n]);return t?a.a.createElement(f,{closeModal:c,addLinkHandler:u,existingLink:i}):null};t.default=v}}]);
//# sourceMappingURL=chunk.82.js.map