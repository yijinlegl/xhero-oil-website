const nav = document.querySelector(".main-nav");
const toggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const page = document.body.dataset.page || "home";
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.prepend(progress);

const pathMap = {
  home: "index.html",
  about: "about/index.html",
  products: "products/index.html",
  industries: "industries/index.html",
  support: "support/index.html",
  cases: "cases/index.html",
  contact: "contact/index.html",
};

document.querySelectorAll("main > section").forEach((section, index) => {
  section.classList.add("float-section");
  section.style.setProperty("--section-shift", `${index % 2 === 0 ? -1 : 1}`);
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  const target = pathMap[page];
  if (href.endsWith(target) || (page === "home" && href.endsWith("index.html"))) link.classList.add("active");
});

toggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(Boolean(open)));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal, .float-section").forEach((el, index) => {
  el.style.setProperty("--delay", `${Math.min(index % 7, 5) * 70}ms`);
  revealObserver.observe(el);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const max = Number(target.dataset.count || 0);
      let current = 0;
      const timer = setInterval(() => {
        current += 1;
        target.textContent = String(current);
        if (current >= max) clearInterval(timer);
      }, 55);
      countObserver.unobserve(target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

function updateMotion() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  document.documentElement.style.setProperty("--scroll", `${value}%`);
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateMotion, { passive: true });
updateMotion();

function applyProductFilter() {
  const active = document.querySelector("[data-filter].active")?.dataset.filter || "all";
  const query = (document.querySelector("[data-product-search]")?.value || "").trim().toLowerCase();
  document.querySelectorAll(".catalog-card").forEach((card) => {
    const category = card.dataset.category || "";
    const matchesFilter = active === "all" || category.includes(active);
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
    card.classList.toggle("is-hidden", !matchesFilter || !matchesQuery);
  });
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyProductFilter();
  });
});

document.querySelector("[data-product-search]")?.addEventListener("input", applyProductFilter);

const productData = {
  DuraHyd: {
    type: "工业油品",
    title: "DuraHyd 抗磨液压油",
    copy: "适合工业液压系统与设备维护场景，覆盖 DuraHyd 32 / 46 / 68 LF 等常用粘度等级。",
    points: ["产品方向：抗磨液压油", "适用场景：液压传动、工业设备维护", "资料内容：TDS、MSDS、选型沟通"],
  },
  DuraSlide: {
    type: "工业油品",
    title: "DuraSlide 系列导轨油",
    copy: "用于机床导轨、滑动面、工作台及液压与导轨共用润滑系统，覆盖 32 / 46 / 68 / 100 / 220 等粘度等级。",
    points: ["典型应用：机床导轨与滑动面", "粘度等级：32 / 46 / 68 / 100 / 220", "客户价值：平稳运行、减摩保护、维护清晰"],
  },
  DuraGuide: {
    type: "工业油品",
    title: "DuraGuide 导轨油产品说明书",
    copy: "面向机床导轨、工作台、立柱、横梁以及相关润滑系统，覆盖多种导轨润滑工况。",
    points: ["产品型号：32 / 46 / 68 / 100", "应用部位：导轨、工作台、滑动面", "资料内容：产品说明、应用范围、储存方式"],
  },
  DuraKnit: {
    type: "工业油品",
    title: "DuraKnit 针织机油",
    copy: "面向针织设备润滑维护，服务纺织设备连续运行与日常保养。",
    points: ["应用方向：纺织与针织设备", "服务内容：润滑维护与资料支持", "客户价值：稳定运行、减少磨损、维护便利"],
  },
  XheroGel: {
    type: "润滑脂系列",
    title: "XheroGel 润滑脂系列",
    copy: "可按 HT、EP、LT、HS、FG、WP、XD、LX、PX 等后缀扩展不同润滑脂方向。",
    points: ["HT = High Temperature 高温", "EP = Extreme Pressure 极压", "FG = Food Grade 食品级", "WP = Water Proof 防水"],
  },
  Tomo: {
    type: "金属加工液",
    title: "Tomo 金属加工液系列",
    copy: "包含 TomoLube 油基切削油、TomoCool 水基冷却液、TomoSyn 半合成切削液。",
    points: ["TomoLube：32 / 46 / 68 / 100 / 220", "TomoCool：3% / 5% / 8% / 10%", "TomoSyn：5% / 8% / 10%"],
  },
  "Anti-Ios": {
    type: "防锈保护",
    title: "Anti-Ios 防锈油系列",
    copy: "可扩展 Dura 长效、Shield 硬膜、Dry 脱水等防锈油方向。",
    points: ["Anti-Ios：通用防锈油", "Anti-Ios Dura：长效防锈油", "Anti-Ios Shield：硬膜防锈油", "Anti-Ios Dry：脱水防锈油"],
  },
};

const dialog = document.querySelector(".product-dialog");
document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const data = productData[button.dataset.product || ""];
    if (!data || !dialog) return;
    dialog.querySelector(".dialog-kicker").textContent = data.type;
    dialog.querySelector("h2").textContent = data.title;
    dialog.querySelector("p:not(.eyebrow)").textContent = data.copy;
    dialog.querySelector("ul").innerHTML = data.points.map((item) => `<li>${item}</li>`).join("");
    dialog.showModal();
  });
});

document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());

const supportContent = {
  tds: ["TDS 产品说明书", "用于向客户说明产品用途、主要性能、典型数据、应用范围和储存方式，帮助客户快速完成初步判断。"],
  msds: ["MSDS 安全资料", "用于说明安全、储存、运输、环保与应急处理信息，支持客户内部合规流转。"],
  label: ["包装与识别", "用于统一产品名称、规格、包装识别和中英文表达，提升客户收货、仓储与使用效率。"],
  selection: ["选型建议", "用于把客户设备、工况、粘度等级、温度、负载和维护需求转成清楚的推荐路径。"],
};

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const content = supportContent[button.dataset.tab];
    if (!content) return;
    document.querySelectorAll("[data-tab]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("[data-tab-title]").textContent = content[0];
    document.querySelector("[data-tab-copy]").textContent = content[1];
  });
});

const lensData = {
  machine: ["Machine Tool", "DuraSlide / DuraGuide 导轨润滑", "适用于机床导轨、滑动面、工作台和低速重载工况，帮助设备保持平稳运行。", "assets/machining-floor.png", "机床导轨与精密加工设备"],
  hydraulic: ["Hydraulic System", "DuraHyd 抗磨液压系统", "面向液压站、泵阀系统和工业设备传动部位，强调抗磨保护与稳定运行。", "assets/factory-hero.png", "现代液压与加工设备"],
  textile: ["Textile Equipment", "DuraKnit 针织设备维护", "服务针织机、传动部位和长期连续运行设备，支持纺织行业日常维护。", "assets/quality-lab.png", "润滑油检测与设备维护环境"],
  protection: ["Rust Protection", "Anti-Ios 防锈保护", "围绕金属部件仓储、运输和加工间隔期保护，提供防锈与表面保护方向。", "assets/machining-floor.png", "金属部件与防护工况"],
};

document.querySelectorAll("[data-lens]").forEach((button) => {
  button.addEventListener("click", () => {
    const data = lensData[button.dataset.lens || ""];
    if (!data) return;
    document.querySelectorAll("[data-lens]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("[data-lens-kicker]").textContent = data[0];
    document.querySelector("[data-lens-title]").textContent = data[1];
    document.querySelector("[data-lens-copy]").textContent = data[2];
    const img = document.querySelector("[data-lens-img]");
    img.src = data[3];
    img.alt = data[4];
    img.animate([{ opacity: 0.55, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], {
      duration: 420,
      easing: "cubic-bezier(.2,.8,.2,1)",
    });
  });
});

document.querySelectorAll(".industry-card").forEach((card) => {
  const toggleCard = () => card.classList.toggle("expanded");
  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard();
    }
  });
});

const drawer = document.querySelector(".contact-drawer");
document.querySelector("[data-open-contact]")?.addEventListener("click", () => {
  drawer?.classList.add("open");
  drawer?.setAttribute("aria-hidden", "false");
});

document.querySelector(".drawer-close")?.addEventListener("click", () => {
  drawer?.classList.remove("open");
  drawer?.setAttribute("aria-hidden", "true");
});

document.querySelectorAll("[data-fake-submit]").forEach((button) => {
  button.addEventListener("click", () => {
    const note = button.parentElement?.querySelector(".form-note") || document.querySelector(".form-note");
    if (note) note.textContent = "咨询摘要已生成，可用于销售与技术团队跟进。";
  });
});
