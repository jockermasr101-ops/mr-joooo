// live.js — الطبقة التفاعلية: طلبات الزوار، نشاط، لايكات، مكتبة ميديا، ولوحة تحكم موسّعة (تحتاج cp-shim.js + Firebase)
(function(){
if(!window.MJ)return;
var SV=function(d,w){return '<svg width="'+w+'" height="'+w+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
var HEART=SV('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',18),FILE=SV('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',34),LINK=SV('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',34);
var TY={video:['فيديو','Video'],image:['صورة','Image'],link:['لينك','Link'],file:['ملف','File']};
function ok(u){u=String(u||'').trim();return u.indexOf('..')<0&&/^(media\/|https:\/\/)/.test(u)?u:''}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
function track(t,id,m){try{MJ.add('events',{t:t,id:String(id||'').slice(0,60),lang:lang,m:String(m||'').slice(0,60)}).catch(function(){})}catch(e){}}
function fmt(d){return d?new Date(d).toLocaleString('ar-EG',{dateStyle:'short',timeStyle:'short'}):''}
cfg.media=cfg.media||[];
// ---- data model: media items live in the config doc
var _m=merge;merge=function(d){var r=_m(d);r.media=Array.isArray(d&&d.media)?d.media:[];return r};
function cm(m){if(!m)return null;var t=TY[m.type]?m.type:'link',u=ok(m.url);if(!u||(t==='link'&&u.indexOf('https://')!==0))return null;
  return{id:String(m.id||'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)).replace(/[^\w-]/g,'').slice(0,24),type:t,title:String(m.title||'').slice(0,100),url:u}}
var _c=cleanDr;cleanDr=function(){if(!_c())return false;dr.media=(dr.media||[]).slice(0,200).map(cm).filter(Boolean);return true};
// ---- visitor tracking
setTimeout(function(){if(ss('mjv'))return;ss('mjv','1');var h='';try{h=new URL(document.referrer).hostname}catch(e){}track('view','',h)},1500);
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a)return;if(a.id==='cwa')track('wa');else if(a.id==='ctg')track('tg');else if(a.id==='send')track('wa','calc')});
var _pick=pick;pick=function(i){var it=cur[i];track('search',nz(sq.value).slice(0,40),it&&it.t);_pick(i)};
// ---- likes inside the work viewer
var _ol=openLb;openLb=function(i,el){_ol(i,el);var w=cfg.works[i];if(!w)return;track('work',w.id,tx(w,'t'));
  var b=document.createElement('button');b.className='likeb';b.innerHTML=HEART+'<span>·</span>';lbc.appendChild(b);var k='lk_'+w.id,n=0,sp=b.querySelector('span');
  function sh(){sp.textContent=n;b.classList.toggle('on',!!ls(k))}
  MJ.likes(w.id).then(function(x){n=x;sh()}).catch(function(){sp.textContent=''});
  b.onclick=function(){if(ls(k))return;ls(k,'1');n++;sh();MJ.like(w.id).then(function(){track('like',w.id,tx(w,'t'))}).catch(function(){n--;try{localStorage.removeItem(k)}catch(e){}sh()})}};
// ---- media library (public section)
var sec=$('#library'),grid=$('#lgrid'),chips=$('#lchips'),man=[],lf='all',shown=[];
function all(){var a=cfg.media||[];return a.concat(man.filter(function(x){return !a.some(function(y){return y.url===x.url})}))}
function card(m,i){var t=esc(m.title||m.url.split('/').pop()),u=esc(m.url),tp=TY[m.type][lang==='ar'?0:1];
  var th=m.type==='image'?'<img loading="lazy" alt="" src="'+u+'">':m.type==='video'?'<video preload="metadata" muted playsinline src="'+u+'#t=0.6"></video><i class="pl"></i>':'<div class="ic">'+(m.type==='file'?FILE:LINK)+'</div>';
  var in_=th+'<div class="lt"><b>'+t+'</b><small>'+tp+'</small></div>';
  return (m.type==='image'||m.type==='video')?'<button class="lc" data-i="'+i+'">'+in_+'</button>':'<a class="lc" href="'+u+'" target="_blank" rel="noopener">'+in_+'</a>'}
function rl(){var a=all(),was=sec.hidden;sec.hidden=!a.length;$$('#menu a[href="#library"]').forEach(function(l){l.hidden=!a.length});
  var ts=Object.keys(TY).filter(function(t){return a.some(function(m){return m.type===t})});
  chips.innerHTML=ts.length>1?['all'].concat(ts).map(function(t){return '<button class="lchip" aria-pressed="'+(t===lf)+'" data-f="'+t+'">'+(t==='all'?T('الكل','All'):TY[t][lang==='ar'?0:1])+'</button>'}).join(''):'';
  shown=a.filter(function(m){return lf==='all'||m.type===lf});grid.innerHTML=shown.map(card).join('');if(was!==sec.hidden)buildNav()}
chips.onclick=function(e){var b=e.target.closest('[data-f]');if(b){lf=b.dataset.f;rl()}};
grid.onclick=function(e){var b=e.target.closest('button[data-i]');if(!b)return;var m=shown[+b.dataset.i];if(!m)return;opener=b;
  lbc.innerHTML=(m.type==='video'?'<video controls playsinline autoplay></video>':'<img alt="">')+'<b></b>';lbc.querySelector(m.type==='video'?'video':'img').src=m.url;lbc.querySelector('b').textContent=m.title||'';
  lb.hidden=false;document.documentElement.classList.add('lbo');$('#lbx').focus();paused=1;track('media',m.id,m.title)};
var _ra=renderAll;renderAll=function(){_ra();rl()};
fetch('media/library.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():[]}).then(function(a){man=(Array.isArray(a)?a:[]).map(cm).filter(Boolean);rl()}).catch(rl);rl();
$('#lang').addEventListener('click',function(){setTimeout(function(){rl();ph()},0)});
// ---- brief form
var bn=$('#bn'),bc=$('#bc'),bs=$('#bs'),bm=$('#bm'),bh=$('#bh'),bb=$('#bb'),bo=$('#bo');
function ph(){bn.placeholder=T('اسمك','Your name');bc.placeholder=T('واتساب أو إيميل','WhatsApp or email');bm.placeholder=T('احكيلي عن مشروعك...','Tell me about your project...')}ph();
bb.onclick=function(){bo.className='bo';if(bh.value)return;var n=bn.value.trim(),c=bc.value.trim(),m=bm.value.trim();
  if(n.length<2||c.length<5||m.length<3){bo.textContent=T('كمّل الاسم وطريقة التواصل والرسالة.','Please fill name, contact and message.');bo.className='bo er';return}
  if(Date.now()-(+ls('mjb')||0)<60000){bo.textContent=T('استنى دقيقة قبل ما تبعت تاني.','Please wait a minute before sending again.');bo.className='bo er';return}
  bb.disabled=true;MJ.add('inbox',{name:n.slice(0,80),contact:c.slice(0,100),service:bs.value.slice(0,40),msg:m.slice(0,1500),lang:lang,st:'new'}).then(function(){ls('mjb',String(Date.now()));track('form');bn.value=bc.value=bm.value='';
    var w=digits(cfg.contact.wa);bo.innerHTML=esc(T('وصلني طلبك، هرد عليك قريب.','Got it. I will reply soon.'))+(w?' <a href="https://wa.me/'+w+'" target="_blank" rel="noopener">'+esc(T('كلّمني واتساب','Chat on WhatsApp'))+'</a>':'');bo.className='bo okk'}).catch(function(){bo.textContent=T('حصلت مشكلة. جرّب تاني أو كلّمني واتساب.','Something went wrong. Try again or message me on WhatsApp.');bo.className='bo er'}).then(function(){bb.disabled=false})};
// ---- dashboard: inbox / activity / library
var inbox=[],evs=[],ifil='all',first=true,base=document.title;
var at=$('#atabs'),ov=at.querySelector('[data-t=overview]');
[['inbox','الطلبات'],['activity','النشاط'],['library','المكتبة']].reverse().forEach(function(x){var b=document.createElement('button');b.dataset.t=x[0];b.textContent=x[1];ov.insertAdjacentElement('afterend',b)});
function badge(){var n=inbox.filter(function(m){return m.st==='new'}).length,b=at.querySelector('[data-t=inbox]');b.textContent='الطلبات'+(n?' ('+n+')':'');document.title=(n?'('+n+') ':'')+base}
function beep(){try{var a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.05;o.start();o.stop(a.currentTime+.18)}catch(e){}}
function ts(o){var t=o.ts;o.d=t&&t.toDate?t.toDate():new Date();return o}
function start(){MJ.watch('inbox',200,function(a,ch){inbox=a.map(ts);badge();if(!first&&ch.some(function(c){return c.type==='added'}))beep();first=false;if(!adm.hidden&&tab==='inbox')redraw()});
  MJ.watch('events',400,function(a){evs=a.map(ts);if(!adm.hidden&&tab==='activity')redraw()})}
var iv=0,tries=0;iv=setInterval(function(){if(canAdm){clearInterval(iv);start()}else if(++tries>60)clearInterval(iv)},500);
function redraw(){var y=adm.scrollTop;draw();adm.scrollTop=y}
function row(m){var w=digits(m.contact),c=/@/.test(m.contact)?'mailto:'+encodeURI(m.contact):w.length>=8?'https://wa.me/'+w:'';
  return '<div class="ib"><div class="ih"><b>'+esc(m.name)+'</b><span class="pill '+(m.st==='new'?'wr':'ok')+'">'+({'new':'جديد',read:'اتقري',done:'تم'}[m.st]||esc(m.st))+'</span><small>'+fmt(m.d)+' · '+esc(m.service)+'</small></div><div class="im">'+esc(m.msg)+'</div><div class="qa"><span class="ct">'+esc(m.contact)+'</span>'+(c?'<a class="b2" target="_blank" rel="noopener" href="'+esc(c)+'">رد</a>':'')+(m.st==='new'?'<button class="b2" data-y="st:'+m.id+':read">اتقري</button>':'')+(m.st!=='done'?'<button class="b2" data-y="st:'+m.id+':done">تم</button>':'')+'<button class="b2" data-y="del:'+m.id+'">حذف</button></div></div>'}
function dInbox(){var L=inbox.filter(function(m){return ifil==='all'||m.st===ifil});
  return '<h3>الطلبات</h3><div class="qa">'+[['all','الكل'],['new','جديد'],['read','اتقري'],['done','تم']].map(function(f){return '<button class="b2" aria-pressed="'+(ifil===f[0])+'" data-y="f:'+f[0]+'">'+f[1]+'</button>'}).join('')+'</div>'+(L.length?L.map(row).join(''):'<p class="mt">مفيش طلبات هنا لسه. أي حد يبعت من فورم الموقع هيظهر هنا فورًا.</p>')}
function top(map,n){return Object.keys(map).sort(function(a,b){return map[b]-map[a]}).slice(0,n)}
function dAct(){var t0=new Date();t0.setHours(0,0,0,0);var V=evs.filter(function(e){return e.t==='view'}),cnt=function(t){return evs.filter(function(e){return e.t===t}).length};
  var wk={},sq_={},nm=function(id){var w=cfg.works.filter(function(x){return x.id===id})[0];return w?w.t[0]:id};
  evs.forEach(function(e){if(e.t==='work')wk[e.id]=(wk[e.id]||0)+1;if(e.t==='search'&&e.id)sq_[e.id]=(sq_[e.id]||0)+1});
  var days=[],mx=1;for(var i=6;i>=0;i--){var a=new Date(t0);a.setDate(a.getDate()-i);var b=new Date(a),n;b.setDate(b.getDate()+1);n=V.filter(function(e){return e.d>=a&&e.d<b}).length;mx=Math.max(mx,n);days.push([a.toLocaleDateString('ar-EG',{weekday:'short'}),n])}
  var bar=function(l,n,m){return '<div class="bar"><span>'+esc(l)+'</span><i><s style="width:'+Math.round(n/m*100)+'%"></s></i><b>'+n+'</b></div>'};
  var D={view:'زيارة',work:'فتح عمل',wa:'ضغط واتساب',tg:'ضغط تليجرام',search:'بحث',like:'إعجاب',form:'أرسل طلب',media:'فتح ملف'};
  var feed=evs.slice(0,25).map(function(e){var x=(e.t==='work'||e.t==='like')?nm(e.id):e.t==='search'?e.id:e.t==='media'?e.m:'';return '<li><small>'+fmt(e.d)+'</small> '+(D[e.t]||esc(e.t))+(x?': '+esc(x):'')+'</li>'}).join('');
  var tw=top(wk,5);
  return '<h3>النشاط</h3><div class="stats"><div class="stat"><big>'+V.filter(function(e){return e.d>=t0}).length+'</big><span>زيارات النهاردة</span></div><div class="stat"><big>'+cnt('wa')+'</big><span>ضغطات واتساب</span></div><div class="stat"><big>'+cnt('form')+'</big><span>طلبات اتبعتت</span></div><div class="stat"><big>'+cnt('like')+'</big><span>إعجابات</span></div></div>'
   +'<div class="bars"><b>الزيارات آخر 7 أيام</b>'+days.map(function(d){return bar(d[0],d[1],mx)}).join('')+'</div>'
   +(tw.length?'<div class="bars" style="margin-top:12px"><b>أكتر أعمال اتفتحت</b>'+tw.map(function(k){return bar(nm(k),wk[k],wk[tw[0]])}).join('')+'</div>':'')
   +(Object.keys(sq_).length?'<div class="bars" style="margin-top:12px"><b>اللي الناس بتدور عليه</b>'+top(sq_,6).map(function(k){return bar(k,sq_[k],sq_[top(sq_,1)[0]])}).join('')+'</div>':'')
   +'<h3 style="margin-top:1.2rem">آخر الحركات</h3><ul class="feed">'+(feed||'<li>لسه مفيش حركة.</li>')+'</ul><p class="mt">الأرقام من آخر 400 حدث. مفيش بيانات شخصية بتتسجل.</p>'}
function dLib(){var M=dr.media=dr.media||[],opt=function(s){return Object.keys(TY).map(function(k){return '<option value="'+k+'"'+(k===s?' selected':'')+'>'+TY[k][0]+'</option>'}).join('')};
  return '<h3>المكتبة</h3><p class="mt">الصق مسار ملف من فولدر <code>media/</code> (مثال: <code>media/reel.mp4</code>) أو لينك https، أو ارفع ملفات لـ Cloudinary. بعد أي تعديل دوس «حفظ ونشر».</p>'
   +M.map(function(m,i){return '<div class="lr"><select data-m="'+i+':type">'+opt(m.type)+'</select><input data-m="'+i+':title" value="'+esc(m.title)+'" placeholder="العنوان" maxlength="100"><input data-m="'+i+':url" value="'+esc(m.url)+'" dir="ltr" placeholder="media/file.mp4"><button class="b2" data-y="up:'+i+'" aria-label="up">'+SV('<path d="M6 15l6-6 6 6"/>',16)+'</button><button class="b2" data-y="dn:'+i+'" aria-label="down">'+SV('<path d="M6 9l6 6 6-6"/>',16)+'</button><button class="b2" data-y="rm:'+i+'" aria-label="delete">'+SV('<path d="M5 7h14M10 11v6M14 11v6M7 7l1 12h8l1-12M9 7V4h6v3"/>',16)+'</button></div>'}).join('')
   +'<div class="qa"><button class="b2" data-y="add">+ إضافة عنصر</button><label class="b2 ul">رفع ملفات (Cloudinary)<input type="file" id="lf" multiple hidden></label></div>'
   +(man.length?'<h3 style="margin-top:1.2rem">من <code>media/library.json</code> (قراءة بس)</h3>'+man.map(function(m){return '<div class="lr ro"><span>'+TY[m.type][0]+'</span><b>'+esc(m.title)+'</b><code>'+esc(m.url)+'</code></div>'}).join(''):'')}
var _d=draw;draw=function(){if(tab==='inbox'||tab==='activity'||tab==='library'){$$('#atabs button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.t===tab)});$('#admb').innerHTML=(tab==='inbox'?dInbox:tab==='activity'?dAct:dLib)()}else _d()};
$('#admb').addEventListener('click',function(e){var b=e.target.closest('[data-y]');if(!b)return;var p=b.dataset.y.split(':'),M=dr.media=dr.media||[];
  if(p[0]==='st')MJ.update('inbox',p[1],{st:p[2]}).catch(function(){msg('فشل التحديث',1)});
  else if(p[0]==='del'){if(confirm('تمسح الطلب ده؟'))MJ.del('inbox',p[1]).catch(function(){msg('فشل المسح',1)})}
  else if(p[0]==='f'){ifil=p[1];draw()}
  else if(p[0]==='add'){M.push({id:'',type:'video',title:'',url:''});draw()}
  else if(p[0]==='rm'){M.splice(+p[1],1);draw()}
  else if(p[0]==='up'&&+p[1]>0){M.splice(+p[1]-1,0,M.splice(+p[1],1)[0]);draw()}
  else if(p[0]==='dn'&&+p[1]<M.length-1){M.splice(+p[1]+1,0,M.splice(+p[1],1)[0]);draw()}});
$('#admb').addEventListener('input',function(e){var d=e.target.dataset&&e.target.dataset.m;if(!d)return;var p=d.split(':');dr.media[+p[0]][p[1]]=e.target.value});
$('#admb').addEventListener('change',function(e){if(e.target.id!=='lf'||!assets)return;var fs=[].slice.call(e.target.files),M=dr.media=dr.media||[],i=0;
  (function nx(){if(i>=fs.length){draw();msg('خلص الرفع. دوس حفظ ونشر');return}var f=fs[i++];msg('بيرفع '+i+'/'+fs.length+': '+f.name+'...');
    assets.upload(f).then(function(r){M.push({id:'',type:/^video\//.test(f.type)?'video':/^image\//.test(f.type)?'image':'file',title:f.name.replace(/\.[^.]+$/,''),url:r.url})}).catch(function(){msg('فشل رفع '+f.name+' (الحجم أو إعدادات Cloudinary)',1)}).then(nx)})()});
})();
