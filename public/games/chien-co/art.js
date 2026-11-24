// Nạp minh họa cục bộ. Ảnh lỗi được thay bằng ký hiệu khi vẽ.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function loadArt(directory, names) {
    const sprites = {};
    const ready = Promise.all(names.map(name => new Promise(resolve => {
        const image = new Image();
        image.onload = () => { sprites[name] = image; resolve(); };
        image.onerror = () => resolve();
        image.src = directory + '/' + name + '.svg';
    })));
    return { sprites, ready };
}

function drawSprite(context, image, x, y, width, height, fallback = '◆') {
    if (image) {
        context.drawImage(image, x - width / 2, y - height / 2, width, height);
        return;
    }
    context.save();
    context.fillStyle = '#f7d79c';
    context.strokeStyle = '#233951';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x, y, Math.min(width, height) * .42, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.font = 'bold ' + Math.round(Math.min(width, height) * .46) + 'px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#192b48';
    context.fillText(fallback, x, y);
    context.restore();
}

// Bộ đệm theo mật độ điểm ảnh; tọa độ vẽ và va chạm vẫn tính bằng pixel CSS.
function sceneryCache() {
    const layer = document.createElement('canvas');
    let lastKey;
    return function paint(context, width, height, key, render) {
        const density = Math.min(devicePixelRatio || 1, 2);
        const w = Math.round(width * density), h = Math.round(height * density);
        if (layer.width !== w || layer.height !== h || key !== lastKey) {
            layer.width = w;
            layer.height = h;
            const brush = layer.getContext('2d');
            brush.setTransform(density, 0, 0, density, 0, 0);
            render(brush);
            lastKey = key;
        }
        context.drawImage(layer, 0, 0, width, height);
    };
}

function syncSound(enabled) {
    const button = document.querySelector('#sound-btn');
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Tắt âm thanh' : 'Bật âm thanh');
    button.innerHTML = gameIcon(enabled ? 'sound' : 'mute') + '<span class="lbl">Âm thanh</span>';
}
const icons = {
  heart:'<path d="M12 21 3 12C-2 4 7-1 12 6c5-7 14-2 9 6z"/>',
  wave:'<path d="M2 8q4-4 8 0t8 0l4-2M2 14q4-4 8 0t8 0l4-2M2 20q4-4 8 0t8 0l4-2"/>',
  pearl:'<path d="M2 16q0-13 10-13t10 13l-10 5zM2 16l10 2 10-2"/><circle cx="12" cy="13" r="3"/>',
  sonar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 8-8"/>',
  shield:'<path d="m12 2 8 3v7q0 5-8 10-8-5-8-10V5z"/>',
  magnet:'<path d="M4 4h5v9a3 3 0 0 0 6 0V4h5v9a8 8 0 0 1-16 0z"/>',
  orbit: '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-36 12 12)"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  keyboard: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h1m3 0h1m3 0h1m3 0h.1M6 13h1m3 3h5m2-3h1"/>',
  touch: '<path d="M7 13V7a2 2 0 0 1 4 0v5l5-1 3 2-1 6-3 2h-4l-6-6q-1-3 2-2z"/>',
  star: '<path d="m12 2 2.8 6.2 6.7 1-5 4.9 1.2 6.9-5.7-3.2L6.3 21l1.2-6.9-5-4.9 6.7-1z"/>',
  layers: '<path d="m3 8 9-5 9 5-9 5zM3 12l9 5 9-5m-18 4 9 5 9-5"/>',
  bolt: '<path d="m14 2-11 12h8l-1 8 11-13h-9z"/>',
  time: '<circle cx="12" cy="14" r="8"/><path d="M12 14V9m-3-7h6"/>',
  sound: '<path d="M3 9h4l5-5v16l-5-5H3zm13-1q4 4 0 8m3-11q7 7 0 14"/>',
  mute: '<path d="M3 9h4l5-5v16l-5-5H3zm13 0 5 6m0-6-5 6"/>'
};
function gameIcon(name) {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
}


// Khi đọc thẻ câu hỏi, phím Tab chỉ đi qua các nút đang hiển thị.
document.addEventListener('DOMContentLoaded', () => {
    const overlays = [...document.querySelectorAll('.overlay')];
    const panels = [...document.querySelectorAll('#hud, #bottom-bar, #action-bar, canvas, .overlay')];
    function updatePanels() {
        const active = overlays.find(panel => getComputedStyle(panel).display !== 'none');
        for (const panel of panels) panel.inert = Boolean(active && panel !== active);
        if (active && !active.contains(document.activeElement) && active.id !== 'start-screen') {
            active.querySelector('button')?.focus({preventScroll:true});
        }
    }
    const observer = new MutationObserver(updatePanels);
    for (const overlay of overlays) observer.observe(overlay, {attributes:true, attributeFilter:['style']});
    updatePanels();
});

function beginJourney(button, start) {
    if (button.disabled) return;
    initAudio();
    button.disabled = true;
    art.ready.then(() => {
        button.disabled = false;
        start();
    });
}
