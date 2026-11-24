// Hai trang dùng chung hình vẽ và dữ liệu để chỉ thay đổi tông màu khi duyệt.
const darkSpace = document.documentElement.dataset.tone === 'a';
const other = darkSpace ? 'b' : 'a';
const icons = {
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
function icon(name) {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
}

// Dùng cùng vị trí sao ở hai phương án để so sánh màu trên cùng một cảnh.
function spaceArt(id, poster) {
  const narrow = id === 'mobile';
  const banner = id === 'banner';
  const w = poster ? 520 : narrow ? 420 : 1280, h = banner ? 285 : poster ? 600 : 800;
  const px = banner ? 426 : poster ? 363 : narrow ? 354 : 1130;
  const py = banner ? 63 : poster ? 135 : narrow ? 508 : 490, radius = banner ? 28 : poster ? 53 : narrow ? 32 : 58;
  const colors = darkSpace
    ? ['#18265c','#344a89','#647cbb','#b7c9f2','#fcd395','#e99a78','#bc7483','#514e82']
    : ['#cfe3fa','#e6f3fb','#fff6dc','#5276aa','#ffe2a1','#e6a77e','#cc9093','#a3b6ce'];
  const [top, mid, base, star, sand, coral, shadow, ridge] = colors;
  const stars = Array.from({length:poster ? 78 : 140}, (_,i) => {
    const x = ((i * 131 + i*i*37) % 997) / 997 * w;
    const y = ((i * 157 + i*i*19) % 991) / 991 * h;
    return i % 12 === 1
      ? '<path d="M-4 0Q0 0 0-6Q0 0 4 0Q0 0 0 6Q0 0-4 0" transform="translate('+x+' '+y+')" fill="'+star+'"/>'
      : '<circle cx="'+x+'" cy="'+y+'" r="'+(i%3*.45+.65)+'" fill="'+star+'" opacity=".72"/>';
  }).join('');
  return `<svg class="space-art art-${id}" aria-hidden="true" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="${id}-sky" x2=".7" y2="1"><stop stop-color="${top}"/><stop offset=".62" stop-color="${mid}"/><stop offset="1" stop-color="${base}"/></linearGradient>
    <linearGradient id="${id}-planet" x2=".5" y2="1"><stop stop-color="#fff1c4"/><stop offset=".48" stop-color="${sand}"/><stop offset="1" stop-color="${shadow}"/></linearGradient>
    <clipPath id="${id}-clip"><circle r="${radius}"/></clipPath>
    <pattern id="${id}-dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="currentColor" opacity=".23"/></pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#${id}-sky)"/>${stars}
  <g fill="none" stroke="${star}" opacity=".34" stroke-width="1.2" transform="rotate(-28 ${w/2} ${h/2})">
    <ellipse cx="${w*.49}" cy="${h*.58}" rx="${w*.89}" ry="${h*.23}"/>
    <ellipse cx="${w*.48}" cy="${h*.58}" rx="${w*.91}" ry="${h*.25}" stroke-dasharray="3 8"/>
  </g>
  <g transform="translate(${px} ${py}) rotate(-20)">
    <ellipse rx="${radius*1.72}" ry="${radius*.27}" fill="none" stroke="${sand}" stroke-width="5"/>
    <circle r="${radius}" fill="url(#${id}-planet)"/>
    <g clip-path="url(#${id}-clip)">
      <path d="M-90-35q50 17 120 5t55 2M-95-18q36 9 84 5t100 0M-90 22q54 14 100 7t75-3" stroke="${coral}" fill="none" stroke-width="7" opacity=".8"/>
      <circle r="${radius}" fill="url(#${id}-dots)" opacity=".55"/>
    </g>
    <path d="M-${radius*1.72} 0a${radius*1.72} ${radius*.27} 0 0 0 ${radius*3.44} 0" fill="none" stroke="${sand}" stroke-width="6"/>
  </g>
  <g transform="translate(0 ${h}) scale(${w/520} ${banner ? .6 : poster ? 1 : .85})">
    <path d="M0-28Q215-115 520-63V0H0" fill="${sand}"/>
    <path d="M0-22Q233-106 520-58V0H0" fill="${coral}"/>
    <path d="m0-9 56-19 15 1 31-9 11 1 42-11 19 2 37-4 28 3 37-7 26 2 28-4 43 5 17-2 29 6 26-1 29 4 46 6v36H0" fill="${shadow}"/>
    <path d="M0-2q117-42 209-30l35-5 45 2 24-3 71 8 23-1 67 8 46 1V0H0" fill="${ridge}"/>
    <path d="M0-2q117-42 209-30l35-5 45 2 24-3 71 8 23-1 67 8 46 1V0H0" fill="url(#${id}-dots)"/>
  </g>
  ${poster ? `<g transform="${banner ? 'translate(76 -73) scale(.71)' : ''} rotate(-31 255 310)">
    <g fill="none" stroke-linecap="round"><path d="M-120 322Q0 339 175 299" stroke="#ffe1a7" stroke-width="11"/><path d="M-95 335Q12 343 174 312" stroke="#ed9d78" stroke-width="3"/><path d="M-100 385Q6 387 164 348" stroke="#ffcc89" stroke-width="9"/><path d="M-80 398Q25 395 160 360" stroke="#eab0a1" stroke-width="2"/></g>
    <image href="chien-co.svg" x="78" y="175" width="374" height="250"/>
  </g>` : ''}
  </svg>`;
}

const preview = document.querySelector('#preview');
const switchLink = '<a class="switch" href="chien-co-'+other+'.html" aria-label="Xem phương án '+other.toUpperCase()+'">Tông '+(darkSpace?'A':'B')+' ⇄ '+other.toUpperCase()+'</a>';
const portalHeader = `<header class="mast"><div class="brand"><span class="emblem">${icon('orbit')}</span><div><b>THCS Nga Sơn</b><small>Sản phẩm dự thi STEM</small></div></div>${switchLink}</header>`;
const saucers = ['Ninh Bình','Quảng Bình','Lạng Sơn'].map((answer,i) => `<div class="saucer"><i></i><b>${'ABC'[i]}</b><span>${answer}</span></div>`).join('');
preview.innerHTML = `
<section id="start">
  ${portalHeader}
  <div class="launch">
    <div class="poster">${spaceArt('poster',true)}${spaceArt('banner',true)}</div>
    <div class="brief">
      <div class="topics"><i></i>Lịch sử · Địa lý · Khoa học</div>
      <h1>Chiến Cơ<br><em>Kiến Thức</em></h1>
      <div class="intro"><img src="coi.svg" alt="Cói"><p><strong>Cói chào phi công!</strong><br>Hãy bắn trúng đĩa bay mang đáp án đúng.</p></div>
      <fieldset><legend>Chọn chế độ</legend>
        <div class="modes">
          <label><input type="radio" name="count" value="30" checked><span class="mode"><b>Thử thách đầy đủ</b><small>30 câu hỏi</small></span></label>
          <label><input type="radio" name="count" value="10"><span class="mode"><b>Trải nghiệm BGK</b><small>10 câu hỏi</small></span></label>
        </div>
      </fieldset>
      <button id="launch" class="primary" aria-label="Khởi hành, xem cảnh chơi">Khởi hành ${icon('arrow')}</button>
      <div class="controls">
        <p>${icon('keyboard')}<span>Chuột, ◀ ▶ hoặc A/D để lái · Click hoặc Space để bắn.</span></p>
        <p>${icon('touch')}<span>Kéo để lái · Chạm để bắn.</span></p>
        <small>Vị trí đáp án được xáo trộn sau mỗi câu.</small>
      </div>
    </div>
  </div>
</section>
<section id="flight" hidden aria-label="Cảnh chơi minh họa">
  ${spaceArt('sky',false)}${spaceArt('mobile',false)}
  <header class="hud">
    <button id="return" title="Về màn bắt đầu" aria-label="Về màn bắt đầu">${icon('back')}</button>
    <div aria-label="Điểm 0">${icon('star')}<span class="lbl">Điểm</span> 0</div>
    <div class="counter">${icon('layers')}<span class="lbl">Câu</span> <span id="count"></span></div>
    <div class="combo" aria-label="Combo nhân một">${icon('bolt')}<span class="lbl">Combo</span> ×1</div>
    <div class="clock">${icon('time')} 00:00</div>
    <button id="sound" aria-label="Bật âm thanh" title="Bật âm thanh" aria-pressed="false">${icon('mute')}</button>
  </header>
  <div class="arena">
    <div class="mother"><div class="question"><small>Câu 1</small><h2>Hang động tự nhiên lớn nhất thế giới nằm ở tỉnh nào của Việt Nam?</h2></div></div>
    <div class="answers">${saucers}</div>
    <div class="engine"><img src="chien-co.svg" alt="Chiến cơ của người chơi"></div>
  </div>
</section>`;

const start = document.querySelector('#start');
const flight = document.querySelector('#flight');
function showScene(playing) {
  const count = document.querySelector('input[name=count]:checked').value;
  document.querySelector('#count').textContent = '1/' + count;
  document.querySelector('.counter').setAttribute('aria-label','Câu 1 trên '+count);
  flight.style.setProperty('--progress', (100 / Number(count)) + '%');
  start.hidden = playing;
  flight.hidden = !playing;
  if (playing) flight.focus({preventScroll:true});
}
flight.tabIndex = -1;
document.querySelector('#launch').onclick = () => { location.hash = 'canh-choi'; };
document.querySelector('#return').onclick = () => { location.hash = 'bat-dau'; };
window.addEventListener('hashchange', () => {
  showScene(location.hash === '#canh-choi');
  if (!start.hidden) document.querySelector('#launch').focus({preventScroll:true});
});
showScene(location.hash === '#canh-choi');

const sound = document.querySelector('#sound');
let audio;
sound.onclick = () => {
  const enable = sound.getAttribute('aria-pressed') !== 'true';
  if (enable) {
    audio ??= new AudioContext();
    audio.resume();
    const note = audio.createOscillator();
    const volume = audio.createGain();
    note.frequency.value = 660;
    volume.gain.setValueAtTime(.07, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .14);
    note.connect(volume).connect(audio.destination);
    note.start();
    note.stop(audio.currentTime + .15);
  }
  sound.setAttribute('aria-pressed', String(enable));
  sound.title = enable ? 'Tắt âm thanh' : 'Bật âm thanh';
  sound.setAttribute('aria-label', sound.title);
  sound.innerHTML = icon(enable ? 'sound' : 'mute');
};
