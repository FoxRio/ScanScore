(function(){"use strict";var e={956:function(e,t,n){var s=n(7764),o=n(4108),r=n(9096);const i=(0,o.QD)("h2",null,"Sveiks, roland. Deploy test 3",-1),a={class:"description"};function l(e,t,n,s,l,c){const u=(0,o.E1)("CreateTest"),d=(0,o.E1)("GradeTest");return(0,o.Wz)(),(0,o.An)(o.ae,null,[(0,o.QD)("div",null,[(0,o.QD)("h1",null,(0,r.WA)(l.title),1),i]),(0,o.QD)("div",a,[(0,o.QD)("p",null,(0,r.WA)(l.appDescription),1)]),(0,o.QD)("div",null,[l.creatingTest||l.gradingTest?(0,o.g1)("",!0):((0,o.Wz)(),(0,o.An)("button",{key:0,onClick:t[0]||(t[0]=(...e)=>c.openCreating&&c.openCreating(...e))},"Create new test")),l.gradingTest||l.creatingTest?(0,o.g1)("",!0):((0,o.Wz)(),(0,o.An)("button",{key:1,onClick:t[1]||(t[1]=(...e)=>c.openGrading&&c.openGrading(...e))},"Grade existing test"))]),l.creatingTest&&!l.gradingTest?((0,o.Wz)(),(0,o.Az)(u,{key:0,onCollapse:c.handleCollapse},null,8,["onCollapse"])):(0,o.g1)("",!0),l.gradingTest&&!l.creatingTest?((0,o.Wz)(),(0,o.Az)(d,{key:1,onCollapse:c.handleCollapse},null,8,["onCollapse"])):(0,o.g1)("",!0)],64)}const c={class:"createNewTest"},u=(0,o.QD)("div",{class:"description"},[(0,o.QD)("p",null,"Here you can create a new Test that will be outputed as a .docx download")],-1),d={class:"documentForm"},h=(0,o.QD)("div",null,null,-1);function p(e,t,n,s,r,i){const a=(0,o.E1)("FormComponent");return(0,o.Wz)(),(0,o.An)(o.ae,null,[(0,o.QD)("div",c,[(0,o.QD)("div",null,[(0,o.QD)("button",{onClick:t[0]||(t[0]=(...e)=>i.collapse&&i.collapse(...e)),class:"collapse"},"collapse")]),u,(0,o.QD)("div",d,[(0,o.K2)(a)])]),(0,o.QD)("div",null,[r.testHasQuestions?((0,o.Wz)(),(0,o.An)("button",{key:0,onClick:t[1]||(t[1]=(...e)=>i.generateDocument&&i.generateDocument(...e))},"Generate Document")):(0,o.g1)("",!0)]),h],64)}var w=n(6860),g=n(8696);const m={class:"createDocumentForm"},f=["for"],D=["id","name"],Q={class:"answer-container"},v={for:"answer1"},T={for:"correctanswer1"},C={for:"answer2"},k={for:"correctanswer2"},b={for:"answer3"},y={for:"correctanswer3"},x={for:"answer4"},A={for:"correctanswer4"};function q(e,t,n,r,i,a){const l=(0,o.E1)("NewQuestion");return(0,o.Wz)(),(0,o.An)("div",m,[(0,o.QD)("form",{onSubmit:t[10]||(t[10]=(0,s.Y7)(((...e)=>a.addNewQuestionPrompt&&a.addNewQuestionPrompt(...e)),["prevent"])),id:"createNewDocumentForm"},[(0,o.QD)("label",{for:e.id,class:"question-label"},[(0,o.mY)("Please enter Question: "),(0,o.wt)((0,o.QD)("textarea",{id:e.name,name:e.name,required:"",placeholder:"Write your question here...","onUpdate:modelValue":t[0]||(t[0]=e=>i.questionText=e),class:"question-textarea"},null,8,D),[[s.Og,i.questionText]])],8,f),(0,o.QD)("div",Q,[(0,o.QD)("label",v,[(0,o.mY)(" Answer: "),(0,o.wt)((0,o.QD)("input",{type:" text",id:"answer1",name:"answer1","onUpdate:modelValue":t[1]||(t[1]=e=>i.answer1=e)},null,512),[[s.Og,i.answer1]]),(0,o.QD)("label",T,[(0,o.mY)("This is the correct answer "),(0,o.wt)((0,o.QD)("input",{type:"checkbox",id:"correctanswer1","onUpdate:modelValue":t[2]||(t[2]=e=>i.isChecked1=e)},null,512),[[s.cV,i.isChecked1]])])]),(0,o.QD)("label",C,[(0,o.mY)(" Answer: "),(0,o.wt)((0,o.QD)("input",{type:" text",id:"answer1",name:"answer2","onUpdate:modelValue":t[3]||(t[3]=e=>i.answer2=e),required:""},null,512),[[s.Og,i.answer2]]),(0,o.QD)("label",k,[(0,o.mY)("This is the correct answer "),(0,o.wt)((0,o.QD)("input",{type:"checkbox",id:"correctanswer2","onUpdate:modelValue":t[4]||(t[4]=e=>i.isChecked2=e)},null,512),[[s.cV,i.isChecked2]])])]),(0,o.QD)("label",b,[(0,o.mY)(" Answer: "),(0,o.wt)((0,o.QD)("input",{type:" text",id:"answer3",name:"answer3","onUpdate:modelValue":t[5]||(t[5]=e=>i.answer3=e),required:""},null,512),[[s.Og,i.answer3]]),(0,o.QD)("label",y,[(0,o.mY)("This is the correct answer "),(0,o.wt)((0,o.QD)("input",{type:"checkbox",id:"correctanswer3","onUpdate:modelValue":t[6]||(t[6]=e=>i.isChecked3=e)},null,512),[[s.cV,i.isChecked3]])])]),(0,o.QD)("label",x,[(0,o.mY)(" Answer: "),(0,o.wt)((0,o.QD)("input",{type:" text",id:"answer4",name:"answer4","onUpdate:modelValue":t[7]||(t[7]=e=>i.answer4=e),required:""},null,512),[[s.Og,i.answer4]]),(0,o.QD)("label",A,[(0,o.mY)("This is the correct answer "),(0,o.wt)((0,o.QD)("input",{type:"checkbox",id:"correctanswer4","onUpdate:modelValue":t[8]||(t[8]=e=>i.isChecked4=e)},null,512),[[s.cV,i.isChecked4]])])])]),(0,o.QD)("button",{type:"button",onClick:t[9]||(t[9]=(...e)=>a.addNewQuestionPrompt&&a.addNewQuestionPrompt(...e))},"Add This Question")],32),((0,o.Wz)(!0),(0,o.An)(o.ae,null,(0,o.mi)(i.questions,((e,t)=>((0,o.Wz)(),(0,o.An)("div",{key:t},[(0,o.K2)(l,{questionData:e,onDeleteEvent:e=>a.deleteQuestion(t)},null,8,["questionData","onDeleteEvent"])])))),128))])}n(3248);const W={class:"question-container"};function z(e,t,n,s,i,a){return(0,o.Wz)(),(0,o.An)("div",W,[(0,o.QD)("p",null,(0,r.WA)(n.questionData.questionText),1),((0,o.Wz)(!0),(0,o.An)(o.ae,null,(0,o.mi)(n.questionData.answers,((e,t)=>((0,o.Wz)(),(0,o.An)("div",{key:t,class:(0,r.WN)({"correct-answer":e.correct})},(0,r.WA)(e.text),3)))),128)),(0,o.QD)("button",{onClick:t[0]||(t[0]=(...e)=>a.deleteQuestion&&a.deleteQuestion(...e)),class:"delete-button"},"Delete")])}var O={props:["questionData"],methods:{deleteQuestion(){this.$emit("deleteEvent")}}},S=n(4100);const V=(0,S.c)(O,[["render",z],["__scopeId","data-v-0373d74c"]]);var E=V,N={components:{NewQuestion:E},data(){return{questionText:null,answer1:null,answer2:null,answer3:null,answer4:null,isChecked1:!1,isChecked2:!1,isChecked3:!1,isChecked4:!1,testHasQuestions:!1,questions:[]}},methods:{collapse(){this.$emit("collapse")},deleteQuestion(e){console.log("deleteQuestion",e),this.questions.splice(e,1),console.log(this.questions)},addNewQuestionPrompt(){if(this.questionText&&(this.answer1||this.answer2||this.answer3||this.answer4)){const e={questionText:this.questionText,answers:{answer1:{text:this.answer1,correct:this.isChecked1},answer2:{text:this.answer2,correct:this.isChecked2},answer3:{text:this.answer3,correct:this.isChecked3},answer4:{text:this.answer4,correct:this.isChecked4}}};this.testHasQuestions=!0,this.questions.push(e),this.questionText=null,this.answer1=null,this.answer2=null,this.answer3=null,this.answer4=null,this.isChecked1=!1,this.isChecked2=!1,this.isChecked3=!1,this.isChecked4=!1}alert("Question Not Added, Please input a question text and at least one answer!")},async handleSubmit(){const e=document.getElementById("createNewDocumentForm"),t=new FormData(e);t.forEach(((e,t)=>{console.log(`${t}: ${e}`)}))}}};const U=(0,S.c)(N,[["render",q]]);var Y=U,P={components:{FormComponent:Y},data(){return{testHasQuestions:!1,questions:[]}},methods:{collapse(){this.$emit("collapse")},async generateDocument(){const e=new w.a8b({sections:[{properties:{},children:[new w.gZ6({children:[new w.CMd("Dear User,")]}),new w.gZ6({children:[new w.CMd("\nBest regards,"),new w.CMd("\nThose who are now in your walls")]})]}]});try{w.ErA.toBlob(e).then((e=>{(0,g.saveAs)(e,"pipebomb.docx")}))}catch(t){console.error("Error generating document:",t)}}}};const F=(0,S.c)(P,[["render",p]]);var G=F;const j={class:"gradeTest"},H=(0,o.QD)("p",null,"Here you can grade a Test",-1);function $(e,t,n,s,r,i){return(0,o.Wz)(),(0,o.An)("div",j,[(0,o.QD)("div",null,[(0,o.QD)("button",{onClick:t[0]||(t[0]=(...e)=>i.collapse&&i.collapse(...e)),class:"collapse"},"collapse")]),H])}var M={data(){},methods:{collapse(){this.$emit("collapse")}}};const _=(0,S.c)(M,[["render",$]]);var B=_,I={name:"App",components:{CreateTest:G,GradeTest:B},data(){return{creatingTest:!1,gradingTest:!1,title:"Scan App",appDescription:"Short description of what this is. Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is."}},methods:{openCreating(){this.creatingTest=!0,console.log("creatingTest",this.creatingTest),console.log("gradingTest",this.gradingTest)},openGrading(){this.gradingTest=!0,console.log("creatingTest",this.creatingTest),console.log("gradingTest",this.gradingTest)},handleCollapse(){this.creatingTest=!1,this.gradingTest=!1,console.log("creatingTest",this.creatingTest),console.log("gradingTest",this.gradingTest)}}};const K=(0,S.c)(I,[["render",l]]);var Z=K;(0,s.W0)(Z).mount("#app")}},t={};function n(s){var o=t[s];if(void 0!==o)return o.exports;var r=t[s]={exports:{}};return e[s].call(r.exports,r,r.exports,n),r.exports}n.m=e,function(){var e=[];n.O=function(t,s,o,r){if(!s){var i=1/0;for(u=0;u<e.length;u++){s=e[u][0],o=e[u][1],r=e[u][2];for(var a=!0,l=0;l<s.length;l++)(!1&r||i>=r)&&Object.keys(n.O).every((function(e){return n.O[e](s[l])}))?s.splice(l--,1):(a=!1,r<i&&(i=r));if(a){e.splice(u--,1);var c=o();void 0!==c&&(t=c)}}return t}r=r||0;for(var u=e.length;u>0&&e[u-1][2]>r;u--)e[u]=e[u-1];e[u]=[s,o,r]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,s){var o,r,i=s[0],a=s[1],l=s[2],c=0;if(i.some((function(t){return 0!==e[t]}))){for(o in a)n.o(a,o)&&(n.m[o]=a[o]);if(l)var u=l(n)}for(t&&t(s);c<i.length;c++)r=i[c],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(u)},s=self["webpackChunkScanApp"]=self["webpackChunkScanApp"]||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))}();var s=n.O(void 0,[999],(function(){return n(956)}));s=n.O(s)})();
//# sourceMappingURL=app.30ed7c48.js.map