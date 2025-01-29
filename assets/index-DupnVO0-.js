(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const ae=(e,t)=>e===t,N=Symbol("solid-proxy"),J=typeof Proxy=="function",L={equals:ae};let ee=oe;const C=1,R=2,te={owned:null,cleanups:null,context:null,owner:null};var d=null;let B=null,he=null,h=null,g=null,b=null,U=0;function de(e,t){const n=h,i=d,s=e.length===0,r=t===void 0?i:t,c=s?te:{owned:null,cleanups:null,context:r?r.context:null,owner:r},o=s?e:()=>e(()=>S(()=>_(c)));d=c,h=null;try{return T(o,!0)}finally{h=n,d=i}}function E(e,t){t=t?Object.assign({},L,t):L;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},i=s=>(typeof s=="function"&&(s=s(n.value)),se(n,s));return[ie.bind(n),i]}function A(e,t,n){const i=H(e,t,!1,C);$(i)}function ge(e,t,n){ee=ye;const i=H(e,t,!1,C);i.user=!0,b?b.push(i):$(i)}function k(e,t,n){n=n?Object.assign({},L,n):L;const i=H(e,t,!0,0);return i.observers=null,i.observerSlots=null,i.comparator=n.equals||void 0,$(i),ie.bind(i)}function S(e){if(h===null)return e();const t=h;h=null;try{return e()}finally{h=t}}function ne(e){return d===null||(d.cleanups===null?d.cleanups=[e]:d.cleanups.push(e)),e}function ie(){if(this.sources&&this.state)if(this.state===C)$(this);else{const e=g;g=null,T(()=>I(this),!1),g=e}if(h){const e=this.observers?this.observers.length:0;h.sources?(h.sources.push(this),h.sourceSlots.push(e)):(h.sources=[this],h.sourceSlots=[e]),this.observers?(this.observers.push(h),this.observerSlots.push(h.sources.length-1)):(this.observers=[h],this.observerSlots=[h.sources.length-1])}return this.value}function se(e,t,n){let i=e.value;return(!e.comparator||!e.comparator(i,t))&&(e.value=t,e.observers&&e.observers.length&&T(()=>{for(let s=0;s<e.observers.length;s+=1){const r=e.observers[s],c=B&&B.running;c&&B.disposed.has(r),(c?!r.tState:!r.state)&&(r.pure?g.push(r):b.push(r),r.observers&&re(r)),c||(r.state=C)}if(g.length>1e6)throw g=[],new Error},!1)),t}function $(e){if(!e.fn)return;_(e);const t=U;we(e,e.value,t)}function we(e,t,n){let i;const s=d,r=h;h=d=e;try{i=e.fn(t)}catch(c){return e.pure&&(e.state=C,e.owned&&e.owned.forEach(_),e.owned=null),e.updatedAt=n+1,ce(c)}finally{h=r,d=s}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?se(e,i):e.value=i,e.updatedAt=n)}function H(e,t,n,i=C,s){const r={fn:e,state:i,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:d,context:d?d.context:null,pure:n};return d===null||d!==te&&(d.owned?d.owned.push(r):d.owned=[r]),r}function j(e){if(e.state===0)return;if(e.state===R)return I(e);if(e.suspense&&S(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<U);)e.state&&t.push(e);for(let n=t.length-1;n>=0;n--)if(e=t[n],e.state===C)$(e);else if(e.state===R){const i=g;g=null,T(()=>I(e,t[0]),!1),g=i}}function T(e,t){if(g)return e();let n=!1;t||(g=[]),b?n=!0:b=[],U++;try{const i=e();return me(n),i}catch(i){n||(b=null),g=null,ce(i)}}function me(e){if(g&&(oe(g),g=null),e)return;const t=b;b=null,t.length&&T(()=>ee(t),!1)}function oe(e){for(let t=0;t<e.length;t++)j(e[t])}function ye(e){let t,n=0;for(t=0;t<e.length;t++){const i=e[t];i.user?e[n++]=i:j(i)}for(t=0;t<n;t++)j(e[t])}function I(e,t){e.state=0;for(let n=0;n<e.sources.length;n+=1){const i=e.sources[n];if(i.sources){const s=i.state;s===C?i!==t&&(!i.updatedAt||i.updatedAt<U)&&j(i):s===R&&I(i,t)}}}function re(e){for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];n.state||(n.state=R,n.pure?g.push(n):b.push(n),n.observers&&re(n))}}function _(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),i=e.sourceSlots.pop(),s=n.observers;if(s&&s.length){const r=s.pop(),c=n.observerSlots.pop();i<s.length&&(r.sourceSlots[c]=i,s[i]=r,n.observerSlots[i]=c)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)_(e.tOwned[t]);delete e.tOwned}if(e.owned){for(t=e.owned.length-1;t>=0;t--)_(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}e.state=0}function be(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function ce(e,t=d){throw be(e)}function y(e,t){return S(()=>e(t||{}))}function P(){return!0}const F={get(e,t,n){return t===N?n:e.get(t)},has(e,t){return t===N?!0:e.has(t)},set:P,deleteProperty:P,getOwnPropertyDescriptor(e,t){return{configurable:!0,enumerable:!0,get(){return e.get(t)},set:P,deleteProperty:P}},ownKeys(e){return e.keys()}};function M(e){return(e=typeof e=="function"?e():e)?e:{}}function xe(){for(let e=0,t=this.length;e<t;++e){const n=this[e]();if(n!==void 0)return n}}function G(...e){let t=!1;for(let c=0;c<e.length;c++){const o=e[c];t=t||!!o&&N in o,e[c]=typeof o=="function"?(t=!0,k(o)):o}if(J&&t)return new Proxy({get(c){for(let o=e.length-1;o>=0;o--){const l=M(e[o])[c];if(l!==void 0)return l}},has(c){for(let o=e.length-1;o>=0;o--)if(c in M(e[o]))return!0;return!1},keys(){const c=[];for(let o=0;o<e.length;o++)c.push(...Object.keys(M(e[o])));return[...new Set(c)]}},F);const n={},i=Object.create(null);for(let c=e.length-1;c>=0;c--){const o=e[c];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let f=l.length-1;f>=0;f--){const a=l[f];if(a==="__proto__"||a==="constructor")continue;const u=Object.getOwnPropertyDescriptor(o,a);if(!i[a])i[a]=u.get?{enumerable:!0,configurable:!0,get:xe.bind(n[a]=[u.get.bind(o)])}:u.value!==void 0?u:void 0;else{const w=n[a];w&&(u.get?w.push(u.get.bind(o)):u.value!==void 0&&w.push(()=>u.value))}}}const s={},r=Object.keys(i);for(let c=r.length-1;c>=0;c--){const o=r[c],l=i[o];l&&l.get?Object.defineProperty(s,o,l):s[o]=l?l.value:void 0}return s}function Ce(e,...t){if(J&&N in e){const s=new Set(t.length>1?t.flat():t[0]),r=t.map(c=>new Proxy({get(o){return c.includes(o)?e[o]:void 0},has(o){return c.includes(o)&&o in e},keys(){return c.filter(o=>o in e)}},F));return r.push(new Proxy({get(c){return s.has(c)?void 0:e[c]},has(c){return s.has(c)?!1:c in e},keys(){return Object.keys(e).filter(c=>!s.has(c))}},F)),r}const n={},i=t.map(()=>({}));for(const s of Object.getOwnPropertyNames(e)){const r=Object.getOwnPropertyDescriptor(e,s),c=!r.get&&!r.set&&r.enumerable&&r.writable&&r.configurable;let o=!1,l=0;for(const f of t)f.includes(s)&&(o=!0,c?i[l][s]=r.value:Object.defineProperty(i[l],s,r)),++l;o||(c?n[s]=r.value:Object.defineProperty(n,s,r))}return[...i,n]}const Ae=e=>`Stale read from <${e}>.`;function pe(e){const t=e.keyed,n=k(()=>e.when,void 0,{equals:(i,s)=>t?i===s:!i==!s});return k(()=>{const i=n();if(i){const s=e.children;return typeof s=="function"&&s.length>0?S(()=>s(t?i:()=>{if(!S(n))throw Ae("Show");return e.when})):s}return e.fallback},void 0,void 0)}const ve=new Set(["innerHTML","textContent","innerText","children"]),Se=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),Ee=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]),_e={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"};function $e(e,t,n){let i=n.length,s=t.length,r=i,c=0,o=0,l=t[s-1].nextSibling,f=null;for(;c<s||o<r;){if(t[c]===n[o]){c++,o++;continue}for(;t[s-1]===n[r-1];)s--,r--;if(s===c){const a=r<i?o?n[o-1].nextSibling:n[r-o]:l;for(;o<r;)e.insertBefore(n[o++],a)}else if(r===o)for(;c<s;)(!f||!f.has(t[c]))&&t[c].remove(),c++;else if(t[c]===n[r-1]&&n[o]===t[s-1]){const a=t[--s].nextSibling;e.insertBefore(n[o++],t[c++].nextSibling),e.insertBefore(n[--r],a),t[s]=n[r]}else{if(!f){f=new Map;let u=o;for(;u<r;)f.set(n[u],u++)}const a=f.get(t[c]);if(a!=null)if(o<a&&a<r){let u=c,w=1,O;for(;++u<s&&u<r&&!((O=f.get(t[u]))==null||O!==a+w);)w++;if(w>a-o){const fe=t[c];for(;o<a;)e.insertBefore(n[o++],fe)}else e.replaceChild(n[o++],t[c++])}else c++;else t[c++].remove()}}}const Y="_$DX_DELEGATE";function Te(e,t,n,i={}){let s;return de(r=>{s=r,t===document?e():m(t,e(),t.firstChild?null:void 0,n)},i.owner),()=>{s(),t.textContent=""}}function p(e,t,n){let i;const s=()=>{const c=document.createElement("template");return c.innerHTML=e,c.content.firstChild},r=()=>(i||(i=s())).cloneNode(!0);return r.cloneNode=r,r}function le(e,t=window.document){const n=t[Y]||(t[Y]=new Set);for(let i=0,s=e.length;i<s;i++){const r=e[i];n.has(r)||(n.add(r),t.addEventListener(r,De))}}function q(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function Oe(e,t,n,i){i==null?e.removeAttributeNS(t,n):e.setAttributeNS(t,n,i)}function Pe(e,t,n){n?e.setAttribute(t,""):e.removeAttribute(t)}function K(e,t){t==null?e.removeAttribute("class"):e.className=t}function X(e,t,n,i){if(i)Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n;else if(Array.isArray(n)){const s=n[0];e.addEventListener(t,n[0]=r=>s.call(e,n[1],r))}else e.addEventListener(t,n,typeof n!="function"&&n)}function Ne(e,t,n={}){const i=Object.keys(t||{}),s=Object.keys(n);let r,c;for(r=0,c=s.length;r<c;r++){const o=s[r];!o||o==="undefined"||t[o]||(Z(e,o,!1),delete n[o])}for(r=0,c=i.length;r<c;r++){const o=i[r],l=!!t[o];!o||o==="undefined"||n[o]===l||!l||(Z(e,o,!0),n[o]=l)}return n}function Le(e,t,n){if(!t)return n?q(e,"style"):t;const i=e.style;if(typeof t=="string")return i.cssText=t;typeof n=="string"&&(i.cssText=n=void 0),n||(n={}),t||(t={});let s,r;for(r in n)t[r]==null&&i.removeProperty(r),delete n[r];for(r in t)s=t[r],s!==n[r]&&(i.setProperty(r,s),n[r]=s);return n}function Re(e,t={},n,i){const s={};return A(()=>typeof t.ref=="function"&&ke(t.ref,e)),A(()=>je(e,t,n,!0,s,!0)),s}function ke(e,t,n){return S(()=>e(t,n))}function m(e,t,n,i){if(n!==void 0&&!i&&(i=[]),typeof t!="function")return D(e,t,i,n);A(s=>D(e,t(),s,n),i)}function je(e,t,n,i,s={},r=!1){t||(t={});for(const c in s)if(!(c in t)){if(c==="children")continue;s[c]=z(e,c,null,s[c],n,r,t)}for(const c in t){if(c==="children")continue;const o=t[c];s[c]=z(e,c,o,s[c],n,r,t)}}function Ie(e){return e.toLowerCase().replace(/-([a-z])/g,(t,n)=>n.toUpperCase())}function Z(e,t,n){const i=t.trim().split(/\s+/);for(let s=0,r=i.length;s<r;s++)e.classList.toggle(i[s],n)}function z(e,t,n,i,s,r,c){let o,l,f,a;if(t==="style")return Le(e,n,i);if(t==="classList")return Ne(e,n,i);if(n===i)return i;if(t==="ref")r||n(e);else if(t.slice(0,3)==="on:"){const u=t.slice(3);i&&e.removeEventListener(u,i,typeof i!="function"&&i),n&&e.addEventListener(u,n,typeof n!="function"&&n)}else if(t.slice(0,10)==="oncapture:"){const u=t.slice(10);i&&e.removeEventListener(u,i,!0),n&&e.addEventListener(u,n,!0)}else if(t.slice(0,2)==="on"){const u=t.slice(2).toLowerCase(),w=Ee.has(u);if(!w&&i){const O=Array.isArray(i)?i[0]:i;e.removeEventListener(u,O)}(w||n)&&(X(e,u,n,w),w&&le([u]))}else if(t.slice(0,5)==="attr:")q(e,t.slice(5),n);else if(t.slice(0,5)==="bool:")Pe(e,t.slice(5),n);else if((a=t.slice(0,5)==="prop:")||(f=ve.has(t))||!s||(o=e.nodeName.includes("-")||"is"in c))a&&(t=t.slice(5),l=!0),t==="class"||t==="className"?K(e,n):o&&!l&&!f?e[Ie(t)]=n:e[t]=n;else{const u=t.indexOf(":")>-1&&_e[t.split(":")[0]];u?Oe(e,u,t,n):q(e,Se[t]||t,n)}return n}function De(e){let t=e.target;const n=`$$${e.type}`,i=e.target,s=e.currentTarget,r=l=>Object.defineProperty(e,"target",{configurable:!0,value:l}),c=()=>{const l=t[n];if(l&&!t.disabled){const f=t[`${n}Data`];if(f!==void 0?l.call(t,f,e):l.call(t,e),e.cancelBubble)return}return t.host&&typeof t.host!="string"&&!t.host._$host&&t.contains(e.target)&&r(t.host),!0},o=()=>{for(;c()&&(t=t._$host||t.parentNode||t.host););};if(Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),e.composedPath){const l=e.composedPath();r(l[0]);for(let f=0;f<l.length-2&&(t=l[f],!!c());f++){if(t._$host){t=t._$host,o();break}if(t.parentNode===s)break}}else o();r(i)}function D(e,t,n,i,s){for(;typeof n=="function";)n=n();if(t===n)return n;const r=typeof t,c=i!==void 0;if(e=c&&n[0]&&n[0].parentNode||e,r==="string"||r==="number"){if(r==="number"&&(t=t.toString(),t===n))return n;if(c){let o=n[0];o&&o.nodeType===3?o.data!==t&&(o.data=t):o=document.createTextNode(t),n=v(e,n,i,o)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||r==="boolean")n=v(e,n,i);else{if(r==="function")return A(()=>{let o=t();for(;typeof o=="function";)o=o();n=D(e,o,n,i)}),()=>n;if(Array.isArray(t)){const o=[],l=n&&Array.isArray(n);if(V(o,t,n,s))return A(()=>n=D(e,o,n,i,!0)),()=>n;if(o.length===0){if(n=v(e,n,i),c)return n}else l?n.length===0?Q(e,o,i):$e(e,n,o):(n&&v(e),Q(e,o));n=o}else if(t.nodeType){if(Array.isArray(n)){if(c)return n=v(e,n,i,t);v(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function V(e,t,n,i){let s=!1;for(let r=0,c=t.length;r<c;r++){let o=t[r],l=n&&n[e.length],f;if(!(o==null||o===!0||o===!1))if((f=typeof o)=="object"&&o.nodeType)e.push(o);else if(Array.isArray(o))s=V(e,o,l)||s;else if(f==="function")if(i){for(;typeof o=="function";)o=o();s=V(e,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||s}else e.push(o),s=!0;else{const a=String(o);l&&l.nodeType===3&&l.data===a?e.push(l):e.push(document.createTextNode(a))}}return s}function Q(e,t,n=null){for(let i=0,s=t.length;i<s;i++)e.insertBefore(t[i],n)}function v(e,t,n,i){if(n===void 0)return e.textContent="";const s=i||document.createTextNode("");if(t.length){let r=!1;for(let c=t.length-1;c>=0;c--){const o=t[c];if(s!==o){const l=o.parentNode===e;!r&&!c?l?e.replaceChild(s,o):e.insertBefore(s,n):l&&o.remove()}else r=!0}}else e.insertBefore(s,n);return[s]}const Ue=!1,W="53300001-0023-4bd4-bbd5-a6920e4c5653",Be="53300002-0023-4bd4-bbd5-a6920e4c5653",Me="53300003-0023-4bd4-bbd5-a6920e4c5653",Fe=3;class qe{device=null;get deviceName(){return this.device?.name||null}server=null;service=null;tx_characteristic=null;rx_characteristic=null;get connected(){return this.device&&this.device.gatt?.connected}onConnectionChange=null;onReconnectionChange=null;wantsConnection=!1;get reconnecting(){return this.device&&!this.device.gatt?.connected&&this.enableAutoReconnect}reconnectTimeoutId=void 0;_enableAutoReconnect=!0;get enableAutoReconnect(){return this._enableAutoReconnect}set enableAutoReconnect(t){this._enableAutoReconnect=t,t||(clearTimeout(this.reconnectTimeoutId),this.reconnectTimeoutId=void 0,this.connected||(this.device=null,this.onReconnectionChange&&this.onReconnectionChange(!1)))}constructor(){}async connectPrompt(){try{const t=await navigator.bluetooth.requestDevice({filters:[{services:[W]}]});await this.connect(t)}catch{console.warn("closed connect prompt")}}async connect(t){t&&(this.device=t,this.wantsConnection=!0,this.server=await t.gatt.connect(),console.log("device connected:",t.name),this.onReconnectionChange&&this.onReconnectionChange(!1),this.onConnectionChange&&this.onConnectionChange(!0),this.service=await this.server.getPrimaryService(W),this.tx_characteristic=await this.service.getCharacteristic(Be),this.rx_characteristic=await this.service.getCharacteristic(Me),console.log("service + characteristics obtained"),t.addEventListener("gattserverdisconnected",()=>{console.log("device disconneted"),this.server=null,this.service=null,this.tx_characteristic=null,this.rx_characteristic=null,this.onConnectionChange&&this.onConnectionChange(!1),this.enableAutoReconnect&&this.wantsConnection?(this.onReconnectionChange&&this.onReconnectionChange(!0),this._attemptReconnect()):t=null}))}async _attemptReconnect(){if(!this.connected&&this.device){console.log("reconnect attempt...");try{clearTimeout(this.reconnectTimeoutId),this.reconnectTimeoutId=void 0,await this.connect(this.device)}catch{clearTimeout(this.reconnectTimeoutId),this.reconnectTimeoutId=setTimeout(()=>{console.log("reconnect timeout"),this._attemptReconnect()},1e3*Fe)}}}disconnect(){this.connected?(this.wantsConnection=!1,this.device.gatt?.disconnect(),this.device=null):(this.wantsConnection=!1,this.device=null,clearTimeout(this.reconnectTimeoutId),this.reconnectTimeoutId=void 0,this.onReconnectionChange&&this.onReconnectionChange(!1))}async sendVibe(t){if(this.tx_characteristic){const i="Vibrate:"+Math.min(20,Math.max(0,t)).toFixed(0)+";",r=new TextEncoder().encode(i);await this.tx_characteristic.writeValue(r)}}}const x=new qe;var Ve=p("<svg stroke-width=0>");function ue(e,t){const n=G(e.a,t),[i,s]=Ce(n,["src"]),[r,c]=E(""),o=k(()=>t.title?`${e.c}<title>${t.title}</title>`:e.c);return ge(()=>c(o())),ne(()=>{c("")}),(()=>{var l=Ve();return Re(l,G({get stroke(){return e.a?.stroke},get color(){return t.color||"currentColor"},get fill(){return t.color||"currentColor"},get style(){return{...t.style,overflow:"visible"}}},s,{get height(){return t.size||"1em"},get width(){return t.size||"1em"},xmlns:"http://www.w3.org/2000/svg",get innerHTML(){return r()}}),!0),m(l,()=>Ue),l})()}function He(e){return ue({a:{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",viewBox:"0 0 24 24"},c:'<path d="M6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>'},e)}function Ke(e){return ue({a:{viewBox:"0 0 512 512"},c:'<path d="M256 208A48 48 0 1 0 256 304 48 48 0 1 0 256 208z"/><path d="m470.39 300-.47-.38-31.56-24.75a16.11 16.11 0 0 1-6.1-13.33v-11.56a16 16 0 0 1 6.11-13.22L469.92 212l.47-.38a26.68 26.68 0 0 0 5.9-34.06l-42.71-73.9a1.59 1.59 0 0 1-.13-.22A26.86 26.86 0 0 0 401 92.14l-.35.13-37.1 14.93a15.94 15.94 0 0 1-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 0 1-8.19-11.82l-5.59-39.59-.12-.72A27.22 27.22 0 0 0 298.76 26h-85.52a26.92 26.92 0 0 0-26.45 22.39l-.09.56-5.57 39.67a16 16 0 0 1-8.13 11.82 175.21 175.21 0 0 0-10 5.82 15.92 15.92 0 0 1-14.43 1.27l-37.13-15-.35-.14a26.87 26.87 0 0 0-32.48 11.34l-.13.22-42.77 73.95a26.71 26.71 0 0 0 5.9 34.1l.47.38 31.56 24.75a16.11 16.11 0 0 1 6.1 13.33v11.56a16 16 0 0 1-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 0 0-5.9 34.06l42.71 73.9a1.59 1.59 0 0 1 .13.22 26.86 26.86 0 0 0 32.45 11.3l.35-.13 37.07-14.93a15.94 15.94 0 0 1 14.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 0 1 8.19 11.82l5.56 39.59.12.72A27.22 27.22 0 0 0 213.24 486h85.52a26.92 26.92 0 0 0 26.45-22.39l.09-.56 5.57-39.67a16 16 0 0 1 8.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0 1 14.43-1.27l37.13 14.95.35.14a26.85 26.85 0 0 0 32.48-11.34 2.53 2.53 0 0 1 .13-.22l42.71-73.89a26.7 26.7 0 0 0-5.89-34.11Zm-134.48-40.24a80 80 0 1 1-83.66-83.67 80.21 80.21 0 0 1 83.66 83.67Z"/>'},e)}var Xe=p("<div>"),Ge=p('<button class="flex flex-row items-center gap-x-2 rounded-md bg-blue-600 p-1.5 px-3 text-xl text-white hover:bg-opacity-90"><span class="text-sm font-bold tracking-wider text-gray-200">Connect</span> '),Ye=p('<button class="flex flex-row items-center gap-x-2 rounded-md bg-gray-600 p-1.5 px-3 text-xl text-white hover:bg-opacity-90">'),Ze=p('<div class="flex flex-row items-center justify-end gap-x-3"><span>'),ze=p('<header class="flex flex-row items-center justify-between p-4"><div class="container mx-auto flex items-center justify-between"><h1 class="text-3xl font-bold tracking-wider text-white">OSP');const Qe=({status:e})=>(()=>{var t=Xe();return A(()=>K(t,`${{on:"bg-green-400",off:"bg-gray-600",wait:"animate-pulse bg-yellow-400 shadow-lg shadow-yellow-400/50"}[e]} size-4 shrink-0 rounded-md transition-colors`)),t})(),We=({onClick:e})=>(()=>{var t=Ge(),n=t.firstChild;return n.nextSibling,X(t,"click",e,!0),m(t,y(He,{}),null),t})(),Je=({onClick:e})=>(()=>{var t=Ye();return X(t,"click",e,!0),m(t,y(Ke,{})),t})(),et=e=>(()=>{var t=ze(),n=t.firstChild;return n.firstChild,m(n,y(pe,{get when(){return e.connected||e.reconnection},get fallback(){return y(We,{onClick:()=>x.connectPrompt()})},get children(){var i=Ze(),s=i.firstChild;return m(i,y(Qe,{get status(){return e.reconnection?"wait":"on"}}),s),m(s,()=>x.deviceName||"No Device"),m(i,y(Je,{onClick:()=>{x.disconnect()}}),null),A(()=>K(s,`text-md me-3 ${x.deviceName?"text-gray-400":"text-gray-500"}`)),i}}),null),t})();le(["click"]);var tt=p('<div class=""><div></div><div class=text-red-500>');const nt=({disabled:e})=>{const[t,n]=E(""),[i,s]=E("");return navigator.permissions.query({name:"accelerometer"}).then(r=>{if(r.state==="denied")n(c=>c+`Accelerometer permission denied
`);else if(r.state==="granted"){s(o=>o+`Accelerometer permission granted
`),window.Accelerometer===void 0&&n(o=>o+`Accelerometer not supported
`);const c=new window.Accelerometer({frequency:60});c.addEventListener("reading",()=>{s(`${c.x} ${c.y} ${c.z}`)}),c.addEventListener("error",o=>{n(l=>l+o.error.name+`
`)}),c.start()}}),(()=>{var r=tt(),c=r.firstChild,o=c.nextSibling;return m(c,i),m(o,t),r})()},it=()=>{const[e,t]=E(!1),[n,i]=E(!1);return x.onConnectionChange=s=>t(s),x.onReconnectionChange=s=>i(s),ne(()=>{x.onConnectionChange=null,x.onReconnectionChange=null}),[y(et,{get connected(){return e()},get reconnection(){return n()}}),y(nt,{get disabled(){return!e()}})]},st=document.getElementById("root");Te(()=>y(it,{}),st);
