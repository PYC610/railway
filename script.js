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

// 📍 B1 一般路線節點 (預設版)
const b1NodesGeneral = [
    {id: "b1b_hsr_gate4", x: 1673, y: 1058},
    {id: "b1b_s_road3", x: 1682, y: 1258},
    {id: "b1c_road1", x: 1738, y: 1422},
    {id: "b1c_road2", x: 1713, y: 1575},
    {id: "b1d_road4", x: 1662, y: 1872},
    {id: "b1d_stairs", x: 1800, y: 1872}
];

// 🌟 預留：B1 一般路線細分選項 (待補上實際座標，目前先指派給預設版)
const b1NodesStairs = b1NodesGeneral;     // 樓梯
const b1NodesEscalator = b1NodesGeneral;  // 自動扶梯
const b1NodesElevator = b1NodesGeneral;   // 電梯 (一般路線的電梯)
const b1NodesBest = b1NodesGeneral;       // 最佳路線

// 📍 B2 節點資料庫
const b2Nodes = [
    {id: "b2_elevator4", x: 1983, y: 1903},
    {id: "b2_road5", x: 1867, y: 1868},
    {id: "b2_bl_entrance4", x: 1867, y: 1852},
    {id: "B2_bl_road5", x: 1722, y: 1842},
    {id: "B2_b1_road4", x: 1577, y: 1842},
    {id: "b2_elevator3", x: 1577, y: 1895}
];

// 📍 B2 一般路線節點
const b2NodesGeneral = [
    {id: "b2_stairs", x: 1800, y: 1872},
    {id: "b2_road5", x: 1867, y: 1868},
    {id: "b2_bl_entrance4", x: 1867, y: 1852},
    {id: "B2_bl_road5", x: 1722, y: 1842},
    {id: "B2_b1_road4", x: 1577, y: 1842},
    {id: "b2_stairs3", x: 1577, y: 1860}
];

// 🌟 預留：B2 一般路線細分選項
const b2NodesStairs = b2NodesGeneral;
const b2NodesEscalator = b2NodesGeneral;
const b2NodesElevator = b2NodesGeneral;
const b2NodesBest = b2NodesGeneral;

// 📍 B3 節點資料庫
const b3Nodes = [
    {id: "b3_elevator", x: 1577, y: 1895},   
    {id: "b3_bl_road3", x: 1577, y: 1856},   
    {id: "b3_bl_road10", x: 1257, y: 1856}   
];

// 📍 B3 一般路線節點
const b3NodesGeneral = [
    {id: "b3_stairs", x: 1577, y: 1860},
    {id: "b3_bl_road3", x: 1577, y: 1856},
    {id: "b3_bl_road10", x: 1257, y: 1856}
];

// 🌟 預留：B3 一般路線細分選項
const b3NodesStairs = b3NodesGeneral;
const b3NodesEscalator = b3NodesGeneral;
const b3NodesElevator = b3NodesGeneral;
const b3NodesBest = b3NodesGeneral;


// 捷運車站決策資料庫
const BL_STATIONS_ORDERED = [
    "頂埔", "永寧", "土城", "海山", "亞東醫院",
    "府中", "板橋", "新埔", "江子翠", "新莊",
    "三重", "菜寮", "三民高中", "徐匯中學", "三重國小",
    "台北橋", "大橋頭", "台北車站",  
    "善導寺", "忠孝新生", "忠孝復興", "忠孝敦化",
    "國父紀念館", "市政府", "永春", "後山埤",
    "昆陽", "南港", "南港展覽館"
];
const TAIPEI_INDEX = BL_STATIONS_ORDERED.indexOf("台北車站"); 

const stationRouteMap = {};
BL_STATIONS_ORDERED.forEach((name, idx) => {
    if (name === "台北車站") return; 
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

    const info = stationRouteMap[name];
    const badge = document.getElementById('direction-badge');
    const isNangang = info.direction === 'nangang';
    badge.style.display = 'block';
    badge.className = 'direction-badge ' + (isNangang ? 'nangang' : 'dingpu');
    badge.innerHTML = isNangang
        ? `🚇 板南線 <strong>${name}</strong> <span>往 南港展覽館 ▶</span>`
        : `🚇 板南線 <span>◀ 往 頂埔</span> <strong>${name}</strong>`;
}

function clearDirection() {
    selectedStation = "";
    document.getElementById('direction-badge').style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        document.getElementById('station-dropdown').style.display = 'none';
    }
});

let currentFloor = 'B1';
let animFrameId = null; 
let isNavigating = false; // 記錄是否正在導航中

const MAP_SCALE = 200 / 2560; 

function calcRouteStats(nodes) {
    let totalPx = 0;
    for (let i = 1; i < nodes.length; i++) {
        const dx = nodes[i].x - nodes[i-1].x;
        const dy = nodes[i].y - nodes[i-1].y;
        totalPx += Math.sqrt(dx*dx + dy*dy);
    }
    const meters = Math.round(totalPx * MAP_SCALE);
    const seconds = Math.round(meters / 1.2); 
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { meters, timeStr: mins > 0 ? `${mins} 分 ${secs} 秒` : `${secs} 秒` };
}

function drawMarkers(nodes, color) {
    const svg = document.getElementById('svg-layer');
    svg.querySelectorAll('.route-marker').forEach(el => el.remove());

    const start = nodes[0];
    const end   = nodes[nodes.length - 1];

    // 起點：綠色系
    const startGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    startGroup.setAttribute('class', 'route-marker');
    const sOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sOuter.setAttribute('cx', start.x); sOuter.setAttribute('cy', start.y);
    sOuter.setAttribute('r', 32); sOuter.setAttribute('fill', '#2ecc71'); sOuter.setAttribute('opacity', '0.25');
    const sMid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sMid.setAttribute('cx', start.x); sMid.setAttribute('cy', start.y);
    sMid.setAttribute('r', 22); sMid.setAttribute('fill', 'none');
    sMid.setAttribute('stroke', '#2ecc71'); sMid.setAttribute('stroke-width', '3'); sMid.setAttribute('opacity', '0.6');
    const sInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sInner.setAttribute('cx', start.x); sInner.setAttribute('cy', start.y);
    sInner.setAttribute('r', 14); sInner.setAttribute('fill', '#2ecc71');
    sInner.setAttribute('stroke', '#ffffff'); sInner.setAttribute('stroke-width', '3');
    const sLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sLabel.setAttribute('x', start.x); sLabel.setAttribute('y', start.y - 40);
    sLabel.setAttribute('text-anchor', 'middle'); sLabel.setAttribute('fill', '#2ecc71');
    sLabel.setAttribute('font-size', '22'); sLabel.setAttribute('font-weight', 'bold');
    sLabel.setAttribute('letter-spacing', '1');
    sLabel.textContent = '🟢 起點';
    startGroup.append(sOuter, sMid, sInner, sLabel);

    // 終點：紅色系
    const endGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    endGroup.setAttribute('class', 'route-marker');
    const eOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eOuter.setAttribute('cx', end.x); eOuter.setAttribute('cy', end.y);
    eOuter.setAttribute('r', 32); eOuter.setAttribute('fill', '#ff3f34'); eOuter.setAttribute('opacity', '0.25');
    const eMid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eMid.setAttribute('cx', end.x); eMid.setAttribute('cy', end.y);
    eMid.setAttribute('r', 22); eMid.setAttribute('fill', 'none');
    eMid.setAttribute('stroke', '#ff3f34'); eMid.setAttribute('stroke-width', '3'); eMid.setAttribute('opacity', '0.6');
    const eInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eInner.setAttribute('cx', end.x); eInner.setAttribute('cy', end.y);
    eInner.setAttribute('r', 14); eInner.setAttribute('fill', '#ff3f34');
    eInner.setAttribute('stroke', '#ffffff'); eInner.setAttribute('stroke-width', '3');
    const eLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    eLabel.setAttribute('x', end.x); eLabel.setAttribute('y', end.y - 40);
    eLabel.setAttribute('text-anchor', 'middle'); eLabel.setAttribute('fill', '#ff3f34');
    eLabel.setAttribute('font-size', '22'); eLabel.setAttribute('font-weight', 'bold');
    eLabel.setAttribute('letter-spacing', '1');
    eLabel.textContent = '🔴 終點';
    endGroup.append(eOuter, eMid, eInner, eLabel);

    svg.append(startGroup, endGroup);
}

function animateRoute(pathElement, color, onComplete) {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const totalLength = pathElement.getTotalLength();

    pathElement.style.transition = 'none';
    pathElement.style.strokeDasharray  = `${totalLength}`;
    pathElement.style.strokeDashoffset = `${totalLength}`;
    pathElement.style.stroke = color;
    pathElement.style.opacity = '1';

    pathElement.getBoundingClientRect();
    pathElement.style.transition = `stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)`;
    pathElement.style.strokeDashoffset = '0';

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

// 根據樓層與模式取得對應的節點
function getNodesForCurrentSettings() {
    const isAccessible = currentMode === 'accessible';
    
    if (currentFloor === 'B1') {
        if (isAccessible) return b1Nodes;
        if (currentSubMode === 'stairs') return b1NodesStairs;
        if (currentSubMode === 'escalator') return b1NodesEscalator;
        if (currentSubMode === 'elevator') return b1NodesElevator;
        if (currentSubMode === 'best') return b1NodesBest;
        return b1NodesGeneral;
    } else if (currentFloor === 'B2') {
        if (isAccessible) return b2Nodes;
        if (currentSubMode === 'stairs') return b2NodesStairs;
        if (currentSubMode === 'escalator') return b2NodesEscalator;
        if (currentSubMode === 'elevator') return b2NodesElevator;
        if (currentSubMode === 'best') return b2NodesBest;
        return b2NodesGeneral;
    } else if (currentFloor === 'B3') {
        if (isAccessible) return b3Nodes;
        if (currentSubMode === 'stairs') return b3NodesStairs;
        if (currentSubMode === 'escalator') return b3NodesEscalator;
        if (currentSubMode === 'elevator') return b3NodesElevator;
        if (currentSubMode === 'best') return b3NodesBest;
        return b3NodesGeneral;
    }
    return [];
}

function startNav() {
    const pathElement = document.getElementById('route-path');

    if (!selectedStation) { alert("⚠️ 請先選擇目的地車站！"); return; }
    if (!currentMode) { alert("⚠️ 請先選擇導航模式（無障礙或一般路線）！"); return; }
    if (currentMode === 'general' && !currentSubMode) { alert("⚠️ 請先選擇一般路線的方式！"); return; }

    isNavigating = true; // 標記為正在導航

    const routeInfo = stationRouteMap[selectedStation];
    const isAccessible = currentMode === 'accessible';
    const color = isAccessible ? '#2ecc71' : '#f39c12'; // 一般路線改用橘黃色區別

    let nodes = getNodesForCurrentSettings();

    if (!nodes || nodes.length === 0) {
        alert(`${currentFloor} 的路線節點尚未設定！`); return;
    }

    const { meters, timeStr } = calcRouteStats(nodes);

    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) d += ` L ${nodes[i].x} ${nodes[i].y}`;
    pathElement.setAttribute('d', d);

    drawMarkers(nodes, color);

    animateRoute(pathElement, color, () => {
        // 如果未來有需要，這邊可保留樓層轉換提示
        const statsHtml = `<div class="route-stats">📏 本段約 ${meters} 公尺 ⏱️ 步行約 ${timeStr}</div>`;
        const nextFloorContainer = document.getElementById('next-floor-container');
        nextFloorContainer.style.display = 'block';
        nextFloorContainer.innerHTML = statsHtml;
    });
}

// 上下樓層切換邏輯
function changeFloor(direction) {
    // 判斷目標樓層
    let targetFloor = '';
    if (currentFloor === 'B1' && direction === 1) targetFloor = 'B2';
    else if (currentFloor === 'B2' && direction === -1) targetFloor = 'B1';
    else if (currentFloor === 'B2' && direction === 1) targetFloor = 'B3';
    else if (currentFloor === 'B3' && direction === -1) targetFloor = 'B2';
    else return; // 超出範圍 (B1 上 或 B3 下)

    currentFloor = targetFloor;

    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }

    document.getElementById('current-floor-display').innerText = `${currentFloor} 樓層`;
    document.getElementById('next-floor-container').style.display = 'none';

    const pathElement = document.getElementById('route-path');
    pathElement.setAttribute('d', '');
    pathElement.style.strokeDasharray = '';
    pathElement.style.strokeDashoffset = '';
    document.getElementById('svg-layer').querySelectorAll('.route-marker').forEach(el => el.remove());

    const mapImg = document.getElementById('map-img');
    if (currentFloor === 'B1') mapImg.src = 'taipei_b1.png';
    else if (currentFloor === 'B2') mapImg.src = 'taipei_b2.png';
    else if (currentFloor === 'B3') mapImg.src = 'taipei_b3.png';

    // 如果已經在導航狀態，切換樓層後自動重畫該樓層路線
    if (isNavigating && selectedStation && currentMode) {
        if (currentMode === 'general' && !currentSubMode) return;
        setTimeout(() => { startNav(); }, 100);
    }
}


let scale = 0.3;          
const MIN_SCALE = 0.1;
const MAX_SCALE = 2.0;

function applyTransform() {
    document.getElementById('map-wrapper').style.transform = `scale(${scale})`;
}

window.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('viewport');
    const wrapper  = document.getElementById('map-wrapper');

    applyTransform();

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left + viewport.scrollLeft;
        const mouseY = e.clientY - rect.top  + viewport.scrollTop;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));

        viewport.scrollLeft = mouseX * (newScale / scale) - (e.clientX - rect.left);
        viewport.scrollTop  = mouseY * (newScale / scale) - (e.clientY - rect.top);

        scale = newScale;
        applyTransform();
    }, { passive: false });

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

    let isDragging = false;
    let startX, startY;
    let scrollLeft, scrollTop;

    viewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.station-dropdown')) {
            return;
        }
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = viewport.scrollLeft;
        scrollTop = viewport.scrollTop;
        viewport.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        viewport.scrollLeft = scrollLeft - dx;
        viewport.scrollTop = scrollTop - dy;
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            viewport.style.cursor = 'grab';
        }
    });

    let touchStartX, touchStartY;
    let touchScrollLeft, touchScrollTop;

    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchScrollLeft = viewport.scrollLeft;
            touchScrollTop = viewport.scrollTop;
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const dx = touch.clientX - touchStartX;
            const dy = touch.clientY - touchStartY;
            viewport.scrollLeft = touchScrollLeft - dx;
            viewport.scrollTop = touchScrollTop - dy;
            e.preventDefault(); 
        }
    }, { passive: false });
});

let currentMode = ''; 
let currentSubMode = ''; // 紀錄一般路線的子選項

function setMode(mode) {
    currentMode = mode;
    
    document.getElementById('btn-accessible').classList.remove('active');
    document.getElementById('btn-general').classList.remove('active');
    document.getElementById(`btn-${mode}`).classList.add('active');
    
    const generalOptions = document.getElementById('general-route-options');
    
    if (mode === 'general') {
        generalOptions.style.display = 'flex';
    } else {
        generalOptions.style.display = 'none';
        currentSubMode = ''; // 清除子選項
        // 取消所有子選項的 active 狀態
        document.querySelectorAll('.sub-mode-btn').forEach(btn => btn.classList.remove('active'));
    }
    
    // 如果正在導航，切換模式後自動重畫
    if (isNavigating && selectedStation && (mode === 'accessible' || (mode === 'general' && currentSubMode))) {
        startNav();
    }
}

// 設定一般路線的子選項
function setSubMode(subMode) {
    currentSubMode = subMode;
    
    // 移除所有子選項的 active 狀態
    document.querySelectorAll('.sub-mode-btn').forEach(btn => btn.classList.remove('active'));
    
    // 加上 active
    document.getElementById(`btn-sub-${subMode}`).classList.add('active');
    
    // 如果正在導航，切換子模式後自動重畫
    if (isNavigating && selectedStation && currentMode === 'general') {
        startNav();
    }
}

// 側邊欄收合控制
function toggleSidebar() {
    const controls = document.getElementById('controls');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    
    controls.classList.toggle('collapsed');
    
    if (controls.classList.contains('collapsed')) {
        toggleBtn.innerText = '▶'; // 變成展開箭頭
    } else {
        toggleBtn.innerText = '◀'; // 變成收合箭頭
    }
}