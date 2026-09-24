<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="theme-color" content="#0b1020">
    <meta name="description" content="MedCEO OS - Personal Operating System">

    <title>MedCEO OS</title>

    <link rel="stylesheet" href="styles.css">
</head>

<body>

<div id="app">

    <!-- ================= HEADER ================= -->
    <header class="topbar">
        <div>
            <div class="brand">MedCEO <span>OS</span></div>
            <div class="date" id="currentDate"></div>
        </div>

        <button class="icon-btn" data-page="settings" aria-label="الإعدادات">
            ⚙️
        </button>
    </header>


    <!-- ================= MAIN ================= -->
    <main id="mainContent">

        <!-- ================= DASHBOARD ================= -->
        <section class="page active" id="page-dashboard">

            <div class="hero-card glass">
                <div>
                    <p class="eyebrow">PERSONAL OPERATING SYSTEM</p>
                    <h1>صباح القيادة، طبيب 👨‍⚕️</h1>
                    <p class="muted">
                        ابنِ يومك اليوم بطريقة تجعل مستقبلك أسهل غداً.
                    </p>
                </div>

                <div class="readiness-ring">
                    <span id="readinessScore">0</span>
                    <small>جاهزية</small>
                </div>
            </div>


            <!-- Readiness -->
            <div class="section-title">
                <h2>جاهزية اليوم</h2>
            </div>

            <div class="grid-3">

                <div class="metric-card glass">
                    <span>😴 النوم</span>
                    <strong>
                        <span id="sleepValue">0</span>
                        ساعة
                    </strong>
                </div>

                <div class="metric-card glass">
                    <span>⚡ الطاقة</span>
                    <strong>
                        <span id="energyValue">0</span>/10
                    </strong>
                </div>

                <div class="metric-card glass">
                    <span>🏥 المناوبة</span>
                    <strong id="shiftStatus">لا توجد</strong>
                </div>

            </div>


            <!-- Daily tasks -->
            <div class="section-title">
                <h2>مهام اليوم</h2>

                <button class="text-btn" id="addTaskBtn">
                    + مهمة
                </button>
            </div>

            <div class="progress-container glass">
                <div class="progress-header">
                    <span>إنجاز اليوم</span>
                    <strong id="taskProgressText">0%</strong>
                </div>

                <div class="progress">
                    <div id="taskProgress"></div>
                </div>
            </div>

            <div id="taskList" class="task-list"></div>


            <!-- AI -->
            <div class="section-title">
                <h2>🧠 المستشار الاستراتيجي</h2>
            </div>

            <div class="ai-card glass">

                <div class="ai-header">
                    <div class="ai-avatar">AI</div>

                    <div>
                        <strong>MedCEO Advisor</strong>
                        <p class="muted">
                            يحلل يومك ويقترح الخطوة التالية.
                        </p>
                    </div>
                </div>

                <div id="aiReport" class="ai-report">
                    لم يتم تحليل اليوم بعد.
                </div>

                <button id="analyzeBtn" class="primary-btn">
                    🧠 تحليل يومي بالذكاء الاصطناعي
                </button>

            </div>

        </section>


        <!-- ================= DAILY ================= -->
        <section class="page" id="page-daily">

            <div class="page-heading">
                <p class="eyebrow">DAILY CONTROL</p>
                <h1>اليوم</h1>
                <p class="muted">
                    أدخل بياناتك اليومية ثم دع النظام يحسب جاهزيتك.
                </p>
            </div>


            <div class="form-card glass">

                <label>
                    ساعات النوم
                    <input
                        id="sleepInput"
                        type="number"
                        min="0"
                        max="16"
                        step="0.5"
                        placeholder="مثلاً 7"
                    >
                </label>

                <label>
                    مستوى الطاقة
                    <input
                        id="energyInput"
                        type="range"
                        min="1"
                        max="10"
                        value="7"
                    >
                    <output id="energyOutput">7</output>/10
                </label>

                <label>
                    ساعات المناوبة
                    <input
                        id="shiftHoursInput"
                        type="number"
                        min="0"
                        max="24"
                        step="1"
                        placeholder="0"
                    >
                </label>

                <label class="switch-row">
                    <span>
                        🏥 وضع المناوبة
                        <small>
                            يخفف الحمل اليومي تلقائياً
                        </small>
                    </span>

                    <input
                        id="onCallInput"
                        type="checkbox"
                    >
                </label>

                <button
                    id="saveDailyBtn"
                    class="primary-btn"
                >
                    حفظ بيانات اليوم
                </button>

            </div>


            <!-- Worship -->
            <div class="section-title">
                <h2>🕌 العبادات</h2>
            </div>

            <div class="worship-grid glass">

                <label class="check-row">
                    <input type="checkbox" data-worship="fajr">
                    الفجر
                </label>

                <label class="check-row">
                    <input type="checkbox" data-worship="dhuhr">
                    الظهر
                </label>

                <label class="check-row">
                    <input type="checkbox" data-worship="asr">
                    العصر
                </label>

                <label class="check-row">
                    <input type="checkbox" data-worship="maghrib">
                    المغرب
                </label>

                <label class="check-row">
                    <input type="checkbox" data-worship="isha">
                    العشاء
                </label>

                <label class="check-row">
                    <input type="checkbox" data-worship="quran">
                    ورد القرآن
                </label>

                <label class="check-row">
                    <input type="checkbox" data-worship="sunnah">
                    النوافل
                </label>

            </div>

            <div class="progress-container glass">
                <div class="progress-header">
                    <span>العبادات</span>
                    <strong id="worshipProgressText">0%</strong>
                </div>

                <div class="progress">
                    <div id="worshipProgress"></div>
                </div>
            </div>


            <!-- Self evaluation -->
            <div class="section-title">
                <h2>📊 تقييم اليوم</h2>
            </div>

            <div class="form-card glass">

                <label>
                    الطب
                    <input
                        class="score-input"
                        data-domain="medicine"
                        type="range"
                        min="1"
                        max="10"
                        value="5"
                    >
                    <output data-output="medicine">5</output>/10
                </label>

                <label>
                    الصحة
                    <input
                        class="score-input"
                        data-domain="health"
                        type="range"
                        min="1"
                        max="10"
                        value="5"
                    >
                    <output data-output="health">5</output>/10
                </label>

                <label>
                    الإنجليزية
                    <input
                        class="score-input"
                        data-domain="english"
                        type="range"
                        min="1"
                        max="10"
                        value="5"
                    >
                    <output data-output="english">5</output>/10
                </label>

                <label>
                    الشركة
                    <input
                        class="score-input"
                        data-domain="company"
                        type="range"
                        min="1"
                        max="10"
                        value="5"
                    >
                    <output data-output="company">5</output>/10
                </label>

                <label>
                    الثروة
                    <input
                        class="score-input"
                        data-domain="wealth"
                        type="range"
                        min="1"
                        max="10"
                        value="5"
                    >
                    <output data-output="wealth">5</output>/10
                </label>

                <label>
                    العلاقات
                    <input
                        class="score-input"
                        data-domain="relationships"
                        type="range"
                        min="1"
                        max="10"
                        value="5"
                    >
                    <output data-output="relationships">5</output>/10
                </label>

            </div>


            <div class="form-card glass">

                <label>
                    أكبر إنجاز اليوم
                    <textarea
                        id="achievementInput"
                        placeholder="ما أهم شيء أنجزته اليوم؟"
                    ></textarea>
                </label>

                <label>
                    أكبر عائق
                    <textarea
                        id="obstacleInput"
                        placeholder="ما الشيء الذي عطلك؟"
                    ></textarea>
                </label>

                <button
                    id="saveEvaluationBtn"
                    class="primary-btn"
                >
                    حفظ التقييم
                </button>

            </div>

        </section>


        <!-- ================= STRATEGY ================= -->
        <section class="page" id="page-strategy">

            <div class="page-heading">
                <p class="eyebrow">STRATEGIC ENGINE</p>
                <h1>الهرم الاستراتيجي</h1>
                <p class="muted">
                    حوّل الرؤية إلى أنظمة ومهام قابلة للتنفيذ.
                </p>
            </div>


            <div class="strategy-stack">

                <div class="strategy-level glass">
                    <span>01</span>
                    <div>
                        <small>VISION</small>
                        <h3 id="visionText">
                            بناء حياة مهنية ومالية وصحية متوازنة
                        </h3>
                    </div>
                </div>

                <div class="strategy-level glass">
                    <span>02</span>
                    <div>
                        <small>YEARLY GOALS</small>
                        <div id="yearGoals"></div>
                    </div>
                </div>

                <div class="strategy-level glass">
                    <span>03</span>
                    <div>
                        <small>QUARTERLY FOCUS</small>
                        <div id="quarterGoals"></div>
                    </div>
                </div>

                <div class="strategy-level glass">
                    <span>04</span>
                    <div>
                        <small>WEEKLY SYSTEM</small>
                        <div id="weeklyPlan"></div>
                    </div>
                </div>

                <div class="strategy-level glass">
                    <span>05</span>
                    <div>
                        <small>DAILY EXECUTION</small>
                        <p class="muted">
                            المهام اليومية هي أصغر وحدة لبناء المستقبل.
                        </p>
                    </div>
                </div>

            </div>


            <div class="section-title">
                <h2>المسارات</h2>
            </div>

            <div id="domainCards" class="domain-grid"></div>


            <div class="section-title">
                <h2>➕ إضافة هدف</h2>
            </div>

            <div class="form-card glass">

                <label>
                    الهدف
                    <input
                        id="goalTitle"
                        placeholder="مثلاً: تحسين الإنجليزية الطبية"
                    >
                </label>

                <label>
                    المسار
                    <select id="goalDomain">
                        <option value="medicine">الطب</option>
                        <option value="company">الشركة</option>
                        <option value="health">الصحة</option>
                        <option value="english">الإنجليزية</option>
                        <option value="relationships">العلاقات</option>
                        <option value="wealth">الثروة</option>
                        <option value="worship">العبادات</option>
                    </select>
                </label>

                <button
                    id="addGoalBtn"
                    class="primary-btn"
                >
                    إضافة الهدف
                </button>

            </div>

        </section>


        <!-- ================= SETTINGS ================= -->
        <section class="page" id="page-settings">

            <div class="page-heading">
                <p class="eyebrow">SYSTEM SETTINGS</p>
                <h1>الإعدادات</h1>
            </div>


            <div class="settings-card glass">

                <h3>🤖 Gemini AI</h3>

                <p class="muted">
                    المفتاح يتم تخزينه محلياً في هذا المتصفح فقط.
                </p>

                <label>
                    Gemini API Key
                    <input
                        id="apiKeyInput"
                        type="password"
                        placeholder="AIza..."
                        autocomplete="off"
                    >
                </label>

                <div class="button-row">

                    <button
                        id="saveApiKeyBtn"
                        class="primary-btn"
                    >
                        حفظ المفتاح
                    </button>

                    <button
                        id="clearApiKeyBtn"
                        class="danger-btn"
                    >
                        حذف
                    </button>

                </div>

            </div>


            <div class="settings-card glass">

                <h3>💾 البيانات</h3>

                <button
                    id="exportBtn"
                    class="secondary-btn"
                >
                    تصدير بياناتي JSON
                </button>

                <label class="secondary-btn file-label">
                    استيراد بيانات
                    <input
                        id="importInput"
                        type="file"
                        accept=".json"
                        hidden
                    >
                </label>

                <button
                    id="resetBtn"
                    class="danger-btn"
                >
                    حذف كل البيانات
                </button>

            </div>


            <div class="settings-card glass">

                <h3>⚠️ الخصوصية</h3>

                <p class="muted">
                    MedCEO OS نسخة Client-Side. بياناتك تحفظ في LocalStorage
                    ولا يتم إرسالها إلى خادم خاص بالتطبيق.
                </p>

                <p class="warning">
                    لا تستخدم API Key حقيقي عالي الصلاحيات في تطبيق GitHub
                    Pages عام إذا كان الهدف منتجاً تجارياً متعدد المستخدمين.
                </p>

            </div>

        </section>

    </main>


    <!-- ================= BOTTOM NAV ================= -->
    <nav class="bottom-nav">

        <button data-page="dashboard" class="nav-item active">
            <span>⌂</span>
            الرئيسية
        </button>

        <button data-page="daily" class="nav-item">
            <span>✓</span>
            اليوم
        </button>

        <button data-page="strategy" class="nav-item">
            <span>♟</span>
            الاستراتيجية
        </button>

        <button data-page="settings" class="nav-item">
            <span>⚙</span>
            الإعدادات
        </button>

    </nav>

</div>


<!-- Task Modal -->
<div id="taskModal" class="modal">

    <div class="modal-box glass">

        <div class="modal-header">
            <h3>إضافة مهمة</h3>

            <button
                id="closeTaskModal"
                class="icon-btn"
            >
                ×
            </button>
        </div>

        <label>
            اسم المهمة
            <input
                id="taskTitleInput"
                placeholder="مثلاً: مراجعة ECG لمدة 30 دقيقة"
            >
        </label>

        <label>
            المسار
            <select id="taskDomainInput">
                <option value="medicine">الطب</option>
                <option value="health">الصحة</option>
                <option value="english">الإنجليزية</option>
                <option value="company">الشركة</option>
                <option value="wealth">الثروة</option>
                <option value="relationships">العلاقات</option>
                <option value="worship">العبادات</option>
            </select>
        </label>

        <label>
            المدة بالدقائق
            <input
                id="taskDurationInput"
                type="number"
                min="5"
                value="30"
            >
        </label>

        <button
            id="saveTaskBtn"
            class="primary-btn"
        >
            إنشاء المهمة
        </button>

    </div>
</div>


<script type="module" src="app.js"></script>

</body>
</html>