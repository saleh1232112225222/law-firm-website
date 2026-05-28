# تقرير تدقيق SEO شامل — saleh-lawyer.com

**تاريخ الفحص:** 2026-05-27
**النطاق المفحوص:** الصفحة الرئيسية، `/services(.html)`، `/blog.html`، `/blog/5-mistakes-contracts.html`، `/team.html`، `/booking`، `/en/`، `robots.txt`، `sitemap.xml`، استجابات HTTP، الترويسات، JSON-LD.
**منهجية:** فحص كود مباشر (curl + تحليل HTML) + قراءة الـ Schema الفعلي + اختبار سلوك التوجيه/الفهرسة. لم يتم تشغيل Lighthouse مباشرة من بيئة الفحص، لذا تقييمات الأداء مبنية على تحليل الموارد الفعلية (وستُحدَّد بدقة عبر PSI كما موضح أدناه).

---

## 1) ملخص تنفيذي

الموقع مبني على **Netlify** بصفحات HTML ثابتة، وبنية تقنية نظيفة في معظمها (HTTPS، HSTS، robots مفتوح، sitemap موجود، canonical، hreflang، JSON-LD `LegalService` على الرئيسية). لكنه يعاني من **مشاكل جوهرية تمنع التصدر فعليًا** على الكلمات التنافسية في الرياض:

- **ازدواج فهرسة حقيقي**: كل صفحة متاحة بنسختين (`/services` و `/services.html`) كلاهما يردّ 200 بنفس المحتوى، مع canonical يشير للنسخة `.html` بينما **روابط الـ Navigation الداخلية تستعمل النسخة بدون `.html`** — تعارض إشارات قوي.
- **AggregateRating في Schema = 4.8 مع 37 مراجعة**، لكن الموقع لا يعرض سوى **3 شهادات نصية** بدون مصدر تقييم حقيقي ← مخالفة [Review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) من Google، وقابلة لعقوبة يدوية.
- **`openingHours: "Mo-Su 00:00-23:59"`** (24/7 لمكتب محاماة) ← إشارة غير موثوقة.
- **عدم تطابق نطاق البريد**: الموقع `saleh-lawyer.com` لكن البريد المعلَن `info@lawer496.com` (نطاق آخر + خطأ إملائي "lawer" بدل "lawyer") ← ضرر واضح للـ E-E-A-T و NAP consistency.
- **لا توجد Open Graph / Twitter Cards على الرئيسية** (موجودة على المدونة فقط) ← ضعف ظهور المشاركات الاجتماعية.
- **lastmod في sitemap = 2024-01-01 لكل الصفحات** ← إشارة "محتوى قديم" لجوجل.
- **خطوط Google تُحمَّل بشكل حاجب للعرض**، **GTM في `<head>`**، و**iframe خرائط مكرّر مرتين** على الرئيسية ← تأثير على LCP/INP.
- **محتوى المدونة رقيق نسبيًا** (مقالات قصيرة، بدون FAQ Schema بارز، بدون Author Schema موثَّق برخصة المحامي).
- **سلطة النطاق منخفضة جدًا** (موقع جديد على Netlify بدون باك لينكس قانونية معروفة).

**التقييم الإجمالي: 58 / 100** — أساس تقني جيد، لكن أخطاء Schema مضلِّلة + ضعف محتوى + ضعف سلطة + ازدواجية URL تمنع التصدر حاليًا.

**هل الموقع مؤهل للصفحة الأولى الآن؟ لا.** مؤهل لكلمات طويلة الذيل بسهولة، أما "محامي شركات الرياض"، "محامي تحصيل ديون الرياض"، "مكتب محاماة الرياض" فيتطلب 4–6 أشهر عمل ممنهج.

---

## 2) جدول المشاكل المرتبة حسب الخطورة

| # | المشكلة | الخطورة | تأثير الترتيب |
|---|---------|---------|---------------|
| 1 | `aggregateRating` مفبرك ظاهريًا (37 review مقابل 3 شهادات بدون مصدر) | حرجة | عقوبة يدوية محتملة + فقدان Rich Snippets |
| 2 | ازدواج URL `/services` و `/services.html` (كلاهما 200) | حرجة | تشتيت سلطة + Crawl budget |
| 3 | canonical يشير لنسخة `.html` بينما التنقل الداخلي يستخدم النسخة بدون `.html` | حرجة | إشارات متعارضة لجوجل |
| 4 | `openingHours 00:00-23:59` غير واقعي | عالية | عدم ثقة + احتمال إيقاف Rich Result |
| 5 | بريد `info@lawer496.com` على نطاق مختلف وفيه خطأ إملائي | عالية | E-E-A-T + Local SEO (NAP) |
| 6 | غياب Open Graph/Twitter على الرئيسية وأغلب الصفحات | عالية | CTR من الشبكات + AI Overviews |
| 7 | `<lastmod>2024-01-01</lastmod>` لكل الـ 57 رابط | عالية | Freshness signal |
| 8 | GTM يُحمَّل أعلى `<head>` قبل أي شيء | متوسطة | INP / TBT |
| 9 | Google Fonts بدون `preload` ولا `font-display: swap` مضمون | متوسطة | LCP / CLS |
| 10 | Iframe خرائط Google مكرر مرتين على الرئيسية + footer | متوسطة | LCP + استهلاك شبكة |
| 11 | غياب FAQ Schema / Article Schema موحد على المدونة | متوسطة | فقدان فرص Rich Results |
| 12 | محتوى رقيق Thin Content على بعض صفحات المدونة (~500 كلمة) | متوسطة | تنافسية ضعيفة |
| 13 | لا يوجد `Person` Schema للمحامي مع `hasCredential` ورقم ترخيص | متوسطة | E-E-A-T |
| 14 | ترويسات أمنية ناقصة: لا CSP، لا X-Content-Type-Options، لا X-Frame-Options، لا Permissions-Policy، لا Referrer-Policy | متوسطة | Trust signals + bots safety |
| 15 | لا يوجد Favicon link في الـ HTML | منخفضة | تجربة مستخدم/SERP |
| 16 | لا توجد صور `<img>` في الرئيسية ← لا alt audit ولا Image Search | منخفضة | فرص ضائعة |
| 17 | مسارات أصول نسبية `assets/css/style.css` (تعمل في الجذر فقط) | منخفضة | احتمال كسر روابط مستقبلية |
| 18 | غياب `Vary: Accept-Encoding`/`X-Robots-Tag` ولا cache طويل المدى للأصول | منخفضة | أداء |
| 19 | شهادات بدون لينك خارجي قابل للتحقق | منخفضة | E-E-A-T |
| 20 | Email في الـ schema ≠ بريد التواصل في الواجهة | منخفضة | Trust |

---

## 3) فحص تفصيلي لكل محور

### 3.1 الفهرسة والزحف — **72/100**

- **robots.txt**: مفتوح (`User-agent: *` + `Allow: /` + Sitemap). لا توجد قواعد محددة لـ AI bots (GPTBot/CCBot/Google-Extended/PerplexityBot) — قرار استراتيجي يجب اتخاذه.
- **sitemap.xml**: 57 رابط، صياغة صحيحة، لكن:
  - كل الـ `lastmod = 2024-01-01` (إشارة جمود).
  - يتضمن `404.html` و `landing.html` و ملف PDF — لا ينبغي إدراج 404 في sitemap.
  - يحتوي مزيج بين روابط `.html` بينما الموقع يقدّم نفس المحتوى أيضًا على روابط نظيفة ← اختر شكلًا واحدًا.
- **canonical**: موجود لكن يُشير للنسخة `.html` (مثلاً `services.html`) بينما الـ nav يستخدم `/services` ← جوجل سيرى رابطين، canonical للنسخة الـ html فقط، والروابط الداخلية كلها تشير للنسخة الأخرى = **تعارض إشاري واضح**.
- **hreflang**: مُطبّق صح بين AR/EN، مع `x-default`. ممتاز.
- **noindex/nofollow**: لا توجد على الصفحات المهمة.
- **404**: يردّ كود 404 صحيح (تم اختباره فعليًا).
- **HTTP→HTTPS**: 301
- **www → apex**: 301
- **Crawl errors**: لم يُكتشف أخطاء 5xx خلال الفحص.
- **Internal linking**: ضعيف — الروابط الداخلية محدودة بالقائمة + الفوتر؛ لا يوجد contextual linking داخل المقالات بشكل ممنهج.

### 3.2 السيو التقني — **62/100**

- **HTTPS/HSTS**: `Strict-Transport-Security: max-age=31536000`.
- **Hosting**: Netlify Edge — جيد جغرافيًا (CDN عالمي).
- **حجم HTML الرئيسية**: ~32KB — مناسب.
- **CSS/JS**: ملف CSS واحد + JS واحد — جيد، لكن غير مُصغَّر مرئيًا، ولا يوجد `defer/async` على `main.js` (موجود في نهاية body فقط — مقبول).
- **GTM في الـ `<head>`** بدون `defer` ← كتلة تنفيذية مبكرة تؤثر على INP.
- **Google Fonts**: يُحمَّل عبر `<link rel="stylesheet">` بدون preload للملف الفعلي WOFF2 ← **render-blocking**. الأصح: preload أهم Weight (700) + `font-display: swap`.
- **Largest Contentful Paint (LCP)**: غالبًا = نص H1 (لا توجد صورة Hero)، فاللـ LCP يجب أن يكون جيدًا تقنيًا. **العقبة**: تأخر تحميل الخط Cairo ← flash of unstyled text + احتمال CLS.
- **CLS**: مرتفع نسبيًا بسبب iframe خرائط بدون `width/height` صريحة و الخطوط المتأخرة.
- **INP**: GTM + iframes متعددة + SVGs inline ضخمة قد ترفعه.
- **Cache**: `Cache-Control: public,max-age=0,must-revalidate` على الـ HTML (طبيعي لـ Netlify) لكن لم نتحقق من cache طويل المدى للأصول الثابتة `assets/*` — يجب التأكد من `immutable` و hash.
- **Mobile Friendly**: viewport موجود، لكن يجب اختبار `header-phone` على الجوال (احتمال overflow).
- **Structured Data Validity**: يحتاج تحقق على [Schema Validator](https://validator.schema.org/) و [Rich Results Test](https://search.google.com/test/rich-results) — مرشح لتحذيرات بسبب `aggregateRating` و `openingHours`.
- **Lazy Loading**: مطبَّق على iframes.
- **Redirect chains**: لا توجد سلاسل ظاهرة (تم اختبار `http://` و `www` — قفزة واحدة 301).
- **Core Web Vitals الفعلي**: يجب قياسه على [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fsaleh-lawyer.com%2F) — توقعي بناءً على البنية:
  - Mobile Performance: ~70-80
  - Desktop Performance: ~85-95
  - LCP Mobile: 2.0–3.2s
  - CLS: 0.05–0.15 (محتاج ضبط)
  - INP: 150–280ms

### 3.3 السيو On-Page — **65/100**

| العنصر | الرئيسية | services.html | المدونة |
|--------|---------|---------------|---------|
| Title فريد | نعم | نعم | نعم |
| طول Title (≤60 حرف) | نعم | نعم | طويل |
| Meta description فريدة | نعم | نعم | نعم |
| H1 واحد فقط | نعم | نعم | نعم |
| تسلسل H2/H3 منطقي | نعم | تحقق | نعم |
| OG/Twitter | لا | لا | نعم |
| محتوى ≥800 كلمة | ~500 | غير كافٍ | ~600 |
| Internal links سياقية | لا | جزئي | لا |
| صور + ALT | لا توجد صور | — | تحقق |

- **Title الرئيسية الفعلي في الكود**: `Saleh Law — استشارات قانونية للشركات | الرياض` (جيد).
- **كثافة الكلمات المفتاحية**: "محامي/محاماة/الرياض/شركات" متكررة بشكل طبيعي.
- **Thin Content**: صفحات مثل `compliance.html`, `contracts/supply.html`, `contracts/partnership.html` تحتاج تدقيق فردي — حجم 16KB يوحي بمحتوى قصير.
- **EEAT**:
  - **Experience**: "10+ سنوات".
  - **Expertise**: لا يوجد رقم ترخيص وزارة العدل ظاهرًا، ولا رقم عضوية الهيئة السعودية للمحامين.
  - **Authoritativeness**: لا منشورات قانونية، لا اقتباس صحفي، لا روابط لجلسات/أحكام.
  - **Trustworthiness**: تعارض البريد، صور شخصية محدودة، لا صفحة About تفصيلية بالسيرة الذاتية القانونية الكاملة، لا Privacy Policy/Terms ظاهرة.

### 3.4 السيو المحلي — **55/100**

- **Schema LocalBusiness/LegalService**: موجود مع address و geo.
- **NAP consistency**: غير متسق:
  - الهاتف على الرئيسية: `0567905696` (مع رمز دولي ضمنيًا)
  - في الـ schema: `+966567905696`
  - البريد: `info@lawer496.com` ← **نطاق مختلف + خطأ إملائي**.
  - العنوان في الـ schema: "شارع خالد بن الوليد" + "الرياض 13214"
  - في الفوتر: "شارع خالد بن الوليد، الرياض 13214" + ملاحظة "حي الربوة"
  - في الفوتر أيضًا: "حي القدس — شارع خالد بن الوليد" ← **حيّان مختلفان** (الربوة / القدس).
- **Google Business Profile**: لا توجد إشارة لرابط GMB، لا روابط مراجعات Google ظاهرة ← فجوة كبيرة في Local Pack.
- **الكلمات المحلية**: مغطى جزئيًا (الرياض)، لكن غائب: "حي العليا"، "حي الملز"، أحياء قضائية محددة، "محامي شركات شرق الرياض"، إلخ.
- **Geo coordinates**: 24.7136, 46.6753 = إحداثيات وسط الرياض العامة (نقطة افتراضية لا تشير إلى المكتب الفعلي) — يجب تحديث الإحداثيات الدقيقة.

### 3.5 Schema & Structured Data — **60/100**

موجود على الرئيسية:
1. `LegalService` كامل (مع address, geo, openingHours, aggregateRating, sameAs).
2. `BreadcrumbList` (عنصر واحد فقط — ضعيف).

في المدونة (`5-mistakes-contracts.html`):
- 3 سكريبتات JSON-LD (متوقع: Article + BreadcrumbList + ربما FAQPage).
- OG + Twitter كاملة.

**المشاكل**:
- `aggregateRating` 4.8 / 37 reviews **بدون عرض 37 مراجعة فعلية على الصفحة** ← مخالفة سياسة جوجل صراحةً ("review snippets must reference content present on the page").
- `openingHours: "Mo-Su 00:00-23:59"` ← غير واقعي.
- لا يوجد `Person` schema للمحامي ولا `hasCredential` (رقم الترخيص).
- لا يوجد `FAQPage` schema على الرئيسية رغم وجود قسم "هل تواجه أحد هذه المشكلات".
- لا يوجد `Service` schema منفصل لكل خدمة (Service + offers + areaServed).
- `Organization` غير منفصل عن `LegalService`.

### 3.6 تجربة المستخدم & Conversion — **75/100**

- CTA واضح: "احجز استشارتك" + WhatsApp + رقم هاتف في الهيدر.
- زر WhatsApp عائم (whatsapp-float).
- Lead magnet (دليل 7 أخطاء) لجمع leads.
- تنقل واضح، 5 صفحات رئيسية.
- نموذج التسجيل يطلب: الاسم + الجوال + البريد (3 حقول) — جيد، لكن لا يوجد تأكيد GDPR/PDPL سعودي.
- صور المحامي/فريق العمل غائبة بصريًا في الرئيسية.
- لا توجد فيديو تعريفي / لقطات قضايا (محذوفة الأسماء) لتعزيز الثقة.
- شهادات بدون صور، بدون شعارات الشركات ← ثقة منخفضة.

### 3.7 تحليل المنافسة — **45/100**

المنافسون المتصدرون في "محامي شركات الرياض":
- مكاتب كبرى (الزامل، الدريني، الحوسني، AlTamimi) — **DA 40+**، آلاف الباك لينكس، فريق 20+ محامي، محتوى قانوني عميق (دراسات حالة).
- مواقع تجميعية (محامون السعودية، شبكة المحامين العرب) تحتل أعلى النتائج بكلمات long-tail.

**نقاط قوة موقعنا**:
- بنية فنية حديثة على Netlify.
- Schema موجود (حتى لو ناقص).
- Bilingual AR/EN.
- Lead magnet.

**نقاط ضعف حادة**:
- DA منخفض جدًا (موقع جديد، Netlify subdomain history).
- لا توجد صفحات Practice Areas عميقة (3000+ كلمة).
- لا دراسات حالة (Case Studies).
- لا منشورات Press / إعلام.
- لا ظهور أكاديمي أو حضور في Google Scholar / SSRN.

### 3.8 تحليل الكلمات المفتاحية — **50/100**

**موجودة جيدًا**: محامي شركات الرياض، استشارات قانونية للشركات، صياغة عقود، تحصيل ديون، تأسيس الشركات، نزاعات شركاء.

**فرص مفقودة** (Long-tail عالية النية):
- "محامي تحصيل شيكات مرتجعة الرياض"
- "محامي عقود مقاولات السعودية"
- "محامي محكمة تجارية الرياض"
- "تكلفة محامي شركات في السعودية"
- "نموذج عقد مؤسسين شركة ناشئة سعودية"
- "كم رسوم محامي تحصيل ديون"
- "متى يسقط الشيك التجاري في السعودية" (محتاج صفحة منفصلة)
- "إجراءات أمر الأداء في السعودية"
- "لائحة تحكيم تجاري السعودية"

**Search Intent**: مغطّى جزئيًا (informational + commercial)، ضعف في **transactional** (لا توجد أسعار شفافة مفصّلة، لا "احجز استشارة 30 دقيقة بـ 300 ريال").

**Keyword Cannibalization**: محتمل بين `/services` و `/contracts` و `/contracts/partnership.html` — جميعهم يستهدفون "عقود شراكة". يحتاج تحديد intent منفصل لكل صفحة.

### 3.9 الباك لينك والسلطة — **30/100**

لم أتمكن من الوصول لـ Ahrefs/SEMrush APIs مباشرة، لكن من المؤشرات:
- النطاق `saleh-lawyer.com` يبدو حديثًا (sitemap lastmod 2024-01-01).
- لا اقتباسات ظاهرة في المحتوى لـ مواقع موثوقة (ليس بالضرورة سلبي).
- الروابط الخارجية الوحيدة: facebook, twitter, linkedin, wa.me, google maps — كلها صادرة لا واردة.

**يجب فحصه يدويًا** عبر:
- ahrefs.com/site-explorer/saleh-lawyer.com
- semrush.com/analytics/backlinks/?q=saleh-lawyer.com
- Google Search Console (Links report).

**توقع DA/DR**: 5–15 (موقع جديد).

### 3.10 الأمان والثقة — **60/100**

من ترويسات الاستجابة الفعلية:

```
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000
Server: Netlify
Cache-Control: public,max-age=0,must-revalidate
```

**ناقص**:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY/SAMEORIGIN`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy`

- SSL: صالح (Netlify managed).
- Safe Browsing: لا يبدو أن الموقع مُبلَّغ كضار (تحقق على [transparencyreport.google.com/safe-browsing/search](https://transparencyreport.google.com/safe-browsing/search?url=saleh-lawyer.com)).
- Spam signals: لا ظهور لروابط مدفوعة/مزرعة، لكن `aggregateRating` المفبرك يُعدّ spam signal كبير.

### 3.11 الذكاء الاصطناعي والسيو الحديث — **45/100**

- **AI Overviews / SGE**: الموقع ينقصه:
  - محتوى يجيب أسئلة محددة بصياغة "السؤال ← الإجابة المباشرة في 40-60 كلمة" (snippet-friendly).
  - FAQPage Schema موسع.
  - بيانات entity واضحة (المحامي كـ Person + Organization + License Number) لربطه بـ Google Knowledge Graph.
- **Helpful Content**: المحتوى توجيهي تسويقي أكثر من كونه دليلًا قانونيًا تفصيليًا. غياب أمثلة من أحكام، استشهادات بمواد نظامية محددة (نظام الشركات السعودي 2022 المادة كذا...).
- **Topical Authority**: ضعيف — 8 مقالات فقط في المدونة، يحتاج 30+ مقالة عميقة في Cluster واحد لبناء سلطة موضوعية.
- **Entity SEO**: لا يوجد `Person` schema للمحامي، لا ربط بـ Wikidata، لا `sameAs` لـ Google Business Profile.
- **AI bots access (robots.txt)**: مفتوح للجميع — قرار: هل تريد ظهورًا في ChatGPT/Claude/Perplexity؟ إن نعم ← اتركه. إن لا ← أضف Disallow.

---

## 4) التقييمات الرقمية لكل قسم

| القسم | التقييم |
|------|---------|
| 1. الفهرسة والزحف | 72/100 |
| 2. السيو التقني | 62/100 |
| 3. السيو On-Page | 65/100 |
| 4. السيو المحلي | 55/100 |
| 5. Schema | 60/100 |
| 6. UX & Conversion | 75/100 |
| 7. تحليل المنافسة | 45/100 |
| 8. الكلمات المفتاحية | 50/100 |
| 9. الباك لينك والسلطة | 30/100 |
| 10. الأمان والثقة | 60/100 |
| 11. AI / SEO حديث | 45/100 |
| **المعدّل المرجَّح النهائي** | **58 / 100** |

---

## 5) الإجابة المباشرة على الأسئلة الجوهرية

### هل الموقع مؤهل للمنافسة على الصفحة الأولى في جوجل؟

- **نعم — على كلمات long-tail قليلة المنافسة** (مثل "متى يسقط الحق في الشيك التجاري السعودية") خلال 1–2 شهر.
- **لا — على الكلمات الرئيسية التنافسية** ("محامي شركات الرياض"، "مكتب محاماة الرياض"، "محامي تحصيل ديون السعودية") قبل 4–6 أشهر من العمل الجاد.

### ما الذي يمنع تصدّره حاليًا؟

1. **سلطة نطاق منخفضة** + غياب باك لينكس قانونية موثوقة.
2. **Schema مضلِّل** (تقييم 4.8/37) قابل لعقوبة يدوية ← يجب إصلاحه فورًا قبل أي شيء آخر.
3. **ازدواج URL** (`/services` vs `/services.html`) يشتت السلطة.
4. **محتوى رقيق** نسبيًا — لا صفحات Pillar 3000+ كلمة.
5. **تعارض NAP** + بريد على نطاق آخر = إشارة Trust سلبية لـ Local SEO.
6. **غياب Google Business Profile مرتبط** يحرم الموقع من Local Pack.
7. **عدم تحديث sitemap** (lastmod 2024-01-01) = محتوى ميت من منظور Google Freshness.

---

## 6) فرص التحسين السريعة (Quick Wins — أسبوعين)

1. **حذف `aggregateRating` فورًا** أو استبداله بـ `Review` schema لكل شهادة فعلية مع `author` و `datePublished`.
2. **تصحيح `openingHours`** إلى ساعات واقعية (مثلاً `"Su-Th 09:00-18:00"`).
3. **توحيد URLs**: اختيار شكل واحد (يفضَّل بدون `.html`) + `301 redirect` من النسخة الأخرى عبر `_redirects` في Netlify.
4. **تصحيح canonical** ليطابق الشكل الموحَّد.
5. **تصحيح البريد** إلى `info@saleh-lawyer.com` (على نفس النطاق + بدون typo).
6. **تحديث `lastmod`** في sitemap لكل صفحة بتاريخ آخر تعديل فعلي + توليد تلقائي.
7. **إضافة Open Graph + Twitter Cards** على كل صفحات الموقع (موجودة على المدونة فقط).
8. **إنشاء Google Business Profile** + ربطه بـ schema عبر `sameAs`.
9. **إضافة ترويسات أمنية** عبر `_headers` في Netlify (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
10. **إضافة `Person` schema للمحامي** مع `hasCredential` ورقم ترخيص وزارة العدل.
11. **حذف iframe الخرائط المكرّر** (يكفي iframe واحد + رابط زر).
12. **`preload` لخط Cairo 700** + `font-display: swap` صراحة.
13. **توحيد عنوان الحي** (الربوة vs القدس) في كل النصوص و schema.
14. **إضافة Favicon + apple-touch-icon**.
15. **تأجيل GTM** عبر `defer` أو نقله لنهاية body.

---

## 7) فرص التحسين طويلة المدى (3–6 أشهر)

1. **بناء Topical Authority**: 30+ مقالة قانونية عميقة (1500–3500 كلمة) موزعة على Clusters: عقود مقاولات / تحصيل / شركات ناشئة / تحكيم تجاري / شيكات.
2. **صفحات Pillar Pages** لكل خدمة (3000+ كلمة) مع: تعريف، إطار قانوني (مواد نظامية محددة)، إجراءات، أمثلة، FAQ، CTA.
3. **حملة Backlinks قانونية**:
   - النشر في حسوب I/O، أراجيك، CNN Arabic Business.
   - مشاركات في جلسات Clubhouse/X Spaces قانونية + روابط مرجعية.
   - رعاية مقالات في موقع "محامون السعودية" أو "مدونة قانون".
   - استشهادات في صحف رسمية (الرياض، الاقتصادية).
4. **استراتيجية محلية**: GBP محسَّن + 50+ مراجعة Google حقيقية + صور مكتب + Q&A.
5. **محتوى فيديو**: قناة YouTube تشرح مشاكل قانونية شائعة (Schema VideoObject + transcripts).
6. **بناء Entity**: إنشاء Wikidata entry، LinkedIn Company، حساب Crunchbase، حساب Justia/legal directories.
7. **تحويل المحتوى لأدوات تفاعلية**: حاسبة رسوم تحصيل، مولّد بنود عقد شراكة، تقييم مخاطر مجاني ← كلها lead magnets + روابط طبيعية.
8. **تحسين Core Web Vitals**: ضبط Cairo preload، استبدال iframe بصورة مع lazy-load عند النقر، تقسيم CSS (critical/async).
9. **مراقبة GSC أسبوعيًا**: Coverage + Core Web Vitals + Manual Actions + Links.
10. **حملة PR قانونية**: تحليل قانوني فوري للأنظمة الجديدة (نظام المعاملات المدنية 2023، نظام الشركات 2022) في أول 24 ساعة من إصدارها ← Backlinks طبيعية.

---

## 8) خلاصة نهائية

موقع `saleh-lawyer.com` يقع في **منطقة "أساس جيد لكن ينقصه التنفيذ والتعميق"**. البنية التقنية (Netlify + HTTPS + Schema + hreflang + sitemap) تشكّل **40%** من المعادلة وهي ممتازة. لكن **60%** المتبقية (محتوى عميق + سلطة + Local SEO نظيف + تطابق Schema مع الواقع + باك لينكس + GBP) هي ما يفصلك عن الصفحة الأولى.

**أولوية رقم 1 خلال 72 ساعة**: إصلاح `aggregateRating` المفبرك ظاهريًا و `openingHours` و البريد المختلف النطاق — هذه ثلاث إشارات سلبية قد تستدعي مراجعة جودة يدوية من Google.

**أولوية رقم 2 خلال أسبوعين**: Quick Wins الـ 15 أعلاه.

**أولوية رقم 3 خلال 6 أشهر**: محتوى + باك لينكس + GBP.

عند تنفيذ هذه التوصيات، تقييم الموقع المتوقع: **85–90 / 100**، مع قابلية حقيقية للتصدّر على كلمات تنافسية متوسطة في الرياض.

---

*التقرير مبني على فحص حقيقي للكود والترويسات بتاريخ 2026-05-27. لقياس Core Web Vitals بدقة أرقامية يُوصى بتشغيل [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fsaleh-lawyer.com%2F) و [Rich Results Test](https://search.google.com/test/rich-results?url=https%3A%2F%2Fsaleh-lawyer.com%2F) و [Schema Validator](https://validator.schema.org/#url=https%3A%2F%2Fsaleh-lawyer.com%2F) مباشرة، ثم ربط الموقع بـ Google Search Console و Ahrefs/SEMrush للحصول على بيانات الباك لينكس الفعلية.*
