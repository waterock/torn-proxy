(this["webpackJsonpclient-side"]=this["webpackJsonpclient-side"]||[]).push([[0],[,,,function(e,t,n){e.exports={metaRow:"ProxyKey_metaRow__3XHtm",keyRow:"ProxyKey_keyRow__2qTzV",permissionsRow:"ProxyKey_permissionsRow__2mp95",betaPermissions:"ProxyKey_betaPermissions__2zDVc",altRow:"ProxyKey_altRow__HnFTT",revoked:"ProxyKey_revoked__2c3RM",key:"ProxyKey_key__3ipTR",revokedAt:"ProxyKey_revokedAt__1Oyv1",revokeButton:"ProxyKey_revokeButton__1ibyz",reinstateButton:"ProxyKey_reinstateButton__1X8g1"}},,function(e,t,n){e.exports={root:"ProxyKeys_root__3mGzb",lockAnchor:"ProxyKeys_lockAnchor__2X_eP"}},function(e,t,n){e.exports={root:"Faq_root__1paRV",question:"Faq_question__1HaW1"}},,,function(e,t,n){e.exports={root:"App_root__2CSG3"}},function(e,t,n){e.exports={wrongKey:"TornKeyForm_wrongKey__1Xm6S"}},function(e,t,n){e.exports=n(18)},,,,,function(e,t,n){},,function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(8),c=n.n(o),s=(n(16),n(1)),l=n.n(s),i=n(4),u=n(2),p=n(9),m=n.n(p),d=n(10),y=n.n(d),f=r.a.createContext({serverBaseUrl:"",user:null});f.displayName="AppContext";var k=f,v=function(e){var t=e.onAuthenticated,n=Object(a.useContext)(k),o=Object(a.useState)(""),c=Object(u.a)(o,2),s=c[0],p=c[1],m=Object(a.useState)(!1),d=Object(u.a)(m,2),f=d[0],v=d[1],h=Object(a.useState)(!1),b=Object(u.a)(h,2),E=b[0],x=b[1],_=function(){var e=Object(i.a)(l.a.mark((function e(a){var r,o,c,i;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),v(!0),x(!1),e.next=5,fetch(n.serverBaseUrl+"/api/authenticate",{credentials:"include",method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:s})});case 5:if(r=e.sent,v(!1),200!==r.status){e.next=16;break}return e.next=10,r.json();case 10:o=e.sent,c=o.id,i=o.name,t({id:c,name:i}),e.next=17;break;case 16:x(!0);case 17:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement("form",{onSubmit:_},r.a.createElement("input",{className:E?y.a.wrongKey:"",type:"text",value:s,onChange:function(e){return p(e.target.value)},disabled:f}),r.a.createElement("input",{type:"submit",disabled:f,value:"Unlock"}),f&&r.a.createElement("span",null,"checking..."))},h=n(3),b=n.n(h),E=function(){return{convertKeyRecordToEntity:function(e){return{key:e.key,userId:e.user_id,permissions:e.permissions,description:e.description,createdAt:new Date(e.created_at),revokedAt:e.revoked_at?new Date(e.revoked_at):null}}}},x=function(e){var t=e.keyEntity,n=e.useAltStyle,o=e.onKeyUpdated,c=Object(a.useContext)(k),s=E(),p=Object(a.useState)(!1),m=Object(u.a)(p,2),d=m[0],y=m[1];function f(){return(f=Object(i.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,x({revokedAt:new Date});case 3:n=e.sent,o(n);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function v(){return(v=Object(i.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,x({revokedAt:null});case 3:n=e.sent,o(n);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function h(){return(h=Object(i.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x({permissions:t});case 2:n=e.sent,o(n);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function x(e){return _.apply(this,arguments)}function _(){return(_=Object(i.a)(l.a.mark((function e(n){var a,r,o;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={},void 0!==n.revokedAt&&(a.revoked_at=(null===(r=n.revokedAt)||void 0===r?void 0:r.toISOString())||null),"string"===typeof n.permissions&&(a.permissions=n.permissions),y(!0),e.next=6,fetch("".concat(c.serverBaseUrl,"/api/keys/").concat(t.key),{method:"put",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});case 6:return o=e.sent,e.next=9,o.json();case 9:return e.abrupt("return",e.sent.map(s.convertKeyRecordToEntity));case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var w=[n?b.a.altRow:"",t.revokedAt?b.a.revoked:""];return r.a.createElement(r.a.Fragment,null,r.a.createElement("tr",{className:[].concat(w,[b.a.metaRow]).join(" ")},r.a.createElement("td",null,t.description),r.a.createElement("td",null,r.a.createElement("span",{title:t.createdAt.toString()},t.createdAt.toLocaleDateString())),r.a.createElement("td",null,null===t.revokedAt&&r.a.createElement("button",{className:b.a.revokeButton,onClick:function(e){return f.apply(this,arguments)},disabled:d},"revoke"),null!==t.revokedAt&&r.a.createElement("span",{title:t.revokedAt.toString(),className:b.a.revokedAt},"revoked at ",t.revokedAt.toLocaleDateString()))),r.a.createElement("tr",{className:[].concat(w,[b.a.keyRow]).join(" ")},r.a.createElement("td",{colSpan:t.revokedAt?2:3},r.a.createElement("span",{className:b.a.key+" "+(null!==t.revokedAt?b.a.revoked:"")},t.key)),null!==t.revokedAt&&r.a.createElement("td",null,r.a.createElement("button",{className:b.a.reinstateButton,onClick:function(e){return v.apply(this,arguments)},disabled:d},"reinstate"))),r.a.createElement("tr",{className:[].concat(w,[b.a.permissionsRow]).join(" ")},r.a.createElement("td",{colSpan:3},r.a.createElement("span",{className:b.a.betaPermissions},"Permissions: "),Object.entries({"*":"Public+private",public:"Public only"}).map((function(e){var n=Object(u.a)(e,2),a=n[0],o=n[1];return r.a.createElement("label",{key:a},r.a.createElement("input",{disabled:d,type:"radio",name:"permissions-".concat(t.key),value:a,checked:t.permissions===a,onChange:function(){return function(e){return h.apply(this,arguments)}(a)}}),o)})))))},_=n(5),w=n.n(_),O=function(e){var t,n,o=e.onLock,c=Object(a.useContext)(k),s=E(),p=Object(a.useState)(!1),m=Object(u.a)(p,2),d=m[0],y=m[1],f=Object(a.useState)([]),v=Object(u.a)(f,2),h=v[0],b=v[1],_=Object(a.useState)(!1),O=Object(u.a)(_,2),j=O[0],g=O[1],A=Object(a.useState)(null),N=Object(u.a)(A,2),P=N[0],S=N[1],R=Object(a.useState)(0),K=Object(u.a)(R,2),T=K[0],B=K[1];Object(a.useEffect)((function(){y(!0),Object(i.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(c.serverBaseUrl+"/api/keys",{credentials:"include"});case 2:if(200!==(t=e.sent).status){e.next=10;break}return e.next=6,t.json();case 6:n=e.sent.map(s.convertKeyRecordToEntity),b(n),e.next=18;break;case 10:return e.t0=S,e.next=13,t.json();case 13:if(e.t1=e.sent.error_message,e.t1){e.next=16;break}e.t1="some error";case 16:e.t2=e.t1,(0,e.t0)(e.t2);case 18:y(!1);case 19:case"end":return e.stop()}}),e)})))()}),[]);var C=Object(a.useMemo)((function(){return h.filter((function(e){return null===e.revokedAt}))}),[h]),D=Object(a.useMemo)((function(){return h.filter((function(e){return null!==e.revokedAt}))}),[h]);function I(e){return e.map((function(e,t){return r.a.createElement(x,{key:T+"_"+e.key,keyEntity:e,useAltStyle:t%2!==0,onKeyUpdated:U})}))}function U(e){B(T+1),b(e)}return P?r.a.createElement("span",null,"Error response from server: ",P,". Please refresh the page."):d?r.a.createElement("span",null,"Loading..."):r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"Hello, ",null===(t=c.user)||void 0===t?void 0:t.name," [",null===(n=c.user)||void 0===n?void 0:n.id,"] ",r.a.createElement("a",{href:"#",className:w.a.lockAnchor,onClick:function(e){e.preventDefault(),o()}},"Lock")),r.a.createElement("table",{className:w.a.root},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Description"),r.a.createElement("th",null,"Created"),r.a.createElement("th",null,"Actions"))),r.a.createElement("tbody",null,I(C)),D.length>0&&r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",{colSpan:3},r.a.createElement("label",null,r.a.createElement("input",{type:"checkbox",checked:j,onChange:function(e){return g(e.target.checked)}}),"\xa0Show revoked keys (",D.length,")"))),j&&I(D))),r.a.createElement("div",null,r.a.createElement("h3",null,"New key? Nope!"),r.a.createElement("p",null,"It is no longer possible to create new keys. The ",r.a.createElement("a",{href:"https://www.torn.com/forums.php#/p=threads&f=63&t=16178384",target:"_blank",rel:"noopener"},"forum thread")," explains why. Basically we're unable to guarantee service with the IP rate limit in place, and Ched isn't going to make any exceptions."),r.a.createElement("p",null,"I recommend reverting to the use of TORN keys."),r.a.createElement("p",null,"Existing keys will remain functional for a little while to ease the transition. But please switch back to TORN keys at your earliest convenience.")))},j=n(6),g=n.n(j),A=function(e){var t=e.question,n=e.answer,a=e.children;return r.a.createElement("div",{className:g.a.root},r.a.createElement("p",{className:g.a.question},t),n&&r.a.createElement("p",null,n),!n&&a)};var N=function(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],o=t[1],c={serverBaseUrl:"https://torn-proxy.com",user:n};return Object(a.useEffect)((function(){Object(i.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(c.serverBaseUrl+"/api/me",{credentials:"include"});case 2:if(200!==(t=e.sent).status){e.next=8;break}return e.next=6,t.json();case 6:n=e.sent,o(n);case 8:case"end":return e.stop()}}),e)})))()}),[]),r.a.createElement(k.Provider,{value:c},r.a.createElement("div",{className:m.a.root},r.a.createElement("h1",null,"TORN proxy"),r.a.createElement("p",null,"The only place that needs to know your TORN API key."),r.a.createElement("p",null,"Apps can use dedicated proxy keys to make requests to the TORN API."),r.a.createElement("p",null,"Easy app-based access control for added privacy and security."),r.a.createElement("h2",null,"My proxy keys"),null===n&&r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"Locked. Enter your TORN API key first."),r.a.createElement(v,{onAuthenticated:o})),null!==n&&r.a.createElement(O,{onLock:function(){o(null),fetch(c.serverBaseUrl+"/api/lock",{credentials:"include",method:"post"})}}),null===n&&r.a.createElement(r.a.Fragment,null,r.a.createElement("h2",null,"We have a problem"),r.a.createElement(A,{question:"What's going on?"},"Please use default TORN keys instead of proxy keys. We can't guarantee continued service because of TORN's API limits, mostly the IP-based one. Need more control? Then bug Ched until he finally gives in. Or ",r.a.createElement("a",{href:"https://www.torn.com/forums.php#/p=threads&f=4&t=16123202",target:"_blank",rel:"noopener"},"vote and bump this")))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(N,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[11,1,2]]]);
//# sourceMappingURL=main.df1506f2.chunk.js.map