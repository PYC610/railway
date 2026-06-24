// 📍 B1 節點資料庫 (完全保留你原本的無障礙資料)
const b1Nodes = [
    {id: "b1b_hsr_gate4", x: 1673, y: 1058},
    {id: "b1b_s_road3", x: 1682, y: 1258},
    {id: "b1c_s_ramp", x: 1720, y: 1322},
    {id: "b1c_s_rampw1", x: 1714, y: 1336},
    {id: "b1c_s_rampw2", x: 1613, y: 1347},
    {id: "b1c_s_rampw3", x: 1617, y: 1369},
    {id: "b1c_s_rampw4", x: 1669, y: 1364},
    {id: "b1c_s_ramped", x: 1712, y: 1402},
    {id: "b1c_road1", x: 1738, y: 1422},
    {id: "b1c_road2", x: 1713, y: 1575},
    {id: "b1d_road4", x: 1662, y: 1872},
    {id: "b1d_road5", x: 1983, y: 1872},
    {id: "b1d_elevator4", x: 1983, y: 1903}
];

// 📍 B1 一般路線節點（走樓梯/手扶梯，較直接）
const b1NodesGeneral = [
    {id: "b1b_hsr_gate4", x: 1673, y: 1058},
    {id: "b1b_s_road3", x: 1682, y: 1258},
    {id: "b1c_road1", x: 1738, y: 1422},
    {id: "b1c_road2", x: 1713, y: 1575},
    {id: "b1d_road4", x: 1662, y: 1872},
    {id: "b1d_stairs", x: 1800, y: 1872}
];

// 📍 B2 節點資料庫 (完全保留你原本的無障礙資料)
const b2Nodes = [
    {id: "b2_elevator4", x: 1983, y: 1903},
    {id: "b2_road5", x: 1867, y: 1868},
    {id: "b2_bl_entrance4", x: 1867, y: 1852},
    {id: "B2_bl_road5", x: 1722, y: 1842},
    {id: "B2_b1_road4", x: 1577, y: 1842},
    {id: "b2_elevator3", x: 1577, y: 1895}
];

// 📍 B2 一般路線節點（走樓梯/手扶梯）
const b2NodesGeneral = [
    {id: "b2_stairs", x: 1800, y: 1872},
    {id: "b2_road5", x: 1867, y: 1868},
    {id: "b2_bl_entrance4", x: 1867, y: 1852},
    {id: "B2_bl_road5", x: 1722, y: 1842},
    {id: "B2_b1_road4", x: 1577, y: 1842},
    {id: "b2_stairs3", x: 1577, y: 1860}
];

// 🌟 修正：已更換為你提供的新 B3 實際無障礙動線座標
const b3Nodes = [
    {id: "b3_elevator", x: 1577, y: 1895},   // B3 起點電梯
    {id: "b3_bl_road3", x: 1577, y: 1856},   // 節點 2
    {id: "b3_bl_road10", x: 1257, y: 1856}   // 節點 3
];

// 📍 B3 一般路線節點（走樓梯/手扶梯）
const b3NodesGeneral = [
    {id: "b3_stairs", x: 1577, y: 1860},
    {id: "b3_bl_road3", x: 1577, y: 1856},
    {id: "b3_bl_road10", x: 1257, y: 1856}
];

// 捷運車站決策資料庫
// 板南線完整站序（從頂埔到南港展覽館），台北站 index = 15
// 台北站左邊（index < 15）→ 往南港展覽館；右邊（index > 15）→ 往頂埔
const BL_STATIONS_ORDERED = [
    "頂埔", "永寧", "土城", "海山", "亞東醫院",
    "府中", "板橋", "新埔", "江子翠", "新莊",
    "三重", "菜寮", "三民高中", "徐匯中學", "三重國小",
    "台北橋", "大橋頭", "台北車站",  // index 17 = 台北
    "善導寺", "忠孝新生", "忠孝復興", "忠孝敦化",
    "國父紀念館", "市政府", "永春", "後山埤",
    "昆陽", "南港", "南港展覽館"
];
// 台北車站在板南線的 index
const TAIPEI_INDEX = BL_STATIONS_ORDERED.indexOf("台北車站"); // 17

const stationRouteMap = {};
BL_STATIONS_ORDERED.forEach((name, idx) => {
    if (name === "台北車站") return; // 出發站，跳過
    const toNangang = idx > TAIPEI_INDEX;
    stationRouteMap[name] = {
        line: "BL",
        direction: toNangang ? "nangang" : "dingpu",
        dirText: toNangang ? "往 南港展覽館" : "往 頂埔"
    };
});

// ── 搜尋 UI 邏輯 ──
let selectedStation = "";

function getStationList() {
    return BL_STATIONS_ORDERED.filter(s => s !== "台北車站");
}

function filterStations(query) {
    const list = query.trim() === ""
        ? getStationList()
        : getStationList().filter(s => s.includes(query.trim()));
    renderDropdown(list);
    // 若輸入完全符合某一站，自動選取
    const exact = getStationList().find(s => s === query.trim());
    if (exact) selectStation(exact, false);
    else clearDirection();
}

function showDropdown() {
    renderDropdown(getStationList());
}

function renderDropdown(list) {
    const dd = document.getElementById('station-dropdown');
    if (list.length === 0) {
        dd.innerHTML = '<div class="dd-item dd-empty">找不到符合車站</div>';
    } else {
        dd.innerHTML = list.map(s => {
            const info = stationRouteMap[s];
            const tag = info.direction === 'nangang'
                ? `<span class="dd-dir nangang">往南港展覽館 ▶</span>`
                : `<span class="dd-dir dingpu">◀ 往頂埔</span>`;
            return `<div class="dd-item" onclick="selectStation('${s}')">${s} ${tag}</div>`;
        }).join('');
    }
    dd.style.display = 'block';
}

function selectStation(name, updateInput = true) {
    selectedStation = name;
    if (updateInput) {
        document.getElementById('station-input').value = name;
    }
    document.getElementById('station-dropdown').style.display = 'none';

    // 顯示方向 badge
    const info = stationRouteMap[name];
    const badge = document.getElementById('direction-badge');
    const isNangang = info.direction === 'nangang';
    badge.style.display = 'block';
    badge.className = 'direction-badge ' + (isNangang ? 'nangang' : 'dingpu');
    badge.innerHTML = isNangang
        ? `🚇 板南線　<strong>${name}</strong>　<span>往 南港展覽館 ▶</span>`
        : `🚇 板南線　<span>◀ 往 頂埔</span>　<strong>${name}</strong>`;
}

function clearDirection() {
    selectedStation = "";
    document.getElementById('direction-badge').style.display = 'none';
}

// 點擊其他地方關閉下拉
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        document.getElementById('station-dropdown').style.display = 'none';
    }
});

let currentFloor = 'B1';
let animFrameId = null; // 用來停止流動動畫

// 計算節點總距離（像素），換算成公尺與步行時間
// 地圖 2560px 對應約實際 ~200 公尺（請依實際比例調整 SCALE）
const MAP_SCALE = 200 / 2560; // 每 px 對應公尺數

function calcRouteStats(nodes) {
    let totalPx = 0;
    for (let i = 1; i < nodes.length; i++) {
        const dx = nodes[i].x - nodes[i-1].x;
        const dy = nodes[i].y - nodes[i-1].y;
        totalPx += Math.sqrt(dx*dx + dy*dy);
    }
    const meters = Math.round(totalPx * MAP_SCALE);
    const seconds = Math.round(meters / 1.2); // 步行速度 1.2 m/s
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { meters, timeStr: mins > 0 ? `${mins} 分 ${secs} 秒` : `${secs} 秒` };
}

// 在 SVG 上畫起點圓點與終點圓點
function drawMarkers(nodes, color) {
    const svg = document.getElementById('svg-layer');
    // 清除舊的標記
    svg.querySelectorAll('.route-marker').forEach(el => el.remove());

    const start = nodes[0];
    const end   = nodes[nodes.length - 1];

    // 起點：白色實心圓 + 外環
    const startGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    startGroup.setAttribute('class', 'route-marker');
    const sOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sOuter.setAttribute('cx', start.x); sOuter.setAttribute('cy', start.y);
    sOuter.setAttribute('r', 28); sOuter.setAttribute('fill', color); sOuter.setAttribute('opacity', '0.3');
    const sInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sInner.setAttribute('cx', start.x); sInner.setAttribute('cy', start.y);
    sInner.setAttribute('r', 16); sInner.setAttribute('fill', '#ffffff');
    const sLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sLabel.setAttribute('x', start.x); sLabel.setAttribute('y', start.y - 38);
    sLabel.setAttribute('text-anchor', 'middle'); sLabel.setAttribute('fill', '#ffffff');
    sLabel.setAttribute('font-size', '28'); sLabel.setAttribute('font-weight', 'bold');
    sLabel.textContent = '起';
    startGroup.append(sOuter, sInner, sLabel);

    // 終點：彩色實心圓 + 旗標文字
    const endGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    endGroup.setAttribute('class', 'route-marker');
    const eOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eOuter.setAttribute('cx', end.x); eOuter.setAttribute('cy', end.y);
    eOuter.setAttribute('r', 28); eOuter.setAttribute('fill', color); eOuter.setAttribute('opacity', '0.3');
    const eInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eInner.setAttribute('cx', end.x); eInner.setAttribute('cy', end.y);
    eInner.setAttribute('r', 16); eInner.setAttribute('fill', color);
    const eLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    eLabel.setAttribute('x', end.x); eLabel.setAttribute('y', end.y - 38);
    eLabel.setAttribute('text-anchor', 'middle'); eLabel.setAttribute('fill', color);
    eLabel.setAttribute('font-size', '28'); eLabel.setAttribute('font-weight', 'bold');
    eLabel.textContent = '終';
    endGroup.append(eOuter, eInner, eLabel);

    svg.append(startGroup, endGroup);
}

// 路線描繪動畫，畫完後轉為流動虛線
function animateRoute(pathElement, color, onComplete) {
    // 停止之前的流動動畫
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const totalLength = pathElement.getTotalLength();

    // 先設定為「從頭描繪」狀態
    pathElement.style.transition = 'none';
    pathElement.style.strokeDasharray  = `${totalLength}`;
    pathElement.style.strokeDashoffset = `${totalLength}`;
    pathElement.style.stroke = color;
    pathElement.style.opacity = '1';

    // 強制 reflow 後開始 CSS transition 描繪
    pathElement.getBoundingClientRect();
    pathElement.style.transition = `stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)`;
    pathElement.style.strokeDashoffset = '0';

    // 描繪結束後啟動流動虛線
    setTimeout(() => {
        startFlowAnimation(pathElement, totalLength, color);
        if (onComplete) onComplete();
    }, 1700);
}

function startFlowAnimation(pathElement, totalLength, color) {
    const dashLen  = 80;
    const gapLen   = 60;
    const pattern  = dashLen + gapLen;
    let offset = 0;

    pathElement.style.transition = 'none';
    pathElement.style.strokeDasharray = `${dashLen} ${gapLen}`;

    function step() {
        offset = (offset + 3) % pattern;
        pathElement.style.strokeDashoffset = -offset;
        animFrameId = requestAnimationFrame(step);
    }
    animFrameId = requestAnimationFrame(step);
}

function startNav() {
    const pathElement = document.getElementById('route-path');

    if (!selectedStation) { alert("⚠️ 請先選擇目的地車站！"); return; }
    if (!currentMode) { alert("⚠️ 請先選擇導航模式（無障礙或一般路線）！"); return; }

    const routeInfo = stationRouteMap[selectedStation];
    const isAccessible = currentMode === 'accessible';
    const color = isAccessible ? '#2ecc71' : '#4bcffa';

    let nodes = [];
    if (currentFloor === 'B1') nodes = isAccessible ? b1Nodes : b1NodesGeneral;
    else if (currentFloor === 'B2') nodes = isAccessible ? b2Nodes : b2NodesGeneral;
    else if (currentFloor === 'B3') nodes = isAccessible ? b3Nodes : b3NodesGeneral;

    if (!nodes || nodes.length === 0) {
        alert(`${currentFloor} 的路線節點尚未設定！`); return;
    }

    // 計算距離與時間
    const { meters, timeStr } = calcRouteStats(nodes);

    // 畫路徑
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) d += ` L ${nodes[i].x} ${nodes[i].y}`;
    pathElement.setAttribute('d', d);

    // 畫起終點標記
    drawMarkers(nodes, color);

    // 播放描繪動畫
    animateRoute(pathElement, color, () => {
        // 動畫結束後顯示換層按鈕與統計
        const nextFloorContainer = document.getElementById('next-floor-container');
        const nextLabel = isAccessible ? '電梯' : '樓梯/手扶梯';
        const statsHtml = `<div class="route-stats">📏 本段約 ${meters} 公尺　⏱️ 步行約 ${timeStr}</div>`;

        if (currentFloor === 'B1') {
            nextFloorContainer.style.display = 'block';
            nextFloorContainer.innerHTML = statsHtml + `<button class="btn btn-success" onclick="goToFloor('B2')">⬇️ 抵達 B1 ${nextLabel}，點擊進入 B2 並繼續導航</button>`;
        } else if (currentFloor === 'B2') {
            nextFloorContainer.style.display = 'block';
            nextFloorContainer.innerHTML = statsHtml + `<button class="btn btn-success" onclick="goToFloor('B3')">⬇️ 抵達 B2 ${nextLabel}，點擊進入 B3 並繼續導航</button>`;
        } else if (currentFloor === 'B3') {
            nextFloorContainer.style.display = 'block';
            nextFloorContainer.innerHTML = statsHtml + `<button class="btn btn-success" style="border-color:#0fb9b1; color:#0fb9b1;" onclick="alert('導航結束！')">🎉 已成功引導至 ${routeInfo.line}線 (${routeInfo.dirText}) 月台層！</button>`;
        }
    });
}

function goToFloor(floor) {
    currentFloor = floor;

    // 停止流動動畫
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }

    document.getElementById('current-floor-display').innerText = `${floor} 樓層`;
    document.getElementById('main-nav-btn').innerText = `重新導航 (回到起點)`;
    document.getElementById('next-floor-container').style.display = 'none';

    // 清除路線與標記
    const pathElement = document.getElementById('route-path');
    pathElement.setAttribute('d', '');
    pathElement.style.strokeDasharray = '';
    pathElement.style.strokeDashoffset = '';
    document.getElementById('svg-layer').querySelectorAll('.route-marker').forEach(el => el.remove());

    const mapImg = document.getElementById('map-img');
    if (floor === 'B1') mapImg.src = 'taipei_b1.png';
    else if (floor === 'B2') mapImg.src = 'taipei_b2.png';
    else if (floor === 'B3') mapImg.src = 'taipei_b3.png';

    setTimeout(() => { startNav(); }, 100);
}

// ===== 縮放與拖曳邏輯 =====
let scale = 0.3;          // 初始縮放比例（地圖很大，預設縮小）
const MIN_SCALE = 0.1;
const MAX_SCALE = 2.0;

const viewport = document.getElementById('viewport') || (() => {
    // 等 DOM 載入後才綁定
})();

function applyTransform() {
    document.getElementById('map-wrapper').style.transform = `scale(${scale})`;
}

window.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('viewport');
    const wrapper  = document.getElementById('map-wrapper');

    // 初始縮放
    applyTransform();

    // ── 滾輪縮放 ──
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left + viewport.scrollLeft;
        const mouseY = e.clientY - rect.top  + viewport.scrollTop;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));

        // 以滑鼠為中心縮放
        viewport.scrollLeft = mouseX * (newScale / scale) - (e.clientX - rect.left);
        viewport.scrollTop  = mouseY * (newScale / scale) - (e.clientY - rect.top);

        scale = newScale;
        applyTransform();
    }, { passive: false });

    // ── 觸控雙指縮放 (Pinch) ──
    let lastDist = null;

    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            lastDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && lastDist !== null) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const delta = dist / lastDist;
            scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
            lastDist = dist;
            applyTransform();
        }
    }, { passive: false });

    viewport.addEventListener('touchend', () => { lastDist = null; });
});
// ===========================
function openMapModal() {
    document.getElementById('mapModal').style.display = 'flex';
}

function closeMapModal() {
    document.getElementById('mapModal').style.display = 'none';
}

let currentMode = ''; // 預設為空

function setMode(mode) {
    currentMode = mode;
    
    // 移除所有按鈕的 active 狀態
    document.getElementById('btn-accessible').classList.remove('active');
    document.getElementById('btn-general').classList.remove('active');
    
    // 為被點擊的按鈕加上 active 狀態
    document.getElementById(`btn-${mode}`).classList.add('active');
    
    console.log("已切換模式為: " + mode);
}
