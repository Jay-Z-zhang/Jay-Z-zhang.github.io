(function(){
const S = {
template: ('cla'+'ssic'),
color: '#374151',
font: "'Noto Sans SC',('In'+'ter'),sans-serif",
lang: 'zh',
eduEntries: [],
workEntries: [],
projectEntries: [],
awardEntries: [],
pubEntries: [],
expanded: new Set(),
};

// Undo/Redo History System
const History = {
  stack: [],
  index: -1,
  maxSize: 50,
  isRestoring: false,
  lastSaveTime: 0,
  saveDelay: 300,
};

function _getFullState() {
  const g = id => (document.getElementById(id) || {value:''}).value;
  const gc = id => (document.getElementById(id) || {checked:false}).checked;
  return {
    template: S.template, color: S.color, font: S.font, lang: S.lang,
    form: {
      name: g('name'), nameEn: g('nameEn'), jobTitle: g('jobTitle'),
      phone: g('phone'), email: g('email'), city: g('city'), linkedin: g('linkedin'),
      showWechat: gc('showWechat'), wechat: g('wechat'),
      showPhoto: gc('showPhoto'), photoUrl: g('photoUrl'),
      showSummary: gc('showSummary'), summary: g('summary'),
      showProject: gc('showProject'), showSkills: gc('showSkills'),
      skillTools: g('skillTools'), skillLang: g('skillLang'), skillCerts: g('skillCerts'),
      showAwards: gc('showAwards'), showPubs: gc('showPubs'),
    },
    edu: S.eduEntries.map(e => ({id: e.id, data: {...e.data}})),
    work: S.workEntries.map(e => ({id: e.id, data: {...e.data}})),
    project: S.projectEntries.map(e => ({id: e.id, data: {...e.data}})),
    award: S.awardEntries.map(e => ({id: e.id, data: {...e.data}})),
    pub: S.pubEntries.map(e => ({id: e.id, data: {...e.data}})),
  };
}

function _restoreState(state) {
  if (!state) return;
  History.isRestoring = true;
  S.template = state.template; S.color = state.color; S.font = state.font; S.lang = state.lang;
  document.querySelectorAll('.tpl-card').forEach(c => c.classList.toggle('active', c.dataset.tpl === state.template));
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('active', s.dataset.color === state.color));
  document.querySelectorAll('.font-opt').forEach(f => f.classList.toggle('active', f.dataset.font === state.font));
  document.querySelectorAll('.lang-tab').forEach(t => t.classList.toggle('active', t.dataset.lang === state.lang));
  const f = state.form || {};
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  const chk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };
  set('name', f.name); set('nameEn', f.nameEn); set('jobTitle', f.jobTitle);
  set('phone', f.phone); set('email', f.email); set('city', f.city); set('linkedin', f.linkedin);
  chk('showWechat', f.showWechat); set('wechat', f.wechat);
  chk('showPhoto', f.showPhoto); set('photoUrl', f.photoUrl);
  chk('showSummary', f.showSummary); set('summary', f.summary);
  chk('showProject', f.showProject); chk('showSkills', f.showSkills);
  set('skillTools', f.skillTools); set('skillLang', f.skillLang); set('skillCerts', f.skillCerts);
  chk('showAwards', f.showAwards); chk('showPubs', f.showPubs);
  document.getElementById('wechatField').style.display = f.showWechat ? '' : 'none';
  document.getElementById('photoField').style.display = f.showPhoto ? '' : 'none';
  document.getElementById('summaryBody').style.display = f.showSummary ? '' : 'none';
  S.eduEntries = (state.edu || []).map(e => ({id: e.id, data: {...e.data}}));
  S.workEntries = (state.work || []).map(e => ({id: e.id, data: {...e.data}}));
  S.projectEntries = (state.project || []).map(e => ({id: e.id, data: {...e.data}}));
  S.awardEntries = (state.award || []).map(e => ({id: e.id, data: {...e.data}}));
  S.pubEntries = (state.pub || []).map(e => ({id: e.id, data: {...e.data}}));
  _renderEntries('edu'); _renderEntries('work'); _renderEntries('project'); _renderEntries('award'); _renderEntries('pub');
  History.isRestoring = false;
  _tu();
}

function _renderEntries(type) {
  if (typeof _t9 === 'function') _t9(type);
}

let _historySaveTimer = null;
function _saveHistory() {
  if (History.isRestoring) return;
  clearTimeout(_historySaveTimer);
  _historySaveTimer = setTimeout(() => {
    const state = _getFullState();
    const stateStr = JSON.stringify(state);
    if (History.stack.length > 0 && JSON.stringify(History.stack[History.index]) === stateStr) return;
    History.stack = History.stack.slice(0, History.index + 1);
    History.stack.push(JSON.parse(stateStr));
    if (History.stack.length > History.maxSize) History.stack.shift();
    History.index = History.stack.length - 1;
    _updateUndoRedoButtons();
  }, History.saveDelay);
}

function _undo() {
  if (History.index <= 0) return;
  History.index--;
  _restoreState(History.stack[History.index]);
  _updateUndoRedoButtons();
}

function _redo() {
  if (History.index >= History.stack.length - 1) return;
  History.index++;
  _restoreState(History.stack[History.index]);
  _updateUndoRedoButtons();
}

function _updateUndoRedoButtons() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.disabled = History.index <= 0;
  if (redoBtn) redoBtn.disabled = History.index >= History.stack.length - 1;
}

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    _undo();
  } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault();
    _redo();
  }
});

function _t0(head) {
const body = head.nextElementSibling;
const open = head.classList.toggle(('op'+'en'));
body.style.display = open ? '' : ('no'+'ne');
}
function _t1(lang, tab) {
S.lang = lang;
document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove(('act'+'ive')));
tab.classList.add(('act'+'ive'));
_tb();
_tu();
}
function _t2(t, card) {
S.template = t;
document.querySelectorAll('.tpl-card').forEach(c => c.classList.remove(('act'+'ive')));
card.classList.add(('act'+'ive'));
const defaults = {classic:'#374151', modern:'#1d4ed8', dark:'#7c3aed', twocol:'#1e293b', lines:'#0f766e', premium:'#1e40af'};
_t4(defaults[t]);
_tu();
}
function _t3(el) {
document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove(('act'+'ive')));
el.classList.add(('act'+'ive'));
S.color = el.dataset.color;
_tu();
}
function _t4(hex) {
S.color = hex;
document.querySelectorAll('.color-swatch').forEach(s => {
s.classList.toggle(('act'+'ive'), s.dataset.color === hex);
});
}
function _t5(el) {
document.querySelectorAll('.font-opt').forEach(f => f.classList.remove(('act'+'ive')));
el.classList.add(('act'+'ive'));
S.font = el.dataset.font;
_tu();
}
document.getElementById(('show'+'Photo')).addEventListener(('cha'+'nge'), function() {
document.getElementById(('photo'+'Field')).style.display = this.checked ? '' : ('no'+'ne');
});
document.getElementById(('showW'+'echat')).addEventListener(('cha'+'nge'), function() {
document.getElementById(('wecha'+'tField')).style.display = this.checked ? '' : ('no'+'ne');
});
document.getElementById(('showS'+'ummary')).addEventListener(('cha'+'nge'), function() {
document.getElementById(('summa'+'ryBody')).style.display = this.checked ? '' : ('no'+'ne');
_tu();
});
function _t6(el, hintId, good, ok, warn) {
const len = el.value.length;
const hint = document.getElementById(hintId);
const h = I18N[S.lang];
if (!hint) { _tu(); return; }
if (len === 0) { hint.className = ('hi'+'nt'); hint.textContent = h.hintEmpty(good, ok); }
else if (len < good) { hint.className = 'hint warn'; hint.textContent = h.hintShort(len, good); }
else if (len <= ok) { hint.className = 'hint good'; hint.textContent = h.hintGood(len); }
else if (len <= warn){ hint.className = 'hint warn'; hint.textContent = h.hintLong(len, ok); }
else { hint.className = 'hint bad'; hint.textContent = h.hintTooLong(len); }
_tu();
}
const I18N = {
zh: {
tagline: '实时预览 · 4套模板 · 中英双语',
btnDemo: '模板预览', btnReset: '重置', btnPdf: '导出 PDF', btnHtml: '下载 HTML',
sLang:'语言 / Language', sTpl:'模板风格', sBasic:'基本信息', sSummary:'自我评价',
sEdu:'教育经历', sWork:'工作经历', sProject:'项目经历', sSkills:'技能',
sAwards:'荣誉奖项', sPubs:'论文/作品',
lPhoto:'头像（右上角）', lPhotoUrl:'照片 URL', hPhoto:'建议证件照风格，比例 3:4',
lName:'姓名', lRequired:'必填',
phName:'张三', phJobTitle:'增长产品经理 / Growth PM',
lJobTitle:'求职意向', hJobTitle:'建议 8-16 字，精准描述目标岗位',
lPhone:'手机', phPhone:'+86 138 0000 0000',
lEmail:'邮箱',
lCity:'城市', phCity:'上海',
lWechat:'显示微信号', lWechatId:'微信号',
lShowModule:'显示此模块',
lSummaryContent:'简介内容', phSummary:'专注增长方向的产品经理，擅长活动设计与数据分析...',
hSummary:'建议 40-60 字，聚焦核心优势 + 差异化亮点',
btnAddEdu:'+ 添加教育经历', btnAddWork:'+ 添加工作/实习经历',
btnAddProject:'+ 添加项目', btnAddAward:'+ 添加奖项', btnAddPub:'+ 添加论文/作品链接',
lSkillTools:'专业技能', lCommaSep:'逗号分隔',
phSkillTools:'SQL, Python, Tableau, A/B Testing',
hSkillTools:'5-10 项技能，与目标岗位匹配',
lSkillLang:'语言能力', phSkillLang:'普通话（母语），英语（CET-6 580）',
lSkillCerts:'证书 / 资质', phSkillCerts:'PMP / Google Analytics 认证',
lFont:'字体', lTypo:'字号 & 颜色调整',
lTzName:'姓名', lTzSection:'章节标题', lTzOrg:'机构/公司',
lTzRole:'职位/学位', lTzBody:'正文内容', lTzMeta:'辅助信息',
ecEduTitle:'教育经历',
ecEduSchool:'学校名称', ecEduSchoolPh:'某某大学', ecEduSchoolHint:'全称，可加括号标注 985/211',
ecEduDegree:'学历/专业', ecEduDegreePh:'硕士 · 计算机科学', ecEduDegreeHint:'',
ecEduPeriod:'时间段', ecEduPeriodPh:'2020.09 — 2023.06', ecEduPeriodHint:'月.年格式',
ecEduGpa:'GPA / 排名（选填）', ecEduGpaPh:'GPA 3.8/4.0，专业前 10%', ecEduGpaHint:'有则写，无则留空',
ecWorkTitle:'工作经历',
ecWorkCompany:'公司名称', ecWorkCompanyPh:'某互联网公司', ecWorkCompanyHint:'',
ecWorkRole:'职位', ecWorkRolePh:'产品经理', ecWorkRoleHint:'',
ecWorkPeriod:'时间段', ecWorkPeriodPh:'2023.07 — 2024.01', ecWorkPeriodHint:'',
ecWorkDesc:'工作描述', ecWorkDescPh:'• 负责... 实现了...\n• 通过 A/B 测试...\n• 推动...',
ecWorkDescHint:'3-5 条，以量化结果结尾，单条建议 20-35 字',
ecProjTitle:'项目经历',
ecProjName:'项目名称', ecProjNamePh:'某某效果分析工具', ecProjNameHint:'',
ecProjRole:'角色', ecProjRolePh:'独立开发 / 产品负责人', ecProjRoleHint:'',
ecProjPeriod:'时间', ecProjPeriodPh:'2025.06', ecProjPeriodHint:'',
ecProjLink:'项目链接（选填）', ecProjLinkPh:'https://...', ecProjLinkHint:'',
ecProjDesc:'项目描述', ecProjDescPh:'• 解决了... 问题\n• 技术栈：...\n• 核心成果：...',
ecProjDescHint:'2-4 条，突出技术亮点或业务价值',
ecAwardTitle:'荣誉奖项',
ecAwardName:'奖项名称', ecAwardNamePh:'某某竞赛 二等奖', ecAwardNameHint:'',
ecAwardOrg:'颁奖机构', ecAwardOrgPh:'某机构', ecAwardOrgHint:'',
ecAwardYear:'年份', ecAwardYearPh:'2023', ecAwardYearHint:'',
ecPubTitle:'论文/作品',
ecPubTitleF:'标题', ecPubTitlePh:'基于协同过滤的推荐系统研究', ecPubTitleHint:'',
ecPubVenue:'期刊/会议/平台', ecPubVenuePh:'GitHub / ACM MM 2024', ecPubVenueHint:'',
ecPubLink:'链接', ecPubLinkPh:'https://...', ecPubLinkHint:'',
hintEmpty:(g,ok)=>`建议 ${g}-${ok} 字`,
hintShort:(len,g)=>`当前 ${len} 字，稍短，建议补充到 ${g} 字`,
hintGood:(len)=>`当前 ${len} 字，长度合适`,
hintLong:(len,ok)=>`当前 ${len} 字，稍长，建议精简到 ${ok} 字以内`,
hintTooLong:(len)=>`当前 ${len} 字，过长！会溢出版面`,
resetConfirm:'确认重置所有内容？',
rSummary:'自我评价', rEdu:'教育经历', rWork:'工作经历', rProject:'项目经历',
rSkillsSection:'技能', rAwards:'荣誉奖项', rPubs:'论文/作品',
rSkillTools:'专业技能', rSkillLang:'语言能力', rSkillCerts:'证书资质',
rContact:'联系方式', rLangSide:'语言', rCertsSide:'证书',
rWechat:'微信', rViewLink:'查看',
},
en: {
tagline: 'Live Preview · 4 Templates · Bilingual',
btnDemo: 'Preview Demo', btnReset: ('Re'+'set'), btnPdf: 'Export PDF', btnHtml: 'Download HTML',
sLang:'Language / 语言', sTpl:('Temp'+'late'), sBasic:'Personal Info', sSummary:('Sum'+'mary'),
sEdu:('Educ'+'ation'), sWork:('Exper'+'ience'), sProject:('Proj'+'ects'), sSkills:('Ski'+'lls'),
sAwards:('Awa'+'rds'), sPubs:('Public'+'ations'),
lPhoto:'Photo (top right)', lPhotoUrl:'Photo URL', hPhoto:'Passport-style preferred, ratio 3:4',
lName:'Full Name', lRequired:('requ'+'ired'),
phName:'Alex Zhang', phJobTitle:'Growth Product Manager',
lJobTitle:'Target Role', hJobTitle:'8-16 words, precise job title',
lPhone:'Phone', phPhone:'+1 (555) 000-0000',
lEmail:'Email',
lCity:'City', phCity:'San Francisco',
lWechat:'Show WeChat', lWechatId:'WeChat ID',
lShowModule:'Show this section',
lSummaryContent:('Sum'+'mary'), phSummary:'Growth PM with 5+ years experience, specializing in user acquisition and retention...',
hSummary:'40-80 words, lead with your strongest differentiator',
btnAddEdu:'+ Add Education', btnAddWork:'+ Add Experience',
btnAddProject:'+ Add Project', btnAddAward:'+ Add Award', btnAddPub:'+ Add Publication',
lSkillTools:('Ski'+'lls'), lCommaSep:'comma separated',
phSkillTools:'SQL, Python, Tableau, A/B Testing',
hSkillTools:'5-10 skills relevant to the target role',
lSkillLang:('Lang'+'uages'), phSkillLang:'English (Native), Mandarin (Fluent)',
lSkillCerts:'Certifications', phSkillCerts:'PMP / Google Analytics Certified',
lFont:('Fo'+'nt'), lTypo:'Font Size & Color',
lTzName:('Na'+'me'), lTzSection:'Section Title', lTzOrg:'Org / Company',
lTzRole:'Role / Degree', lTzBody:'Body Text', lTzMeta:'Meta Info',
ecEduTitle:('Educ'+'ation'),
ecEduSchool:('Insti'+'tution'), ecEduSchoolPh:'State University', ecEduSchoolHint:'Full official name',
ecEduDegree:'Degree / Major', ecEduDegreePh:'M.S. Computer Science', ecEduDegreeHint:'',
ecEduPeriod:('Per'+'iod'), ecEduPeriodPh:'Sep 2020 — Jun 2023', ecEduPeriodHint:'Month Year format',
ecEduGpa:'GPA / Rank (optional)', ecEduGpaPh:'GPA 3.8/4.0, Top 10%', ecEduGpaHint:'Leave blank if not applicable',
ecWorkTitle:('Exper'+'ience'),
ecWorkCompany:('Com'+'pany'), ecWorkCompanyPh:'Tech Company Inc.', ecWorkCompanyHint:'',
ecWorkRole:('Ti'+'tle'), ecWorkRolePh:'Product Manager', ecWorkRoleHint:'',
ecWorkPeriod:('Per'+'iod'), ecWorkPeriodPh:'Jul 2023 — Jan 2024', ecWorkPeriodHint:'',
ecWorkDesc:('Descr'+'iption'), ecWorkDescPh:'• Led... resulting in...\n• Increased ... by X% through...\n• Collaborated with...',
ecWorkDescHint:'3-5 bullets, end with quantified results',
ecProjTitle:('Proj'+'ects'),
ecProjName:'Project Name', ecProjNamePh:'Analytics Dashboard', ecProjNameHint:'',
ecProjRole:('Ro'+'le'), ecProjRolePh:'Solo Developer / PM', ecProjRoleHint:'',
ecProjPeriod:('Da'+'te'), ecProjPeriodPh:'Jun 2025', ecProjPeriodHint:'',
ecProjLink:'Link (optional)', ecProjLinkPh:'https://...', ecProjLinkHint:'',
ecProjDesc:('Descr'+'iption'), ecProjDescPh:'• Solved... problem\n• Stack: ...\n• Outcome: ...',
ecProjDescHint:'2-4 bullets, highlight tech or business impact',
ecAwardTitle:('Awa'+'rds'),
ecAwardName:'Award Name', ecAwardNamePh:'National Innovation Competition — 2nd Place', ecAwardNameHint:'',
ecAwardOrg:'Issuing Organization', ecAwardOrgPh:'IEEE / Ministry of Education', ecAwardOrgHint:'',
ecAwardYear:('Ye'+'ar'), ecAwardYearPh:'2023', ecAwardYearHint:'',
ecPubTitle:('Public'+'ations'),
ecPubTitleF:('Ti'+'tle'), ecPubTitlePh:'Collaborative Filtering for Recommendation Systems', ecPubTitleHint:'',
ecPubVenue:'Journal / Conference / Platform', ecPubVenuePh:'GitHub / ACM MM 2024', ecPubVenueHint:'',
ecPubLink:('Li'+'nk'), ecPubLinkPh:'https://...', ecPubLinkHint:'',
hintEmpty:(g,ok)=>`Suggested ${g}-${ok} words`,
hintShort:(len,g)=>`${len} chars — a bit short, aim for ${g}`,
hintGood:(len)=>`${len} chars — looks good`,
hintLong:(len,ok)=>`${len} chars — slightly long, try to keep under ${ok}`,
hintTooLong:(len)=>`${len} chars — too long, may overflow the page`,
resetConfirm:'Reset all content?',
rSummary:('Sum'+'mary'), rEdu:('Educ'+'ation'), rWork:('Exper'+'ience'), rProject:('Proj'+'ects'),
rSkillsSection:('Ski'+'lls'), rAwards:('Awa'+'rds'), rPubs:('Public'+'ations'),
rSkillTools:('Ski'+'lls'), rSkillLang:('Lang'+'uages'), rSkillCerts:'Certifications',
rContact:('Con'+'tact'), rLangSide:('Lang'+'uages'), rCertsSide:'Certifications',
rWechat:('WeC'+'hat'), rViewLink:'View',
}
};
function _tb() {
const t = I18N[S.lang];
document.querySelectorAll('[data-i18n]').forEach(el => {
const key = el.dataset.i18n;
if (t[key] !== undefined) el.textContent = t[key];
});
document.querySelectorAll('[data-i18n-ph]').forEach(el => {
const key = el.dataset.i18nPh;
if (t[key] !== undefined) el.placeholder = t[key];
});
const tagEl = document.getElementById('topbar-tagline');
if (tagEl) tagEl.textContent = t.tagline;
const tzKeys = [('lTz'+'Name'),('lTzSe'+'ction'),('lTz'+'Org'),('lTz'+'Role'),('lTz'+'Body'),('lTz'+'Meta')];
document.querySelectorAll('.typo-label').forEach((el, i) => {
if (t[tzKeys[i]]) el.textContent = t[tzKeys[i]];
});
['edu','work','project','award','pub'].forEach(type => _t9(type));
}
function _ta() {
const t = I18N[S.lang];
return {
edu: { title: t.ecEduTitle, fields: [
{id:('sch'+'ool'), label:t.ecEduSchool, placeholder:t.ecEduSchoolPh, hint:t.ecEduSchoolHint},
{id:('deg'+'ree'), label:t.ecEduDegree, placeholder:t.ecEduDegreePh, hint:t.ecEduDegreeHint},
{id:('per'+'iod'), label:t.ecEduPeriod, placeholder:t.ecEduPeriodPh, hint:t.ecEduPeriodHint},
{id:('g'+'pa'), label:t.ecEduGpa, placeholder:t.ecEduGpaPh, hint:t.ecEduGpaHint},
]},
work: { title: t.ecWorkTitle, fields: [
{id:('com'+'pany'), label:t.ecWorkCompany, placeholder:t.ecWorkCompanyPh, hint:t.ecWorkCompanyHint},
{id:('ro'+'le'), label:t.ecWorkRole, placeholder:t.ecWorkRolePh, hint:t.ecWorkRoleHint},
{id:('per'+'iod'), label:t.ecWorkPeriod, placeholder:t.ecWorkPeriodPh, hint:t.ecWorkPeriodHint},
{id:('de'+'sc'), label:t.ecWorkDesc, placeholder:t.ecWorkDescPh, hint:t.ecWorkDescHint,
isTextarea:true, hintId:('workDe'+'scHint'), good:60, ok:150, warn:250},
]},
project: { title: t.ecProjTitle, fields: [
{id:('na'+'me'), label:t.ecProjName, placeholder:t.ecProjNamePh, hint:t.ecProjNameHint},
{id:('ro'+'le'), label:t.ecProjRole, placeholder:t.ecProjRolePh, hint:t.ecProjRoleHint},
{id:('per'+'iod'), label:t.ecProjPeriod, placeholder:t.ecProjPeriodPh, hint:t.ecProjPeriodHint},
{id:('li'+'nk'), label:t.ecProjLink, placeholder:t.ecProjLinkPh, hint:t.ecProjLinkHint},
{id:('de'+'sc'), label:t.ecProjDesc, placeholder:t.ecProjDescPh, hint:t.ecProjDescHint,
isTextarea:true, hintId:('projDe'+'scHint'), good:50, ok:120, warn:200},
]},
award: { title: t.ecAwardTitle, fields: [
{id:('na'+'me'), label:t.ecAwardName, placeholder:t.ecAwardNamePh, hint:t.ecAwardNameHint},
{id:('o'+'rg'), label:t.ecAwardOrg, placeholder:t.ecAwardOrgPh, hint:t.ecAwardOrgHint},
{id:('ye'+'ar'), label:t.ecAwardYear, placeholder:t.ecAwardYearPh, hint:t.ecAwardYearHint},
]},
pub: { title: t.ecPubTitle, fields: [
{id:('ti'+'tle'), label:t.ecPubTitleF, placeholder:t.ecPubTitlePh, hint:t.ecPubTitleHint},
{id:('ve'+'nue'), label:t.ecPubVenue, placeholder:t.ecPubVenuePh, hint:t.ecPubVenueHint},
{id:('li'+'nk'), label:t.ecPubLink, placeholder:t.ecPubLinkPh, hint:t.ecPubLinkHint},
]},
};
}
function _t7(type) {
const key = type + ('Ent'+'ries');
const id = Date.now();
S[key].push({id, data:{}});
S.expanded.add(id);
_t9(type);
_tu();
}
function _t8(type, id) {
const key = type + ('Ent'+'ries');
S[key] = S[key].filter(e => e.id !== id);
S.expanded.delete(id);
_t9(type);
_tu();
}
function _entrySummary(type, entry) {
  const d = entry.data || {};
  const parts = [];
  const push = v => { if (v && String(v).trim()) parts.push(String(v).trim()); };
  if (type === 'work') { push(d.company); push(d.role); push(d.period); }
  else if (type === 'edu') { push(d.school); push(d.degree); push(d.period); }
  else if (type === 'project') { push(d.name); push(d.role); push(d.period); }
  else if (type === 'award') { push(d.name); push(d.org); push(d.year); }
  else if (type === 'pub') { push(d.title); push(d.venue); }
  return parts;
}
function _isEntryEmpty(type, entry) {
  const d = entry.data || {};
  return !Object.values(d).some(v => v && String(v).trim());
}
function _toggleCollapse(type, id) {
  if (S.expanded.has(id)) S.expanded.delete(id);
  else S.expanded.add(id);
  _t9(type);
  _tu();
}
window._toggleCollapse = _toggleCollapse;

function _t9(type) {
const key = type + ('Ent'+'ries');
const cfg = _ta()[type];
const container = document.getElementById(type + ('Li'+'st'));
if (!container) return;
container.innerHTML = '';
S[key].forEach((entry, idx) => {
const card = document.createElement(('d'+'iv'));
card.className = 'entry-card';
card.dataset.entryId = entry.id;
card.dataset.entryType = type;
const hasDesc = cfg.fields.some(f => f.id === 'desc');
// 空条目自动保持展开
const isEmpty = _isEntryEmpty(type, entry);
const isExpanded = S.expanded.has(entry.id) || isEmpty;

const dragHandle = `<span class="entry-drag-handle" data-drag="1" title="拖动排序"><svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg></span>`;
const rewriteBtn = hasDesc ? `<button class="rewrite-btn" onclick="event.stopPropagation();openRewriteDialog('${type}',${entry.id})" title="AI 改写此段"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>AI 改写</button>` : '';
const delBtn = `<button class="entry-del" onclick="event.stopPropagation();_t8('${type}',${entry.id})" title="删除"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

if (!isExpanded) {
  card.classList.add('collapsed');
  card.onclick = function(e){
    if (e.target.closest('button') || e.target.closest('[data-drag="1"]')) return;
    _toggleCollapse(type, entry.id);
  };
  const parts = _entrySummary(type, entry);
  const summaryHtml = parts.length
    ? parts.map(p => `<span>${p}</span>`).join('<span class="sep">·</span>')
    : `<span class="empty">${cfg.title} ${idx+1} — 点击展开填写</span>`;
  card.innerHTML = `<div class="entry-collapsed-row">
    ${dragHandle}
    <div class="entry-summary">${summaryHtml}</div>
    <div class="entry-card-actions">${rewriteBtn}${delBtn}</div>
  </div>`;
  container.appendChild(card);
  return;
}

card.classList.add('expanded');
const collapseBtn = `<button class="entry-collapse-btn" onclick="event.stopPropagation();_toggleCollapse('${type}',${entry.id})" title="收起"><svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg></button>`;
card.innerHTML = `<div class="entry-card-head">
<div class="head-left">${dragHandle}<span class="title">${cfg.title} ${idx+1}</span></div>
<div class="entry-card-actions">${rewriteBtn}${collapseBtn}${delBtn}</div>
</div>`;
cfg.fields.forEach(f => {
const div = document.createElement(('d'+'iv'));
div.className = ('fi'+'eld');
div.innerHTML = `<label>${f.label}</label>`;
if (f.isTextarea) {
// Bold toolbar above description field
var toolbar = document.createElement('div');
toolbar.className = 'field-toolbar';
toolbar.innerHTML = '<button type="button" class="field-toolbar-btn" title="加粗选中文字 (Ctrl+B)"><b>B</b></button>';
toolbar.querySelector('button').addEventListener('click', function(){ _wrapSel(ta); });
div.appendChild(toolbar);
const ta = document.createElement(('text'+'area'));
ta.placeholder = f.placeholder;
ta.rows = 3;
ta.value = entry.data[f.id] || '';
ta.oninput = function() {
entry.data[f.id] = this.value;
if (f.hintId) _t6(this, f.hintId + '_' + entry.id, f.good, f.ok, f.warn);
else _tu();
};
ta.addEventListener('keydown', function(e) {
if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); _wrapSel(this); }
});
div.appendChild(ta);
if (f.hintId) {
const hint = document.createElement(('d'+'iv'));
hint.id = f.hintId + '_' + entry.id;
hint.className = ('hi'+'nt');
hint.textContent = f.hint;
div.appendChild(hint);
} else if (f.hint) {
const hint = document.createElement(('d'+'iv'));
hint.className = ('hi'+'nt');
hint.textContent = f.hint;
div.appendChild(hint);
}
} else {
const inp = document.createElement(('in'+'put'));
inp.type = f.id === ('li'+'nk') ? ('u'+'rl') : ('te'+'xt');
inp.placeholder = f.placeholder;
inp.value = entry.data[f.id] || '';
inp.oninput = function() { entry.data[f.id] = this.value; _tu(); };
div.appendChild(inp);
if (f.hint) {
const hint = document.createElement(('d'+'iv'));
hint.className = ('hi'+'nt');
hint.textContent = f.hint;
div.appendChild(hint);
}
}
card.appendChild(div);
});
container.appendChild(card);
});
_bindDrag(type);
}
function _bindDrag(type) {
  const container = document.getElementById(type + 'List');
  if (!container || container._dragBound) return;
  container._dragBound = true;
  let dragCard = null;
  let dragType = null;
  let placeholder = null;
  let cardHeight = 0;
  function onMove(e){
    if (!dragCard) return;
    e.preventDefault();
    const others = Array.from(container.querySelectorAll('.entry-card')).filter(c => c !== dragCard);
    let inserted = false;
    for (const other of others) {
      const rect = other.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (e.clientY < mid) {
        other.parentNode.insertBefore(placeholder, other);
        inserted = true;
        break;
      }
    }
    if (!inserted) container.appendChild(placeholder);
  }
  function onUp(){
    if (!dragCard) return;
    const cardsInOrder = Array.from(container.children).filter(c =>
      c === placeholder || (c.classList.contains('entry-card') && c !== dragCard)
    );
    const draggedId = parseFloat(dragCard.dataset.entryId);
    const key = dragType + 'Entries';
    const dragged = S[key].find(x => x.id === draggedId);
    const newArr = [];
    cardsInOrder.forEach(node => {
      if (node === placeholder) newArr.push(dragged);
      else {
        const oid = parseFloat(node.dataset.entryId);
        const found = S[key].find(x => x.id === oid);
        if (found) newArr.push(found);
      }
    });
    S[key] = newArr;
    placeholder.remove();
    dragCard.classList.remove('dragging');
    document.body.style.cursor = '';
    const cachedType = dragType;
    dragCard = null; dragType = null; placeholder = null;
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    _t9(cachedType);
    _tu();
  }
  container.addEventListener('pointerdown', function(e){
    const handle = e.target.closest('[data-drag="1"]');
    if (!handle) return;
    e.preventDefault();
    dragCard = handle.closest('.entry-card');
    if (!dragCard) return;
    dragType = dragCard.dataset.entryType;
    cardHeight = dragCard.getBoundingClientRect().height;
    placeholder = document.createElement('div');
    placeholder.className = 'entry-drop-placeholder';
    placeholder.style.height = cardHeight + 'px';
    dragCard.parentNode.insertBefore(placeholder, dragCard.nextSibling);
    dragCard.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  });
}

function _tc(id, fallback) { const el = document.getElementById(id); return el ? (parseFloat(el.value) || fallback) : fallback; }
function _td(id) { const el = document.getElementById(id); return el ? el.value : '#374151'; }
function _te() {
const g = id => (document.getElementById(id) || {value:''}).value.trim();
const gc = id => (document.getElementById(id) || {checked:false}).checked;
return {
name: g(('na'+'me')), nameEn: g(('nam'+'eEn')), jobTitle: g(('jobT'+'itle')),
phone: g(('ph'+'one')), email: g(('em'+'ail')), city: g(('ci'+'ty')),
linkedin: g(('link'+'edin')),
wechat: gc(('showW'+'echat')) ? g(('wec'+'hat')) : '',
showPhoto: gc(('show'+'Photo')), photoUrl: g(('phot'+'oUrl')),
showSummary: gc(('showS'+'ummary')), summary: g(('sum'+'mary')),
showProject: gc(('showP'+'roject')),
showSkills: gc(('showS'+'kills')),
skillTools: g(('skill'+'Tools')), skillLang: g(('skil'+'lLang')), skillCerts: g(('skill'+'Certs')),
showAwards: gc(('showA'+'wards')),
showPubs: gc(('show'+'Pubs')),
edu: S.eduEntries.map(e => e.data),
work: S.workEntries.map(e => e.data),
project: S.projectEntries.map(e => e.data),
award: S.awardEntries.map(e => e.data),
pub: S.pubEntries.map(e => e.data),
t: {
szName: _tc(('sz-'+'name'), 24),
szSection: _tc(('sz-se'+'ction'), 13),
szOrg: _tc(('sz-'+'org'), 12),
szRole: _tc(('sz-'+'role'), 11),
szBody: _tc(('sz-'+'body'), 11),
szMeta: _tc(('sz-'+'meta'), 11),
clName: _td(('cl-'+'name')),
clSection: _td(('cl-se'+'ction')),
clOrg: _td(('cl-'+'org')),
clRole: _td(('cl-'+'role')),
clBody: _td(('cl-'+'body')),
clMeta: _td(('cl-'+'meta')),
},
};
}
function _tf(hex) {
const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
return {r,g,b};
}
function _tg(hex, amt) {
const {r,g,b} = _tf(hex);
return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function _th(hex, a) { const {r,g,b} = _tf(hex); return `rgba(${r},${g},${b},${a})`; }
function _ti(hex) { const {r,g,b} = _tf(hex); return (r*299+g*587+b*114)/1000 < 140; }
function _md(text) {
if (!text) return '';
return text.replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight:700;">$1</strong>');
}
function _tj(text) {
if (!text) return '';
return text.split('\n').filter(l=>l.trim()).map(l => {
const hasBullet = l.startsWith('•') || l.startsWith('-');
const content = l.replace(/^[•\-]\s*/,'').replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight:700;">$1</strong>');
return `<div style="margin-bottom:2px;padding-left:10px;position:relative;"><span style="position:absolute;left:0;top:0;">${hasBullet ? '' : '•'}</span>${content}</div>`;
}).join('');
}
function _tk(v, col) {
const items = [];
if (v.phone) items.push(v.phone);
if (v.email) items.push(v.email);
if (v.city) items.push(v.city);
if (v.linkedin) items.push(v.linkedin);
if (v.wechat) items.push((v.L ? v.L.rWechat : ('WeC'+'hat')) + ': ' + v.wechat);
return items.map(i => `<span style="margin:0 6px;color:${col}">${i}</span>`).join('<span style="color:#9ca3af">|</span>');
}
function _tl(v, col, font) {
const t = v.t;
const sections = [];
sections.push(`
<div style="text-align:center;padding-bottom:12px;border-bottom:2px solid ${col};margin-bottom:14px;position:relative;">
${v.showPhoto && v.photoUrl ? `<img src="${v.photoUrl}" alt="${v.name || 'Profile'}" style="position:absolute;right:0;top:0;width:62px;height:82px;object-fit:cover;border-radius:3px;">` : ''}
<div style="font-size:${t.szName}px;font-weight:700;letter-spacing:.02em;color:${t.clName};">${v.name || '姓名'}${v.nameEn ? `<span style="font-size:${Math.round(t.szName*0.62)}px;font-weight:400;color:${t.clMeta};margin-left:10px;">${v.nameEn}</span>` : ''}</div>
${v.jobTitle ? `<div style="font-size:${t.szRole}px;color:${col};margin-top:4px;font-weight:500;">${v.jobTitle}</div>` : ''}
<div style="font-size:${t.szMeta}px;margin-top:6px;">${_tk(v, t.clBody)}</div>
</div>`);
if (v.showSummary && v.summary) sections.push(_tm(v.L.rSummary, `<p style="line-height:1.7;font-size:${t.szBody}px;color:${t.clBody};">${_md(v.summary)}</p>`, col, t));
if (v.edu.length) sections.push(_tm(v.L.rEdu, v.edu.map(e=>`
<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;">
<strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.school||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span>
</div><div style="font-size:${t.szRole}px;color:${t.clRole};">${e.degree||''}${e.gpa?` &nbsp;|&nbsp; <span style="color:${col}">${e.gpa}</span>`:''}</div></div>`).join(''), col, t));
if (v.work.length) sections.push(_tm(v.L.rWork, v.work.map(e=>`
<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;">
<strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.company||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span>
</div><div style="font-size:${t.szRole}px;color:${col};font-weight:500;margin-bottom:3px;">${e.role||''}</div>
<div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join(''), col, t));
if (v.showProject && v.project.length) sections.push(_tm(v.L.rProject, v.project.map(e=>`
<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;align-items:baseline;">
<strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.name||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span>
</div><div style="font-size:${t.szRole}px;color:${col};margin-bottom:2px;">${e.role||''}${e.link?` · <a href="${e.link}" style="color:${col};text-decoration:none;">${v.L.rViewLink}</a>`:''}</div>
<div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join(''), col, t));
if (v.showSkills && (v.skillTools||v.skillLang||v.skillCerts)) {
const sk = [];
if (v.skillTools) sk.push(`<div style="margin-bottom:4px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${v.L.rSkillTools}：</strong>${v.skillTools}</div>`);
if (v.skillLang) sk.push(`<div style="margin-bottom:4px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${v.L.rSkillLang}：</strong>${v.skillLang}</div>`);
if (v.skillCerts) sk.push(`<div style="font-size:${t.szBody}px;color:${t.clBody};"><strong>${v.L.rSkillCerts}：</strong>${v.skillCerts}</div>`);
sections.push(_tm(v.L.rSkillsSection, sk.join(''), col, t));
}
if (v.showAwards && v.award.length) sections.push(_tm(v.L.rAwards, v.award.map(e=>`
<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:${t.szBody}px;">
<span><strong style="color:${col}">${e.name||''}</strong>${e.org?` · <span style="color:${t.clBody}">${e.org}</span>`:''}</span><span style="color:${t.clMeta};">${e.year||''}</span>
</div>`).join(''), col, t));
if (v.showPubs && v.pub.length) sections.push(_tm(v.L.rPubs, v.pub.map(e=>`
<div style="margin-bottom:6px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${e.title||''}</strong>${e.venue?` · <em style="color:${t.clMeta};">${e.venue}</em>`:''}${e.link?` · <a href="${e.link}" style="color:${col};">${e.link}</a>`:''}</div>`).join(''), col, t));
return `<div style="padding:32px 40px;font-family:${font};color:${t.clBody};">${sections.join('')}</div>`;
}
function _tm(title, body, col, t) {
const sz = t ? t.szSection : 13;
const cl = t ? t.clSection : col;
return `<div style="margin-bottom:16px;">
<div style="font-size:${sz}px;font-weight:700;color:${cl};border-bottom:1px solid ${cl};padding-bottom:3px;margin-bottom:8px;letter-spacing:.04em;">${title}</div>
${body}
</div>`;
}
function _tn(v, col, font) {
const t = v.t;
const sections = [];
if (v.showSummary && v.summary) sections.push(_to(v.L.rSummary, `<p style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.7;">${_md(v.summary)}</p>`, col, t));
if (v.edu.length) sections.push(_to(v.L.rEdu, v.edu.map(e=>`
<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
<div><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.school||''}</strong><br><span style="font-size:${t.szRole}px;color:${t.clRole};">${e.degree||''}</span>${e.gpa?`<br><span style="font-size:${t.szMeta}px;color:${col}">${e.gpa}</span>`:''}</div>
<span style="font-size:${t.szMeta}px;color:${t.clMeta};white-space:nowrap;padding-top:2px;">${e.period||''}</span>
</div>`).join(''), col, t));
if (v.work.length) sections.push(_to(v.L.rWork, v.work.map(e=>`
<div style="margin-bottom:12px;padding:10px;background:${_th(col,.05)};border-radius:6px;border-left:3px solid ${col};">
<div style="display:flex;justify-content:space-between;"><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.company||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span></div>
<div style="font-size:${t.szRole}px;color:${col};font-weight:600;margin:2px 0 4px;">${e.role||''}</div>
<div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div>
</div>`).join(''), col, t));
if (v.showProject && v.project.length) sections.push(_to(v.L.rProject, v.project.map(e=>`
<div style="margin-bottom:10px;padding:10px;background:#f8faff;border-radius:6px;border:1px solid ${_th(col,.2)};">
<div style="display:flex;justify-content:space-between;align-items:center;">
<strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.name||''}</strong>
${e.link?`<a href="${e.link}" style="font-size:${t.szMeta}px;color:${col};text-decoration:none;background:${_th(col,.1)};padding:2px 6px;border-radius:4px;">${v.L.rViewLink}</a>`:''}
</div>
<div style="font-size:${t.szRole}px;color:${t.clMeta};margin:2px 0;">${e.role||''} ${e.period?`· ${e.period}`:''}</div>
<div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div>
</div>`).join(''), col, t));
if (v.showSkills && (v.skillTools||v.skillLang||v.skillCerts)) {
const tags = (v.skillTools||'').split(',').filter(s=>s.trim()).map(s=>`<span style="background:${_th(col,.1)};color:${col};padding:2px 8px;border-radius:12px;font-size:${t.szBody}px;margin:2px;display:inline-block;">${s.trim()}</span>`).join('');
sections.push(_to(v.L.rSkillsSection, `<div style="margin-bottom:4px;">${tags}</div>${v.skillLang?`<div style="font-size:${t.szBody}px;color:${t.clBody};margin-top:6px;"><strong>${v.L.rSkillLang}：</strong>${v.skillLang}</div>`:''}${v.skillCerts?`<div style="font-size:${t.szBody}px;color:${t.clBody};margin-top:3px;"><strong>${v.L.rSkillCerts}：</strong>${v.skillCerts}</div>`:''}`, col, t));
}
if (v.showAwards && v.award.length) sections.push(_to(v.L.rAwards, v.award.map(e=>`<div style="display:flex;justify-content:space-between;font-size:${t.szBody}px;margin-bottom:4px;"><span><strong style="color:${col}">${e.name||''}</strong>${e.org?` · <span style="color:${t.clBody}">${e.org}</span>`:''}</span><span style="color:${t.clMeta};">${e.year||''}</span></div>`).join(''), col, t));
if (v.showPubs && v.pub.length) sections.push(_to(v.L.rPubs, v.pub.map(e=>`<div style="margin-bottom:6px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${e.title||''}</strong>${e.venue?` · <em style="color:${t.clMeta};">${e.venue}</em>`:''}${e.link?` · <a href="${e.link}" style="color:${col};">${e.link}</a>`:''}</div>`).join(''), col, t));
return `<div style="font-family:${font};color:${t.clBody};">
<div style="background:${col};color:#fff;padding:28px 36px 20px;">
${v.showPhoto && v.photoUrl ? `<img src="${v.photoUrl}" alt="${v.name || 'Profile'}" style="float:right;width:62px;height:82px;object-fit:cover;border-radius:4px;margin-left:12px;">` : ''}
<div style="font-size:${t.szName}px;font-weight:700;letter-spacing:.01em;">${v.name||(v.L?v.L.lName:('Na'+'me'))}${v.nameEn?`<span style="font-size:${Math.round(t.szName*0.54)}px;font-weight:300;opacity:.85;margin-left:10px;">${v.nameEn}</span>`:''}</div>
${v.jobTitle?`<div style="font-size:${t.szRole}px;opacity:.9;margin-top:4px;font-weight:400;">${v.jobTitle}</div>`:''}
<div style="font-size:${t.szMeta}px;opacity:.85;margin-top:8px;">${_tk(v,'rgba(255,255,255,.9)')}</div>
</div>
<div style="padding:24px 36px;">${sections.join('')}</div>
</div>`;
}
function _to(title, body, col, t) {
const sz = t ? t.szSection : 12;
return `<div style="margin-bottom:18px;">
<div style="background:${col};color:#fff;font-size:${sz}px;font-weight:700;padding:4px 10px;border-radius:4px;display:inline-block;margin-bottom:10px;letter-spacing:.06em;">${title}</div>
${body}
</div>`;
}
function _tp(v, col, font) {
const t = v.t;
const bg = '#1a1a2e'; const bg2 = '#16213e'; const textLight = '#e2e8f0';
const sections = [];
if (v.showSummary && v.summary) sections.push(_tq(v.L.rSummary, `<p style="font-size:${t.szBody}px;color:#94a3b8;line-height:1.7;">${_md(v.summary)}</p>`, col, t));
if (v.edu.length) sections.push(_tq(v.L.rEdu, v.edu.map(e=>`
<div style="margin-bottom:8px;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:6px;">
<div style="display:flex;justify-content:space-between;"><strong style="font-size:${t.szOrg}px;color:${textLight};">${e.school||''}</strong><span style="font-size:${t.szMeta}px;color:#64748b;">${e.period||''}</span></div>
<div style="font-size:${t.szRole}px;color:#94a3b8;margin-top:2px;">${e.degree||''}${e.gpa?` | <span style="color:${col}">${e.gpa}</span>`:''}</div>
</div>`).join(''), col, t));
if (v.work.length) sections.push(_tq(v.L.rWork, v.work.map(e=>`
<div style="margin-bottom:12px;border-left:3px solid ${col};padding-left:12px;">
<div style="display:flex;justify-content:space-between;"><strong style="font-size:${t.szOrg}px;color:${textLight};">${e.company||''}</strong><span style="font-size:${t.szMeta}px;color:#64748b;">${e.period||''}</span></div>
<div style="font-size:${t.szRole}px;color:${col};font-weight:600;margin:2px 0 4px;">${e.role||''}</div>
<div style="font-size:${t.szBody}px;color:#94a3b8;line-height:1.65;">${_tj(e.desc)}</div>
</div>`).join(''), col, t));
if (v.showProject && v.project.length) sections.push(_tq(v.L.rProject, v.project.map(e=>`
<div style="margin-bottom:10px;padding:10px;background:rgba(255,255,255,.05);border-radius:8px;border:1px solid ${_th(col,.25)};">
<div style="display:flex;justify-content:space-between;align-items:center;">
<strong style="font-size:${t.szOrg}px;color:${textLight};">${e.name||''}</strong>
${e.link?`<a href="${e.link}" style="font-size:${t.szMeta}px;color:${col};text-decoration:none;background:${_th(col,.15)};padding:2px 6px;border-radius:4px;">${v.L.rViewLink}</a>`:''}
</div>
<div style="font-size:${t.szRole}px;color:#64748b;margin:2px 0;">${e.role||''} ${e.period?`· ${e.period}`:''}</div>
<div style="font-size:${t.szBody}px;color:#94a3b8;line-height:1.65;">${_tj(e.desc)}</div>
</div>`).join(''), col, t));
if (v.showSkills && (v.skillTools||v.skillLang||v.skillCerts)) {
const tags = (v.skillTools||'').split(',').filter(s=>s.trim()).map(s=>`<span style="background:${_th(col,.15)};color:${col};border:1px solid ${_th(col,.3)};padding:2px 8px;border-radius:12px;font-size:${t.szBody}px;margin:2px;display:inline-block;">${s.trim()}</span>`).join('');
sections.push(_tq(v.L.rSkillsSection, `<div>${tags}</div>${v.skillLang?`<div style="font-size:${t.szBody}px;color:#94a3b8;margin-top:6px;"><span style="color:${col};font-weight:600;">${v.L.rSkillLang} </span>${v.skillLang}</div>`:''}${v.skillCerts?`<div style="font-size:${t.szBody}px;color:#94a3b8;margin-top:3px;"><span style="color:${col};font-weight:600;">${v.L.rSkillCerts} </span>${v.skillCerts}</div>`:''}`, col, t));
}
if (v.showAwards && v.award.length) sections.push(_tq(v.L.rAwards, v.award.map(e=>`<div style="display:flex;justify-content:space-between;font-size:${t.szBody}px;margin-bottom:4px;color:#94a3b8;"><span><span style="display:inline-block;width:4px;height:4px;border-radius:50%;background:${col};margin-right:8px;vertical-align:middle;"></span><span style="color:${textLight}">${e.name||''}</span>${e.org?` · ${e.org}`:''}</span><span style="color:#64748b;">${e.year||''}</span></div>`).join(''), col, t));
if (v.showPubs && v.pub.length) sections.push(_tq(v.L.rPubs, v.pub.map(e=>`<div style="margin-bottom:6px;font-size:${t.szBody}px;color:#94a3b8;"><span style="color:${textLight}">${e.title||''}</span>${e.venue?` · <em>${e.venue}</em>`:''}${e.link?` · <a href="${e.link}" style="color:${col};">${e.link}</a>`:''}</div>`).join(''), col, t));
return `<div style="font-family:${font};background:${bg};min-height:1123px;">
<div style="background:linear-gradient(135deg,${col} 0%,${bg2} 60%);padding:28px 36px 20px;">
${v.showPhoto && v.photoUrl ? `<img src="${v.photoUrl}" alt="${v.name || 'Profile'}" style="float:right;width:62px;height:82px;object-fit:cover;border-radius:6px;border:2px solid ${_th(col,.4)};margin-left:12px;">` : ''}
<div style="font-size:${t.szName}px;font-weight:700;color:#fff;letter-spacing:.01em;">${v.name||(v.L?v.L.lName:('Na'+'me'))}${v.nameEn?`<span style="font-size:${Math.round(t.szName*0.54)}px;font-weight:300;opacity:.7;margin-left:10px;">${v.nameEn}</span>`:''}</div>
${v.jobTitle?`<div style="font-size:${t.szRole}px;color:${_tg(col,120)};margin-top:4px;">${v.jobTitle}</div>`:''}
<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.7);margin-top:8px;">${_tk(v,'rgba(255,255,255,.9)')}</div>
</div>
<div style="padding:24px 36px;">${sections.join('')}</div>
</div>`;
}
function _tq(title, body, col, t) {
const sz = t ? t.szSection : 13;
return `<div style="margin-bottom:18px;">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
<div style="width:3px;height:14px;background:${col};border-radius:2px;"></div>
<span style="font-size:${sz}px;font-weight:700;color:${col};letter-spacing:.06em;">${title}</span>
<div style="flex:1;height:1px;background:rgba(255,255,255,.08);"></div>
</div>
${body}
</div>`;
}
function _tr(v, col, font) {
const t = v.t;
const sideContent = [];
if (v.showPhoto && v.photoUrl) sideContent.push(`<div style="text-align:center;margin-bottom:16px;"><img src="${v.photoUrl}" alt="${v.name || 'Profile'}" style="width:80px;height:107px;object-fit:cover;border-radius:6px;border:2px solid rgba(255,255,255,.3);"></div>`);
sideContent.push(`<div style="text-align:center;margin-bottom:16px;">
<div style="font-size:${Math.round(t.szName*0.75)}px;font-weight:700;color:#fff;line-height:1.3;">${v.name||(v.L?v.L.lName:('Na'+'me'))}</div>
${v.nameEn?`<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.6);margin-top:2px;">${v.nameEn}</div>`:''}
${v.jobTitle?`<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.85);margin-top:6px;font-weight:500;">${v.jobTitle}</div>`:''}
</div>`);
const contacts = [];
if (v.phone) contacts.push(v.phone);
if (v.email) contacts.push(v.email);
if (v.city) contacts.push(v.city);
if (v.linkedin) contacts.push(v.linkedin);
if (v.wechat) contacts.push(v.wechat);
if (contacts.length) sideContent.push(`<div style="margin-bottom:16px;">${_ts(v.L.rContact)}<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.8);line-height:2;">${contacts.join('<br>')}</div></div>`);
if (v.showSkills && v.skillTools) sideContent.push(`<div style="margin-bottom:14px;">${_ts(v.L.rSkillsSection)}<div>${(v.skillTools||'').split(',').filter(s=>s.trim()).map(s=>`<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.8);padding:2px 0;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:4px;">${s.trim()}</div>`).join('')}</div></div>`);
if (v.showSkills && v.skillLang) sideContent.push(`<div style="margin-bottom:14px;">${_ts(v.L.rLangSide)}<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.8);line-height:1.8;">${v.skillLang}</div></div>`);
if (v.showSkills && v.skillCerts) sideContent.push(`<div style="margin-bottom:14px;">${_ts(v.L.rCertsSide)}<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.8);line-height:1.8;">${v.skillCerts}</div></div>`);
if (v.showAwards && v.award.length) sideContent.push(`<div style="margin-bottom:14px;">${_ts(v.L.rAwards)}${v.award.map(e=>`<div style="font-size:${t.szMeta}px;color:rgba(255,255,255,.8);margin-bottom:4px;"><strong>${e.name||''}</strong><br>${e.org||''} ${e.year||''}</div>`).join('')}</div>`);
const mainContent = [];
if (v.showSummary && v.summary) mainContent.push(_tt(v.L.rSummary, `<p style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.7;">${_md(v.summary)}</p>`, col, t));
if (v.edu.length) mainContent.push(_tt(v.L.rEdu, v.edu.map(e=>`
<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;">
<strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.school||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span>
</div><div style="font-size:${t.szRole}px;color:${t.clRole};">${e.degree||''}${e.gpa?` | <span style="color:${col}">${e.gpa}</span>`:''}</div></div>`).join(''), col, t));
if (v.work.length) mainContent.push(_tt(v.L.rWork, v.work.map(e=>`
<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;">
<strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.company||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span>
</div><div style="font-size:${t.szRole}px;color:${col};font-weight:600;margin-bottom:3px;">${e.role||''}</div>
<div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join(''), col, t));
if (v.showProject && v.project.length) mainContent.push(_tt(v.L.rProject, v.project.map(e=>`
<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;align-items:baseline;">
<strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.name||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span>
</div><div style="font-size:${t.szRole}px;color:${col};margin-bottom:2px;">${e.role||''}${e.link?` · <a href="${e.link}" style="color:${col};">${v.L.rViewLink}</a>`:''}</div>
<div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join(''), col, t));
if (v.showPubs && v.pub.length) mainContent.push(_tt(v.L.rPubs, v.pub.map(e=>`<div style="margin-bottom:6px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${e.title||''}</strong>${e.venue?` · <em style="color:${t.clMeta};">${e.venue}</em>`:''}${e.link?` · <a href="${e.link}" style="color:${col};">${e.link}</a>`:''}</div>`).join(''), col, t));
return `<div style="font-family:${font};display:flex;min-height:1123px;color:${t.clBody};">
<div style="width:220px;flex-shrink:0;background:${col};color:#fff;padding:28px 18px;min-height:1123px;">${sideContent.join('')}</div>
<div style="flex:1;padding:28px 28px;">${mainContent.join('')}</div>
</div>`;
}
function _ts(title) {
return `<div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:4px;margin-bottom:8px;">${title}</div>`;
}
function _tt(title, body, col, t) {
const sz = t ? t.szSection : 13;
const cl = t ? t.clSection : col;
return `<div style="margin-bottom:18px;">
<div style="font-size:${sz}px;font-weight:700;color:${cl};border-bottom:2px solid ${cl};padding-bottom:3px;margin-bottom:8px;letter-spacing:.04em;">${title}</div>
${body}
</div>`;
}

/* ── Template: 极简线条 (lines) ── */
function _tlines(v, col, font) {
const t = v.t;
function secH(title) {
  return `<div style="display:flex;align-items:center;gap:8px;margin:14px 0 8px;"><div style="width:3px;height:${t.szSection+2}px;background:${col};border-radius:2px;flex-shrink:0;"></div><span style="font-size:${t.szSection}px;font-weight:700;color:${t.clSection};letter-spacing:.06em;text-transform:uppercase;">${title}</span><div style="flex:1;height:1px;background:${col};opacity:.2;"></div></div>`;
}
const ci = [];
if (v.phone) ci.push(v.phone);
if (v.email) ci.push(v.email);
if (v.city) ci.push(v.city);
if (v.linkedin) ci.push(v.linkedin);
if (v.wechat) ci.push((v.L?v.L.rWechat:'WeChat')+': '+v.wechat);
let html = `<div style="font-family:${font};color:${t.clBody};padding:28px 36px 24px;">`;
html += `<div style="position:relative;padding-right:${v.showPhoto&&v.photoUrl?'78px':'0'};">
${v.showPhoto&&v.photoUrl?`<img src="${v.photoUrl}" alt="${v.name||'Profile'}" style="position:absolute;right:0;top:0;width:62px;height:82px;object-fit:cover;border-radius:3px;">`:'' }
<div style="font-size:${t.szName}px;font-weight:700;color:${t.clName};">${v.name||'姓名'}${v.nameEn?`<span style="font-size:${Math.round(t.szName*.52)}px;font-weight:400;color:${t.clMeta};margin-left:10px;">${v.nameEn}</span>`:''}</div>
${v.jobTitle?`<div style="font-size:${t.szRole}px;color:${col};font-weight:500;margin-top:4px;">${v.jobTitle}</div>`:''}
${ci.length?`<div style="font-size:${t.szMeta}px;color:${t.clMeta};margin-top:6px;">${ci.join('<span style="margin:0 5px;opacity:.4;">|</span>')}</div>`:''}
<div style="height:2px;background:${col};margin-top:12px;border-radius:1px;opacity:.7;"></div>
</div>`;
if (v.showSummary&&v.summary) html+=secH(v.L.rSummary)+`<p style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.7;margin:0;">${_md(v.summary)}</p>`;
if (v.edu.length) html+=secH(v.L.rEdu)+v.edu.map(e=>`<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.school||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span></div><div style="font-size:${t.szRole}px;color:${t.clRole};">${e.degree||''}${e.gpa?` &nbsp;·&nbsp; <span style="color:${col};">${e.gpa}</span>`:''}</div></div>`).join('');
if (v.work.length) html+=secH(v.L.rWork)+v.work.map(e=>`<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.company||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span></div><div style="font-size:${t.szRole}px;color:${col};font-weight:500;margin-bottom:3px;">${e.role||''}</div><div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join('');
if (v.showProject&&v.project.length) html+=secH(v.L.rProject)+v.project.map(e=>`<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.name||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span></div><div style="font-size:${t.szRole}px;color:${col};margin-bottom:2px;">${e.role||''}${e.link?` · <a href="${e.link}" style="color:${col};text-decoration:none;">${v.L.rViewLink}</a>`:''}</div><div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join('');
if (v.showSkills&&(v.skillTools||v.skillLang||v.skillCerts)){
  html+=secH(v.L.rSkillsSection);
  if(v.skillTools) html+=`<div style="margin-bottom:4px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${v.L.rSkillTools}：</strong>${v.skillTools}</div>`;
  if(v.skillLang) html+=`<div style="margin-bottom:4px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${v.L.rSkillLang}：</strong>${v.skillLang}</div>`;
  if(v.skillCerts) html+=`<div style="font-size:${t.szBody}px;color:${t.clBody};"><strong>${v.L.rSkillCerts}：</strong>${v.skillCerts}</div>`;
}
if (v.showAwards&&v.award.length) html+=secH(v.L.rAwards)+v.award.map(e=>`<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:${t.szBody}px;"><span><strong style="color:${col};">${e.name||''}</strong>${e.org?` · <span style="color:${t.clBody};">${e.org}</span>`:''}</span><span style="color:${t.clMeta};">${e.year||''}</span></div>`).join('');
if (v.showPubs&&v.pub.length) html+=secH(v.L.rPubs)+v.pub.map(e=>`<div style="margin-bottom:6px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${e.title||''}</strong>${e.venue?` · <em style="color:${t.clMeta};">${e.venue}</em>`:''}${e.link?` · <a href="${e.link}" style="color:${col};">${e.link}</a>`:''}</div>`).join('');
return html+'</div>';
}

/* ── Template: 精英侧栏 (premium) ── */
function _tpremium(v, col, font) {
const t = v.t;
function sideH(title) {
  return `<div style="font-size:9px;font-weight:700;color:${col};letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid ${_th(col,.25)};padding-bottom:3px;margin:12px 0 7px;">${title}</div>`;
}
function mainH(title) {
  return `<div style="font-size:${t.szSection}px;font-weight:700;color:${t.clSection};padding-bottom:3px;margin:14px 0 7px;border-bottom:1px solid ${_th(col,.2)};">${title}</div>`;
}
const header = `<div style="background:${col};color:#fff;padding:18px 22px 14px;display:flex;justify-content:space-between;align-items:flex-start;">
<div><div style="font-size:${t.szName}px;font-weight:700;">${v.name||'姓名'}${v.nameEn?`<span style="font-size:${Math.round(t.szName*.52)}px;font-weight:300;opacity:.8;margin-left:8px;">${v.nameEn}</span>`:''}</div>${v.jobTitle?`<div style="font-size:${t.szRole}px;opacity:.9;margin-top:4px;">${v.jobTitle}</div>`:''}</div>
${v.showPhoto&&v.photoUrl?`<img src="${v.photoUrl}" alt="${v.name||'Profile'}" style="width:58px;height:77px;object-fit:cover;border-radius:4px;border:2px solid rgba(255,255,255,.35);">`:'' }
</div>`;
const ci = [];
if (v.phone) ci.push(v.phone);
if (v.email) ci.push(v.email);
if (v.city) ci.push(v.city);
if (v.linkedin) ci.push(v.linkedin);
if (v.wechat) ci.push(v.wechat);
let side = '';
if (ci.length) side+=sideH(v.L.rContact)+`<div style="font-size:${t.szMeta}px;color:#374151;line-height:2.0;">${ci.join('<br>')}</div>`;
if (v.showSkills&&v.skillTools) side+=sideH(v.L.rSkillsSection)+(v.skillTools||'').split(',').filter(s=>s.trim()).map(s=>`<div style="font-size:${t.szMeta}px;color:#374151;padding:2px 0;border-bottom:1px solid ${_th(col,.1)};margin-bottom:3px;">${s.trim()}</div>`).join('');
if (v.showSkills&&v.skillLang) side+=sideH(v.L.rLangSide)+`<div style="font-size:${t.szMeta}px;color:#374151;line-height:1.8;">${v.skillLang}</div>`;
if (v.showSkills&&v.skillCerts) side+=sideH(v.L.rCertsSide)+`<div style="font-size:${t.szMeta}px;color:#374151;line-height:1.8;">${v.skillCerts}</div>`;
if (v.showAwards&&v.award.length) side+=sideH(v.L.rAwards)+v.award.map(e=>`<div style="font-size:${t.szMeta}px;color:#374151;margin-bottom:6px;"><strong style="color:${col};display:block;">${e.name||''}</strong><span style="opacity:.65;">${e.org||''} ${e.year||''}</span></div>`).join('');
let main = '';
if (v.showSummary&&v.summary) main+=mainH(v.L.rSummary)+`<p style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.7;margin:0;">${_md(v.summary)}</p>`;
if (v.work.length) main+=mainH(v.L.rWork)+v.work.map(e=>`<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.company||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span></div><div style="font-size:${t.szRole}px;color:${col};font-weight:500;margin-bottom:3px;">${e.role||''}</div><div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join('');
if (v.edu.length) main+=mainH(v.L.rEdu)+v.edu.map(e=>`<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.school||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span></div><div style="font-size:${t.szRole}px;color:${t.clRole};">${e.degree||''}${e.gpa?` · <span style="color:${col};">${e.gpa}</span>`:''}</div></div>`).join('');
if (v.showProject&&v.project.length) main+=mainH(v.L.rProject)+v.project.map(e=>`<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><strong style="font-size:${t.szOrg}px;color:${t.clOrg};">${e.name||''}</strong><span style="font-size:${t.szMeta}px;color:${t.clMeta};">${e.period||''}</span></div><div style="font-size:${t.szRole}px;color:${col};margin-bottom:2px;">${e.role||''}${e.link?` · <a href="${e.link}" style="color:${col};">${v.L.rViewLink}</a>`:''}</div><div style="font-size:${t.szBody}px;color:${t.clBody};line-height:1.65;">${_tj(e.desc)}</div></div>`).join('');
if (v.showPubs&&v.pub.length) main+=mainH(v.L.rPubs)+v.pub.map(e=>`<div style="margin-bottom:6px;font-size:${t.szBody}px;color:${t.clBody};"><strong>${e.title||''}</strong>${e.venue?` · <em style="color:${t.clMeta};">${e.venue}</em>`:''}${e.link?` · <a href="${e.link}" style="color:${col};">${e.link}</a>`:''}</div>`).join('');
return `<div style="font-family:${font};color:${t.clBody};">${header}<div style="display:flex;min-height:1050px;"><div style="width:196px;flex-shrink:0;background:${_th(col,.06)};border-right:1px solid ${_th(col,.15)};padding:16px 14px;">${side}</div><div style="flex:1;padding:16px 22px;">${main}</div></div></div>`;
}

function _tu() {
const v = _te();
v.L = I18N[S.lang];
const col = S.color;
const font = S.font;
let html = '';
if (S.template === ('cla'+'ssic')) html = _tl(v, col, font);
else if (S.template === ('mod'+'ern')) html = _tn(v, col, font);
else if (S.template === ('da'+'rk')) html = _tp(v, col, font);
else if (S.template === ('two'+'col')) html = _tr(v, col, font);
else if (S.template === 'lines') html = _tlines(v, col, font);
else if (S.template === 'premium') html = _tpremium(v, col, font);
const el = document.getElementById('resume-preview');
el.innerHTML = html;
requestAnimationFrame(() => {
el.querySelectorAll('.pg-break').forEach(n => n.remove());
const PAGE_H = 1123;
const totalH = el.scrollHeight;
const pages = Math.ceil(totalH / PAGE_H);
for (let i = 1; i < pages; i++) {
const marker = document.createElement(('d'+'iv'));
marker.className = ('pg-b'+'reak');
marker.style.top = (PAGE_H * i) + 'px';
marker.innerHTML = `<span class="pg-break-label">第 ${i} 页 / 第 ${i+1} 页</span>`;
el.appendChild(marker);
}
});
if (typeof _scheduleSave === 'function') _scheduleSave();
_saveHistory();
}
function _tv() {
const v = _te();
const col = S.color;
const font = S.font;
let body = '';
if (S.template === ('cla'+'ssic')) body = _tl(v,col,font);
else if (S.template === ('mod'+'ern')) body = _tn(v,col,font);
else if (S.template === ('da'+'rk')) body = _tp(v,col,font);
else if (S.template === ('two'+'col')) body = _tr(v,col,font);
else if (S.template === 'lines') body = _tlines(v,col,font);
else if (S.template === 'premium') body = _tpremium(v,col,font);
return `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Lato:wght@300;400;700&family=Raleway:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#d1d5db;display:flex;justify-content:center;padding:24px;}
@media print{body{background:#fff;padding:0;}#page{box-shadow:none;}}
#page{width:794px;min-height:1123px;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.2);}</style>
<title>${v.name||'简历'}</title></head>
<body><div id="page">${body}</div></body></html>`;
}
function _tw() {
const v = _te();
const a = document.createElement('a');
a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(_tv());
a.download = (v.name||('res'+'ume')) + '-简历.html';
a.click();
}
function _tx() {
const win = window.open('', '_blank');
win.document.write(_tv());
win.document.close();
win.focus();
setTimeout(() => { win.print(); }, 600);
}
function _ty() {
if (!confirm(I18N[S.lang].resetConfirm)) return;
try { localStorage.removeItem(_STORAGE_KEY); } catch(e) {}
location.reload();
}

/* ── 自动保存到 localStorage ── */
const _STORAGE_KEY = 'resume-builder-v1';
let _saveTimer = null;
let _restoring = false;
function _snapshotState() {
  const v = _te();
  return {
    _v: 1,
    S: {template:S.template, color:S.color, font:S.font, lang:S.lang},
    entries: {
      edu: S.eduEntries, work: S.workEntries, project: S.projectEntries,
      award: S.awardEntries, pub: S.pubEntries,
    },
    expanded: Array.from(S.expanded),
    form: {
      name:v.name, nameEn:v.nameEn, jobTitle:v.jobTitle, phone:v.phone,
      email:v.email, city:v.city, linkedin:v.linkedin, wechat:v.wechat,
      showPhoto:v.showPhoto, photoUrl:v.photoUrl,
      showSummary:v.showSummary, summary:v.summary,
      showProject:v.showProject, showSkills:v.showSkills,
      skillTools:v.skillTools, skillLang:v.skillLang, skillCerts:v.skillCerts,
      showAwards:v.showAwards, showPubs:v.showPubs,
    },
    typo: v.t,
  };
}
function _save() {
  if (_restoring) return;
  try {
    localStorage.setItem(_STORAGE_KEY, JSON.stringify(_snapshotState()));
    const s = document.getElementById('saveStatus');
    if (s) {
      s.textContent = '已保存';
      s.style.color = '#10b981';
      s.style.opacity = '1';
      clearTimeout(_save._fade);
      _save._fade = setTimeout(() => { s.style.opacity = '0'; }, 1500);
    }
  } catch(e) {
    const s = document.getElementById('saveStatus');
    if (s) { s.textContent = '保存失败'; s.style.color = '#f59e0b'; s.style.opacity = '1'; }
  }
}
function _scheduleSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(_save, 400);
}
function _restore() {
  let raw;
  try { raw = localStorage.getItem(_STORAGE_KEY); } catch(e) { return false; }
  if (!raw) return false;
  let data;
  try { data = JSON.parse(raw); } catch(e) { return false; }
  if (!data || data._v !== 1) return false;
  _restoring = true;
  try {
    if (data.S) {
      S.template = data.S.template || S.template;
      S.color = data.S.color || S.color;
      S.font = data.S.font || S.font;
      S.lang = data.S.lang || S.lang;
    }
    if (data.entries) {
      S.eduEntries = data.entries.edu || [];
      S.workEntries = data.entries.work || [];
      S.projectEntries = data.entries.project || [];
      S.awardEntries = data.entries.award || [];
      S.pubEntries = data.entries.pub || [];
    }
    S.expanded = new Set(data.expanded || []);
    const f = data.form || {};
    const set = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = val; };
    const chk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    set('name', f.name); set('nameEn', f.nameEn); set('jobTitle', f.jobTitle);
    set('phone', f.phone); set('email', f.email); set('city', f.city);
    set('linkedin', f.linkedin); set('wechat', f.wechat);
    chk('showPhoto', f.showPhoto); set('photoUrl', f.photoUrl);
    chk('showSummary', f.showSummary); set('summary', f.summary);
    chk('showProject', f.showProject); chk('showSkills', f.showSkills);
    set('skillTools', f.skillTools); set('skillLang', f.skillLang); set('skillCerts', f.skillCerts);
    chk('showAwards', f.showAwards); chk('showPubs', f.showPubs);
    // showWechat 的状态从 wechat 有无值反推(_snapshotState 里 wechat 空串代表已关闭)
    const wechatHasValue = !!(f.wechat && f.wechat.length);
    chk('showWechat', wechatHasValue);
    const photoField = document.getElementById('photoField');
    if (photoField) photoField.style.display = f.showPhoto ? '' : 'none';
    const wechatField = document.getElementById('wechatField');
    if (wechatField) wechatField.style.display = wechatHasValue ? '' : 'none';
    const summaryBody = document.getElementById('summaryBody');
    if (summaryBody) summaryBody.style.display = f.showSummary ? '' : 'none';
    const t = data.typo || {};
    const setNum = (id, v) => { const el = document.getElementById(id); if (el && v != null) el.value = v; };
    setNum('sz-name', t.szName); setNum('sz-section', t.szSection);
    setNum('sz-org', t.szOrg); setNum('sz-role', t.szRole);
    setNum('sz-body', t.szBody); setNum('sz-meta', t.szMeta);
    setNum('cl-name', t.clName); setNum('cl-section', t.clSection);
    setNum('cl-org', t.clOrg); setNum('cl-role', t.clRole);
    setNum('cl-body', t.clBody); setNum('cl-meta', t.clMeta);
    document.querySelectorAll('.lang-tab').forEach((el, i) => {
      el.classList.toggle('active', (i === 0 ? 'zh' : 'en') === S.lang);
    });
    document.querySelectorAll('.tpl-card').forEach((el, i) => {
      const names = ['classic','modern','dark','twocol','lines','premium'];
      el.classList.toggle('active', names[i] === S.template);
    });
    document.querySelectorAll('.color-swatch').forEach(el => {
      el.classList.toggle('active', el.dataset.color === S.color);
    });
    document.querySelectorAll('.font-opt').forEach(el => {
      el.classList.toggle('active', el.dataset.font === S.font);
    });
  } finally {
    _restoring = false;
  }
  return true;
}
function _tz() {
if (S.lang === 'en') {
document.getElementById(('na'+'me')).value = 'Alex Zhang';
document.getElementById(('nam'+'eEn')).value = '';
document.getElementById(('jobT'+'itle')).value = 'Growth Product Manager';
document.getElementById(('ph'+'one')).value = '+1 (555) 000-****';
document.getElementById(('em'+'ail')).value = 'alex.zhang@example.com';
document.getElementById(('ci'+'ty')).value = 'San Francisco, CA';
document.getElementById(('link'+'edin')).value = 'linkedin.com/in/alexzhang';
document.getElementById(('showS'+'ummary')).checked = true;
document.getElementById(('summa'+'ryBody')).style.display = '';
document.getElementById(('sum'+'mary')).value = 'Growth PM with 5+ years of experience driving user acquisition and retention. Led viral referral programs generating 300K+ new registrations. Skilled in A/B experimentation, data-driven attribution, and cross-functional execution across two high-growth consumer tech companies.';
document.getElementById(('showS'+'kills')).checked = true;
document.getElementById(('skill'+'Tools')).value = 'SQL, Python, Mixpanel, Amplitude, A/B Testing, Figma, Tableau';
document.getElementById(('skil'+'lLang')).value = 'English (Native), Mandarin (Fluent)';
document.getElementById(('skill'+'Certs')).value = 'Google Analytics Certified, PMP';
S.eduEntries = [];
S.workEntries = [];
S.projectEntries = [];
S.awardEntries = [];
S.pubEntries = [];
S.eduEntries = [
{id: Date.now(), data: {school:'Stanford University', degree:'M.S. Computer Science', period:'Sep 2017 — Jun 2020', gpa:'GPA 3.8/4.0, Top 10%'}},
{id: Date.now()+1, data: {school:'University of Washington', degree:'B.S. Software Engineering', period:'Sep 2013 — Jun 2017', gpa:''}},
];
S.workEntries = [
{id: Date.now()+10, data: {
company:'Acme Corp',
role:'Senior Product Manager · Growth',
period:'Mar 2022 — Present',
desc:'• Built referral growth loop for international app launch; "Invite & Earn" mechanism drove +120K DAU in month one, ROI 1:4.2\n• Upgraded attribution from Last-Click to data-driven model, improving channel budget efficiency by 23%\n• Scaled A/B experimentation platform to 60+ concurrent experiments, cutting cycle time by 40%',
}},
{id: Date.now()+11, data: {
company:'TechStart Inc.',
role:'Product Manager · User Growth',
period:'Jul 2020 — Feb 2022',
desc:'• Optimised new-user activation funnel via landing-page stratified experiments, lifting registration CVR by 18%\n• Designed "refer-a-friend" campaign adding 80K linked payment accounts per run; CAC reduced by 35%\n• Led dormant-user re-engagement strategy, improving 7-day return rate from 6% to 11%',
}},
];
document.getElementById(('showP'+'roject')).checked = true;
S.projectEntries = [
{id: Date.now()+20, data: {
name:'Growth Experimentation Platform',
role:'Product Owner',
period:'Jun 2023 — Dec 2023',
link:'',
desc:'• Eliminated dependency on engineering sprints for experiment setup; PMs self-serve in minutes\n• Stack: React + Node.js + ClickHouse; integrated across 5 business lines\n• 3× faster experiment iterations; saved 200h+ engineering time per month',
}},
{id: Date.now()+21, data: {
name:'Campaign Attribution Dashboard',
role:'Solo Designer & Stakeholder',
period:'Nov 2022',
link:'',
desc:'• Unified multi-channel attribution data for real-time ROI visualisation, replacing 3 manual reports\n• SQL + Tableau pipeline cut data latency from T+1 to under 2 hours',
}},
];
document.getElementById(('showA'+'wards')).checked = true;
S.awardEntries = [
{id: Date.now()+30, data: {name:'Annual Best Growth Initiative Award', org:'Acme Corp', year:'2023'}},
{id: Date.now()+31, data: {name:'National Math Modeling Competition — 2nd Place', org:'Ministry of Education', year:'2016'}},
];
} else {
document.getElementById(('na'+'me')).value = '李明远';
document.getElementById(('nam'+'eEn')).value = 'Alex Li';
document.getElementById(('jobT'+'itle')).value = '增长产品经理 / Growth PM';
document.getElementById(('ph'+'one')).value = '+86 138 **** 8888';
document.getElementById(('em'+'ail')).value = 'alex.li@example.com';
document.getElementById(('ci'+'ty')).value = '上海';
document.getElementById(('link'+'edin')).value = 'linkedin.com/in/alexli';
document.getElementById(('showS'+'ummary')).checked = true;
document.getElementById(('summa'+'ryBody')).style.display = '';
document.getElementById(('sum'+'mary')).value = '5 年增长方向产品经验，主导多个拉新与留存项目，累计带动新增注册用户 300 万+。擅长数据驱动决策、A/B 实验设计及跨团队协作，曾在两家大型互联网公司担任核心 PM 职位。';
document.getElementById(('showS'+'kills')).checked = true;
document.getElementById(('skill'+'Tools')).value = 'SQL, Python, Mixpanel, Amplitude, A/B Testing, Figma, Tableau';
document.getElementById(('skil'+'lLang')).value = '普通话（母语），英语（CET-6 588）';
document.getElementById(('skill'+'Certs')).value = 'Google Analytics 认证，PMP';
S.eduEntries = [];
S.workEntries = [];
S.projectEntries = [];
S.awardEntries = [];
S.pubEntries = [];
S.eduEntries = [
{id: Date.now(), data: {school:'某重点高校', degree:'硕士 · 计算机科学与技术', period:'2017.09 — 2020.06', gpa:'GPA 3.8/4.0，专业前 8%'}},
{id: Date.now()+1, data: {school:'另一所高校', degree:'本科 · 软件工程', period:'2013.09 — 2017.06', gpa:''}},
];
S.workEntries = [
{id: Date.now()+10, data: {
company:'某大型互联网公司',
role:'高级产品经理 · 增长组',
period:'2022.03 — 至今',
desc:'• 主导 App 海外版拉新裂变体系搭建，设计"邀请有礼"双边激励机制，首月带动新增 DAU 12 万，ROI 1:4.2\n• 推动归因模型从 Last-Click 升级为数据驱动归因，渠道预算分配效率提升 23%\n• 联合数据团队搭建增长实验平台，支持同时在线 60+ A/B 实验，实验周期缩短 40%',
}},
{id: Date.now()+11, data: {
company:'另一家互联网公司',
role:'产品经理 · 用户增长',
period:'2020.07 — 2022.02',
desc:'• 负责外卖新用户激活链路优化，通过落地页分层实验将注册转化率提升 18%\n• 设计"老带新"裂变活动，单次活动新增绑卡用户 8 万，获客成本降低 35%\n• 主导用户分层召回策略，沉默用户 7 日回归率从 6% 提升至 11%',
}},
];
document.getElementById(('showP'+'roject')).checked = true;
S.projectEntries = [
{id: Date.now()+20, data: {
name:'增长实验自动化平台',
role:'产品负责人',
period:'2023.06 — 2023.12',
link:'',
desc:'• 解决业务侧实验配置繁琐、依赖研发排期问题，实现 PM 自助配置上线\n• 技术栈：React + Node.js + ClickHouse，接入 5 条业务线\n• 上线后实验迭代速度提升 3 倍，月均节省研发工时 200h+',
}},
{id: Date.now()+21, data: {
name:'裂变活动效果归因看板',
role:'独立设计 & 需求方',
period:'2022.11',
link:'',
desc:'• 整合多渠道归因数据，实现活动 ROI 实时可视化，替代 3 张手工报表\n• 基于 SQL + Tableau，数据延迟从 T+1 降至 2 小时内刷新',
}},
];
document.getElementById(('showA'+'wards')).checked = true;
S.awardEntries = [
{id: Date.now()+30, data: {name:'年度最佳增长项目奖', org:'某互联网公司', year:'2023'}},
{id: Date.now()+31, data: {name:'全国大学生数学建模竞赛 二等奖', org:'教育部', year:'2016'}},
];
}
S.expanded = new Set();
['edu','work','project','award'].forEach(t => _t9(t));
document.querySelectorAll('.sb-section-head').forEach(head => {
if (!head.classList.contains(('op'+'en'))) {
head.classList.add(('op'+'en'));
head.nextElementSibling.style.display = '';
}
});
_tu();
}

_t7(('e'+'du'));
_t7(('wo'+'rk'));
_tb();
_tu();
if (_restore()) {
  ['edu','work','project','award','pub'].forEach(t => _t9(t));
  _tb();
  _tu();
} else {
  document.getElementById('onboardOverlay').style.display = 'flex';
}
// Initialize history with current state
setTimeout(function() {
  History.stack = [_getFullState()];
  History.index = 0;
  _updateUndoRedoButtons();
}, 100);
window.toggleSection=_t0;
window.setLang=_t1;
window.setTemplate=_t2;
window.setColor=_t3;
window.setFont=_t5;
window.updateHint=_t6;
window.addEntry=_t7;
window.deleteEntry=_t8;
window.render=_tu;
window.downloadHTML=_tw;
window.exportPDF=_tx;
window.resetAll=_ty;
window.fillDemoData=_tz;
window.undoAction=_undo;
window.redoAction=_redo;

/* ════ 首次访问引导 ════ */
window.onboardChoose = function(choice) {
  document.getElementById('onboardOverlay').style.display = 'none';
  if (choice === 'demo') _tz();
  else if (choice === 'import') openImportDialog();
  else if (choice === 'blank') { _tu(); _save(); }
};

/* ════ 导入旧简历对话框 ════ */
window.openImportDialog = function() {
  document.getElementById('importDialog').style.display = 'flex';
  document.getElementById('importResult').style.display = 'none';
  document.getElementById('importLoading').style.display = 'none';
  var btn = document.getElementById('importRunBtn');
  btn.disabled = false;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>开始导入';
};
window.closeImportDialog = function() {
  document.getElementById('importDialog').style.display = 'none';
};

(function initImportDrop(){
  var drop = document.getElementById('importDrop');
  var fileInput = document.getElementById('importFile');
  var textarea = document.getElementById('importText');
  if (!drop || !fileInput) return;
  function readFile(file) {
    if (!file) return;
    // PDF 无法在浏览器直接解析,给明确提示
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      alert('PDF 暂不支持直接上传。\n\n请打开 PDF → 全选文字 → 复制 → 粘贴到下方文本框。');
      return;
    }
    if (file.size > 500 * 1024) { alert('文件太大 (>500KB)，请截取核心内容后粘贴'); return; }
    // 先读为 ArrayBuffer,自动检测编码(UTF-8 → GB18030 fallback)
    var bufReader = new FileReader();
    bufReader.onload = function(e) {
      var buf = e.target.result;
      var text;
      try {
        // 先尝试 UTF-8(严格模式,遇到非法字节会抛出)
        text = new TextDecoder('utf-8', { fatal: true }).decode(buf);
      } catch (err) {
        // UTF-8 解码失败,尝试 GB18030(兼容 GBK/GB2312,Windows 中文默认)
        try {
          text = new TextDecoder('gb18030', { fatal: false }).decode(buf);
        } catch (err2) {
          text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
        }
      }
      textarea.value = text;
    };
    bufReader.readAsArrayBuffer(file);
  }
  fileInput.addEventListener('change', function(){ readFile(this.files[0]); });
  drop.addEventListener('dragover', function(e){ e.preventDefault(); drop.classList.add('dragover'); });
  drop.addEventListener('dragleave', function(){ drop.classList.remove('dragover'); });
  drop.addEventListener('drop', function(e){
    e.preventDefault();
    drop.classList.remove('dragover');
    if (e.dataTransfer.files.length) readFile(e.dataTransfer.files[0]);
  });
})();

window.runImport = function() {
  var text = document.getElementById('importText').value.trim();
  if (!text) { alert('请先粘贴简历内容或选择文件'); return; }
  if (text.length < 50) { alert('内容太短，请粘贴完整简历'); return; }

  var workerUrl = document.getElementById('aiWorkerUrl')?.value.trim() || '';
  var apiKey = document.getElementById('aiApiKey')?.value.trim() || '';

  var schema = '{\n' +
    '  "name": "姓名",\n' +
    '  "nameEn": "英文名(如有)",\n' +
    '  "jobTitle": "求职意向/目标岗位",\n' +
    '  "phone": "手机号",\n' +
    '  "email": "邮箱",\n' +
    '  "city": "城市",\n' +
    '  "linkedin": "LinkedIn URL(如有)",\n' +
    '  "summary": "自我评价/个人简介",\n' +
    '  "skillTools": "专业技能,用逗号分隔",\n' +
    '  "skillLang": "语言能力",\n' +
    '  "skillCerts": "证书资质",\n' +
    '  "edu": [{"school":"","degree":"","period":"","gpa":""}],\n' +
    '  "work": [{"company":"","role":"","period":"","desc":"用换行分隔的成就项,每项以•开头"}],\n' +
    '  "project": [{"name":"","role":"","period":"","link":"","desc":"用换行分隔的项目描述"}],\n' +
    '  "award": [{"name":"","org":"","year":""}]\n' +
    '}';

  var prompt = '你是简历解析助手。请从下面的简历原文提取结构化信息,严格按 JSON schema 输出,只输出 JSON,不要任何 markdown 代码块标记或说明文字。\n\n' +
    '## JSON Schema\n' + schema + '\n\n' +
    '## 规则\n' +
    '- 找不到的字段用空字符串 "" 或空数组 []\n' +
    '- 数组类字段(edu/work/project/award)按简历中的时间倒序\n' +
    '- work.desc / project.desc 每条成就前加 "• "，用 \\n 分隔\n' +
    '- period 保持简历原文格式,不要重排\n\n' +
    '## 简历原文\n' + text;

  document.getElementById('importLoading').style.display = 'block';
  document.getElementById('importResult').style.display = 'none';
  var btn = document.getElementById('importRunBtn');
  btn.disabled = true;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-2px;margin-right:4px;animation:spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>解析中...';

  var controller = new AbortController();
  var timeoutId = setTimeout(function(){ controller.abort(); }, 45000);
  var targetUrl, fetchOptions;
  var payload = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: '你是精准的简历解析器,只输出 JSON,不解释。' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 3000,
    temperature: 0.2,
    x_kind: 'import',
    signal: controller.signal
  };
  if (workerUrl) {
    targetUrl = workerUrl.replace(/\/$/, '');
    fetchOptions = { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload), signal: controller.signal };
  } else {
    targetUrl = 'https://api.deepseek.com/chat/completions';
    fetchOptions = { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey}, body: JSON.stringify(payload), signal: controller.signal };
  }

  fetch(targetUrl, fetchOptions)
  .then(function(res){
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('API 请求失败: ' + res.status);
    return res.json();
  })
  .then(function(data){
    var raw = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!raw) throw new Error('AI 未返回结果');
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    var parsed;
    try { parsed = JSON.parse(raw); } catch(e) {
      var m = raw.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error('AI 返回内容无法解析为 JSON');
    }
    applyImportedData(parsed);
    document.getElementById('importLoading').style.display = 'none';
    closeImportDialog();
  })
  .catch(function(err){
    clearTimeout(timeoutId);
    document.getElementById('importLoading').style.display = 'none';
    document.getElementById('importResult').style.display = 'block';
    var isNet = err.name === 'AbortError' || /Failed to fetch|Load failed|NetworkError|ERR_TIMED_OUT|The network connection was lost/i.test(err.message);
    var el = document.getElementById('importResultContent');
    if (isNet) {
      el.innerHTML = '<div style="color:#f59e0b;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>无法连接到 AI 服务</div>' +
        '<div style="color:#e8eaf0;line-height:1.7;">导入功能依赖 Cloudflare Workers,公司/校园/部分家庭宽带可能无法访问。</div>' +
        '<div style="color:#94a3b8;margin-top:10px;line-height:1.7;">你可以:</div>' +
        '<div style="color:#e8eaf0;line-height:1.9;margin-top:4px;">• 切换手机热点后重试<br>• 或使用其他网络后重试<br>• 或点"取消"手动填写</div>';
    } else {
      el.textContent = '解析失败: ' + err.message;
    }
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>重新导入';
  });
};

function applyImportedData(d) {
  d = d || {};
  var setV = function(id, v) { var el = document.getElementById(id); if (el && v != null) el.value = v; };
  var setChk = function(id, v) { var el = document.getElementById(id); if (el) el.checked = !!v; };
  setV('name', d.name); setV('nameEn', d.nameEn); setV('jobTitle', d.jobTitle);
  setV('phone', d.phone); setV('email', d.email); setV('city', d.city); setV('linkedin', d.linkedin);
  if (d.summary) { setChk('showSummary', true); setV('summary', d.summary); document.getElementById('summaryBody').style.display = ''; }
  if (d.skillTools || d.skillLang || d.skillCerts) {
    setChk('showSkills', true);
    setV('skillTools', d.skillTools); setV('skillLang', d.skillLang); setV('skillCerts', d.skillCerts);
  }
  S.eduEntries = (d.edu || []).map(function(e, i){ return {id: Date.now()+i, data: e}; });
  S.workEntries = (d.work || []).map(function(e, i){ return {id: Date.now()+100+i, data: e}; });
  S.projectEntries = (d.project || []).map(function(e, i){ return {id: Date.now()+200+i, data: e}; });
  if (S.projectEntries.length) setChk('showProject', true);
  S.awardEntries = (d.award || []).map(function(e, i){ return {id: Date.now()+300+i, data: e}; });
  if (S.awardEntries.length) setChk('showAwards', true);
  // 导入的条目默认收起(有内容),用户想改再点开
  S.expanded = new Set();
  ['edu','work','project','award','pub'].forEach(function(t){ _t9(t); });
  _tu();
}
window._applyImportedData = applyImportedData;

/* ── 加粗选中文字 (textarea **...**) ── */
function _wrapSel(ta) {
  var start = ta.selectionStart;
  var end = ta.selectionEnd;
  var text = ta.value;
  var sel = text.substring(start, end);
  var before = '**'; var after = '**';
  // 已包裹 → 解除;未包裹 → 加粗
  if (sel.startsWith(before) && sel.endsWith(after) && sel.length > before.length + after.length) {
    var inner = sel.slice(before.length, -after.length);
    ta.value = text.substring(0, start) + inner + text.substring(end);
    ta.setSelectionRange(start, start + inner.length);
  } else {
    ta.value = text.substring(0, start) + before + sel + after + text.substring(end);
    ta.setSelectionRange(start + before.length, start + before.length + sel.length);
  }
  ta.dispatchEvent(new Event('input'));
}
window._wrapSel = _wrapSel;

/* ════ AI 改写单段 ════ */
var _rewriteCtx = null;

window.openRewriteDialog = function(type, entryId) {
  var before = '', label = '';
  if (type === 'summary') {
    before = document.getElementById('summary').value.trim();
    label = '自我评价';
  } else if (type === 'work' || type === 'project') {
    var entries = type === 'work' ? S.workEntries : S.projectEntries;
    var e = entries.find(function(x){ return x.id === entryId; });
    if (!e) { alert('未找到该条目'); return; }
    before = e.data.desc || '';
    var titleField = type === 'work' ? (e.data.company || '') : (e.data.name || '');
    label = (type === 'work' ? '工作经历' : '项目经历') + (titleField ? ': ' + titleField : '');
  }
  if (!before.trim()) { alert('该段落还没有内容,请先填写再改写'); return; }
  _rewriteCtx = { type: type, entryId: entryId, before: before, label: label };

  document.getElementById('rewriteTargetLabel').textContent = '目标段落: ' + label;
  document.getElementById('rewriteStep1').style.display = '';
  document.getElementById('rewriteStep2').style.display = 'none';
  document.getElementById('rewriteLoading').style.display = 'none';
  document.getElementById('rewriteError').style.display = 'none';
  document.getElementById('rewriteDialog').style.display = 'flex';
};

window.closeRewriteDialog = function() {
  document.getElementById('rewriteDialog').style.display = 'none';
  _rewriteCtx = null;
};

document.querySelectorAll('#rewriteStep1 .font-opt').forEach(function(opt){
  opt.addEventListener('click', function(){
    document.querySelectorAll('#rewriteStep1 .font-opt').forEach(function(o){ o.classList.remove('active'); });
    this.classList.add('active');
    this.querySelector('input').checked = true;
  });
});

window.runRewrite = function() {
  if (!_rewriteCtx) return;
  var jd = document.getElementById('rewriteJd').value.trim();
  var style = document.querySelector('input[name="rewriteStyle"]:checked')?.value || 'star';
  var styleHint = {
    star: '严格使用 STAR 法则(Situation-Task-Action-Result),每条以动词开头,包含量化数据(百分比/人数/金额)',
    concise: '尽量精简,去掉一切冗余修饰,保留核心动作和结果',
    senior: '突出决策层视角、跨团队协作、业务影响,用词更资深'
  }[style];

  var prompt = '你是资深简历顾问。请改写下面的简历段落。\n\n' +
    '## 段落类型\n' + _rewriteCtx.label + '\n\n' +
    '## 改写规则\n- ' + styleHint + '\n' +
    '- 保持原文事实不变,只优化措辞、结构、数据呈现\n' +
    '- 保持原文语言(中文或英文)\n' +
    '- 输出用换行分隔的成就项,每项以"• "开头\n' +
    '- 只输出改写后的内容,不要任何前言、解释、markdown 标记' +
    (jd ? '\n- 结合目标岗位 JD 的关键词,但不要生造经历' : '') +
    '\n\n' +
    (jd ? '## 目标岗位 JD\n' + jd + '\n\n' : '') +
    '## 原文\n' + _rewriteCtx.before;

  var workerUrl = document.getElementById('aiWorkerUrl')?.value.trim() || '';
  var apiKey = document.getElementById('aiApiKey')?.value.trim() || '';

  document.getElementById('rewriteStep1').style.display = 'none';
  document.getElementById('rewriteLoading').style.display = 'block';
  document.getElementById('rewriteError').style.display = 'none';

  var controller = new AbortController();
  var timeoutId = setTimeout(function(){ controller.abort(); }, 25000);
  var payload = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: '你是资深简历顾问,只输出改写后的段落内容,不解释。' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1500,
    temperature: 0.5,
    x_kind: 'rewrite'
  };
  var targetUrl, fetchOptions;
  if (workerUrl) {
    targetUrl = workerUrl.replace(/\/$/, '');
    fetchOptions = { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload), signal: controller.signal };
  } else {
    targetUrl = 'https://api.deepseek.com/chat/completions';
    fetchOptions = { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey}, body: JSON.stringify(payload), signal: controller.signal };
  }

  fetch(targetUrl, fetchOptions)
  .then(function(res){
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('API 请求失败: ' + res.status);
    return res.json();
  })
  .then(function(data){
    var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('AI 未返回结果');
    text = text.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').trim();
    _rewriteCtx.after = text;
    document.getElementById('rewriteLoading').style.display = 'none';
    document.getElementById('rewriteBefore').textContent = _rewriteCtx.before;
    document.getElementById('rewriteAfter').textContent = text;
    document.getElementById('rewriteStep2').style.display = '';
  })
  .catch(function(err){
    clearTimeout(timeoutId);
    document.getElementById('rewriteLoading').style.display = 'none';
    document.getElementById('rewriteStep1').style.display = '';
    document.getElementById('rewriteError').style.display = 'block';
    var isNet = err.name === 'AbortError' || /Failed to fetch|Load failed|NetworkError|ERR_TIMED_OUT|The network connection was lost/i.test(err.message);
    var el = document.getElementById('rewriteErrorContent');
    if (isNet) {
      el.innerHTML = '<div style="color:#f59e0b;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>无法连接到 AI 服务</div>' +
        '<div style="color:#e8eaf0;line-height:1.7;">改写功能依赖 Cloudflare Workers,公司/校园/部分家庭宽带可能无法访问。可切换手机热点或换网络后重试。</div>';
    } else {
      el.textContent = '改写失败: ' + err.message;
    }
  });
};

window.acceptRewrite = function() {
  if (!_rewriteCtx || !_rewriteCtx.after) return;
  var ctx = _rewriteCtx;
  if (ctx.type === 'summary') {
    var s = document.getElementById('summary');
    s.value = ctx.after;
    s.dispatchEvent(new Event('input'));
  } else {
    var entries = ctx.type === 'work' ? S.workEntries : S.projectEntries;
    var e = entries.find(function(x){ return x.id === ctx.entryId; });
    if (e) {
      e.data.desc = ctx.after;
      _t9(ctx.type);
    }
  }
  _tu();
  closeRewriteDialog();
};
window._setRewriteAfter = function(text) { if (_rewriteCtx) _rewriteCtx.after = text; };

/* ── Markdown → safe HTML (仅用于 AI 润色结果展示) ── */
function _mdToHtml(md) {
  if (!md) return '';
  var s = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  var lines = s.split('\n');
  var out = [];
  var inList = false;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    if (/^### (.+)/.test(l)) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<h4 style="font-size:12px;font-weight:700;color:#c084fc;margin:14px 0 6px;letter-spacing:.04em;">' + l.replace(/^### /, '') + '</h4>');
    } else if (/^## (.+)/.test(l)) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<h3 style="font-size:13px;font-weight:700;color:#e8eaf0;margin:16px 0 6px;border-bottom:1px solid #252832;padding-bottom:4px;">' + l.replace(/^## /, '') + '</h3>');
    } else if (/^---+$/.test(l.trim())) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<hr style="border:none;border-top:1px solid #252832;margin:12px 0;">');
    } else if (/^&gt; (.*)/.test(l)) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<div style="border-left:3px solid #6366f1;padding:6px 10px;margin:6px 0;background:rgba(99,102,241,.08);border-radius:0 6px 6px 0;font-size:12px;color:#c4c9d4;line-height:1.65;">' + _mdInline(l.replace(/^&gt; /, '')) + '</div>');
    } else if (/^[•\-\*] (.+)/.test(l) || /^\d+\. (.+)/.test(l)) {
      if (!inList) { out.push('<ul style="margin:6px 0;padding:0;list-style:none;">'); inList = true; }
      var item = l.replace(/^[•\-\*] /, '').replace(/^\d+\. /, '');
      out.push('<li style="padding:3px 0 3px 14px;position:relative;font-size:12px;line-height:1.65;color:#c4c9d4;"><span style="position:absolute;left:0;color:#6366f1;">•</span>' + _mdInline(item) + '</li>');
    } else if (l.trim() === '') {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<div style="height:5px;"></div>');
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<p style="font-size:12px;line-height:1.7;color:#c4c9d4;margin:4px 0;">' + _mdInline(l) + '</p>');
    }
  }
  if (inList) out.push('</ul>');
  return out.join('');
}
function _mdInline(s) {
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e8eaf0;font-weight:600;">$1</strong>');
  s = s.replace(/`(.+?)`/g, '<code style="background:rgba(99,102,241,.15);color:#a5b4fc;padding:1px 4px;border-radius:3px;font-size:11px;">$1</code>');
  return s;
}

/* ════ AI 润色对话框 ════ */
window.openAIPolish = function() {
  document.getElementById('aiPolishDialog').style.display = 'flex';
  document.getElementById('aiPolishResult').style.display = 'none';
  document.getElementById('aiPolishLoading').style.display = 'none';
  var btn = document.getElementById('aiPolishRunBtn');
  btn.disabled = false;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>开始润色';
};

window.closeAIPolish = function() {
  document.getElementById('aiPolishDialog').style.display = 'none';
};

window.toggleOption = function(el) {
  var cb = el.querySelector('input[type=checkbox]');
  cb.checked = !cb.checked;
  el.classList.toggle('selected', cb.checked);
};

window.runAIPolish = function() {
  var workerUrl = document.getElementById('aiWorkerUrl')?.value.trim() || '';
  var apiKey = document.getElementById('aiApiKey')?.value.trim() || '';
  var jd = document.getElementById('aiPolishJd').value.trim();

  var dims = [];
  var options = document.querySelectorAll('#aiPolishDialog .ai-option');
  options.forEach(function(opt) {
    var cb = opt.querySelector('input[type=checkbox]');
    if (cb.checked) {
      var text = opt.textContent.trim();
      if (text.includes('STAR')) dims.push('1. 文案质量优化：用 STAR 法则重写经历描述，确保每段经历都有量化成果（数据/百分比），动词开头，去掉废话');
      else if (text.includes('ATS')) dims.push('2. ATS 关键词匹配：提取 JD 中的关键词，对比简历中是否包含，给出补充建议');
      else if (text.includes('语法')) dims.push('3. 语法/拼写检查：找出错别字、语法错误、用词不当、标点问题');
      else if (text.includes('精简')) dims.push('4. 精简篇幅：压缩冗余描述，控制在合理长度，突出重点');
    }
  });

  if (!dims.length) { alert('请至少选择一个润色维度'); return; }
  if (!apiKey && !workerUrl) { alert('请确保 Worker 代理地址已配置'); return; }

  var resumeText = [];
  var nameEl = document.getElementById('name');
  if (nameEl && nameEl.value) resumeText.push('姓名：' + nameEl.value);
  var jobTitleEl = document.getElementById('jobTitle');
  if (jobTitleEl && jobTitleEl.value) resumeText.push('求职意向：' + jobTitleEl.value);
  var summaryEl = document.getElementById('summary');
  if (summaryEl && summaryEl.value) resumeText.push('【自我评价】\n' + summaryEl.value);

  if (S.workEntries && S.workEntries.length) {
    S.workEntries.forEach(function(e, i) {
      var w = '【工作经历 ' + (i+1) + '】\n' + (e.data.company||'') + ' | ' + (e.data.role||'') + ' | ' + (e.data.period||'');
      if (e.data.desc) w += '\n' + e.data.desc;
      resumeText.push(w);
    });
  }

  if (S.eduEntries && S.eduEntries.length) {
    S.eduEntries.forEach(function(e, i) {
      var ed = '【教育经历 ' + (i+1) + '】\n' + (e.data.school||'') + ' | ' + (e.data.degree||'') + ' | ' + (e.data.period||'');
      resumeText.push(ed);
    });
  }

  if (S.projectEntries && S.projectEntries.length) {
    S.projectEntries.forEach(function(e, i) {
      var p = '【项目经历 ' + (i+1) + '】\n' + (e.data.name||'');
      if (e.data.desc) p += '\n' + e.data.desc;
      resumeText.push(p);
    });
  }

  if (!resumeText.length) { alert('请先填写简历内容'); return; }

  var prompt = '你是一位资深简历顾问。请对以下简历内容进行润色并给出修改建议。\n\n';
  prompt += '## 润色维度\n' + dims.join('\n') + '\n\n';
  prompt += '## 简历内容\n' + resumeText.join('\n\n') + '\n\n';
  if (jd) prompt += '## 目标岗位 JD\n' + jd + '\n\n';
  prompt += '请按维度分点给出具体、可操作的修改建议。直接给出建议，不要废话。';

  document.getElementById('aiPolishResult').style.display = 'none';
  document.getElementById('aiPolishLoading').style.display = 'block';
  var btn = document.getElementById('aiPolishRunBtn');
  btn.disabled = true;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-2px;margin-right:4px;animation:spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>分析中...';

  var fetchOptions;
  var targetUrl;

  if (workerUrl) {
    targetUrl = workerUrl.replace(/\/$/, '');
    fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是资深简历顾问，擅长用 STAR 法则优化简历、提升 ATS 通过率。回答要具体、可操作、分点列出。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        x_kind: 'polish'
      })
    };
  } else {
    targetUrl = 'https://api.deepseek.com/chat/completions';
    fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是资深简历顾问，擅长用 STAR 法则优化简历、提升 ATS 通过率。回答要具体、可操作、分点列出。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    };
  }

  var controller = new AbortController();
  var timeoutId = setTimeout(function(){ controller.abort(); }, 45000);
  fetchOptions.signal = controller.signal;

  fetch(targetUrl, fetchOptions)
  .then(function(res) {
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('API 请求失败：' + res.status);
    return res.json();
  })
  .then(function(data) {
    document.getElementById('aiPolishLoading').style.display = 'none';
    document.getElementById('aiPolishResult').style.display = 'block';
    var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    document.getElementById('aiPolishResultContent').innerHTML = _mdToHtml(text || '未获取到结果');
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>开始润色';
  })
  .catch(function(err) {
    clearTimeout(timeoutId);
    document.getElementById('aiPolishLoading').style.display = 'none';
    document.getElementById('aiPolishResult').style.display = 'block';
    var isNetworkErr = err.name === 'AbortError' || /Failed to fetch|Load failed|NetworkError|ERR_TIMED_OUT|The network connection was lost/i.test(err.message);
    var resultEl = document.getElementById('aiPolishResultContent');
    if (isNetworkErr) {
      resultEl.innerHTML =
        '<div style="color:#f59e0b;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>无法连接到 AI 服务</div>' +
        '<div style="color:#e8eaf0;line-height:1.7;">AI 润色依赖 Cloudflare Workers，公司/校园/部分家庭宽带可能无法访问。</div>' +
        '<div style="color:#94a3b8;margin-top:10px;line-height:1.7;">你可以试试：</div>' +
        '<div style="color:#e8eaf0;line-height:1.9;margin-top:4px;">' +
        '• 切换到<b>手机流量热点</b>后重试<br>' +
        '• 或复制简历内容到 <a href="https://chat.deepseek.com" target="_blank" rel="noopener" style="color:#c084fc;text-decoration:underline;">DeepSeek 官网</a> 手动润色<br>' +
        '• 或使用其他网络环境后重试' +
        '</div>';
    } else {
      resultEl.textContent = '请求失败：' + err.message + '\n\n请检查：\n1. DeepSeek 账户余额是否充足\n2. Worker 是否已配置 API Key';
    }
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>重新尝试';
  });
};

document.addEventListener('click', function(e) {
  var dialog = document.getElementById('aiPolishDialog');
  if (e.target === dialog) closeAIPolish();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeAIPolish();
});

(function() {
  try {
    var savedKey = localStorage.getItem('deepseek_api_key');
    var savedWorker = localStorage.getItem('deepseek_worker_url');
    if (savedKey) document.getElementById('aiApiKey').value = savedKey;
    if (savedWorker) document.getElementById('aiWorkerUrl').value = savedWorker;
  } catch(e) {}
})();
})();
