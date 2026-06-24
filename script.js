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
const stationRouteMap = {
    // 淡水信義線 (R)
    "信義安和": { line: "R", direction: "xiangshan", dirText: "往 象山" },
    "象山":     { line: "R", direction: "xiangshan", dirText: "往 象山" },
    "台北101/世帥": { line: "R", direction: "xiangshan", dirText: "往 象山" },
    "中山":     { line: "R", direction: "tamsui",    dirText: "往 淡水" },
    "士林":     { line: "R", direction: "tamsui",    dirText: "往 淡水" },
    "淡水":     { line: "R", direction: "tamsui",    dirText: "往 淡水" },
    
    // 板南線 (BL)
    "市政府":   { line: "BL", direction: "nangang",  dirText: "往 南港展覽館" },
    "南港展覽館": { line: "BL", direction: "nangang",  dirText: "往 南港展覽館" },
    "西門":     { line: "BL", direction: "dingpu",   dirText: "往 頂埔" },
    "龍山寺":   { line: "BL", direction: "dingpu",   dirText: "往 頂埔" },
    "頂埔":     { line: "BL", direction: "dingpu",   dirText: "往 頂埔" }
};

let currentFloor = 'B1'; 

function startNav() {
    const selectedStation = document.getElementById('station-select').value;
    const pathElement = document.getElementById('route-path');
    
    if (!selectedStation) { alert("⚠️ 請先選擇目的地車站！"); return; }
    if (!currentMode) { alert("⚠️ 請先選擇導航模式（無障礙或一般路線）！"); return; }

    const routeInfo = stationRouteMap[selectedStation];

    // 根據樓層 + 模式選擇對應節點
    let nodes = [];
    const isAccessible = currentMode === 'accessible';

    if (currentFloor === 'B1') {
        nodes = isAccessible ? b1Nodes : b1NodesGeneral;
    } else if (currentFloor === 'B2') {
        nodes = isAccessible ? b2Nodes : b2NodesGeneral;
    } else if (currentFloor === 'B3') {
        nodes = isAccessible ? b3Nodes : b3NodesGeneral;
    }

    if (!nodes || nodes.length === 0) {
        alert(`${currentFloor} 的路線節點尚未設定！`);
        return;
    }

    // 無障礙：綠色；一般：藍色
    pathElement.style.stroke = isAccessible ? '#2ecc71' : '#4bcffa';
    
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
        d += ` L ${nodes[i].x} ${nodes[i].y}`;
    }
    pathElement.setAttribute('d', d);
    
    const nextFloorContainer = document.getElementById('next-floor-container');
    const nextLabel = isAccessible ? '電梯' : '樓梯/手扶梯';
    
    if (currentFloor === 'B1') {
        nextFloorContainer.style.display = 'block';
        nextFloorContainer.innerHTML = `<button class="btn btn-success" onclick="goToFloor('B2')">⬇️ 抵達 B1 ${nextLabel}，點擊進入 B2 並繼續導航</button>`;
    } else if (currentFloor === 'B2') {
        nextFloorContainer.style.display = 'block';
        nextFloorContainer.innerHTML = `<button class="btn btn-success" onclick="goToFloor('B3')">⬇️ 抵達 B2 ${nextLabel}，點擊進入 B3 並繼續導航</button>`;
    } else if (currentFloor === 'B3') {
        nextFloorContainer.style.display = 'block';
        nextFloorContainer.innerHTML = `<button class="btn btn-success" style="border-color:#0fb9b1; color:#0fb9b1;" onclick="alert('導航結束')">🎉 已成功引導至 ${routeInfo.line}線 (${routeInfo.dirText}) 月台層！</button>`;
    }
}

function goToFloor(floor) {
    currentFloor = floor;
    
    document.getElementById('current-floor-display').innerText = `${floor} 樓層`;
    document.getElementById('main-nav-btn').innerText = `重新導航 (回到起點)`;
    
    document.getElementById('next-floor-container').style.display = 'none';
    document.getElementById('route-path').setAttribute('d', '');

    const mapImg = document.getElementById('map-img');
    if (floor === 'B1') {
        mapImg.src = 'taipei_b1.png';
    } else if (floor === 'B2') {
        mapImg.src = 'taipei_b2.png'; 
    } else if (floor === 'B3') {
        mapImg.src = 'taipei_b3.png'; 
    }

    setTimeout(() => {
        startNav();
    }, 100);
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
