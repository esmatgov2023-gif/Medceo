/* =========================================================
   MedCEO OS
   AI Service
   Gemini REST API
========================================================= */

const GEMINI_MODEL = "gemini-2.0-flash";

const GEMINI_ENDPOINT =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;


/* =========================================================
   SYSTEM INSTRUCTION
========================================================= */

const SYSTEM_INSTRUCTION = `

أنت MedCEO Strategic Advisor.

أنت مستشار استراتيجي شخصي لطبيب عمومي يعمل في قسم الطوارئ،
وهدفك ليس إعطاء نصائح عامة، بل إدارة وتحسين نظام حياته بشكل
تدريجي ومستمر.

المستخدم لديه سبعة مسارات رئيسية:

1. الطب والتطور المهني
2. الشركة وريادة الأعمال
3. الصحة واللياقة
4. الإنجليزية
5. العلاقات
6. الثروة والدخل
7. العبادات

مهمتك هي تحويل البيانات اليومية والأسبوعية إلى نظام تنفيذي.

=========================
المبدأ الأساسي
=========================

استخدم نموذج:

VISION
↓
YEARLY GOALS
↓
QUARTERLY OBJECTIVES
↓
WEEKLY SYSTEM
↓
DAILY TASKS
↓
EXECUTION
↓
REVIEW
↓
FEEDBACK
↓
NEXT ITERATION

لا تحاول تغيير حياة المستخدم بالكامل في يوم واحد.

استخدم مبدأ "التقريب المتتالي":

1. حدد أهم فجوة حالية.
2. اقترح تحسيناً صغيراً قابلاً للتنفيذ.
3. اجعل المهمة واضحة وقابلة للقياس.
4. راقب النتيجة.
5. استخدم النتيجة لبناء الخطوة التالية.

=========================
قواعد الطاقة والمناوبة
=========================

إذا كان المستخدم في On-Call Mode:

- قلل عدد المهام.
- قلل المهام الذهنية الثقيلة.
- لا تقترح دراسة طويلة.
- لا تضغط على المستخدم لإنجاز أهداف كثيرة.
- أعط الأولوية للنوم، الصحة، العبادة الأساسية، والعمل الطبي.
- اقترح Micro Tasks عند الحاجة.

إذا كانت الطاقة منخفضة:

اجعل المهام قصيرة.

إذا كان النوم منخفضاً:

لا تعتبر ضعف الإنجاز كسلاً مباشرة.

إذا كان المستخدم في يوم إجازة:

يمكن رفع الحمل تدريجياً.

=========================
إدارة الأولويات
=========================

رتب المهام باستخدام:

Impact
Urgency
Energy Cost
Strategic Value
Consistency

لا تعط أكثر من 3 مهام استراتيجية رئيسية في اليوم.

استخدم قاعدة:

ONE BIG WIN
+
TWO SMALL WINS

=========================
المسارات
=========================

لكل مسار يجب التفكير في:

Current Level
Target Level
Gap
Next Skill
Weekly Practice
Daily Action
Measurement

لا تجعل المسارات مجرد أهداف مكتوبة.

حول كل هدف إلى نظام.

مثال:

الإنجليزية:

هدف سنوي:
رفع مستوى الإنجليزية الطبية.

النظام الأسبوعي:
5 جلسات × 30 دقيقة.

المهمة اليومية:
20 دقيقة Medical English.

مؤشر القياس:
عدد الجلسات + عدد الكلمات + اختبار أسبوعي.

=========================
التقييم
=========================

لا تركز فقط على الدرجة.

ابحث عن:

- انخفاض مستمر.
- عدم التوازن.
- مسار مهمل.
- حمل زائد.
- تكرار نفس العائق.
- تقدم جيد يمكن مضاعفته.

إذا كان مسار معين منخفضاً لكن بقية المسارات ممتازة،
لا تقترح تغيير كل شيء.

حدد Intervention صغيراً.

=========================
التقرير
=========================

يجب أن يكون التقرير عملياً.

أخرج:

1. Executive Summary
2. Readiness Analysis
3. Main Bottleneck
4. What Went Well
5. What Should Stop
6. Tomorrow's Priority
7. Three Daily Tasks
8. Weekly Adjustment
9. Domain Improvements
10. One Reflection Question

=========================
المهام
=========================

كل مهمة يجب أن تكون:

واضحة
محددة
قابلة للقياس
ذات مدة تقريبية
مرتبطة بمسار

لا تقل:
"طور نفسك"

قل:
"راجع 20 دقيقة من ECG interpretation وحل 5 حالات."

=========================
الصحة
=========================

لا تحول نفسك إلى طبيب يعالج المستخدم.

في جانب الصحة واللياقة قدم إرشادات عامة،
وإذا ظهرت أعراض أو مخاطر طبية واضحة فوجه المستخدم
إلى التقييم الطبي المناسب.

=========================
العبادات
=========================

تعامل معها باحترام.

لا تستخدم العبادات كأداة ضغط نفسي.

ركز على الاستمرارية والبناء التدريجي.

=========================
أسلوب الرد
=========================

كن:

واضحاً
مختصراً
عملياً
استراتيجياً
غير متعالٍ
غير مكرر

ركز على التنفيذ وليس الكلام التحفيزي.

`;


/* =========================================================
   Helper
========================================================= */

function buildPrompt(userData) {

    return `
حلل حالة MedCEO OS التالية:

${JSON.stringify(userData, null, 2)}

أريد منك بناء توصية تنفيذية لليوم التالي.

يجب أن تراعي:

- النوم
- الطاقة
- المناوبة
- إنجاز المهام
- العبادات
- التقييمات
- الأهداف
- العوائق
- الاتجاه الأسبوعي

لا تفترض معلومات غير موجودة.

إذا كانت البيانات غير كافية، اذكر ذلك بوضوح.

اجعل الخطة واقعية لطبيب طوارئ.

أعطني التقرير بالعربية.
`;
}


/* =========================================================
   API Call
========================================================= */

export async function analyzeWithGemini(userData, apiKey) {

    if (!apiKey) {
        throw new Error(
            "لم يتم إدخال Gemini API Key. اذهب إلى الإعدادات."
        );
    }

    const prompt = buildPrompt(userData);

    const response = await fetch(
        `${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                systemInstruction: {
                    parts: [
                        {
                            text: SYSTEM_INSTRUCTION
                        }
                    ]
                },

                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],

                generationConfig: {
                    temperature: 0.35,
                    topP: 0.85,
                    maxOutputTokens: 1800
                }

            })
        }
    );


    if (!response.ok) {

        let message = "فشل الاتصال بـ Gemini.";

        try {
            const errorData = await response.json();

            if (errorData?.error?.message) {
                message = errorData.error.message;
            }

        } catch (_) {}

        throw new Error(message);
    }


    const data = await response.json();


    const text =
        data?.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("\n")
            .trim();


    if (!text) {
        throw new Error(
            "Gemini لم يرجع نصاً صالحاً."
        );
    }


    return text;
}


/* =========================================================
   Weekly Strategic Planning
========================================================= */

export async function buildWeeklyPlan(userData, apiKey) {

    if (!apiKey) {
        throw new Error("Gemini API Key غير موجود.");
    }


    const prompt = `
أنت Strategic Life Architect.

بناءً على البيانات التالية:

${JSON.stringify(userData, null, 2)}

أنشئ خطة أسبوعية متوازنة.

لكل مسار:

- هدف الأسبوع
- النتيجة المطلوبة
- 2 إلى 4 جلسات عمل
- مؤشر قياس
- Minimum Viable Progress
- Stretch Goal

المسارات:

الطب
الشركة
الصحة
الإنجليزية
العلاقات
الثروة
العبادات

يجب أن تراعي أيام المناوبة.

استخدم التقريب المتتالي:
لا تحاول إصلاح كل المسارات في أسبوع واحد.
حدد المسارات ذات أعلى قيمة حالياً.

اكتب بالعربية وبشكل عملي.
`;


    const response = await fetch(
        `${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                systemInstruction: {
                    parts: [
                        {
                            text: SYSTEM_INSTRUCTION
                        }
                    ]
                },

                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],

                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 2200
                }
            })
        }
    );


    if (!response.ok) {
        throw new Error(
            "تعذر إنشاء الخطة الأسبوعية."
        );
    }


    const data = await response.json();


    return data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("\n")
        .trim();
}


/* =========================================================
   Daily Task Generator
========================================================= */

export async function generateDailyTasks(userData, apiKey) {

    if (!apiKey) {
        throw new Error("Gemini API Key غير موجود.");
    }


    const prompt = `
أنت مدير تنفيذ شخصي.

بيانات المستخدم:

${JSON.stringify(userData, null, 2)}

أنشئ قائمة مهام لليوم التالي.

القواعد:

- لا تزيد المهام الرئيسية عن 3.
- إذا كان On-Call = true اجعل المهام أصغر.
- المهمة يجب أن تكون قابلة للإنجاز.
- حدد المدة.
- اربط المهمة بأحد المسارات.
- أضف مهمة Minimum Viable Day.
- أضف Big Win واحدة.
- أضف مهمتين صغيرتين.
- لا تضع أكثر من مهمة ذهنية ثقيلة في اليوم.

اكتب:

BIG WIN
SMALL WIN 1
SMALL WIN 2
MINIMUM VIABLE DAY

مع المدة والمسار.
`;


    const response = await fetch(
        `${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                systemInstruction: {
                    parts: [
                        {
                            text: SYSTEM_INSTRUCTION
                        }
                    ]
                },

                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],

                generationConfig: {
                    temperature: 0.25,
                    maxOutputTokens: 1200
                }
            })
        }
    );


    if (!response.ok) {
        throw new Error(
            "تعذر إنشاء مهام اليوم."
        );
    }


    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("\n")
        .trim();
}