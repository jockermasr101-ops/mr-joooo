# تشغيل لوحة التحكم على Vercel (خطوة بخطوة)

الرابط المخفي بعد النشر: `https://موقعك.vercel.app/#cp-w728ciqwzr8l`
(لو فتحته من غير ما تكون مسجّل دخول، بتظهر شاشة دخول. غيرك مش هيشوف حاجة ولا يقدر يكتب.)

## 1) Firebase (مجاني)
1. console.firebase.google.com ← Add project.
2. Build ← **Authentication** ← Get started ← Email/Password ← Enable.
3. تبويب Users ← Add user ← إيميلك + باسورد قوي (ده الأدمن).
4. Authentication ← Settings ← User actions ← **اقفل Enable create (sign-up)**.
5. Authentication ← Settings ← Authorized domains ← ضيف دومين Vercel بتاعك.
6. Build ← **Firestore Database** ← Create (production mode).
7. تبويب Rules ← الصق محتوى `firestore.rules` بعد ما تغيّر `PASTE_YOUR_EMAIL` لإيميلك ← Publish.
8. Project settings ← Your apps ← Web (</>) ← انسخ القيم (apiKey, authDomain, projectId, appId).

## 2) Cloudinary (لرفع الصور والفيديو)
Settings ← Upload ← Upload presets ← Add ← Signing mode: **Unsigned** ← احفظ، وانسخ اسم الـ preset واسم الـ cloud.

## 3) املا `firebase-config.js`
حط إيميلك وقيم Firebase وقيم Cloudinary مكان كلمة PASTE.

## 4) النشر
ارفع **محتوى** الفولدر ده على ريبو GitHub (مش الـ zip نفسه، و`index.html` في أول الريبو) ← Vercel ← Import ← Framework: Other ← Deploy.

## ملاحظات أمان
- مفتاح Firebase (apiKey) مش سري. الحماية الحقيقية من `firestore.rules` ومن قفل التسجيل.
- ما تنشرش الرابط المخفي، وخلّي الباسورد طويل.

## حماية إضافية (من النصايح اللي اتفقنا عليها)
- **الدخول بينتهي لوحده** لما تقفل التاب، وبعد 30 دقيقة من غير حركة.
- **القواعد** بتمنع حفظ أكتر من 60 عمل، وبتقصر الكتابة على إيميلك.
- **2FA:** مصادقة Firebase العادية مفيهاش تحقق بخطوتين مجاني. لو عايزه، يا إما تفعّل MFA عن طريق ترقية Identity Platform (غالبًا مدفوعة بعد حد معين)، يا إما تحط الدومين ورا Cloudflare وتفعّل Cloudflare Access على رابط اللوحة.
- **WAF/DDoS:** ضيف الدومين على Cloudflare (الخطة المجانية) وفعّل Proxy.
- **نسخ احتياطي:** من لوحة التحكم ← نسخة احتياطية ← نسخ، واحتفظ بالنص عندك بعد أي تعديل كبير.

## الميزات التفاعلية (بتشتغل بعد ما تكمل الإعداد)
- **فورم «ابعتلي طلبك»** في آخر الصفحة: أي طلب بيوصل لوحة التحكم ← **الطلبات** فورًا (مع صوت وعدّاد على عنوان التاب). تقدر تردّ بضغطة واتساب/إيميل وتعلّم الطلب «اتقري/تم» أو تمسحه.
- **النشاط:** زيارات النهاردة وآخر 7 أيام، أكتر أعمال اتفتحت، ضغطات واتساب، اللي الناس بتبحث عنه، وآخر الحركات. مفيش بيانات شخصية بتتسجل.
- **إعجاب ♥** على كل عمل بيظهر للكل.
- **المكتبة:** فيديوهات وصور وملفات ولينكات من فولدر `media/` أو من Cloudinary (شوف `media/README-AR.txt`).
- لازم تنسخ **القواعد الجديدة** من `firestore.rules` (فيها طلبات وأحداث وإعجابات).
- حماية الفورم: خانة فخ للبوتات، وحد دقيقة بين كل طلب والتاني، وقواعد بتحدد أطوال الحقول. للحماية الأقوى فعّل **Firebase App Check** من الكونسول.
