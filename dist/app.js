(() => {
  const $ = (id) => document.getElementById(id);
  const input = $('file-input'), zone = $('drop-zone'), quality = $('quality'), qualityValue = $('quality-value');
  const format = $('format'), results = $('results'), list = $('file-list'), summary = $('summary');
  const files = [];
  const chinese = {navHow:'使用方法',language:'语言',eyebrow:'免费 · 私密 · 浏览器本地处理',heroTitle:'让图片更轻。<br><em>保留好画质。</em>',heroCopy:'压缩 JPG、PNG 和 WebP 图片，无需将文件发送到任何服务器。',workspaceLabel:'图片压缩工具',dropLabel:'点击或拖拽上传图片',dropTitle:'拖放图片到这里',or:'或',browse:'从设备中选择',dropHelp:'JPG、PNG 或 WebP · 支持一次选择多张',settingsLabel:'压缩设置',quality:'压缩质量',qualityHelp:'数值越低，文件越小。照片建议使用 70–85%。',format:'输出格式',keepOriginal:'保持原格式',formatHelp:'PNG 为无损格式；质量设置影响 JPG 和 WebP。',privacy:'图片始终留在此设备上，所有处理均在浏览器本地完成。',ready:'可以保存',compressedImages:'张已压缩图片',addMore:'继续添加',downloadAll:'全部下载 (.zip)',benefitsLabel:'核心优势',local:'100% 本地处理',noUpload:'不上传至服务器',multiFile:'多图处理',batch:'一次压缩整个批次',formats:'三种格式',simple:'简洁易用',how:'如何使用',step1Title:'选择图片',step1Copy:'拖入图片，或从手机和电脑中选择文件。',step2Title:'设置偏好',step2Copy:'选择适合需求的质量等级和输出格式。',step3Title:'保存小文件',step3Copy:'单独下载，或将所有图片打包成一个 ZIP。',supported:'支持的格式',formatsTitle:'适配每天都在使用的图片。',formatsCopy:'支持打开 JPG、PNG 和 WebP；浏览器支持时可导出为 JPG、WebP 或 PNG。',faq1Q:'图片会被上传吗？',faq1A:'不会。工具使用浏览器 Canvas 在本地处理图片，不会将任何内容发送到服务器。',faq2Q:'为什么 PNG 可能更大？',faq2A:'PNG 是无损格式。对于照片，导出为 JPG 或 WebP 通常能获得更小的文件。',faq3Q:'手机上可以使用吗？',faq3A:'可以。通过手机的文件选择器或分享菜单选择多张支持的图片即可。',footer:'私密图片压缩，直接在浏览器中完成。',chooseFiles:'请选择 JPG、PNG 或 WebP 图片。',compressing:'正在压缩…',done:'已完成',failed:'无法压缩',download:'下载',preparing:'正在创建 ZIP…',saved:'共节省 {size}（缩小 {percent}%）。',processing:'正在压缩 {total} 张图片中的第 {done} 张…',smaller:'缩小 {percent}%',larger:'增大 {percent}%',title:'Image Compressor — 浏览器本地压缩图片',description:'直接在浏览器中压缩 JPG、PNG 和 WebP 图片。免费、私密、无需上传。'};
  const defaultText = Object.fromEntries([...document.querySelectorAll('[data-i18n]')].map(el => [el.dataset.i18n, el.textContent]));
  const defaultHtml = Object.fromEntries([...document.querySelectorAll('[data-i18n-html]')].map(el => [el.dataset.i18nHtml, el.innerHTML]));
  const defaultAria = Object.fromEntries([...document.querySelectorAll('[data-i18n-aria]')].map(el => [el.dataset.i18nAria, el.getAttribute('aria-label')]));
  let currentLanguage = localStorage.getItem('image-compressor-language') || (navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en');
  const t = (key, vars = {}) => (currentLanguage === 'zh-CN' ? chinese[key] : (defaultText[key] || defaultHtml[key] || defaultAria[key]))?.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '') || key;
  function setLanguage(language) { currentLanguage = language === 'zh-CN' ? language : 'en'; localStorage.setItem('image-compressor-language', currentLanguage); document.documentElement.lang = currentLanguage; $('language').value = currentLanguage; document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n)); document.querySelectorAll('[data-i18n-html]').forEach(el => el.innerHTML = t(el.dataset.i18nHtml)); document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria))); document.title = currentLanguage === 'zh-CN' ? chinese.title : 'Image Compressor — Compress images privately in your browser'; document.querySelector('meta[name="description"]').content = currentLanguage === 'zh-CN' ? chinese.description : 'Compress JPG, PNG, and WebP images directly in your browser. Free, private, and no upload required.'; if (files.length) render(); }
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
