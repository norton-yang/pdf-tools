(() => {
  const $ = (id) => document.getElementById(id);
  const input = $('file-input'), zone = $('drop-zone'), quality = $('quality'), qualityValue = $('quality-value');
  const format = $('format'), results = $('results'), list = $('file-list'), summary = $('summary');
  const files = [];
  const chinese = {navHow:'使用方法',language:'语言',eyebrow:'免费 · 私密 · 浏览器本地处理',heroTitle:'让图片更轻。<br><em>保留好画质。</em>',heroCopy:'压缩 JPG、PNG 和 WebP 图片，无需将文件发送到任何服务器。',workspaceLabel:'图片压缩工具',dropLabel:'点击或拖拽上传图片',dropTitle:'拖放图片到这里',or:'或',browse:'从设备中选择',dropHelp:'JPG、PNG 或 WebP · 支持一次选择多张',settingsLabel:'压缩设置',quality:'压缩质量',qualityHelp:'数值越低，文件越小。照片建议使用 70–85%。',format:'输出格式',keepOriginal:'保持原格式',formatHelp:'PNG 为无损格式；质量设置影响 JPG 和 WebP。',privacy:'图片始终留在此设备上，所有处理均在浏览器本地完成。',ready:'可以保存',compressedImages:'张已压缩图片',addMore:'继续添加',downloadAll:'全部下载 (.zip)',benefitsLabel:'核心优势',local:'100% 本地处理',noUpload:'不上传至服务器',multiFile:'多图处理',batch:'一次压缩整个批次',formats:'三种格式',simple:'简洁易用',how:'如何使用',step1Title:'选择图片',step1Copy:'拖入图片，或从手机和电脑中选择文件。',step2Title:'设置偏好',step2Copy:'选择适合需求的质量等级和输出格式。',step3Title:'保存小文件',step3Copy:'单独下载，或将所有图片打包成一个 ZIP。',supported:'支持的格式',formatsTitle:'适配每天都在使用的图片。',formatsCopy:'支持打开 JPG、PNG 和 WebP；浏览器支持时可导出为 JPG、WebP 或 PNG。',faq1Q:'图片会被上传吗？',faq1A:'不会。工具使用浏览器 Canvas 在本地处理图片，不会将任何内容发送到服务器。',faq2Q:'为什么 PNG 可能更大？',faq2A:'PNG 是无损格式。对于照片，导出为 JPG 或 WebP 通常能获得更小的文件。',faq3Q:'手机上可以使用吗？',faq3A:'可以。通过手机的文件选择器或分享菜单选择多张支持的图片即可。',footer:'私密图片压缩，直接在浏览器中完成。',chooseFiles:'请选择 JPG、PNG 或 WebP 图片。',compressing:'正在压缩…',done:'已完成',failed:'无法压缩',download:'下载',preparing:'正在创建 ZIP…',saved:'共节省 {size}（缩小 {percent}%）。',processing:'正在压缩 {total} 张图片中的第 {done} 张…',smaller:'缩小 {percent}%',larger:'增大 {percent}%',title:'Image Compressor — 浏览器本地压缩图片',description:'直接在浏览器中压缩 JPG、PNG 和 WebP 图片。免费、私密、无需上传。'};
  const locale = (values) => ({ ...values });
  const locales = {
    'zh-CN': chinese,
    'zh-TW': locale({navHow:'使用方式',language:'語言',eyebrow:'免費 · 私密 · 瀏覽器本機處理',heroTitle:'讓圖片更輕。<br><em>保留好畫質。</em>',heroCopy:'壓縮 JPG、PNG 與 WebP 圖片，無需將檔案傳送到任何伺服器。',dropTitle:'將圖片拖放到這裡',or:'或',browse:'從裝置選擇',quality:'壓縮品質',format:'輸出格式',keepOriginal:'保留原始格式',privacy:'圖片始終留在此裝置上，所有處理均在瀏覽器本機完成。',addMore:'繼續新增',downloadAll:'全部下載 (.zip)',how:'如何使用',download:'下載',preparing:'正在建立 ZIP…'}),
    ja: locale({navHow:'使い方',language:'言語',eyebrow:'無料 · プライベート · ブラウザ内処理',heroTitle:'画像を軽く。<br><em>品質はそのまま。</em>',heroCopy:'JPG、PNG、WebP をどこにも送信せずに圧縮します。',dropTitle:'ここに画像をドロップ',or:'または',browse:'デバイスから選択',quality:'圧縮品質',format:'出力形式',keepOriginal:'元の形式を保持',privacy:'画像はこの端末に残ります。処理はブラウザ内で行われます。',addMore:'追加する',downloadAll:'すべてダウンロード (.zip)',how:'使い方',download:'ダウンロード',preparing:'ZIP を準備中…'}),
    ko: locale({navHow:'사용 방법',language:'언어',eyebrow:'무료 · 비공개 · 브라우저 내 처리',heroTitle:'이미지는 가볍게.<br><em>품질은 그대로.</em>',heroCopy:'JPG, PNG, WebP를 어디에도 업로드하지 않고 압축합니다.',dropTitle:'여기에 이미지를 놓으세요',or:'또는',browse:'기기에서 선택',quality:'압축 품질',format:'출력 형식',keepOriginal:'원본 형식 유지',privacy:'이미지는 이 기기에 남습니다. 모든 처리는 브라우저에서 이루어집니다.',addMore:'더 추가',downloadAll:'모두 다운로드 (.zip)',how:'사용 방법',download:'다운로드',preparing:'ZIP 준비 중…'}),
    es: locale({navHow:'Cómo funciona',language:'Idioma',eyebrow:'GRATIS · PRIVADO · EN TU NAVEGADOR',heroTitle:'Imágenes más ligeras.<br><em>La misma calidad.</em>',heroCopy:'Comprime JPG, PNG y WebP sin enviar tus imágenes a ningún sitio.',dropTitle:'Suelta tus imágenes aquí',or:'o',browse:'busca en tu dispositivo',quality:'Calidad de compresión',format:'Formato de salida',keepOriginal:'Mantener original',privacy:'Tus imágenes se quedan en este dispositivo. Todo se procesa localmente.',addMore:'Añadir más',downloadAll:'Descargar todo (.zip)',how:'Cómo funciona',download:'Descargar',preparing:'Preparando ZIP…'}),
    ru: locale({navHow:'Как это работает',language:'Язык',eyebrow:'БЕСПЛАТНО · КОНФИДЕНЦИАЛЬНО · В БРАУЗЕРЕ',heroTitle:'Изображения легче.<br><em>Качество сохранено.</em>',heroCopy:'Сжимайте JPG, PNG и WebP, не отправляя изображения на сервер.',dropTitle:'Перетащите изображения сюда',or:'или',browse:'выберите на устройстве',quality:'Качество сжатия',format:'Формат вывода',keepOriginal:'Сохранить исходный',privacy:'Изображения остаются на этом устройстве. Обработка выполняется локально.',addMore:'Добавить ещё',downloadAll:'Скачать всё (.zip)',how:'Как это работает',download:'Скачать',preparing:'Подготовка ZIP…'}),
    fr: locale({navHow:'Comment ça marche',language:'Langue',eyebrow:'GRATUIT · PRIVÉ · DANS VOTRE NAVIGATEUR',heroTitle:'Des images plus légères.<br><em>La qualité préservée.</em>',heroCopy:'Compressez JPG, PNG et WebP sans envoyer vos images ailleurs.',dropTitle:'Déposez vos images ici',or:'ou',browse:'choisir sur votre appareil',quality:'Qualité de compression',format:'Format de sortie',keepOriginal:'Conserver l’original',privacy:'Vos images restent sur cet appareil. Le traitement est local.',addMore:'Ajouter',downloadAll:'Tout télécharger (.zip)',how:'Comment ça marche',download:'Télécharger',preparing:'Préparation du ZIP…'}),
    de: locale({navHow:'So funktioniert es',language:'Sprache',eyebrow:'KOSTENLOS · PRIVAT · IM BROWSER',heroTitle:'Bilder leichter machen.<br><em>Qualität behalten.</em>',heroCopy:'Komprimiere JPG, PNG und WebP, ohne Bilder hochzuladen.',dropTitle:'Bilder hier ablegen',or:'oder',browse:'vom Gerät auswählen',quality:'Kompressionsqualität',format:'Ausgabeformat',keepOriginal:'Original behalten',privacy:'Deine Bilder bleiben auf diesem Gerät. Alles wird lokal verarbeitet.',addMore:'Weitere hinzufügen',downloadAll:'Alle herunterladen (.zip)',how:'So funktioniert es',download:'Herunterladen',preparing:'ZIP wird erstellt…'}),
    ar: locale({navHow:'كيف يعمل',language:'اللغة',eyebrow:'مجاني · خاص · داخل المتصفح',heroTitle:'صور أخف.<br><em>مع الحفاظ على الجودة.</em>',heroCopy:'اضغط JPG وPNG وWebP من دون إرسال صورك إلى أي مكان.',dropTitle:'أفلت صورك هنا',or:'أو',browse:'اختر من جهازك',quality:'جودة الضغط',format:'تنسيق الإخراج',keepOriginal:'الاحتفاظ بالأصل',privacy:'تبقى صورك على هذا الجهاز. تتم المعالجة محلياً في المتصفح.',addMore:'إضافة المزيد',downloadAll:'تنزيل الكل (.zip)',how:'كيف يعمل',download:'تنزيل',preparing:'جارٍ إعداد ZIP…'}),
    pt: locale({navHow:'Como funciona',language:'Idioma',eyebrow:'GRÁTIS · PRIVADO · NO SEU NAVEGADOR',heroTitle:'Imagens mais leves.<br><em>Qualidade preservada.</em>',heroCopy:'Comprima JPG, PNG e WebP sem enviar suas imagens para nenhum lugar.',dropTitle:'Solte suas imagens aqui',or:'ou',browse:'escolha no seu dispositivo',quality:'Qualidade da compressão',format:'Formato de saída',keepOriginal:'Manter original',privacy:'Suas imagens ficam neste dispositivo. O processamento é local.',addMore:'Adicionar mais',downloadAll:'Baixar tudo (.zip)',how:'Como funciona',download:'Baixar',preparing:'Preparando ZIP…'}),
    th: locale({navHow:'วิธีใช้งาน',language:'ภาษา',eyebrow:'ฟรี · เป็นส่วนตัว · ทำงานในเบราว์เซอร์',heroTitle:'ภาพเล็กลง<br><em>คุณภาพยังดี</em>',heroCopy:'บีบอัด JPG, PNG และ WebP โดยไม่ส่งรูปไปที่ใด',dropTitle:'วางรูปภาพของคุณที่นี่',or:'หรือ',browse:'เลือกจากอุปกรณ์',quality:'คุณภาพการบีบอัด',format:'รูปแบบไฟล์ออก',keepOriginal:'คงรูปแบบเดิม',privacy:'รูปภาพอยู่บนอุปกรณ์นี้ การประมวลผลทำในเบราว์เซอร์',addMore:'เพิ่มอีก',downloadAll:'ดาวน์โหลดทั้งหมด (.zip)',how:'วิธีใช้งาน',download:'ดาวน์โหลด',preparing:'กำลังสร้าง ZIP…'}),
    hi: locale({navHow:'यह कैसे काम करता है',language:'भाषा',eyebrow:'निःशुल्क · निजी · ब्राउज़र में',heroTitle:'छवियाँ हल्की करें।<br><em>गुणवत्ता बनाए रखें।</em>',heroCopy:'अपनी छवियाँ कहीं भेजे बिना JPG, PNG और WebP को संपीड़ित करें।',dropTitle:'अपनी छवियाँ यहाँ छोड़ें',or:'या',browse:'डिवाइस से चुनें',quality:'संपीड़न गुणवत्ता',format:'आउटपुट प्रारूप',keepOriginal:'मूल प्रारूप रखें',privacy:'आपकी छवियाँ इसी डिवाइस पर रहती हैं। प्रोसेसिंग ब्राउज़र में होती है।',addMore:'और जोड़ें',downloadAll:'सभी डाउनलोड करें (.zip)',how:'यह कैसे काम करता है',download:'डाउनलोड',preparing:'ZIP तैयार हो रही है…'})
  };
  const defaultText = Object.fromEntries([...document.querySelectorAll('[data-i18n]')].map(el => [el.dataset.i18n, el.textContent]));
  const defaultHtml = Object.fromEntries([...document.querySelectorAll('[data-i18n-html]')].map(el => [el.dataset.i18nHtml, el.innerHTML]));
  const defaultAria = Object.fromEntries([...document.querySelectorAll('[data-i18n-aria]')].map(el => [el.dataset.i18nAria, el.getAttribute('aria-label')]));
  const detected = (navigator.languages?.[0] || navigator.language).toLowerCase();
  const autoLanguage = detected.startsWith('zh-tw') || detected.startsWith('zh-hk') ? 'zh-TW' : Object.keys(locales).find(code => detected.startsWith(code)) || 'en';
  let currentLanguage = localStorage.getItem('image-compressor-language') || autoLanguage;
  const t = (key, vars = {}) => ((locales[currentLanguage]?.[key]) || defaultText[key] || defaultHtml[key] || defaultAria[key])?.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '') || key;
  function setLanguage(language) { currentLanguage = locales[language] ? language : 'en'; localStorage.setItem('image-compressor-language', currentLanguage); document.documentElement.lang = currentLanguage; document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr'; $('language').value = currentLanguage; document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n)); document.querySelectorAll('[data-i18n-html]').forEach(el => el.innerHTML = t(el.dataset.i18nHtml)); document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria))); document.title = locales[currentLanguage]?.title || 'Image Compressor — Compress images privately in your browser'; document.querySelector('meta[name="description"]').content = locales[currentLanguage]?.description || 'Compress JPG, PNG, and WebP images directly in your browser. Free, private, and no upload required.'; if (files.length) render(); }
  const supported = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const bytes = (n) => n < 1024 * 1024 ? `${(n / 1024).toFixed(n < 1024 ? 0 : 1)} KB` : `${(n / 1048576).toFixed(2)} MB`;
  const extension = (type) => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type] || 'jpg');
  const outputName = (name, type) => `${name.replace(/\.[^/.]+$/, '')}-compressed.${extension(type)}`;

  $('language').addEventListener('change', (event) => setLanguage(event.target.value));
  setLanguage(currentLanguage);
  quality.addEventListener('input', () => qualityValue.textContent = `${quality.value}%`);
  $('browse-button').addEventListener('click', (e) => { e.stopPropagation(); input.click(); });
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  input.addEventListener('change', () => addFiles([...input.files]));
  ['dragenter','dragover'].forEach(event => zone.addEventListener(event, (e) => { e.preventDefault(); zone.classList.add('dragging'); }));
  ['dragleave','drop'].forEach(event => zone.addEventListener(event, (e) => { e.preventDefault(); zone.classList.remove('dragging'); }));
  zone.addEventListener('drop', (e) => addFiles([...e.dataTransfer.files]));
  $('add-more').addEventListener('click', () => input.click());

  async function addFiles(selected) {
    const valid = selected.filter(file => supported.has(file.type));
    if (!valid.length) return alert(t('chooseFiles'));
    for (const file of valid) {
      const item = { file, id: crypto.randomUUID(), status: t('compressing') };
      files.push(item); render();
      try { item.result = await compress(file); item.status = t('done'); }
      catch (error) { item.status = t('failed'); item.error = error.message; }
      render();
    }
    input.value = '';
  }

  function targetType(file) { return format.value === 'auto' ? file.type : format.value; }
  async function compress(file) {
    const image = await createImageBitmap(file);
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    // JPEG cannot retain transparency; a white background avoids black transparent pixels.
    const type = targetType(file); if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(image, 0, 0); image.close();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, Number(quality.value) / 100));
    if (!blob) throw new Error('This browser cannot create that output format.');
    return { blob, type, name: outputName(file.name, type) };
  }

  function render() {
    results.hidden = files.length === 0; $('empty-message').hidden = files.length > 0; $('file-count').textContent = files.length;
    let original = 0, compressed = 0, done = 0;
    list.replaceChildren(...files.map(item => {
      original += item.file.size; const card = document.createElement('article'); card.className = 'file-card';
      const image = document.createElement('img'); image.className = 'thumb'; image.alt = ''; image.src = URL.createObjectURL(item.file); card.append(image);
      const info = document.createElement('div'); const title = document.createElement('div'); title.className = 'file-name'; title.textContent = item.file.name; info.append(title);
      const metrics = document.createElement('div'); metrics.className = 'metrics';
      if (item.result) { done++; compressed += item.result.blob.size; const save = Math.round((1 - item.result.blob.size / item.file.size) * 100); metrics.innerHTML = `<span>${bytes(item.file.size)} → ${bytes(item.result.blob.size)}</span><span class="saving">${save >= 0 ? t('smaller', {percent:save}) : t('larger', {percent:Math.abs(save)})}</span>`; }
      else metrics.textContent = item.status;
      info.append(metrics); card.append(info);
      const button = document.createElement('button'); button.className = 'download-button'; button.type = 'button'; button.textContent = item.result ? t('download') : item.status; button.disabled = !item.result;
      button.addEventListener('click', () => download(item.result.blob, item.result.name)); card.append(button); return card;
    }));
    const saving = original && done ? Math.round((1 - compressed / original) * 100) : 0;
    summary.textContent = done === files.length ? t('saved', {size:bytes(original-compressed),percent:saving}) : t('processing', {done,total:files.length});
    $('download-all').disabled = done !== files.length || !done;
  }
  function download(blob, name) { const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 2000); }
  // Creates a standards-compliant, uncompressed ZIP in-browser so no library or server is needed.
  function crc32(data) { let c = ~0; for (const b of data) { c ^= b; for (let k=0;k<8;k++) c = (c>>>1) ^ (0xEDB88320 & -(c&1)); } return ~c >>> 0; }
  const u16 = n => [n & 255, (n >>> 8) & 255], u32 = n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
  async function makeZip(entries) { let offset = 0; const local = [], central = []; for (const entry of entries) { const data = new Uint8Array(await entry.blob.arrayBuffer()), name = new TextEncoder().encode(entry.name), crc = crc32(data); const head = [80,75,3,4,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),0,0,...name]; local.push(new Uint8Array(head), data); const directory = [80,75,1,2,20,0,20,0,0,0,0,0,0,0,...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),0,0,0,0,0,0,0,0,0,0,...u32(offset),...name]; central.push(new Uint8Array(directory)); offset += head.length + data.length; } const centralLength = central.reduce((n,a)=>n+a.length,0); const end = new Uint8Array([80,75,5,6,0,0,0,0,...u16(entries.length),...u16(entries.length),...u32(centralLength),...u32(offset),0,0]); return new Blob([...local,...central,end], {type:'application/zip'}); }
  $('download-all').addEventListener('click', async () => { const button = $('download-all'); button.textContent = t('preparing'); button.disabled = true; try { download(await makeZip(files.map(x => x.result)), 'compressed-images.zip'); } finally { button.textContent = t('downloadAll'); button.disabled = false; } });
})();
