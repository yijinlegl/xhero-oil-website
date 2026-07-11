const nav = document.querySelector(".main-nav");
const toggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.prepend(progress);
const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "返回页面顶部");
backToTop.textContent = "↑";
document.body.append(backToTop);

document.querySelectorAll("main > section").forEach((section, index) => {
  section.classList.add("float-section");
  section.style.setProperty("--section-shift", `${index % 2 === 0 ? -1 : 1}`);
});

const normalizePagePath = (value) => {
  const pathname = new URL(value, window.location.href).pathname;
  return pathname.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";
};

const currentPagePath = normalizePagePath(window.location.href);

document.querySelectorAll(".main-nav a").forEach((link) => {
  if (link.classList.contains("nav-cta")) return;
  if (normalizePagePath(link.href) === currentPagePath) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

function setMobileNav(open) {
  nav?.classList.toggle("open", open);
  toggle?.setAttribute("aria-expanded", String(open));
  toggle?.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  document.body.classList.toggle("nav-open", open);
}

toggle?.addEventListener("click", () => setMobileNav(!nav?.classList.contains("open")));

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileNav(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !nav?.classList.contains("open")) return;
  setMobileNav(false);
  toggle?.focus();
});

document.addEventListener("pointerdown", (event) => {
  if (!nav?.classList.contains("open") || header?.contains(event.target)) return;
  setMobileNav(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 920 && nav?.classList.contains("open")) setMobileNav(false);
});

const revealTargets = [...document.querySelectorAll(".reveal, .float-section")];
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px 10% 0px" }
    )
  : null;

revealTargets.forEach((el, index) => {
  el.style.setProperty("--delay", `${Math.min(index % 7, 5) * 70}ms`);
  const rect = el.getBoundingClientRect();
  const startsInViewport = rect.top <= window.innerHeight * 1.05 && rect.bottom >= 0;
  if (!revealObserver || startsInViewport) el.classList.add("visible");
  else revealObserver.observe(el);
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
  document.documentElement.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.035, 24)}px`);
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 720);
}

window.addEventListener("scroll", updateMotion, { passive: true });
updateMotion();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const productFilterButtons = [...document.querySelectorAll("[data-filter]")];
const productCards = [...document.querySelectorAll(".product-catalog-section .catalog-card")];
const productSearch = document.querySelector("[data-product-search]");
const productGrid = document.querySelector("#product-grid");

function setProductFilter(button) {
  if (!button) return;
  productFilterButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
}

function updateProductUrl({ productKey, mode = "replace", dialogEntry } = {}) {
  if (!productFilterButtons.length) return;
  const url = new URL(window.location.href);
  const activeButton = productFilterButtons.find((button) => button.getAttribute("aria-selected") === "true");
  const category = activeButton?.dataset.filter || "all";
  const query = (productSearch?.value || "").trim();

  if (category === "all") url.searchParams.delete("category");
  else url.searchParams.set("category", category);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  if (productKey !== undefined) {
    if (productKey) url.searchParams.set("product", productKey);
    else url.searchParams.delete("product");
  }

  const currentState = history.state && typeof history.state === "object" ? history.state : {};
  const nextState = dialogEntry === undefined ? currentState : { ...currentState, xheroProductDialog: dialogEntry };
  const method = mode === "push" ? "pushState" : "replaceState";
  history[method](nextState, "", url);
}

function applyProductFilter() {
  const activeButton = productFilterButtons.find((button) => button.getAttribute("aria-selected") === "true");
  const active = activeButton?.dataset.filter || "all";
  const query = (productSearch?.value || "").trim().toLocaleLowerCase("zh-CN");
  let visibleCount = 0;
  productCards.forEach((card) => {
    const categories = (card.dataset.category || "").split(/\s+/).filter(Boolean);
    const matchesFilter = active === "all" || categories.includes(active);
    const matchesQuery = !query || card.textContent.toLocaleLowerCase("zh-CN").includes(query);
    const hidden = !matchesFilter || !matchesQuery;
    card.classList.toggle("is-hidden", hidden);
    card.toggleAttribute("hidden", hidden);
    if (!hidden) visibleCount += 1;
  });

  const result = document.querySelector("[data-filter-result]");
  if (result) {
    const label = active === "all" ? "全部" : activeButton?.textContent.trim() || "当前分类";
    result.textContent = query
      ? `“${query}”共找到 ${visibleCount} 项产品`
      : `显示${label} ${visibleCount} 项产品`;
  }
}

productFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setProductFilter(button);
    applyProductFilter();
    updateProductUrl();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      productGrid?.animate(
        [{ opacity: 0.62, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 260, easing: "ease-out" }
      );
    }
  });

  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = productFilterButtons.indexOf(button);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + productFilterButtons.length) % productFilterButtons.length;
    productFilterButtons[nextIndex].focus();
    productFilterButtons[nextIndex].click();
  });
});

const initialProductParams = new URLSearchParams(window.location.search);
const requestedCategory = initialProductParams.get("category") || "all";
const initialFilterButton = productFilterButtons.find((button) => button.dataset.filter === requestedCategory)
  || productFilterButtons.find((button) => button.dataset.filter === "all");
setProductFilter(initialFilterButton);
if (productSearch) productSearch.value = initialProductParams.get("q") || "";
productSearch?.addEventListener("input", () => {
  applyProductFilter();
  updateProductUrl();
});
applyProductFilter();

const productData = {
  GearOil: {
    type: "设备传动润滑",
    title: "工业齿轮油",
    copy: "面向封闭式工业齿轮箱、减速机及重载传动系统，重点满足齿面抗磨、承载保护、氧化稳定与长期运行需求。选型需综合设备制造商要求、粘度等级、负荷特征、工作温度和维护周期。",
    points: [
      "典型应用：风电齿轮箱、工业减速机、输送设备及重载传动装置",
      "工况关注：高负荷、冲击负荷、温度变化、污染控制与长周期运行",
      "选型依据：设备要求、粘度等级、负荷、温度、密封适配与换油周期"
    ],
  },
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
  Duramult: {
    type: "设备用油",
    title: "Duramult 主轴油系列",
    copy: "面向高速主轴、精密轴承和轻负荷高速润滑部位，强调低摩擦、良好油膜稳定性和设备洁净维护。",
    points: ["典型应用：机床主轴、精密轴承、高速轻负荷润滑点", "工况特点：高转速、低负荷、温升控制和低噪声运行", "客户价值：稳定油膜、降低温升、支持主轴长期精密运行"],
  },
  DuraKnit: {
    type: "针织机油",
    title: "DuraKnit 针织机油",
    copy: "面向针织设备润滑维护，服务纺织设备连续运行与日常保养。",
    points: ["应用方向：纺织与针织设备", "服务内容：润滑维护与资料支持", "客户价值：稳定运行、减少磨损、维护便利"],
  },
  XheroGel: {
    type: "工业润滑脂",
    title: "XheroGel 润滑脂系列",
    copy: "面向轴承、电机、齿轮及集中润滑系统的多样化工况，产品覆盖高温、极压、低温、高速、防水及食品级等应用方向。可结合工作温度、转速、负荷、介质环境和补脂周期进行针对性选型。",
    points: [
      "典型应用：滚动轴承、滑动轴承、电机、齿轮及集中润滑系统",
      "工况覆盖：高温、极压、低温、高速、防水、食品级及长寿命润滑",
      "选型依据：温度、转速、负荷、密封结构、介质接触与维护周期"
    ],
  },
  Tomo: {
    type: "金属加工液",
    title: "Tomo 金属加工液系列",
    copy: "包含 TomoCut 油基切削油、TomoCool 水基冷却液、TomoForm 成型油，覆盖切削、冷却清洗与塑性成型等加工工况。",
    points: [
      "TomoCut：适用于车削、铣削、钻孔、攻丝等中重负荷切削加工",
      "TomoCool：适用于集中供液、磨削、轻中负荷切削及冷却清洗要求较高的工况",
      "TomoForm：适用于冲压、拉伸、弯管、滚压等金属成型与塑性加工"
    ],
  },
  "Anti-ios": {
    type: "防锈保护",
    title: "Anti-ios 防锈油系列",
    copy: "针对金属零部件工序间防护、库存保管及运输过程中的锈蚀风险，提供油膜型、硬膜型、脱水型及长效防锈解决方案。可结合金属材质、防护周期、环境湿度、包装方式和后续清洗要求进行选型。",
    points: [
      "典型应用：机加工件、汽车零部件、模具、工具及金属半成品",
      "防护方向：工序间防锈、仓储防锈、运输包装、脱水置换与硬膜保护",
      "选型依据：材质、湿度、盐雾环境、防护周期、膜层要求与后续清洗"
    ],
  },
};

const dialog = document.querySelector(".product-dialog");
let productDialogOpener = null;

function openProductDialog(productKey, { pushHistory = false, opener = null } = {}) {
  const data = productData[productKey || ""];
  if (!data || !dialog) return false;
  dialog.querySelector(".dialog-kicker").textContent = data.type;
  dialog.querySelector("h2").textContent = data.title;
  dialog.querySelector("p:not(.eyebrow)").textContent = data.copy;
  dialog.querySelector("ul").innerHTML = data.points.map((item) => `<li>${item}</li>`).join("");
  const enquiryLink = dialog.querySelector("[data-product-enquiry]");
  if (enquiryLink) enquiryLink.href = `../contact/?product=${encodeURIComponent(productKey)}`;
  dialog.dataset.product = productKey;
  productDialogOpener = opener;
  if (!dialog.open) dialog.showModal();
  if (pushHistory) updateProductUrl({ productKey, mode: "push", dialogEntry: true });
  return true;
}

function closeProductDialog({ fromHistory = false } = {}) {
  if (!dialog) return;
  if (!fromHistory && history.state?.xheroProductDialog) {
    history.back();
    return;
  }
  if (dialog.open) dialog.close();
  delete dialog.dataset.product;
  if (!fromHistory) updateProductUrl({ productKey: null, dialogEntry: false });
  productDialogOpener?.focus();
  productDialogOpener = null;
}

document.querySelectorAll("[data-product]").forEach((button) => {
  button.setAttribute("aria-haspopup", "dialog");
  button.addEventListener("click", () => {
    openProductDialog(button.dataset.product, { pushHistory: true, opener: button });
  });
});

document.querySelector(".dialog-close")?.addEventListener("click", () => closeProductDialog());
dialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProductDialog();
});
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeProductDialog();
});

function restoreProductStateFromUrl() {
  if (!productFilterButtons.length) return;
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "all";
  const filterButton = productFilterButtons.find((button) => button.dataset.filter === category)
    || productFilterButtons.find((button) => button.dataset.filter === "all");
  setProductFilter(filterButton);
  if (productSearch) productSearch.value = params.get("q") || "";
  applyProductFilter();

  const productKey = params.get("product");
  if (productKey && productData[productKey]) openProductDialog(productKey);
  else closeProductDialog({ fromHistory: true });
}

if (productFilterButtons.length) {
  const initialProductKey = initialProductParams.get("product");
  history.replaceState({ ...(history.state || {}), xheroProductDialog: false }, "", window.location.href);
  if (initialProductKey && productData[initialProductKey]) openProductDialog(initialProductKey);
  window.addEventListener("popstate", restoreProductStateFromUrl);
}

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
  machine: ["Machine Tool", "DuraSlide 导轨润滑", "适用于机床导轨、滑动面、工作台和低速重载工况，帮助设备保持平稳运行。", "assets/machining-floor.webp", "机床导轨与精密加工设备"],
  hydraulic: ["Hydraulic System", "DuraHyd 抗磨液压系统", "面向液压站、泵阀系统和工业设备传动部位，强调抗磨保护与稳定运行。", "assets/factory-hero.webp", "现代液压与加工设备"],
  textile: ["Textile Equipment", "DuraKnit 针织设备维护", "服务针织机、传动部位和长期连续运行设备，支持纺织行业日常维护。", "assets/quality-lab.webp", "润滑油检测与设备维护环境"],
  protection: ["Rust Protection", "Anti-ios 防锈保护", "围绕金属部件仓储、运输和加工间隔期保护，提供防锈与表面保护方向。", "assets/machining-floor.webp", "金属部件与防护工况"],
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

const contactProductSelect = document.querySelector('select[name="product"]');
if (contactProductSelect) {
  const requestedProduct = new URLSearchParams(window.location.search).get("product");
  const hasRequestedProduct = [...contactProductSelect.options].some((option) => option.value === requestedProduct);
  if (hasRequestedProduct) contactProductSelect.value = requestedProduct;
}

document.querySelectorAll("[data-email-submit]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const productField = form.querySelector('select[name="product"]');
    const productLabel = productField?.selectedOptions?.[0]?.textContent.trim() || "工业润滑产品";
    const subject = `网站咨询｜${data.get("company") || "客户"}｜${productLabel}`;
    const body = [
      `姓名：${data.get("name") || "未填写"}`,
      `公司：${data.get("company") || "未填写"}`,
      `关注产品：${productLabel}`,
      "",
      "需求说明：",
      String(data.get("requirement") || "未填写"),
    ].join("\n");
    window.location.href = `mailto:marketing@xhero-oil.com.cn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const note = form.querySelector(".form-note");
    if (note) note.textContent = "已打开邮件应用，请确认内容后发送。";
  });
});
