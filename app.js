/* =========================================================
   MedCEO OS
   Main Application
========================================================= */

import {
    analyzeWithGemini,
    buildWeeklyPlan,
    generateDailyTasks
} from "./ai-service.js";


/* =========================================================
   Storage
========================================================= */

const STORAGE_KEY = "medceo_os_v1";


const defaultState = {

    settings: {
        apiKey: ""
    },

    daily: {

        sleep: 7,

        energy: 7,

        shiftHours: 0,

        onCall: false,

        worship: {
            fajr: false,
            dhuhr: false,
            asr: false,
            maghrib: false,
            isha: false,
            quran: false,
            sunnah: false
        },

        scores: {
            medicine: 5,
            health: 5,
            english: 5,
            company: 5,
            wealth: 5,
            relationships: 5
        },

        achievement: "",

        obstacle: ""
    },


    tasks: [],


    strategy: {

        vision:
            "بناء حياة مهنية ومالية وصحية متوازنة",

        yearlyGoals: [
            "تطوير المسار الطبي",
            "بناء مصدر دخل إضافي",
            "تحسين الصحة واللياقة",
            "رفع مستوى الإنجليزية"
        ],

        quarterlyGoals: [
            "بناء نظام عمل مستمر",
            "تطوير مهارة طبية عالية القيمة",
            "إنشاء أصل رقمي أو تجاري"
        ],

        weeklyPlan:
            "حدد أهم نتيجة للأسبوع ثم حولها إلى جلسات عمل."
    },


    ai: {

        lastReport: "",

        lastAnalysisDate: null,

        weeklyPlan: ""
    }
};


/* =========================================================
   State
========================================================= */

let state = loadState();


function loadState() {

    try {

        const raw =
            localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return structuredClone(defaultState);
        }

        const saved = JSON.parse(raw);

        return mergeDeep(
            structuredClone(defaultState),
            saved
        );

    } catch (error) {

        console.error(error);

        return structuredClone(defaultState);
    }
}


function mergeDeep(target, source) {

    for (const key of Object.keys(source || {})) {

        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {

            target[key] = mergeDeep(
                target[key] || {},
                source[key]
            );

        } else {

            target[key] = source[key];
        }
    }

    return target;
}


function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}


/* =========================================================
   Date
========================================================= */

function getDateKey(date = new Date()) {

    return date.toISOString().split("T")[0];
}


function formatDate() {

    return new Intl.DateTimeFormat(
        "ar",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(new Date());
}


/* =========================================================
   Navigation
========================================================= */

function initNavigation() {

    document
        .querySelectorAll("[data-page]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    showPage(page);
                }
            );
        });
}


function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove("active");
        });


    const target =
        document.getElementById(
            `page-${page}`
        );

    if (target) {
        target.classList.add("active");
    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page === page
            );
        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   Readiness
========================================================= */

function calculateReadiness() {

    const sleep =
        Number(state.daily.sleep || 0);

    const energy =
        Number(state.daily.energy || 0);

    const shift =
        Number(state.daily.shiftHours || 0);


    const taskCompletion =
        calculateTaskCompletion();


    const worship =
        calculateWorshipCompletion();


    let sleepScore =
        Math.min(sleep / 8, 1) * 100;


    let energyScore =
        (energy / 10) * 100;


    let workloadPenalty =
        Math.min(shift * 2.5, 25);


    let score =
        (
            sleepScore * 0.30 +
            energyScore * 0.30 +
            taskCompletion * 0.20 +
            worship * 0.10 +
            (100 - workloadPenalty) * 0.10
        );


    return Math.round(
        Math.max(0, Math.min(100, score))
    );
}


/* =========================================================
   Tasks
========================================================= */

function calculateTaskCompletion() {

    if (!state.tasks.length) {
        return 0;
    }


    const completed =
        state.tasks.filter(
            task => task.done
        ).length;


    return Math.round(
        completed /
        state.tasks.length *
        100
    );
}


function renderTasks() {

    const container =
        document.getElementById("taskList");


    if (!state.tasks.length) {

        container.innerHTML = `
            <div class="glass"
                 style="padding:20px;text-align:center">
                <p class="muted">
                    لا توجد مهام اليوم.
                </p>

                <button
                    class="primary-btn"
                    id="emptyAddTask"
                >
                    إنشاء أول مهمة
                </button>
            </div>
        `;


        document
            .getElementById("emptyAddTask")
            ?.addEventListener(
                "click",
                openTaskModal
            );

        return;
    }


    container.innerHTML =
        state.tasks
            .map(task => `

                <div class="task-item
                    ${task.done ? "done" : ""}">

                    <input
                        class="task-checkbox"
                        type="checkbox"
                        data-task-id="${task.id}"
                        ${task.done ? "checked" : ""}
                    >

                    <div class="task-content">

                        <div class="task-title">
                            ${escapeHTML(task.title)}
                        </div>

                        <div class="task-meta">
                            ${domainLabel(task.domain)}
                            • ${task.duration} دقيقة
                        </div>

                    </div>

                    <button
                        class="delete-task"
                        data-delete-task="${task.id}"
                    >
                        ×
                    </button>

                </div>

            `)
            .join("");


    container
        .querySelectorAll("[data-task-id]")
        .forEach(input => {

            input.addEventListener(
                "change",
                () => {

                    const task =
                        state.tasks.find(
                            item =>
                                item.id ===
                                input.dataset.taskId
                        );

                    if (task) {

                        task.done =
                            input.checked;

                        saveState();

                        renderAll();
                    }
                }
            );
        });


    container
        .querySelectorAll("[data-delete-task]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.tasks =
                        state.tasks.filter(
                            task =>
                                task.id !==
                                button.dataset.deleteTask
                        );

                    saveState();

                    renderAll();
                }
            );
        });
}


function addTask(
    title,
    domain = "medicine",
    duration = 30
) {

    if (!title.trim()) {
        return;
    }


    state.tasks.push({

        id:
            crypto.randomUUID(),

        title:
            title.trim(),

        domain,

        duration:

            Number(duration) || 30,

        done:
            false,

        createdAt:
            new Date().toISOString()
    });


    saveState();

    renderAll();
}


/* =========================================================
   Worship
========================================================= */

function calculateWorshipCompletion() {

    const worship =
        state.daily.worship;


    const values =
        Object.values(worship);


    const completed =
        values.filter(Boolean).length;


    return Math.round(
        completed /
        values.length *
        100
    );
}


function renderWorship() {

    document
        .querySelectorAll("[data-worship]")
        .forEach(input => {

            input.checked =
                Boolean(
                    state.daily.worship[
                        input.dataset.worship
                    ]
                );
        });


    const progress =
        calculateWorshipCompletion();


    document
        .getElementById("worshipProgress")
        .style.width =
            `${progress}%`;


    document
        .getElementById("worshipProgressText")
        .textContent =
            `${progress}%`;
}


/* =========================================================
   Daily Inputs
========================================================= */

function loadDailyInputs() {

    const daily =
        state.daily;


    document.getElementById(
        "sleepInput"
    ).value = daily.sleep;


    document.getElementById(
        "energyInput"
    ).value = daily.energy;


    document.getElementById(
        "energyOutput"
    ).textContent = daily.energy;


    document.getElementById(
        "shiftHoursInput"
    ).value = daily.shiftHours;


    document.getElementById(
        "onCallInput"
    ).checked = daily.onCall;


    Object.entries(
        daily.scores
    ).forEach(([domain, score]) => {

        const input =
            document.querySelector(
                `.score-input[data-domain="${domain}"]`
            );

        const output =
            document.querySelector(
                `[data-output="${domain}"]`
            );

        if (input) {
            input.value = score;
        }

        if (output) {
            output.textContent = score;
        }
    });


    document.getElementById(
        "achievementInput"
    ).value =
        daily.achievement;


    document.getElementById(
        "obstacleInput"
    ).value =
        daily.obstacle;
}


/* =========================================================
   Save Daily
========================================================= */

function saveDailyData() {

    state.daily.sleep =
        Number(
            document.getElementById(
                "sleepInput"
            ).value
        ) || 0;


    state.daily.energy =
        Number(
            document.getElementById(
                "energyInput"
            ).value
        ) || 0;


    state.daily.shiftHours =
        Number(
            document.getElementById(
                "shiftHoursInput"
            ).value
        ) || 0;


    state.daily.onCall =
        document.getElementById(
            "onCallInput"
        ).checked;


    saveState();

    renderAll();

    showToast(
        "تم حفظ بيانات اليوم ✓"
    );
}


/* =========================================================
   Evaluation
========================================================= */

function saveEvaluation() {

    document
        .querySelectorAll(".score-input")
        .forEach(input => {

            state.daily.scores[
                input.dataset.domain
            ] =
                Number(input.value);
        });


    state.daily.achievement =
        document.getElementById(
            "achievementInput"
        ).value;


    state.daily.obstacle =
        document.getElementById(
            "obstacleInput"
        ).value;


    saveState();

    renderAll();

    showToast(
        "تم حفظ التقييم ✓"
    );
}


/* =========================================================
   AI Data
========================================================= */

function buildAIData() {

    return {

        date:
            getDateKey(),

        readiness:
            calculateReadiness(),

        daily:
            state.daily,

        tasks: {

            total:
                state.tasks.length,

            completed:
                state.tasks.filter(
                    task => task.done
                ).length,

            completion:
                calculateTaskCompletion(),

            items:
                state.tasks
        },

        strategy:
            state.strategy,

        previousAI:
            state.ai.lastReport

    };
}


/* =========================================================
   AI Analysis
========================================================= */

async function runAIAnalysis() {

    const button =
        document.getElementById(
            "analyzeBtn"
        );

    const report =
        document.getElementById(
            "aiReport"
        );


    const apiKey =
        state.settings.apiKey;


    if (!apiKey) {

        report.textContent =
            "أضف Gemini API Key من الإعدادات أولاً.";

        showPage("settings");

        return;
    }


    button.disabled = true;

    button.textContent =
        "🧠 جاري التحليل...";


    report.textContent =
        "يقوم MedCEO بتحليل يومك وبناء الخطوة التالية...";


    try {

        const result =
            await analyzeWithGemini(
                buildAIData(),
                apiKey
            );


        state.ai.lastReport =
            result;


        state.ai.lastAnalysisDate =
            new Date().toISOString();


        saveState();


        report.textContent =
            result;


    } catch (error) {

        console.error(error);

        report.textContent =
            `حدث خطأ:\n${error.message}`;

    } finally {

        button.disabled = false;

        button.textContent =
            "🧠 تحليل يومي بالذكاء الاصطناعي";
    }
}


/* =========================================================
   Weekly AI Plan
========================================================= */

async function generateWeeklyPlanAI() {

    const apiKey =
        state.settings.apiKey;


    if (!apiKey) {

        showToast(
            "أضف Gemini API Key أولاً."
        );

        return;
    }


    try {

        showToast(
            "جاري بناء الخطة الأسبوعية..."
        );


        const plan =
            await buildWeeklyPlan(
                buildAIData(),
                apiKey
            );


        state.ai.weeklyPlan =
            plan;


        state.strategy.weeklyPlan =
            plan;


        saveState();

        renderStrategy();


        showToast(
            "تم بناء الخطة الأسبوعية ✓"
        );

    } catch (error) {

        showToast(
            error.message
        );
    }
}


/* =========================================================
   Strategy
========================================================= */

const DOMAIN_NAMES = {

    medicine: "الطب",

    company: "الشركة",

    health: "الصحة",

    english: "الإنجليزية",

    relationships: "العلاقات",

    wealth: "الثروة",

    worship: "العبادات"
};


function domainLabel(domain) {

    return DOMAIN_NAMES[domain]
        || domain;
}


function renderStrategy() {

    document.getElementById(
        "visionText"
    ).textContent =
        state.strategy.vision;


    document.getElementById(
        "yearGoals"
    ).innerHTML =
        state.strategy.yearlyGoals
            .map(goal => `
                <p>• ${escapeHTML(goal)}</p>
            `)
            .join("");


    document.getElementById(
        "quarterGoals"
    ).innerHTML =
        state.strategy.quarterlyGoals
            .map(goal => `
                <p>• ${escapeHTML(goal)}</p>
            `)
            .join("");


    document.getElementById(
        "weeklyPlan"
    ).innerHTML =
        `
        <p class="muted">
            ${escapeHTML(
                state.strategy.weeklyPlan
            )}
        </p>

        <button
            id="generateWeeklyBtn"
            class="secondary-btn"
        >
            🤖 توليد خطة أسبوعية بالـAI
        </button>
        `;


    document
        .getElementById("generateWeeklyBtn")
        ?.addEventListener(
            "click",
            generateWeeklyPlanAI
        );


    renderDomains();
}


function renderDomains() {

    const container =
        document.getElementById(
            "domainCards"
        );


    const domains = [
        "medicine",
        "company",
        "health",
        "english",
        "relationships",
        "wealth",
        "worship"
    ];


    container.innerHTML =
        domains.map(domain => {

            let score = 5;


            if (
                state.daily.scores[domain] !==
                undefined
            ) {
                score =
                    state.daily.scores[domain];
            }


            if (domain === "worship") {

                score =
                    Math.round(
                        calculateWorshipCompletion()
                        / 10
                    );
            }


            return `

                <div class="domain-card glass">

                    <h3>
                        ${domainLabel(domain)}
                    </h3>

                    <span class="domain-score">
                        ${score}/10
                    </span>

                    <p class="muted">
                        التطور المستمر
                    </p>

                </div>

            `;

        }).join("");
}


/* =========================================================
   Settings
========================================================= */

function loadSettings() {

    document.getElementById(
        "apiKeyInput"
    ).value =
        state.settings.apiKey || "";
}


function saveApiKey() {

    state.settings.apiKey =
        document.getElementById(
            "apiKeyInput"
        ).value.trim();


    saveState();


    showToast(
        "تم حفظ المفتاح محلياً ✓"
    );
}


function clearApiKey() {

    state.settings.apiKey = "";

    saveState();

    document.getElementById(
        "apiKeyInput"
    ).value = "";


    showToast(
        "تم حذف المفتاح."
    );
}


/* =========================================================
   Task Modal
========================================================= */

function openTaskModal() {

    document
        .getElementById("taskModal")
        .classList.add("show");


    document
        .getElementById("taskTitleInput")
        .focus();
}


function closeTaskModal() {

    document
        .getElementById("taskModal")
        .classList.remove("show");
}


function saveModalTask() {

    const title =
        document.getElemen