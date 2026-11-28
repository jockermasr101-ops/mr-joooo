// يوصّل لوحة التحكم بـ Firebase (دخول + بيانات) و Cloudinary (رفع الصور والفيديو).
(function(){
var C=window.MRJOO_CONFIG||{},F=C.firebase||{};
if(!F.apiKey||/PASTE/.test(F.apiKey)||/PASTE/.test(C.adminEmail||'PASTE'))return;
var CP='#cp-w728ciqwzr8l',B='https://www.gstatic.com/firebasejs/10.12.2/',ready=null;
function load(u){return new Promise(function(ok,no){var s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function fb(){return ready||(ready=load(B+'firebase-app-compat.js').then(function(){return Promise.all([load(B+'firebase-auth-compat.js'),load(B+'firebase-firestore-compat.js')])}).then(function(){firebase.initializeApp(F);var a=firebase.auth();try{a.setPersistence(firebase.auth.Auth.Persistence.SESSION)}catch(_){}return{auth:a,fs:firebase.firestore()}}))}
function who(){return fb().then(function(f){return new Promise(function(res){var off=f.auth.onAuthStateChanged(function(u){off();res(u)})})})}
var last=Date.now(),isAdmin=function(u){var ok=!!(u&&u.email&&u.email.toLowerCase()===C.adminEmail.toLowerCase());if(ok)window.__cpAdmin=1;return ok};
['pointerdown','keydown'].forEach(function(e){addEventListener(e,function(){last=Date.now()},true)});
setInterval(function(){if(window.__cpAdmin&&Date.now()-last>30*60e3)window.cpLogout()},30000);
window.cpLogout=function(){fb().then(function(f){return f.auth.signOut()}).then(function(){location.hash='';location.reload()})};
window.claude={use:function(n){
  if(n==='user')return Promise.resolve({canEdit:function(){return who().then(isAdmin).catch(function(){return false})}});
  if(n==='db')return Promise.resolve({doc:function(p){return{
    set:function(d){return fb().then(function(f){return f.fs.doc(p).set(JSON.parse(JSON.stringify(d)))})},
    onSnapshot:function(ok,no){fb().then(function(f){f.fs.doc(p).onSnapshot(ok,no)}).catch(no)}}}});
  if(n==='assets')return Promise.resolve({upload:function(blob){var K=C.cloudinary||{};if(!K.cloudName||/PASTE/.test(K.cloudName))return Promise.reject();var fd=new FormData();fd.append('file',blob);fd.append('upload_preset',K.uploadPreset);
    return fetch('https://api.cloudinary.com/v1_1/'+K.cloudName+'/auto/upload',{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){if(!j.secure_url)throw 0;return{url:j.secure_url}})}});
  return Promise.reject()}};
// ---- MJ: دوال Firestore للطبقة التفاعلية (طلبات، أحداث، لايكات)
var fsP=function(){return fb().then(function(f){return f.fs})},TS=function(){return firebase.firestore.FieldValue.serverTimestamp()};
window.MJ={
  add:function(c,d){return fsP().then(function(fs){d.ts=TS();return fs.collection(c).add(d)})},
  watch:function(c,n,cb){fsP().then(function(fs){fs.collection(c).orderBy('ts','desc').limit(n).onSnapshot(function(s){cb(s.docs.map(function(x){var o=x.data();o.id=x.id;return o}),s.docChanges())},function(){})}).catch(function(){})},
  update:function(c,id,d){return fsP().then(function(fs){return fs.collection(c).doc(id).update(d)})},
  del:function(c,id){return fsP().then(function(fs){return fs.collection(c).doc(id).delete()})},
  likes:function(id){return fsP().then(function(fs){return fs.collection('likes').doc(id).get()}).then(function(s){return s.exists?(s.data().n||0):0})},
  like:function(id){return fsP().then(function(fs){var r=fs.collection('likes').doc(id);return r.get().then(function(s){return s.exists?r.update({n:firebase.firestore.FieldValue.increment(1)}):r.set({n:1})})})}
};
// ---- login (only when the hidden route is opened)
var fails=0,lockUntil=0;
function login(){if(document.getElementById('cplogin'))return;var d=document.createElement('div');d.className='srch';d.id='cplogin';
  d.innerHTML='<div class="sbox" style="padding:1.6rem;display:grid;gap:.9rem"><h3 style="font:800 1.3rem var(--ar)">دخول لوحة التحكم</h3><input id="cpe" type="email" autocomplete="username" placeholder="الإيميل" style="border:1px solid rgba(188,220,251,.3);border-radius:12px"><input id="cpp" type="password" autocomplete="current-password" placeholder="الباسورد" style="border:1px solid rgba(188,220,251,.3);border-radius:12px"><div id="cpm" style="color:#ff8aa8;min-height:1.2em;font-size:.9rem"></div><div style="display:flex;gap:.6rem"><button class="btn" id="cpg">دخول</button><button class="btn o" id="cpx">إلغاء</button></div></div>';
  document.body.appendChild(d);var m=d.querySelector('#cpm'),e=d.querySelector('#cpe'),p=d.querySelector('#cpp');e.focus();
  function go(){if(Date.now()<lockUntil){m.textContent='محاولات كتير. استنى دقيقة.';return}
    fb().then(function(f){return f.auth.signInWithEmailAndPassword(e.value.trim(),p.value)}).then(function(r){if(!isAdmin(r&&r.user||{email:e.value.trim()})&&r&&r.user){return fb().then(function(f){return f.auth.signOut()}).then(function(){m.textContent='الحساب ده مش مصرّح له'})}location.reload()}).catch(function(){fails++;if(fails>=5){lockUntil=Date.now()+60000;fails=0}m.textContent='الإيميل أو الباسورد غلط'})}
  d.querySelector('#cpg').onclick=go;p.addEventListener('keydown',function(ev){if(ev.key==='Enter')go()});
  d.querySelector('#cpx').onclick=function(){d.remove();history.replaceState(null,'',location.pathname)}}
function route(){if(location.hash===CP)who().then(function(u){if(!isAdmin(u))login()}).catch(function(){})}
addEventListener('hashchange',route);addEventListener('DOMContentLoaded',route);
})();
