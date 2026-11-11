// Test IO Master Portal Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initBugGenerator();
  initDisputeGenerator();
  initTricksFilter();
  initGlossarySearch();
  initCalculator();
  initAutomatedAuditor();
});

// Toast notification function
function showToast(message = "تم النسخ بنجاح إلى الحافظة! 📋") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// 1. Tab Navigation
function initTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');

      tabButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg');
        b.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-slate-200');
      });
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg');
      btn.classList.remove('text-slate-400', 'hover:bg-slate-800');

      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetId) {
          content.classList.add('active');
        }
      });

      // If opening automated auditor, run audit on current generator report
      if (targetId === 'tab-checklist') {
        syncAndAudit();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// 2. Bug Report Generator
function initBugGenerator() {
  const fields = [
    'bugPage', 'bugIssue', 'bugCondition', 
    'bugDevice', 'bugOS', 'bugBrowser', 
    'bugSeverity', 'bugSteps', 'bugExpected', 'bugActual'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        updateBugPreview();
        // Live auto audit if available
        if (typeof runAutoAuditFromFields === 'function') {
          runAutoAuditFromFields();
        }
      });
    }
  });

  const copyBtn = document.getElementById('copyBugReportBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const previewText = document.getElementById('bugReportOutput').innerText;
      navigator.clipboard.writeText(previewText).then(() => {
        showToast("تم نسخ تقرير الباج بنجاح! جاهز للصق في Test IO 🚀");
      });
    });
  }

  const resetBtn = document.getElementById('resetBugReportBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      updateBugPreview();
    });
  }

  const sampleBtn = document.getElementById('loadSampleBugBtn');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      document.getElementById('bugPage').value = 'Checkout / Payment Modal';
      document.getElementById('bugIssue').value = '"Pay Now" button remains unresponsive with no spinner';
      document.getElementById('bugCondition').value = 'when paying with Visa on mobile screen widths';
      document.getElementById('bugDevice').value = 'Samsung Galaxy S22';
      document.getElementById('bugOS').value = 'Android 13';
      document.getElementById('bugBrowser').value = 'Google Chrome v121.0';
      document.getElementById('bugSeverity').value = 'Critical (Crash / Complete Blocker)';
      document.getElementById('bugSteps').value = `1. Open the website and add any item to the shopping cart.\n2. Proceed to the Checkout page.\n3. Fill in shipping information and choose 'Credit Card (Visa)'.\n4. Enter valid card details and tap on the 'Pay Now' button.\n5. Notice that the button does not react to clicks and nothing happens.`;
      document.getElementById('bugExpected').value = 'The payment should be processed, a loading spinner should appear, and the user redirected to Order Confirmation.';
      document.getElementById('bugActual').value = 'The button does not react to clicks, no network request is sent in console, and no error message is displayed.';
      updateBugPreview();
      showToast("تم تحميل نموذج باج تجريبي ممتاز!");
    });
  }

  updateBugPreview();
}

function updateBugPreview() {
  const page = document.getElementById('bugPage')?.value.trim() || '[Page/Feature]';
  const issue = document.getElementById('bugIssue')?.value.trim() || '[What happens / The issue]';
  const condition = document.getElementById('bugCondition')?.value.trim() || '[Under which condition/viewport]';
  const device = document.getElementById('bugDevice')?.value.trim() || 'e.g. PC / iPhone 13';
  const os = document.getElementById('bugOS')?.value.trim() || 'e.g. Windows 11 / iOS 17';
  const browser = document.getElementById('bugBrowser')?.value.trim() || 'e.g. Chrome 120.0';
  const severity = document.getElementById('bugSeverity')?.value || 'High';
  const steps = document.getElementById('bugSteps')?.value.trim() || '1. Go to...\n2. Click on...\n3. Observe...';
  const expected = document.getElementById('bugExpected')?.value.trim() || 'Describe what was expected to happen...';
  const actual = document.getElementById('bugActual')?.value.trim() || 'Describe what actually happened...';

  const title = `[${page}] - ${issue} ${condition}`;

  const output = `TITLE:
${title}

SEVERITY:
${severity}

ENVIRONMENT:
Device: ${device}
Operating System: ${os}
Browser/App Version: ${browser}

STEPS TO REPRODUCE:
${steps}

EXPECTED RESULT:
${expected}

ACTUAL RESULT:
${actual}`;

  const target = document.getElementById('bugReportOutput');
  if (target) {
    target.innerText = output;
  }
}

// 3. Dispute Message Generator
function initDisputeGenerator() {
  const inputs = ['disputeTlName', 'disputeTimestamp', 'disputeReason', 'disputeImpact'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateDisputePreview);
  });

  const copyBtn = document.getElementById('copyDisputeBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('disputeOutput').innerText;
      navigator.clipboard.writeText(text).then(() => {
        showToast("تم نسخ رسالة الاعتراض المهذبة! ✉️");
      });
    });
  }

  updateDisputePreview();
}

function updateDisputePreview() {
  const tlName = document.getElementById('disputeTlName')?.value.trim() || 'Team Lead';
  const timestamp = document.getElementById('disputeTimestamp')?.value.trim() || '00:15';
  const reason = document.getElementById('disputeReason')?.value.trim() || 'the issue consistently occurs following the exact documented steps and is within the test scope';
  const impact = document.getElementById('disputeImpact')?.value.trim() || 'users are unable to complete their action without refreshing the page';

  const output = `Hi ${tlName},

Thank you for reviewing my report. I would like to kindly ask for a reconsideration regarding this rejection.

As shown in the attached video at timestamp (${timestamp}), ${reason}. 

This directly impacts the end-user experience because ${impact}.

Could you please double-check this submission when you have a moment? Thank you very much for your time and guidance!

Best regards,`;

  const target = document.getElementById('disputeOutput');
  if (target) target.innerText = output;
}

// 4. AUTOMATED QUALITY AUDITOR & LINTER (NEW & AUTOMATED)
function initAutomatedAuditor() {
  const auditInput = document.getElementById('auditReportInput');
  const syncBtn = document.getElementById('syncGeneratorReportBtn');
  const videoInput = document.getElementById('auditVideoFile');
  const dropzone = document.getElementById('videoDropzone');

  if (auditInput) {
    auditInput.addEventListener('input', () => {
      runTextAudit(auditInput.value);
    });
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      syncAndAudit();
      showToast("تم سحب التقرير من المولد وفحصه آلياً!");
    });
  }

  // Video Inspection
  if (videoInput) {
    videoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        inspectVideo(e.target.files[0]);
      }
    });
  }

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-indigo-500', 'bg-indigo-950/20');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-indigo-500', 'bg-indigo-950/20');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-indigo-500', 'bg-indigo-950/20');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        inspectVideo(e.dataTransfer.files[0]);
      }
    });
  }
}

function syncAndAudit() {
  const generatorOutput = document.getElementById('bugReportOutput')?.innerText || '';
  const auditInput = document.getElementById('auditReportInput');
  if (auditInput) {
    auditInput.value = generatorOutput;
    runTextAudit(generatorOutput);
  }
}

function runTextAudit(text) {
  if (!text || text.trim().length === 0) {
    renderAuditResults(0, [
      { passed: false, title: "لا يوجد تقرير للفحص", desc: "يرجى كتابة أو لصق تقرير الباج أو الضغط على زر سحب التقرير من المولد.", penalty: 100 }
    ]);
    return;
  }

  const checks = [];
  let score = 100;

  // 1. Title Checks
  const titleMatch = text.match(/TITLE:\s*(.+)/i) || [null, text.split('\n')[0]];
  const title = titleMatch[1]?.trim() || '';

  const hasBrackets = /^\[.+\]/.test(title);
  if (hasBrackets) {
    checks.push({
      passed: true,
      title: "صيغة المكان في العنوان [Where]",
      desc: "العنوان يبدأ بمحدد المكان بين قوسين مربعين مثل [Checkout Page]."
    });
  } else {
    score -= 15;
    checks.push({
      passed: false,
      title: "العنوان لا يبدأ بالمكان [Where]",
      desc: "يجب أن يبدأ العنوان بـ [اسم الصفحة/المكون] مثل [Login] أو [Cart]."
    });
  }

  const forbiddenWords = ['not work', 'broken', 'bug here', 'issue', 'problem without explanation'];
  const hasVagueWords = forbiddenWords.some(w => title.toLowerCase().includes(w));
  if (title.length >= 25 && !hasVagueWords) {
    checks.push({
      passed: true,
      title: "وضوح ودقة العنوان",
      desc: `العنوان مفصل بطول سليم (${title.length} حرفاً) وخالٍ من الكلمات المبهمة العامة.`
    });
  } else {
    score -= 15;
    checks.push({
      passed: false,
      title: "العنوان قصير أو يحتوي على كلمات عامة",
      desc: "اجعل العنوان أكثر تحديداً لوصف ماذا حدث بالضبط والشرط المسبب له."
    });
  }

  // 2. Steps to Reproduce Checks
  const stepsMatch = text.match(/STEPS TO REPRODUCE:\s*([\s\S]*?)(?=EXPECTED RESULT:|$)/i);
  const stepsText = stepsMatch ? stepsMatch[1].trim() : text;
  const stepLines = stepsText.split('\n').filter(l => /^\s*\d+[\.\)]/.test(l));

  if (stepLines.length >= 3) {
    checks.push({
      passed: true,
      title: `خطوات تكرار مرقمة (${stepLines.length} خطوات)`,
      desc: "الخطوات مكتوبة بتسلسل رقمي واضح وكافٍ لتمكين المطور من محاكاة المشكلة."
    });
  } else {
    score -= 20;
    checks.push({
      passed: false,
      title: "خطوات التكرار غير كافية أو غير مرقمة",
      desc: "يجب كتابة 3 خطوات مرقمة على الأقل تبدأ بـ 1. 2. 3."
    });
  }

  const firstStep = stepLines[0] || '';
  const zeroStateKeywords = ['open', 'navigate', 'go to', 'visit', 'launch', 'http'];
  const startsFromZero = zeroStateKeywords.some(k => firstStep.toLowerCase().includes(k));

  if (startsFromZero) {
    checks.push({
      passed: true,
      title: "الخطوة الأولى تبدأ من الصفر (Zero State)",
      desc: "الخطوة رقم 1 توضح فتح الرابط أو التطبيق مباشرة."
    });
  } else {
    score -= 15;
    checks.push({
      passed: false,
      title: "الخطوة الأولى لا تبدأ من الصفر",
      desc: "ينبغي أن تبدأ الخطوة الأولى بفتح الموقع أو التطبيق (مثل: 1. Navigate to URL)."
    });
  }

  // 3. Expected Result Check
  const expectedMatch = text.match(/EXPECTED RESULT:\s*([\s\S]*?)(?=ACTUAL RESULT:|$)/i);
  const expectedText = expectedMatch ? expectedMatch[1].trim() : '';

  if (expectedText.length > 20 && !expectedText.includes('Describe what')) {
    checks.push({
      passed: true,
      title: "النتيجة المتوقعة مكتملة (Expected Result)",
      desc: "شرح واضح لما كان يجب أن يحدث منطقياً."
    });
  } else {
    score -= 15;
    checks.push({
      passed: false,
      title: "النتيجة المتوقعة ناقصة أو مفقودة",
      desc: "اكتب بالتفصيل ما الذي كان ينتظره المستخدم لو لم يكن هناك عطل."
    });
  }

  // 4. Actual Result Check
  const actualMatch = text.match(/ACTUAL RESULT:\s*([\s\S]*?)$/i);
  const actualText = actualMatch ? actualMatch[1].trim() : '';

  if (actualText.length > 20 && !actualText.includes('Describe what') && actualText !== expectedText) {
    checks.push({
      passed: true,
      title: "النتيجة الفعلية دقيقة (Actual Result)",
      desc: "وصف دقيق لما حدث على الشاشة (رسائل الخطأ أو التجمد أو عدم الاستجابة)."
    });
  } else {
    score -= 15;
    checks.push({
      passed: false,
      title: "النتيجة الفعلية غير واضحة أو مطابقة للمتوقعة",
      desc: "وضح السلوك الخاطئ الفعلي الذي حدث أمامك بالتفصيل."
    });
  }

  // 5. Environment Check
  const hasDevice = /Device:\s*[^\n\[]+/i.test(text) && !text.includes('e.g. PC');
  const hasOS = /Operating System:\s*[^\n\[]+/i.test(text) && !text.includes('e.g. Windows');

  if (hasDevice && hasOS) {
    checks.push({
      passed: true,
      title: "بيانات الجهاز ونظام التشغيل مكتملة",
      desc: "تم تحديد نوع الجهاز وإصدار النظام بدقة."
    });
  } else {
    score -= 10;
    checks.push({
      passed: false,
      title: "بيانات الجهاز أو نظام التشغيل ناقصة",
      desc: "حدد اسم جهازك الفعلي وإصدار النظام دون ترك أمثلة تجريبية."
    });
  }

  score = Math.max(0, score);
  renderAuditResults(score, checks);
}

function renderAuditResults(score, checks) {
  const scoreDisplay = document.getElementById('autoScoreDisplay');
  const scoreProgress = document.getElementById('autoScoreProgress');
  const scoreBadge = document.getElementById('autoScoreBadge');
  const checksList = document.getElementById('autoChecksList');

  if (scoreDisplay) scoreDisplay.innerText = `${score}%`;
  if (scoreProgress) {
    scoreProgress.style.width = `${score}%`;
    if (score >= 85) {
      scoreProgress.className = "bg-emerald-500 h-full transition-all duration-500";
    } else if (score >= 60) {
      scoreProgress.className = "bg-amber-500 h-full transition-all duration-500";
    } else {
      scoreProgress.className = "bg-rose-500 h-full transition-all duration-500";
    }
  }

  if (scoreBadge) {
    if (score >= 85) {
      scoreBadge.innerText = "جاهز للإرسال بأمان بنسبة 100% 🎯";
      scoreBadge.className = "badge-pill bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    } else if (score >= 60) {
      scoreBadge.innerText = "جيد لكن يحتاج بعض التحسينات ⚠️";
      scoreBadge.className = "badge-pill bg-amber-500/20 text-amber-400 border border-amber-500/30";
    } else {
      scoreBadge.innerText = "غير مكتمل - خطر الرفض ❌";
      scoreBadge.className = "badge-pill bg-rose-500/20 text-rose-400 border border-rose-500/30";
    }
  }

  if (checksList) {
    checksList.innerHTML = checks.map(c => `
      <div class="p-4 rounded-xl ${c.passed ? 'bg-slate-900/90 border border-emerald-500/30' : 'bg-slate-900/90 border border-rose-500/30'} flex items-start gap-3">
        <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${c.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
          <i class="fa-solid ${c.passed ? 'fa-check' : 'fa-xmark'} text-xs"></i>
        </div>
        <div>
          <h4 class="text-xs font-bold ${c.passed ? 'text-white' : 'text-rose-300'}">${c.title}</h4>
          <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${c.desc}</p>
        </div>
      </div>
    `).join('');
  }
}

// Automated Video Inspection
function inspectVideo(file) {
  const resultCard = document.getElementById('videoAuditResult');
  const videoName = document.getElementById('videoFileName');
  const videoDurationEl = document.getElementById('videoDurationText');
  const videoSizeEl = document.getElementById('videoSizeText');
  const videoVerdict = document.getElementById('videoVerdict');

  if (!file) return;

  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.src = url;

  video.onloadedmetadata = () => {
    URL.revokeObjectURL(url);
    const duration = Math.round(video.duration);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

    if (resultCard) resultCard.classList.remove('hidden');
    if (videoName) videoName.innerText = file.name;
    if (videoDurationEl) videoDurationEl.innerText = `${duration} ثانية`;
    if (videoSizeEl) videoSizeEl.innerText = `${sizeMb} MB (${video.videoWidth}x${video.videoHeight})`;

    if (videoVerdict) {
      if (duration >= 15 && duration <= 45) {
        videoVerdict.innerHTML = `
          <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>
            <div>
              <strong class="block">مدة الفيديو مثالية 100%! (${duration}s)</strong>
              <span>متوافق تماماً مع شروط Test IO (بين 15 و 45 ثانية).</span>
            </div>
          </div>
        `;
      } else if (duration > 45) {
        videoVerdict.innerHTML = `
          <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-rose-400 text-base"></i>
            <div>
              <strong class="block">الفيديو طويل جداً (${duration}s) - خطر الرفض!</strong>
              <span>الحد الأقصى المسموح 45 ثانية. يرجى قص الفيديو قبل رفعه.</span>
            </div>
          </div>
        `;
      } else {
        videoVerdict.innerHTML = `
          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation text-amber-400 text-base"></i>
            <div>
              <strong class="block">الفيديو قصير (${duration}s)</strong>
              <span>تأكد من أنك قمت بإظهار المشكلة مرتين متتاليتين لإثبات ثبات الخطأ.</span>
            </div>
          </div>
        `;
      }
    }
  };
}

// 5. Pro Tricks Filter
function initTricksFilter() {
  const filterBtns = document.querySelectorAll('[data-trick-filter]');
  const cards = document.querySelectorAll('.trick-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-trick-filter');

      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('bg-slate-800', 'text-slate-300');

      cards.forEach(card => {
        const cat = card.getAttribute('data-trick-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 6. QA Glossary Search
function initGlossarySearch() {
  const searchInput = document.getElementById('glossarySearch');
  const items = document.querySelectorAll('.glossary-item');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    items.forEach(item => {
      const text = item.innerText.toLowerCase();
      if (text.includes(term)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

// 7. Interactive Earnings Calculator
function initCalculator() {
  const inputs = ['calcCritical', 'calcHigh', 'calcMedium', 'calcLow', 'calcRepro'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateEarnings);
    }
  });

  calculateEarnings();
}

function calculateEarnings() {
  const critical = parseInt(document.getElementById('calcCritical')?.value || 0, 10);
  const high = parseInt(document.getElementById('calcHigh')?.value || 0, 10);
  const medium = parseInt(document.getElementById('calcMedium')?.value || 0, 10);
  const low = parseInt(document.getElementById('calcLow')?.value || 0, 10);
  const repro = parseInt(document.getElementById('calcRepro')?.value || 0, 10);

  const total = (critical * 35) + (high * 18) + (medium * 10) + (low * 4) + (repro * 1.25);
  
  const outputEl = document.getElementById('calcTotalOutput');
  if (outputEl) {
    outputEl.innerText = `$${total.toFixed(2)}`;
  }
}
