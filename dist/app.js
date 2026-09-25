(() => {
  const $ = (id) => document.getElementById(id);
  const input = $('file-input'), zone = $('drop-zone'), quality = $('quality'), qualityValue = $('quality-value');
  const format = $('format'), results = $('results'), list = $('file-list'), summary = $('summary');
  const files = [];
  const supported = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const bytes = (n) => n < 1024 * 1024 ? `${(n / 1024).toFixed(n < 1024 ? 0 : 1)} KB` : `${(n / 1048576).toFixed(2)} MB`;
  const extension = (type) => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type] || 'jpg');
  const outputName = (name, type) => `${name.replace(/\.[^/.]+$/, '')}-compressed.${extension(type)}`;

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
    if (!valid.length) return alert('Please choose JPG, PNG, or WebP images.');
    for (const file of valid) {
      const item = { file, id: crypto.randomUUID(), status: 'Compressing…' };
      files.push(item); render();
      try { item.result = await compress(file); item.status = 'Done'; }
      catch (error) { item.status = 'Could not compress'; item.error = error.message; }
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
      if (item.result) { done++; compressed += item.result.blob.size; const save = Math.round((1 - item.result.blob.size / item.file.size) * 100); metrics.innerHTML = `<span>${bytes(item.file.size)} → ${bytes(item.result.blob.size)}</span><span class="saving">${save >= 0 ? `${save}% smaller` : `${Math.abs(save)}% larger`}</span>`; }
      else metrics.textContent = item.status;
      info.append(metrics); card.append(info);
      const button = document.createElement('button'); button.className = 'download-button'; button.type = 'button'; button.textContent = item.result ? 'Download' : item.status; button.disabled = !item.result;
      button.addEventListener('click', () => download(item.result.blob, item.result.name)); card.append(button); return card;
    }));
    const saving = original && done ? Math.round((1 - compressed / original) * 100) : 0;
    summary.textContent = done === files.length ? `You saved ${bytes(original - compressed)} total (${saving}% smaller).` : `Compressing ${done} of ${files.length} image${files.length === 1 ? '' : 's'}…`;
    $('download-all').disabled = done !== files.length || !done;
  }
  function download(blob, name) { const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 2000); }
  // Creates a standards-compliant, uncompressed ZIP in-browser so no library or server is needed.
  function crc32(data) { let c = ~0; for (const b of data) { c ^= b; for (let k=0;k<8;k++) c = (c>>>1) ^ (0xEDB88320 & -(c&1)); } return ~c >>> 0; }
  const u16 = n => [n & 255, (n >>> 8) & 255], u32 = n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
  async function makeZip(entries) { let offset = 0; const local = [], central = []; for (const entry of entries) { const data = new Uint8Array(await entry.blob.arrayBuffer()), name = new TextEncoder().encode(entry.name), crc = crc32(data); const head = [80,75,3,4,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),0,0,...name]; local.push(new Uint8Array(head), data); const directory = [80,75,1,2,20,0,20,0,0,0,0,0,0,0,...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),0,0,0,0,0,0,0,0,0,0,...u32(offset),...name]; central.push(new Uint8Array(directory)); offset += head.length + data.length; } const centralLength = central.reduce((n,a)=>n+a.length,0); const end = new Uint8Array([80,75,5,6,0,0,0,0,...u16(entries.length),...u16(entries.length),...u32(centralLength),...u32(offset),0,0]); return new Blob([...local,...central,end], {type:'application/zip'}); }
  $('download-all').addEventListener('click', async () => { const button = $('download-all'); button.textContent = 'Preparing ZIP…'; button.disabled = true; try { download(await makeZip(files.map(x => x.result)), 'compressed-images.zip'); } finally { button.textContent = 'Download all (.zip)'; button.disabled = false; } });
})();
