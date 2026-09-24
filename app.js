const KEY = "medceo_v1";

const defaults = {
  tasks: [
    {
      id: 1,
      name: "التدريب الطبي / الجراحي",
      duration: 90,
      domain: "🩺 الطب",
      done: false
    },
    {
      id: 2,
      name: "English Speaking & Listening",
      duration: 45,
      domain: "🗣️ الإنجليزية",
      done: false
    },
    {
      id: 3,
      name: "أعلى مهمة أثرًا في الشركة",
      duration: 60,
      domain: "🏢 الشركة",
      done: false
    }
  ],

  domains: {
    medicine: {
      name: "الطب والجراحة",
      icon: "🩺",
      score: 70
    },

    company: {
      name: "الشركة",
      icon: "🏢",
      score: 40
    },

    health: {
      name: "الصحة",
      icon: "❤️",
      score: 75
    },

    english: {
      name: "الإنجليزية",
      icon: "🗣️",
      score: 50
    },

    wealth: {
      name: "الثروة",
      icon: "💰",
      score: 40
    },

    social: {
      name: "العلاقات",
      icon: "🤝",
      score: 65
    }
  },

  goals: [],

  skills: [
    {
      name: "القيادة",
      icon: "♟️",
      score: 40,
      text: "اتخاذ القرار وإدارة الفريق"
    },
    {
      name: "الاستراتيجية",
      icon: "🎯",
      score: 35,
      text: "الميزة التنافسية وتخصيص الموارد"
    },
    {
      name: "المالية",
      icon: "📈",
      score: 25,
      text: "P&L والتدفق النقدي والقوائم المالية"
    },
    {
      name: "المبيعات",
      icon: "🤝",
      score: 30,
      text: "فهم العميل وإغلاق الصفقات"
    },
    {
      name: "التفاوض",
      icon: "⚖️",
      score: 35,
      text: "خلق القيمة وإدارة الاتفاقات"
    },
    {
      name: "Data & AI",
      icon: "✦",
      score: 40,
      text: "البيانات والذكاء الاصطناعي للقيادة"
    }
  ],

  reviews: []
};

let data = load();

function load() {
  try {
    const value =
      JSON.parse(localStorage.getItem(KEY));

    return value || structuredClone(defaults);
  } catch {
    return structuredClone(defaults);
  }
}

function save() {
  localStorage.setItem(
    KEY,
    JSON.stringify(data)
  );
}

function init() {
  setDate();
  renderTasks();
  renderDomains();
  renderGoals();
  renderSkills();
  renderLastReview();
  updateLifeScore();
}

function setDate() {
  const date =
    new Intl.DateTimeFormat(
      "ar",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(new Date());

  document.getElementById(
    "todayDate"
  ).textContent = date;
}

function navigate(page) {
  document
    .querySelectorAll(".page")
    .forEach(x =>
      x.classList.remove("active")
    );

  document
    .getElementById("page-" + page)
    ?.classList.add("active");

  document
    .querySelectorAll(".bottom-nav button")
    .forEach(x =>
      x.classList.remove("nav-active")
    );

  document
    .querySelector(
      `[data-page="${page}"]`
    )
    ?.classList.add("nav-active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function renderTasks() {
  const root =
    document.getElementById("taskList");

  if (!data.tasks.length) {
    root.innerHTML =
      `<p class="muted">
        لا توجد مهام لليوم.
      </p>`;
    return;
  }

  root.innerHTML =
    data.tasks
      .map(
        task => `
          <div
            class="task ${task.done ? "done" : ""}"
          >
            <button
              class="task-check"
              onclick="toggleTask(${task.id})"
            >
              ✓
            </button>

            <div>
              <div class="task-name">
                ${escapeHTML(task.name)}
              </div>

              <small>
                ${escapeHTML(task.domain)}
              </small>
            </div>

            <small>
              ${task.duration}m
            </small>
          </div>
        `
      )
      .join("");
}

function toggleTask(id) {
  const task =
    data.tasks.find(x => x.id === id);

  if (!task) return;

  task.done = !task.done;

  save();
  renderTasks();
  updateLifeScore();
}

function openTaskDialog() {
  document
    .getElementById("taskDialog")
    .showModal();
}

function closeTaskDialog() {
  document
    .getElementById("taskDialog")
    .close();
}

function addTask(event) {
  event.preventDefault();

  const name =
    document
      .getElementById("newTask")
      .value
      .trim();

  if (!name) return;

  data.tasks.push({
    id: Date.now(),

    name,

    duration:
      Number(
        document
          .getElementById("newDuration")
          .value
      ) || 30,

    domain:
      document
        .getElementById("newTaskDomain")
        .value,

    done: false
  });

  save();

  document
    .getElementById("newTask")
    .value = "";

  closeTaskDialog();
  renderTasks();
}

function renderDomains() {
  const root =
    document.getElementById("domainGrid");

  root.innerHTML =
    Object.values(data.domains)
      .map(
        d => `
          <article class="domain">

            <div class="domain-icon">
              ${d.icon}
            </div>

            <div class="domain-head">
              <h4>${d.name}</h4>
              <strong>${d.score}%</strong>
            </div>

            <div class="progress">
              <span
                style="width:${d.score}%"
              ></span>
            </div>

          </article>
        `
      )
      .join("");
}

function updateLifeScore() {
  const scores =
    Object.values(data.domains)
      .map(x => x.score);

  const domainAverage =
    scores.reduce((a,b) => a+b,0) /
    scores.length;

  const taskScore =
    data.tasks.length
      ? (
          data.tasks.filter(x => x.done).length /
          data.tasks.length
        ) * 100
      : 0;

  const total =
    Math.round(
      domainAverage * .65 +
      taskScore * .35
    );

  document.getElementById(
    "lifeScore"
  ).textContent = total;
}

function calculateReadiness() {
  const sleep =
    Number(
      document.getElementById("sleep").value
    ) || 0;

  const energy =
    Number(
      document.getElementById("energy").value
    ) || 0;

  const shift =
    Number(
      document.getElementById("shift").value
    ) || 0;

  const sleepScore =
    Math.min(sleep / 8, 1) * 100;

  const energyScore =
    Math.min(energy / 10, 1) * 100;

  const shiftPenalty =
    Math.min(shift / 24, 1) * 50;

  const readiness =
    Math.max(
      10,
      Math.round(
        sleepScore * .45 +
        energyScore * .55 -
        shiftPenalty
      )
    );

  document.getElementById(
    "readinessValue"
  ).textContent =
    readiness + "%";

  return readiness;
}

function emergencyMode() {
  data.tasks =
    data.tasks.map(task => {
      if (
        task.domain.includes("الإنجليزية")
      ) {
        return {
          ...task,
          duration: 10
        };
      }

      if (
        task.domain.includes("الشركة")
      ) {
        return {
          ...task,
          duration: 20
        };
      }

      return task;
    });

  const hasRecovery =
    data.tasks.some(
      x => x.name.includes("تعاف")
    );

  if (!hasRecovery) {
    data.tasks.push({
      id: Date.now(),
      name: "ماء + وجبة + تعافٍ بعد المناوبة",
      duration: 10,
      domain: "❤️ الصحة",
      done: false
    });
  }

  save();
  renderTasks();

  alert(
    "تم تفعيل وضع المناوبة وخفض الحمل غير الضروري."
  );

  navigate("home");
}

function saveGoal() {
  const text =
    document
      .getElementById("goalText")
      .value
      .trim();

  if (!text) {
    alert("اكتب الهدف أولاً.");
    return;
  }

  data.goals.unshift({
    id: Date.now(),

    text,

    level:
      document
        .getElementById("goalLevel")
        .value,

    domain:
      document
        .getElementById("goalDomain")
        .value,

    created:
      new Date().toISOString()
  });

  save();

  document
    .getElementById("goalText")
    .value = "";

  renderGoals();
}

function renderGoals() {
  const root =
    document.getElementById("goalList");

  if (!data.goals.length) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML =
    data.goals
      .map(
        goal => `
          <article class="glass goal-card">

            <span class="eyebrow gold">
              ${escapeHTML(goal.level)}
              ·
              ${escapeHTML(goal.domain)}
            </span>

            <h3>
              ${escapeHTML(goal.text)}
            </h3>

            <button
              class="small-btn"
              onclick="deleteGoal(${goal.id})"
            >
              حذف
            </button>

          </article>
        `
      )
      .join("");
}

function deleteGoal(id) {
  data.goals =
    data.goals.filter(
      x => x.id !== id
    );

  save();
  renderGoals();
}

function renderSkills() {
  const root =
    document.getElementById("skillList");

  root.innerHTML =
    data.skills
      .map(
        skill => `
          <div class="skill-row">

            <article class="glass">

              <div class="skill-top">
                <h3>
                  ${skill.icon}
                  ${skill.name}
                </h3>

                <strong>
                  ${skill.score}%
                </strong>
              </div>

              <p>
                ${skill.text}
              </p>

              <div class="progress">
                <span
                  style="width:${skill.score}%"
                ></span>
              </div>

            </article>

          </div>
        `
      )
      .join("");
}

function getReviewValue(id) {
  return Math.max(
    0,
    Math.min(
      10,
      Number(
        document
          .getElementById(id)
          .value
      ) || 0
    )
  );
}

function saveReview() {
  const scores = {
    medicine:
      getReviewValue("rMedicine"),

    health:
      getReviewValue("rHealth"),

    company:
      getReviewValue("rCompany"),

    english:
      getReviewValue("rEnglish"),

    wealth:
      getReviewValue("rWealth"),

    social:
      getReviewValue("rSocial")
  };

  Object.keys(scores)
    .forEach(key => {
      const old =
        data.domains[key].score;

      const current =
        scores[key] * 10;

      data.domains[key].score =
        Math.round(
          old * .7 +
          current * .3
        );
    });

  const review = {
    id: Date.now(),
    date: new Date().toISOString(),

    scores,

    win:
      document
        .getElementById("todayWin")
        .value
        .trim(),

    obstacle:
      document
        .getElementById("todayObstacle")
        .value
        .trim()
  };

  data.reviews.unshift(review);

  save();

  renderDomains();
  renderLastReview();
  updateLifeScore();
  generateAdvice();

  alert(
    "تم حفظ التقييم وتحديث النظام."
  );
}

function renderLastReview() {
  const root =
    document.getElementById("lastReview");

  const review =
    data.reviews[0];

  if (!review) {
    root.innerHTML =
      `<p class="muted">
        لا توجد مراجعة بعد.
      </p>`;
    return;
  }

  root.innerHTML = `
    <p>
      <b>الإنجاز:</b>
      ${
        escapeHTML(review.win) ||
        "—"
      }
    </p>

    <p>
      <b>العائق:</b>
      ${
        escapeHTML(review.obstacle) ||
        "—"
      }
    </p>

    <p class="muted">
      ${
        new Date(
          review.date
        ).toLocaleString("ar")
      }
    </p>
  `;
}

function generateAdvice() {
  const domains =
    Object.entries(data.domains);

  const weakest =
    domains.sort(
      (a,b) =>
        a[1].score -
        b[1].score
    )[0][1];

  const unfinished =
    data.tasks.filter(
      x => !x.done
    );

  let text =
    `المجال الأقل تقدماً الآن هو "${weakest.name}" ` +
    `بدرجة ${weakest.score}%. `;

  if (unfinished.length) {
    text +=
      `أكمل أولاً "${unfinished[0].name}"، ` +
      `ثم خصص جلسة مركزة قصيرة لأعلى خطوة ` +
      `قابلة للقياس في ${weakest.name}.`;
  } else {
    text +=
      `أنجزت مهام اليوم. استخدم طاقتك المتبقية ` +
      `لأصغر خطوة عالية الأثر في هذا المجال، ` +
      `أو للتعافي إذا كانت جاهزيتك منخفضة.`;
  }

  document.getElementById(
    "aiAdvice"
  ).textContent = text;

  return text;
}

function buildToday() {
  const weakest =
    Object.values(data.domains)
      .sort(
        (a,b) =>
          a.score - b.score
      )[0];

  alert(
    `اقتراح اليوم:\n\n` +
    `1. حافظ على الهدف الطبي الأساسي.\n` +
    `2. نفذ جلسة الإنجليزية.\n` +
    `3. أعط أولوية إضافية لـ ${weakest.name}.`
  );
}

function showDetail(type) {
  const content = {
    medicine: {
      title: "🩺 الطب والجراحة",
      text:
        "المسار التخصصي، المهارات السريرية، الإجراءات، " +
        "الامتحانات، البحث العلمي والتعليم الطبي المستمر."
    },

    company: {
      title: "🏢 Company OS",
      text:
        "الاستراتيجية، المنتج، العملاء، الإيرادات، الفريق، " +
        "العمليات ومؤشرات الأداء."
    },

    health: {
      title: "❤️ Health OS",
      text:
        "النوم، القوة، الكارديو، التغذية، التعافي " +
        "والاستمرارية خلال المناوبات."
    },

    wealth: {
      title: "💰 Wealth OS",
      text:
        "الدخل، المصروفات، الأصول، الالتزامات، " +
        "صافي الثروة والأهداف المالية."
    },

    english: {
      title: "🗣️ English Year",
      text:
        "Speaking • Listening • Reading • Writing • " +
        "Medical English. الهدف: تقدم قابل للقياس نحو C1."
    }
  };

  const item =
    content[type];

  const card =
    document.getElementById(
      "detailCard"
    );

  card.classList.remove("hidden");

  card.innerHTML = `
    <span class="eyebrow gold">
      MEDCEO MODULE
    </span>

    <h3>
      ${item.title}
    </h3>

    <p style="
      color:#9ca9bd;
      line-height:1.9
    ">
      ${item.text}
    </p>
  `;

  card.scrollIntoView({
    behavior: "smooth"
  });
}

function exportData() {
  const blob =
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "medceo-backup-" +
    new Date()
      .toISOString()
      .slice(0,10) +
    ".json";

  a.click();

  URL.revokeObjectURL(url);
}

function resetApp() {
  const ok =
    confirm(
      "سيتم حذف جميع بيانات MedCEO المخزنة على هذا الهاتف. متابعة؟"
    );

  if (!ok) return;

  localStorage.removeItem(KEY);

  location.reload();
}

function openSettings() {
  navigate("more");
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
