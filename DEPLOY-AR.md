# النشر — اختار طريقة واحدة

## الطريقة 1: Netlify Drop (أسهل واحدة، من غير GitHub)
افتح app.netlify.com/drop ← اسحب **الفولدر** (بعد فك الـ zip) وارميه في الصفحة. الموقع بيتنشر في ثواني ويقرا `_headers`.

## الطريقة 2: Cloudflare Pages (Direct Upload)
Workers & Pages ← Create ← Pages ← Upload assets ← اسحب الفولدر ← Deploy.

## الطريقة 3: Vercel بالـ CLI (من غير GitHub)
افتح التيرمنال جوه الفولدر:
```
npm i -g vercel
vercel login
vercel --prod
```
أسئلة Vercel: كل الإجابات Enter. لو سألك Build Command سيبه فاضي.

## الطريقة 4: Vercel عن طريق GitHub
1. فك الـ zip، وارفع **الملفات نفسها** على الريبو بحيث `index.html` يبقى في أول الريبو (مش جوه فولدر).
2. Vercel ← Add New ← Project ← Import الريبو.
3. Framework Preset: **Other**. Build Command و Output Directory و Install Command: سيبهم فاضيين.
4. Root Directory: سيبه فاضي (لو index.html جوه فولدر، اكتب اسم الفولدر).
5. Deploy.

## لو حصلت مشكلة
| العَرَض | السبب والحل |
|---|---|
| Deployment نجح بس بيطلع **404** | `index.html` مش في الـ Root. حط الملفات في أول الريبو أو اضبط Root Directory. |
| الصفحة بتطلب **تسجيل دخول Vercel** | بتفتح رابط الـ Preview. افتح الدومين الأساسي (Production) المنتهي بـ `.vercel.app`، أو عطّل Vercel Authentication من Settings ← Deployment Protection. |
| بيعمل **Build failed** | في الريبو ملفات قديمة (`package.json` أو فولدر مشروع قديم). امسحها أو اعمل ريبو جديد فيه ملفات الـ zip بس. |
| رفعت ملف **zip** وبس | GitHub مش بيفك الـ zip. فكه الأول وارفع محتواه. |
| `vercel.json` رفض | انسخ نص الخطأ وابعته، غالبًا مسافة أو حرف اتضاف بالغلط وانت بتعدل الملف. |
