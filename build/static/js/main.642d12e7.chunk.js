(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{118:function(e,t,c){"use strict";c.r(t);var n=c(2),a=c.n(n),r=c(24),s=c.n(r),i=(c(69),c(18)),j=c(10),l=c(120),d=c(121),o=c(122),b=c(123),h=c(124),u=c(1);function O(){var e=Object(j.f)();return Object(u.jsx)("div",{className:"container",children:Object(u.jsxs)(l.a,{style:{width:"100%"},children:[Object(u.jsx)("h2",{children:"\u0412\u0445\u043e\u0434"}),Object(u.jsxs)(d.a,{children:[Object(u.jsx)(o.a,{for:"exampleEmail",children:"\u041b\u043e\u0433\u0438\u043d"}),Object(u.jsx)(b.a,{type:"numbers",name:"login",id:"exampleEmail",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043b\u043e\u0433\u0438\u043d"})]}),Object(u.jsxs)(d.a,{style:{marginTop:"2em"},children:[Object(u.jsx)(o.a,{for:"examplePassword",children:"\u041f\u0430\u0440\u043e\u043b\u044c"}),Object(u.jsx)(b.a,{type:"password",name:"password",id:"examplePassword",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c"})]}),Object(u.jsx)(h.a,{style:{marginTop:"10%",width:"100%"},onClick:function(){return e.push("/")},children:"\u0412\u043e\u0439\u0442\u0438"})]})})}var x=c(14),p=c.n(x),f=c(21),m=c(9),g=c(23),v=c.n(g),y=c(125);function w(){var e=new URLSearchParams(window.location.search);e=e.get("id");var t=Object(j.f)(),c=Object(n.useState)(""),a=Object(m.a)(c,2),r=a[0],s=a[1],i=Object(n.useState)(0),O=Object(m.a)(i,2),x=O[0],g=O[1],w=Object(n.useState)(!1),k=Object(m.a)(w,2),S=k[0],C=k[1];function N(e){var t=parseInt(e);return isFinite(t)&&t>0?(C(!0),!0):(C(!1),!1)}var T=function(){var t=Object(f.a)(p.a.mark((function t(){var c;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,v.a.get("https://6099651699011f0017140ca7.mockapi.io/students/"+e);case 2:return c=t.sent,t.abrupt("return",c.data);case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();Object(n.useEffect)((function(){var e=function(){var e=Object(f.a)(p.a.mark((function e(){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,T();case 2:N((t=e.sent).id)&&(s(t.stName),g(t.id));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();0===r.length&&e()}));var E=Object(n.useState)(""),B=Object(m.a)(E,2),F=B[0],P=B[1],D=Object(n.useState)(""),I=Object(m.a)(D,2),R=I[0],A=I[1],L=Object(n.useState)(!1),J=Object(m.a)(L,2),M=J[0],U=J[1],_=Object(n.useState)(0),q=Object(m.a)(_,2),z=q[0],G=q[1];return Object(n.useEffect)((function(){0===F.length?U(!1):U(!0),R!==F&&G(2),0===R.length?G(1):G(R!==F?2:0)}),[F,R,M,U]),Object(u.jsx)("div",{className:"container",children:S?Object(u.jsxs)(l.a,{style:{width:"100%"},onSubmit:function(e){e.preventDefault(),0!==F.length?0!==R.length?F===R?console.log(x,F,R):alert("\u041f\u0430\u0440\u043e\u043b\u0438 \u043d\u0435 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442"):alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u043f\u0430\u0440\u043e\u043b\u044f"):alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c")},children:[Object(u.jsx)("h2",{children:"\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f"}),Object(u.jsxs)(o.a,{children:["\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439, ",r]}),Object(u.jsx)("br",{}),Object(u.jsxs)(o.a,{children:["\u0412\u0430\u0448 \u0431\u0443\u0434\u0443\u0449\u0438\u0439 \u043b\u043e\u0433\u0438\u043d - ",e]}),Object(u.jsxs)(d.a,{style:{marginTop:"2em"},children:[Object(u.jsx)(o.a,{for:"pwEnter",children:"\u041f\u0430\u0440\u043e\u043b\u044c"}),Object(u.jsx)(b.a,{invalid:!M,type:"password",name:"password",id:"pwEnter",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c",onChange:function(e){P(e.target.value)}}),Object(u.jsx)(y.a,{children:"\u041f\u0430\u0440\u043e\u043b\u044c \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0431\u044b\u0442\u044c \u043f\u0443\u0441\u0442\u043e\u0439"})]}),Object(u.jsxs)(d.a,{style:{marginTop:"2em"},children:[Object(u.jsx)(o.a,{for:"pwConfirm",children:"\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c"}),Object(u.jsx)(b.a,{invalid:z>0,type:"password",name:"password",id:"pwConfirm",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c",onChange:function(e){A(e.target.value)}}),1===z&&Object(u.jsx)(y.a,{children:"\u041f\u0430\u0440\u043e\u043b\u044c \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0431\u044b\u0442\u044c \u043f\u0443\u0441\u0442\u043e\u0439"}),2===z&&Object(u.jsx)(y.a,{children:"\u041f\u0430\u0440\u043e\u043b\u0438 \u043e\u0442\u043b\u0438\u0447\u0430\u044e\u0442\u0441\u044f"})]}),Object(u.jsx)(h.a,{style:{marginTop:"10%",width:"100%"},type:"submit",children:"\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f"}),Object(u.jsx)(h.a,{style:{marginTop:"10%",width:"100%"},onClick:function(){return t.push("/login")},children:"\u041d\u0430\u0437\u0430\u0434"})]}):Object(u.jsxs)(l.a,{children:[Object(u.jsx)("h1",{style:{textAlign:"center"},children:"\u041e\u0448\u0438\u0431\u043b\u0438\u0441\u044c \u0441\u0441\u044b\u043b\u043a\u043e\u0439?"}),Object(u.jsx)(h.a,{style:{marginTop:"10%",width:"100%"},onClick:function(){return t.push("/login")},children:"\u041d\u0430\u0437\u0430\u0434"})]})})}var k=c(128),S=c(129),C=c(135),N=c(136),T=c(138),E=c(137),B=c(126),F=c(127),P=c.p+"static/media/addSt.7ac91716.svg",D=c.p+"static/media/edit.cbb14456.svg",I=c.p+"static/media/exit.f6ba0030.svg",R=c.p+"static/media/give_task.cee06c92.svg",A=c(4),L=c.n(A),J=c(130),M=c(131);function U(e){var t=e.student;return Object(u.jsx)("div",{children:t.id})}function _(e){var t=e.student,c=Object(n.useState)(1),a=Object(m.a)(c,2),r=a[0],s=a[1],i=function(e){r!==e&&s(e)};return Object(u.jsxs)(B.a,{children:[Object(u.jsxs)(F.a,{tabs:!0,style:{marginBottom:"25px",flexDirection:"column"},children:[Object(u.jsx)(k.a,{style:{width:"100%",textAlign:"center"},children:Object(u.jsx)(S.a,{className:L()({active:1===r}),style:1===r?{color:"#fff",backgroundColor:"#343a40"}:{},onClick:function(){i(1)},children:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430"})}),Object(u.jsx)(k.a,{style:{width:"100%",textAlign:"center"},children:Object(u.jsx)(S.a,{className:L()({active:2===r}),style:2===r?{color:"#fff",backgroundColor:"#343a40"}:{},onClick:function(){i(2)},children:"\u0417\u0430\u0434\u0430\u043d\u0438\u044f"})})]}),Object(u.jsxs)(J.a,{activeTab:r,children:[Object(u.jsx)(M.a,{tabId:1,children:Object(u.jsx)(U,{student:t})}),Object(u.jsx)(M.a,{tabId:2,children:t.stName})]})]})}var q=c(139),z=c(132),G=c(133),H=c(134);function K(e){var t=e.isOpen,c=e.toggle,a=Object(n.useState)(""),r=Object(m.a)(a,2),s=r[0],i=r[1],j=Object(n.useState)(""),O=Object(m.a)(j,2),x=O[0],p=O[1];return Object(u.jsx)(q.a,{isOpen:t,toggle:c,children:Object(u.jsxs)(l.a,{onSubmit:function(e){e.preventDefault(),""!==s?function(){if(""===s)return;v.a.post("https://6099651699011f0017140ca7.mockapi.io/students",{StName:s}).then((function(e){console.log(e.data.id),p("".concat(window.location.origin+"/register?id="+e.data.id))})).catch((function(e){console.log(e)}))}():alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f")},children:[Object(u.jsx)(z.a,{children:"\u0414\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u0430"}),Object(u.jsx)(G.a,{children:Object(u.jsxs)(d.a,{children:[Object(u.jsx)(o.a,{for:"fullname",children:"\u0418\u043c\u044f \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u0430"}),Object(u.jsx)(b.a,{type:"textarea",id:"fullname",style:{height:"80px"},onChange:function(e){return i(e.target.value)},placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0424\u0418\u041e \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u0430"}),Object(u.jsx)("br",{}),0!==x.length&&Object(u.jsxs)(o.a,{onClick:function(){navigator.clipboard.writeText(x)},children:["\u0421\u0441\u044b\u043b\u043a\u0430-\u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435 (\u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u0434\u043b\u044f \u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f): ",x]})]})}),Object(u.jsxs)(H.a,{children:[Object(u.jsx)(h.a,{onClick:c,className:"redBtn",style:{float:"left"},children:"\u041e\u0442\u043c\u0435\u043d\u0430"}),Object(u.jsx)(h.a,{type:"submit",style:{float:"right"},children:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u0430"})]})]})})}function Q(){var e=Object(n.useState)(-1),t=Object(m.a)(e,2),c=t[0],a=t[1],r=Object(n.useState)([]),s=Object(m.a)(r,2),i=s[0],j=s[1],l=Object(n.useState)(!1),d=Object(m.a)(l,2),o=d[0],b=d[1],h=function(){return b(!o)};Object(n.useEffect)((function(){(function(){var e=Object(f.a)(p.a.mark((function e(){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O();case 2:t=e.sent,j(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]);var O=function(){var e=Object(f.a)(p.a.mark((function e(){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v.a.get("https://6099651699011f0017140ca7.mockapi.io/students/");case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),x=function(){return Object(u.jsx)(u.Fragment,{children:i.map((function(e){return Object(u.jsx)(k.a,{className:c===e.id&&"chosenSidebar",children:Object(u.jsx)(S.a,{onClick:function(){return a(e.id)},children:e.stName})},e.id)}))})};return Object(u.jsxs)("div",{children:[Object(u.jsxs)(C.a,{color:"dark",dark:!0,children:[Object(u.jsx)(N.a,{href:"/",children:"\u041b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442"}),Object(u.jsxs)("div",{className:"iconRow",children:[Object(u.jsx)("img",{src:R,alt:"\u0412\u044b\u0434\u0430\u0442\u044c \u0437\u0430\u0434\u0430\u043d\u0438\u044f",id:"giveic"}),Object(u.jsx)("img",{src:D,alt:"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0431\u0430\u0437\u0443 \u0437\u0430\u0434\u0430\u043d\u0438\u0439",id:"editic"}),Object(u.jsx)("img",{src:P,alt:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u0430",id:"addst",onClick:h}),Object(u.jsx)("img",{src:I,alt:"\u0412\u044b\u0439\u0442\u0438",id:"exitic"}),Object(u.jsx)(T.a,{placement:"bottom",target:"addst",children:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u0430"}),Object(u.jsx)(T.a,{placement:"bottom",target:"editic",children:"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0431\u0430\u0437\u0443 \u0437\u0430\u0434\u0430\u043d\u0438\u0439"}),Object(u.jsx)(T.a,{placement:"bottom",target:"giveic",children:"\u0412\u044b\u0434\u0430\u0442\u044c \u0437\u0430\u0434\u0430\u043d\u0438\u044f"}),Object(u.jsx)(T.a,{placement:"bottom",target:"exitic",children:"\u0412\u044b\u0439\u0442\u0438"})]})]}),Object(u.jsxs)(E.a,{style:{marginRight:"0"},children:[Object(u.jsx)(B.a,{className:"sidebar",children:Object(u.jsxs)(F.a,{vertical:!0,children:[Object(u.jsx)(k.a,{children:Object(u.jsx)(S.a,{children:"\u0421\u043f\u0438\u0441\u043e\u043a \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u043e\u0432"})}),Object(u.jsx)(k.a,{children:Object(u.jsx)("div",{className:"dropdown-divider"})}),Object(u.jsx)(x,{})]})}),-1!==c?Object(u.jsx)(_,{student:i[c]}):Object(u.jsx)(B.a,{className:"notChosenPlaceholder",children:Object(u.jsx)("p",{children:"\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441\u043b\u0435\u0432\u0430 \u0434\u043b\u044f \u043d\u0430\u0447\u0430\u043b\u0430 \u0440\u0430\u0431\u043e\u0442\u044b"})})]}),Object(u.jsx)(K,{isOpen:o,toggle:h})]})}function V(){return Object(u.jsx)("div",{children:Object(u.jsxs)(C.a,{color:"dark",dark:!0,children:[Object(u.jsx)(N.a,{href:"/",children:"\u041b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442"}),Object(u.jsxs)("div",{className:"iconRow",children:[Object(u.jsx)(i.b,{id:"tasktxt",to:"/student",style:{color:"white",paddingTop:"2px"},children:"\u0417\u0430\u0434\u0430\u043d\u0438\u044f"}),Object(u.jsx)(T.a,{placement:"bottom",target:"tasktxt",children:"\u0420\u0435\u0448\u0430\u0439\u0442\u0435 \u0437\u0430\u0434\u0430\u043d\u0438\u044f, \u0432\u044b\u0434\u0430\u043d\u043d\u044b\u0435 \u043f\u0440\u0435\u043f\u043e\u0434\u0430\u0432\u0430\u0442\u0435\u043b\u0435\u043c"}),Object(u.jsx)("img",{src:I,alt:"\u0412\u044b\u0439\u0442\u0438",id:"exitic"}),Object(u.jsx)(T.a,{placement:"bottom",target:"exitic",children:"\u0412\u044b\u0439\u0442\u0438"})]})]})})}var W=c.p+"static/media/plus.11fdb7a9.svg";function X(e){var t=e.theory;void 0===t&&(t={title:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u043c\u044b",id:"0",text:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0430"});var c=Object(n.useState)(""),a=Object(m.a)(c,2),r=a[0],s=a[1],i=Object(n.useState)(""),j=Object(m.a)(i,2),O=j[0],x=j[1];return Object(u.jsx)(B.a,{children:Object(u.jsxs)(l.a,{onSubmit:function(e){e.preventDefault(),console.log(t.id,r,O),r||alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u043e\u0440\u0438\u0438!"),O||alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0442\u0435\u043e\u0440\u0438\u0438!")},style:{marginTop:"10px"},children:[Object(u.jsxs)(d.a,{children:[Object(u.jsx)(o.a,{for:"title",children:"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u043c\u044b"}),Object(u.jsx)(b.a,{type:"textarea",placeholder:t.title,onChange:function(e){return s(e.target.value)}})]}),Object(u.jsxs)(d.a,{children:[Object(u.jsx)(o.a,{for:"title",children:"\u0422\u0435\u043a\u0441\u0442 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0430"}),Object(u.jsx)(b.a,{type:"textarea",placeholder:t.text,onChange:function(e){return x(e.target.value)},style:{height:"500px"}})]}),Object(u.jsx)("br",{}),"0"!==t.id&&Object(u.jsx)(h.a,{type:"submit",className:"redBtn",children:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0442\u0435\u043e\u0440\u0438\u044e"}),Object(u.jsx)(h.a,{type:"submit",style:{float:"right"},children:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u0435\u043e\u0440\u0438\u044e"})]})})}function Y(e){var t=e.task;void 0===t&&(t={id:"0",text:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0437\u0430\u0434\u0430\u043d\u0438\u044f",answer:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043e\u0442\u0432\u0435\u0442",isOpen:!1,difficulty:2});var c=Object(n.useState)(""),a=Object(m.a)(c,2),r=a[0],s=a[1],i=Object(n.useState)(t.isOpen),j=Object(m.a)(i,2),O=j[0],x=j[1],p=Object(n.useState)(["\u0411\u0430\u0437\u043e\u0432\u044b\u0439","\u041f\u0440\u043e\u0434\u0432\u0438\u043d\u0443\u0442\u044b\u0439","\u0412\u044b\u0441\u043e\u043a\u0438\u0439"][t.difficulty]),f=Object(m.a)(p,2),g=f[0],v=f[1],y=Object(n.useState)(""),w=Object(m.a)(y,2),k=w[0],S=w[1];return Object(u.jsx)(B.a,{children:Object(u.jsxs)(l.a,{onSubmit:function(e){e.preventDefault(),console.log(t.id,r,O,g,k),r||alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0437\u0430\u0434\u0430\u043d\u0438\u044f!"),k||O||alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043e\u0442\u0432\u0435\u0442 \u043d\u0430 \u0437\u0430\u0434\u0430\u043d\u0438\u0435!"),O&&k&&S("")},style:{marginTop:"10px"},children:[Object(u.jsxs)(d.a,{children:[Object(u.jsx)(o.a,{for:"diff",children:"\u0421\u043b\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u0437\u0430\u0434\u0430\u043d\u0438\u044f"}),Object(u.jsxs)(b.a,{type:"select",id:"diff",onChange:function(e){return v(e.target.value)},children:[Object(u.jsx)("option",{children:"\u0411\u0430\u0437\u043e\u0432\u044b\u0439"}),Object(u.jsx)("option",{children:"\u041f\u0440\u043e\u0434\u0432\u0438\u043d\u0443\u0442\u044b\u0439"}),Object(u.jsx)("option",{children:"\u0412\u044b\u0441\u043e\u043a\u0438\u0439"})]})]}),Object(u.jsxs)(d.a,{children:[Object(u.jsx)(o.a,{for:"text",children:"\u0422\u0435\u043a\u0441\u0442 \u0437\u0430\u0434\u0430\u043d\u0438\u044f"}),Object(u.jsx)(b.a,{type:"textarea",placeholder:t.text,id:"text",style:{height:"250px"},onChange:function(e){return s(e.target.value)}})]}),Object(u.jsx)(d.a,{check:!0,inline:!0,style:{marginBottom:"25px"},children:Object(u.jsxs)(o.a,{check:!0,children:[Object(u.jsx)(b.a,{type:"checkbox",value:O,onChange:function(e){return x(e.currentTarget.checked)}}),"\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0439 \u0432\u043e\u043f\u0440\u043e\u0441 (\u043e\u0442\u0432\u0435\u0442 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043f\u0440\u0435\u043f\u043e\u0434\u0430\u0432\u0430\u0442\u0435\u043b\u044e)"]})}),!O&&Object(u.jsxs)(d.a,{children:[Object(u.jsx)(o.a,{for:"answ",children:"\u041e\u0442\u0432\u0435\u0442 \u043d\u0430 \u0437\u0430\u0434\u0430\u043d\u0438\u0435"}),Object(u.jsx)(b.a,{type:"textarea",placeholder:t.answer,id:"answ",style:{height:"250px"},onChange:function(e){return S(e.target.value)}})]}),Object(u.jsx)("br",{}),"0"!==t.id&&Object(u.jsx)(h.a,{type:"submit",className:"redBtn",children:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0437\u0430\u0434\u0430\u043d\u0438\u0435"}),Object(u.jsx)(h.a,{type:"submit",style:{float:"right"},children:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u0434\u0430\u043d\u0438\u0435"})]})})}function Z(){var e=Object(n.useState)([]),t=Object(m.a)(e,2),c=t[0],a=t[1],r=Object(n.useState)([]),s=Object(m.a)(r,2),i=s[0],j=s[1],l=Object(n.useState)(-1),d=Object(m.a)(l,2),o=d[0],b=d[1],h=Object(n.useState)(-1),O=Object(m.a)(h,2),x=O[0],g=O[1],y=Object(n.useState)(1),w=Object(m.a)(y,2),C=w[0],N=w[1],P=function(e){b(-1),g(-1),C!==e&&N(e)};Object(n.useEffect)((function(){(function(){var e=Object(f.a)(p.a.mark((function e(){var t,c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,D();case 2:return t=e.sent,e.next=5,I();case 5:c=e.sent,a(c),j(t);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]);var D=function(){var e=Object(f.a)(p.a.mark((function e(){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v.a.get("https://6099651699011f0017140ca7.mockapi.io/theories/");case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),I=function(){var e=Object(f.a)(p.a.mark((function e(){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v.a.get("https://6099651699011f0017140ca7.mockapi.io/tasks/");case 2:return(t=e.sent).data.forEach((function(e){e.id++})),e.abrupt("return",t.data);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),R=function(){return Object(u.jsx)(u.Fragment,{children:c.map((function(e){return Object(u.jsxs)(k.a,{className:o===e.id?"chosenSidebar":"",children:[Object(u.jsx)(S.a,{onClick:function(){return b(e.id)},id:"tooltip"+e.id,children:e.text.length>50?"".concat(e.text.substring(0,50),"..."):e.text}),Object(u.jsx)(T.a,{placement:"bottom",target:"tooltip"+e.id,children:e.text})]},e.id)}))})},A=function(){return Object(u.jsx)(u.Fragment,{children:i.map((function(e){return Object(u.jsx)(k.a,{className:x===e.id?"chosenSidebar":"",children:Object(u.jsx)(S.a,{onClick:function(){return g(e.id)},children:e.title})},e.id)}))})};return Object(u.jsxs)("div",{children:[Object(u.jsxs)(F.a,{tabs:!0,style:{marginBottom:"25px",flexDirection:"column"},children:[Object(u.jsx)(k.a,{style:{width:"100%",textAlign:"center"},children:Object(u.jsx)(S.a,{className:L()({active:1===C}),style:1===C?{color:"#fff",backgroundColor:"#343a40"}:{},onClick:function(){P(1)},children:"\u0417\u0430\u0434\u0430\u043d\u0438\u044f"})}),Object(u.jsx)(k.a,{style:{width:"100%",textAlign:"center"},children:Object(u.jsx)(S.a,{className:L()({active:2===C}),style:2===C?{color:"#fff",backgroundColor:"#343a40"}:{},onClick:function(){P(2)},children:"\u0422\u0435\u043e\u0440\u0438\u044f"})})]}),Object(u.jsxs)(J.a,{activeTab:C,children:[Object(u.jsx)(M.a,{tabId:1,children:Object(u.jsxs)(E.a,{style:{marginRight:"0"},children:[Object(u.jsx)(B.a,{className:"sidebar",children:Object(u.jsxs)(F.a,{vertical:!0,children:[Object(u.jsx)(k.a,{className:0===o&&"chosenSidebar",children:Object(u.jsxs)(S.a,{onClick:function(){return b(0)},children:[Object(u.jsx)("img",{alt:" ",src:W}),Object(u.jsx)("span",{children:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u043e\u0435 \u0437\u0430\u0434\u0430\u043d\u0438\u0435"})]})}),Object(u.jsx)(k.a,{children:Object(u.jsx)("div",{className:"dropdown-divider"})}),Object(u.jsx)(R,{})]})}),-1!==o?Object(u.jsx)(Y,{task:c[o-1]}):Object(u.jsx)(B.a,{className:"notChosenPlaceholder",children:Object(u.jsx)("p",{children:"\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441\u043b\u0435\u0432\u0430 \u0434\u043b\u044f \u043d\u0430\u0447\u0430\u043b\u0430 \u0440\u0430\u0431\u043e\u0442\u044b"})})]})}),Object(u.jsx)(M.a,{tabId:2,children:Object(u.jsxs)(E.a,{style:{marginRight:"0"},children:[Object(u.jsx)(B.a,{className:"sidebar",children:Object(u.jsxs)(F.a,{vertical:!0,children:[Object(u.jsx)(k.a,{className:0===x&&"chosenSidebar",children:Object(u.jsxs)(S.a,{onClick:function(){return g(0)},children:[Object(u.jsx)("img",{alt:" ",src:W}),Object(u.jsx)("span",{children:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0442\u0435\u043e\u0440\u0435\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b"})]})}),Object(u.jsx)(k.a,{children:Object(u.jsx)("div",{className:"dropdown-divider"})}),Object(u.jsx)(A,{})]})}),-1!==x?Object(u.jsx)(X,{theory:i[x-1]}):Object(u.jsx)(B.a,{className:"notChosenPlaceholder",children:Object(u.jsx)("p",{children:"\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441\u043b\u0435\u0432\u0430 \u0434\u043b\u044f \u043d\u0430\u0447\u0430\u043b\u0430 \u0440\u0430\u0431\u043e\u0442\u044b"})})]})})]})]})}var $=function(){return Object(u.jsxs)(i.a,{children:[Object(u.jsxs)("ul",{children:[Object(u.jsx)("li",{children:Object(u.jsx)(i.b,{to:"/",children:"teacher"})}),Object(u.jsx)("li",{children:Object(u.jsx)(i.b,{to:"/login",children:"login "})}),Object(u.jsx)("li",{children:Object(u.jsx)(i.b,{to:"/register",children:"reg"})}),Object(u.jsx)("li",{children:Object(u.jsx)(i.b,{to:"/student",children:"student"})}),Object(u.jsx)("li",{children:Object(u.jsx)(i.b,{to:"/base",children:"base"})})]}),Object(u.jsx)("div",{style:{height:"90%"},children:Object(u.jsxs)(j.c,{children:[Object(u.jsx)(j.a,{path:"/login",children:Object(u.jsx)(O,{})}),Object(u.jsx)(j.a,{path:"/register",children:Object(u.jsx)(w,{})}),Object(u.jsx)(j.a,{path:"/student",children:Object(u.jsx)(V,{})}),Object(u.jsx)(j.a,{path:"/base",children:Object(u.jsx)(Z,{})}),Object(u.jsx)(j.a,{path:"/",children:Object(u.jsx)(Q,{})})]})})]})},ee=function(e){e&&e instanceof Function&&c.e(3).then(c.bind(null,140)).then((function(t){var c=t.getCLS,n=t.getFID,a=t.getFCP,r=t.getLCP,s=t.getTTFB;c(e),n(e),a(e),r(e),s(e)}))};s.a.render(Object(u.jsx)(a.a.StrictMode,{children:Object(u.jsx)($,{})}),document.getElementById("root")),ee()},69:function(e,t,c){}},[[118,1,2]]]);
//# sourceMappingURL=main.642d12e7.chunk.js.map