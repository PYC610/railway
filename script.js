// ============================================================
//  台北車站無障礙導航 — script.js
//  使用 nodes.json + edges.json 進行 Dijkstra 最短路徑搜尋
// ============================================================

// ── 內嵌資料（取代 fetch，支援直接開啟 file://） ──────────
const NODES_INLINE = {
  "b1b_hsr_gate4": { "floor": "B1", "x": 1673, "y": 1058 },
  "b1b_s_road3": { "floor": "B1", "x": 1682, "y": 1258 },
  "b1c_rampst": { "floor": "B1", "x": 1720, "y": 1322 },
  "b1c_rampw1": { "floor": "B1", "x": 1714, "y": 1336 },
  "b1c_rampw2": { "floor": "B1", "x": 1613, "y": 1347 },
  "b1c_rampw3": { "floor": "B1", "x": 1617, "y": 1369 },
  "b1c_rampw4": { "floor": "B1", "x": 1669, "y": 1364 },
  "b1c_ramped": { "floor": "B1", "x": 1712, "y": 1402 },
  "b1c_road1": { "floor": "B1", "x": 1738, "y": 1422 },
  "b1c_road2": { "floor": "B1", "x": 1713, "y": 1575 },
  "b1c_road3": { "floor": "B1", "x": 1558, "y": 1376 },
  "b1c_road4": { "floor": "B1", "x": 1558, "y": 1542 },
  "b1c_road5": { "floor": "B1", "x": 1832, "y": 1603 },
  "b1c_road6": { "floor": "B1", "x": 1673, "y": 1735 },
  "b1c_stair1": { "floor": "B1", "x": 1766, "y": 1324 },
  "b1c_stair2": { "floor": "B1", "x": 1534, "y": 1393 },
  "b1c_stair3": { "floor": "B1", "x": 1490, "y": 1550 },
  "b1c_elevator": { "floor": "B1", "x": 1482, "y": 1376 },
  "b1c_exit": { "floor": "B1", "x": 1812, "y": 1736 },

  "b1d_road1": { "floor": "B1", "x": 964, "y": 1737 },
  "b1d_road2": { "floor": "B1", "x": 964, "y": 1889 },
  "b1d_road3": { "floor": "B1", "x": 1335, "y": 1878 },
  "b1d_road4": { "floor": "B1", "x": 1662, "y": 1872 },
  "b1d_road5": { "floor": "B1", "x": 1983, "y": 1872 },
  "b1d_road6": { "floor": "B1", "x": 2107, "y": 1872 },
  "b1d_road7": { "floor": "B1", "x": 1409, "y": 1750 },
  "b1d_road8": { "floor": "B1", "x": 1242, "y": 1930 },
  "b1d_road9": { "floor": "B1", "x": 1242, "y": 1974 },
  "b1d_road10": { "floor": "B1", "x": 1413, "y": 1974 },
  "b1d_exit1": { "floor": "B1", "x": 890, "y": 1737 },
  "b1d_exit2": { "floor": "B1", "x": 1242, "y": 2026 },
  "b1d_exit3": { "floor": "B1", "x": 1500, "y": 1750 },
  "b1d_exit4": { "floor": "B1", "x": 1756, "y": 2024 },
  "b1d_exit5": { "floor": "B1", "x": 2261, "y": 1775 },
  "b1d_stair1": { "floor": "B1", "x": 1338, "y": 1717 },
  "b1d_stair2": { "floor": "B1", "x": 927, "y": 1915 },
  "b1d_stair3": { "floor": "B1", "x": 1081, "y": 1946 },
  "b1d_stair4": { "floor": "B1", "x": 1394, "y": 1938 },
  "b1d_stair5": { "floor": "B1", "x": 1783, "y": 1942 },
  "b1d_stair6": { "floor": "B1", "x": 2082, "y": 1826 },
  "b1d_escalator1": { "floor": "B1", "x": 927, "y": 1881 },
  "b1d_escalator2": { "floor": "B1", "x": 1081, "y": 1935 },
  "b1d_escalator3": { "floor": "B1", "x": 1394, "y": 1927 },
  "b1d_escalator4": { "floor": "B1", "x": 1783, "y": 1927 },
  "b1d_escalator5": { "floor": "B1", "x": 2080, "y": 1842 },
  "b1d_elevator1": { "floor": "B1", "x": 920, "y": 1836 },
  "b1d_elevator2": { "floor": "B1", "x": 1180, "y": 1915 },
  "b1d_elevator3": { "floor": "B1", "x": 1422, "y": 1771 },
  "b1d_elevator4": { "floor": "B1", "x": 1983, "y": 1903 },

  "b2_road1": { "floor": "B2", "x": 1184, "y": 1830 },
  "b2_road2": { "floor": "B2", "x": 1235, "y": 1830 },
  "b2_road3": { "floor": "B2", "x": 1268, "y": 1896 },
  "b2_road4": { "floor": "B2", "x": 1235, "y": 1944 },
  "b2_road5": { "floor": "B2", "x": 1867, "y": 1868 },
  "b2_stair1": { "floor": "B2", "x": 1182, "y": 1949 },
  "b2_stair2": { "floor": "B2", "x": 1337, "y": 1942 },
  "b2_stair3": { "floor": "B2", "x": 1818, "y": 1942 },
  "b2_stair4": { "floor": "B2", "x": 1995, "y": 1826 },
  "b2_escalator1": { "floor": "B2", "x": 1182, "y": 1937 },
  "b2_escalator2": { "floor": "B2", "x": 1337, "y": 1930 },
  "b2_escalator3": { "floor": "B2", "x": 1818, "y": 1930 },
  "b2_escalator4": { "floor": "B2", "x": 1995, "y": 1843 },
  "b2_elevator1": { "floor": "B2", "x": 1674, "y": 1564 },
  "b2_elevator2": { "floor": "B2", "x": 1180, "y": 1915 },
  "b2_elevator3": { "floor": "B2", "x": 1577, "y": 1895 },
  "b2_elevator4": { "floor": "B2", "x": 1983, "y": 1903 },

  "b2_bl_entrance1": { "floor": "B2", "x": 1258, "y": 1835 },
  "b2_bl_entrance2": { "floor": "B2", "x": 1312, "y": 1864 },
  "b2_bl_entrance3": { "floor": "B2", "x": 1848, "y": 1864 },
  "b2_bl_entrance4": { "floor": "B2", "x": 1867, "y": 1852 },
  "b2_bl_road1": { "floor": "B2", "x": 1645, "y": 1687 },
  "b2_bl_road2": { "floor": "B2", "x": 1719, "y": 1693 },
  "b2_bl_road3": { "floor": "B2", "x": 1428, "y": 1842 },
  "b2_bl_road4": { "floor": "B2", "x": 1577, "y": 1842 },
  "b2_bl_road5": { "floor": "B2", "x": 1722, "y": 1842 },
  "b2_bl_stair1": { "floor": "B2", "x": 1641, "y": 1631 },
  "b2_bl_stair2": { "floor": "B2", "x": 1676, "y": 1754 },
  "b2_bl_stair3": { "floor": "B2", "x": 1399, "y": 1881 },
  "b2_bl_stair4": { "floor": "B2", "x": 1537, "y": 1881 },
  "b2_bl_stair5": { "floor": "B2", "x": 1617, "y": 1881 },
  "b2_bl_stair6": { "floor": "B2", "x": 1757, "y": 1881 },
  "b2_bl_escalator1": { "floor": "B2", "x": 1643, "y": 1629 },
  "b2_bl_escalator2": { "floor": "B2", "x": 1694, "y": 1639 },
  "b2_bl_escalator3": { "floor": "B2", "x": 1658, "y": 1749 },
  "b2_bl_escalator4": { "floor": "B2", "x": 1399, "y": 1896 },
  "b2_bl_escalator5": { "floor": "B2", "x": 1537, "y": 1896 },
  "b2_bl_escalator6": { "floor": "B2", "x": 1617, "y": 1896 },
  "b2_bl_escalator7": { "floor": "B2", "x": 1757, "y": 1896 },
  "b2_bl_info1": { "floor": "B2", "x": 1298, "y": 1854 },
  "b2_bl_info2": { "floor": "B2", "x": 1886, "y": 1854 },

  "b3_bl_road1": { "floor": "B3", "x": 1257, "y": 1856 },
  "b3_bl_road2": { "floor": "B3", "x": 1389, "y": 1856 },
  "b3_bl_road3": { "floor": "B3", "x": 1521, "y": 1856 },
  "b3_bl_road4": { "floor": "B3", "x": 1653, "y": 1856 },
  "b3_bl_road5": { "floor": "B3", "x": 1785, "y": 1856 },
  "b3_bl_road6": { "floor": "B3", "x": 1917, "y": 1856 },
  "b3_bl_road7": { "floor": "B3", "x": 1257, "y": 1917 },
  "b3_bl_road8": { "floor": "B3", "x": 1389, "y": 1917 },
  "b3_bl_road9": { "floor": "B3", "x": 1521, "y": 1917 },
  "b3_bl_road10": { "floor": "B3", "x": 1653, "y": 1917 },
  "b3_bl_road11": { "floor": "B3", "x": 1785, "y": 1917 },
  "b3_bl_road12": { "floor": "B3", "x": 1917, "y": 1917 },
  "b3_bl_stair1": { "floor": "B3", "x": 1314, "y": 1881 },
  "b3_bl_stair2": { "floor": "B3", "x": 1460, "y": 1881 },
  "b3_bl_stair3": { "floor": "B3", "x": 1695, "y": 1881 },
  "b3_bl_stair4": { "floor": "B3", "x": 1848, "y": 1881 },
  "b3_bl_escalator1": { "floor": "B3", "x": 1314, "y": 1896 },
  "b3_bl_escalator2": { "floor": "B3", "x": 1460, "y": 1896 },
  "b3_bl_escalator3": { "floor": "B3", "x": 1695, "y": 1896 },
  "b3_bl_escalator4": { "floor": "B3", "x": 1848, "y": 1896 },
  "b3_bl_elevator": { "floor": "B3", "x": 1577, "y": 1895 }
};

const EDGES_INLINE = [
  { "from": "b1b_hsr_gate4", "to": "b1b_s_road3", "type": "flat", "isAccessible": true },
  { "from": "b1b_s_road3", "to": "b1b_hsr_gate4", "type": "flat", "isAccessible": true },
  { "from": "b1b_s_road3", "to": "b1c_rampst", "type": "flat", "isAccessible": true },
  { "from": "b1c_rampst", "to": "b1b_s_road3", "type": "flat", "isAccessible": true },
  { "from": "b1b_s_road3", "to": "b1c_stair1", "type": "flat", "isAccessible": true },
  { "from": "b1c_stair1", "to": "b1b_s_road3", "type": "flat", "isAccessible": true },
  { "from": "b1c_stair1", "to": "b1c_road1", "type": "stair", "isAccessible": false },
  { "from": "b1c_road1", "to": "b1c_stair1", "type": "stair", "isAccessible": false },
  { "from": "b1c_rampst", "to": "b1c_rampw1", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw1", "to": "b1c_rampst", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw1", "to": "b1c_rampw2", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw2", "to": "b1c_rampw1", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw2", "to": "b1c_rampw3", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw3", "to": "b1c_rampw2", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw3", "to": "b1c_rampw4", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw4", "to": "b1c_rampw3", "type": "ramp", "isAccessible": true },
  { "from": "b1c_rampw4", "to": "b1c_ramped", "type": "ramp", "isAccessible": true },
  { "from": "b1c_ramped", "to": "b1c_rampw4", "type": "ramp", "isAccessible": true },
  { "from": "b1c_ramped", "to": "b1c_road1", "type": "flat", "isAccessible": true },
  { "from": "b1c_road1", "to": "b1c_ramped", "type": "flat", "isAccessible": true },
  { "from": "b1c_road1", "to": "b1c_road2", "type": "flat", "isAccessible": true },
  { "from": "b1c_road2", "to": "b1c_road1", "type": "flat", "isAccessible": true },
  { "from": "b1c_road2", "to": "b1c_road4", "type": "flat", "isAccessible": true },
  { "from": "b1c_road4", "to": "b1c_road2", "type": "flat", "isAccessible": true },
  { "from": "b1c_road2", "to": "b1c_road5", "type": "flat", "isAccessible": true },
  { "from": "b1c_road5", "to": "b1c_road2", "type": "flat", "isAccessible": true },
  { "from": "b1c_road2", "to": "b1c_road6", "type": "flat", "isAccessible": true },
  { "from": "b1c_road6", "to": "b1c_road2", "type": "flat", "isAccessible": true },
  { "from": "b1c_road2", "to": "b1d_road4", "type": "flat", "isAccessible": true },
  { "from": "b1d_road4", "to": "b1c_road2", "type": "flat", "isAccessible": true },
  { "from": "b1c_road3", "to": "b1c_elevator", "type": "flat", "isAccessible": true },
  { "from": "b1c_elevator", "to": "b1c_road3", "type": "flat", "isAccessible": true },
  { "from": "b1c_road3", "to": "b1c_stair3", "type": "flat", "isAccessible": true },
  { "from": "b1c_stair3", "to": "b1c_road3", "type": "flat", "isAccessible": true },
  { "from": "b1c_road4", "to": "b1c_road3", "type": "flat", "isAccessible": true },
  { "from": "b1c_road3", "to": "b1c_road4", "type": "flat", "isAccessible": true },
  { "from": "b1c_road4", "to": "b1c_stair2", "type": "flat", "isAccessible": true },
  { "from": "b1c_stair2", "to": "b1c_road4", "type": "flat", "isAccessible": true },
  { "from": "b1c_road5", "to": "b1c_exit", "type": "flat", "isAccessible": true },
  { "from": "b1c_exit", "to": "b1c_road5", "type": "flat", "isAccessible": true },
  { "from": "b1c_road6", "to": "b1d_road1", "type": "flat", "isAccessible": true },
  { "from": "b1d_road1", "to": "b1c_road6", "type": "flat", "isAccessible": true },
  { "from": "b1c_stair3", "to": "b1c_stair2", "type": "flat", "isAccessible": true },
  { "from": "b1c_stair2", "to": "b1c_stair3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road1", "to": "b1d_road2", "type": "flat", "isAccessible": true },
  { "from": "b1d_road2", "to": "b1d_road1", "type": "flat", "isAccessible": true },
  { "from": "b1d_road1", "to": "b1d_exit1", "type": "flat", "isAccessible": true },
  { "from": "b1d_exit1", "to": "b1d_road1", "type": "flat", "isAccessible": true },
  { "from": "b1d_road2", "to": "b1d_road3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road3", "to": "b1d_road2", "type": "flat", "isAccessible": true },
  { "from": "b1d_road2", "to": "b1d_stair2", "type": "flat", "isAccessible": true },
  { "from": "b1d_stair2", "to": "b1d_road2", "type": "flat", "isAccessible": true },
  { "from": "b1d_road2", "to": "b1d_elevator1", "type": "flat", "isAccessible": true },
  { "from": "b1d_elevator1", "to": "b1d_road2", "type": "flat", "isAccessible": true },
  { "from": "b1d_road2", "to": "b1d_elevator2", "type": "flat", "isAccessible": true },
  { "from": "b1d_elevator2", "to": "b1d_road2", "type": "flat", "isAccessible": true },
  { "from": "b1d_road3", "to": "b1d_road7", "type": "flat", "isAccessible": true },
  { "from": "b1d_road7", "to": "b1d_road3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road3", "to": "b1d_road8", "type": "flat", "isAccessible": true },
  { "from": "b1d_road8", "to": "b1d_road3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road3", "to": "b1d_stair1", "type": "flat", "isAccessible": true },
  { "from": "b1d_stair1", "to": "b1d_road3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road3", "to": "b1d_elevator2", "type": "flat", "isAccessible": true },
  { "from": "b1d_elevator2", "to": "b1d_road3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road3", "to": "b1d_elevator3", "type": "flat", "isAccessible": true },
  { "from": "b1d_elevator3", "to": "b1d_road3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road4", "to": "b1d_road3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road3", "to": "b1d_road4", "type": "flat", "isAccessible": true },
  { "from": "b1d_road4", "to": "b1d_road5", "type": "flat", "isAccessible": true },
  { "from": "b1d_road5", "to": "b1d_road4", "type": "flat", "isAccessible": true },
  { "from": "b1d_road4", "to": "b1d_road10", "type": "flat", "isAccessible": true },
  { "from": "b1d_road10", "to": "b1d_road4", "type": "flat", "isAccessible": true },
  { "from": "b1d_road4", "to": "b1d_exit4", "type": "flat", "isAccessible": true },
  { "from": "b1d_exit4", "to": "b1d_road4", "type": "flat", "isAccessible": true },
  { "from": "b1d_road5", "to": "b1d_road6", "type": "flat", "isAccessible": true },
  { "from": "b1d_road6", "to": "b1d_road5", "type": "flat", "isAccessible": true },
  { "from": "b1d_road5", "to": "b1d_elevator4", "type": "flat", "isAccessible": true },
  { "from": "b1d_elevator4", "to": "b1d_road5", "type": "flat", "isAccessible": true },
  { "from": "b1d_road6", "to": "b1d_stair6", "type": "flat", "isAccessible": true },
  { "from": "b1d_stair6", "to": "b1d_road6", "type": "flat", "isAccessible": true },
  { "from": "b1d_road6", "to": "b1d_exit5", "type": "flat", "isAccessible": true },
  { "from": "b1d_exit5", "to": "b1d_road6", "type": "flat", "isAccessible": true },
  { "from": "b1d_road7", "to": "b1d_exit3", "type": "flat", "isAccessible": true },
  { "from": "b1d_exit3", "to": "b1d_road7", "type": "flat", "isAccessible": true },
  { "from": "b1d_road8", "to": "b1d_road9", "type": "flat", "isAccessible": true },
  { "from": "b1d_road9", "to": "b1d_road8", "type": "flat", "isAccessible": true },
  { "from": "b1d_road9", "to": "b1d_road10", "type": "flat", "isAccessible": true },
  { "from": "b1d_road10", "to": "b1d_road9", "type": "flat", "isAccessible": true },
  { "from": "b1d_road9", "to": "b1d_exit2", "type": "flat", "isAccessible": true },
  { "from": "b1d_exit2", "to": "b1d_road9", "type": "flat", "isAccessible": true },
  { "from": "b1d_road10", "to": "b1d_stair4", "type": "flat", "isAccessible": true },
  { "from": "b1d_stair4", "to": "b1d_road10", "type": "flat", "isAccessible": true },
  { "from": "b1d_escalator1", "to": "b1d_road2", "type": "flat", "isAccessible": true },
  { "from": "b1d_escalator2", "to": "b1d_road2", "type": "flat", "isAccessible": true },
  { "from": "b1d_escalator3", "to": "b1d_road4", "type": "flat", "isAccessible": true },
  { "from": "b1d_escalator3", "to": "b1d_road10", "type": "flat", "isAccessible": true },
  { "from": "b1d_escalator4", "to": "b1d_road4", "type": "flat", "isAccessible": true },
  { "from": "b1d_escalator5", "to": "b1d_road6", "type": "flat", "isAccessible": true },
  { "from": "b2_road1", "to": "b2_road2", "type": "flat", "isAccessible": true },
  { "from": "b2_road2", "to": "b2_road1", "type": "flat", "isAccessible": true },
  { "from": "b2_road1", "to": "b2_elevator2", "type": "flat", "isAccessible": true },
  { "from": "b2_elevator2", "to": "b2_road1", "type": "flat", "isAccessible": true },
  { "from": "b2_road2", "to": "b2_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_road3", "to": "b2_road2", "type": "flat", "isAccessible": true },
  { "from": "b2_road2", "to": "b2_bl_entrance1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance1", "to": "b2_road2", "type": "flat", "isAccessible": true },
  { "from": "b2_road3", "to": "b2_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_road4", "to": "b2_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_road3", "to": "b2_stair2", "type": "flat", "isAccessible": true },
  { "from": "b2_stair2", "to": "b2_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_road3", "to": "b2_escalator2", "type": "flat", "isAccessible": true },
  { "from": "b2_road3", "to": "b2_bl_entrance2", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance2", "to": "b2_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_stair1", "to": "b2_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_road4", "to": "b2_stair1", "type": "flat", "isAccessible": true },
  { "from": "b2_stair1", "to": "b2_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_road4", "to": "b2_escalator1", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_stair3", "type": "flat", "isAccessible": true },
  { "from": "b2_stair3", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_stair4", "type": "flat", "isAccessible": true },
  { "from": "b2_stair4", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_elevator4", "type": "flat", "isAccessible": true },
  { "from": "b2_elevator4", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_bl_entrance3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance3", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_bl_entrance4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance4", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road1", "to": "b2_bl_road2", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road2", "to": "b2_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road1", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road1", "to": "b2_bl_stair1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_stair1", "to": "b2_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road1", "to": "b2_elevator1", "type": "flat", "isAccessible": true },
  { "from": "b2_elevator1", "to": "b2_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road1", "to": "b2_bl_escalator2", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road2", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road5", "to": "b2_bl_road2", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road2", "to": "b2_bl_escalator2", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road3", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road3", "to": "b2_bl_stair3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_stair3", "to": "b2_bl_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road3", "to": "b2_bl_escalator4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_escalator4", "to": "b2_bl_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road3", "to": "b2_bl_entrance1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance1", "to": "b2_bl_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road3", "to": "b2_bl_entrance2", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance2", "to": "b2_bl_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road5", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_stair3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_stair3", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_stair4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_stair4", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_stair5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_stair5", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_escalator5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_escalator5", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_bl_escalator6", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_escalator6", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road4", "to": "b2_elevator3", "type": "flat", "isAccessible": true },
  { "from": "b2_elevator3", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road5", "to": "b2_bl_stair2", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_stair2", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road5", "to": "b2_bl_stair6", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_stair6", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road5", "to": "b2_bl_escalator7", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_escalator7", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road5", "to": "b2_bl_entrance3", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance3", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_road5", "to": "b2_bl_entrance4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_entrance4", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_escalator1", "to": "b2_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_escalator3", "to": "b2_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_bl_escalator3", "to": "b2_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road1", "to": "b3_bl_road2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road2", "to": "b3_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road1", "to": "b3_bl_stair1", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair1", "to": "b3_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road1", "to": "b3_bl_escalator1", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator1", "to": "b3_bl_road1", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road2", "to": "b3_bl_road3", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road3", "to": "b3_bl_road2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road2", "to": "b3_bl_stair2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair2", "to": "b3_bl_road2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road2", "to": "b3_bl_escalator2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator2", "to": "b3_bl_road2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road3", "to": "b3_bl_elevator", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_elevator", "to": "b3_bl_road3", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road4", "to": "b3_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road5", "to": "b3_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road4", "to": "b3_bl_elevator", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_elevator", "to": "b3_bl_road4", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road5", "to": "b3_bl_road6", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road6", "to": "b3_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road5", "to": "b3_bl_stair3", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair3", "to": "b3_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road5", "to": "b3_bl_escalator3", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator3", "to": "b3_bl_road5", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road6", "to": "b3_bl_stair4", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair4", "to": "b3_bl_road6", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road6", "to": "b3_bl_escalator4", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator4", "to": "b3_bl_road6", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road7", "to": "b3_bl_road8", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road8", "to": "b3_bl_road7", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road7", "to": "b3_bl_stair1", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair1", "to": "b3_bl_road7", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road7", "to": "b3_bl_escalator1", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator1", "to": "b3_bl_road7", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road8", "to": "b3_bl_road9", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road9", "to": "b3_bl_road8", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road8", "to": "b3_bl_stair2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair2", "to": "b3_bl_road8", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road8", "to": "b3_bl_escalator2", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator2", "to": "b3_bl_road8", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road9", "to": "b3_bl_elevator", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_elevator", "to": "b3_bl_road9", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road10", "to": "b3_bl_road11", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road11", "to": "b3_bl_road10", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road10", "to": "b3_bl_elevator", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_elevator", "to": "b3_bl_road10", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road11", "to": "b3_bl_road12", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road12", "to": "b3_bl_road11", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road11", "to": "b3_bl_stair3", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair3", "to": "b3_bl_road11", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road11", "to": "b3_bl_escalator3", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator3", "to": "b3_bl_road11", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road12", "to": "b3_bl_stair4", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_stair4", "to": "b3_bl_road12", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_road12", "to": "b3_bl_escalator4", "type": "flat", "isAccessible": true },
  { "from": "b3_bl_escalator4", "to": "b3_bl_road12", "type": "flat", "isAccessible": true },
  { "from": "b1d_stair3", "to": "b2_stair1", "type": "stair", "isAccessible": false },
  { "from": "b2_stair1", "to": "b1d_stair3", "type": "stair", "isAccessible": false },
  { "from": "b1d_stair4", "to": "b2_stair2", "type": "stair", "isAccessible": false },
  { "from": "b2_stair2", "to": "b1d_stair4", "type": "stair", "isAccessible": false },
  { "from": "b1d_stair5", "to": "b2_stair3", "type": "stair", "isAccessible": false },
  { "from": "b2_stair3", "to": "b1d_stair5", "type": "stair", "isAccessible": false },
  { "from": "b1d_stair6", "to": "b2_stair4", "type": "stair", "isAccessible": false },
  { "from": "b2_stair4", "to": "b1d_stair6", "type": "stair", "isAccessible": false },
  { "from": "b2_escalator1", "to": "b1d_escalator2", "type": "escalator", "isAccessible": false },
  { "from": "b2_escalator2", "to": "b1d_escalator3", "type": "escalator", "isAccessible": false },
  { "from": "b2_escalator3", "to": "b1d_escalator4", "type": "escalator", "isAccessible": false },
  { "from": "b2_escalator4", "to": "b1d_escalator5", "type": "escalator", "isAccessible": false },
  { "from": "b1d_elevator2", "to": "b2_elevator2", "type": "elevator", "isAccessible": true },
  { "from": "b2_elevator2", "to": "b1d_elevator2", "type": "elevator", "isAccessible": true },
  { "from": "b1d_elevator4", "to": "b2_elevator4", "type": "elevator", "isAccessible": true },
  { "from": "b2_elevator4", "to": "b1d_elevator4", "type": "elevator", "isAccessible": true },
  { "from": "b2_bl_stair3", "to": "b3_bl_stair1", "type": "stair", "isAccessible": false },
  { "from": "b3_bl_stair1", "to": "b2_bl_stair3", "type": "stair", "isAccessible": false },
  { "from": "b2_bl_stair4", "to": "b3_bl_stair2", "type": "stair", "isAccessible": false },
  { "from": "b3_bl_stair2", "to": "b2_bl_stair4", "type": "stair", "isAccessible": false },
  { "from": "b2_bl_stair5", "to": "b3_bl_stair3", "type": "stair", "isAccessible": false },
  { "from": "b3_bl_stair3", "to": "b2_bl_stair5", "type": "stair", "isAccessible": false },
  { "from": "b2_bl_stair6", "to": "b3_bl_stair4", "type": "stair", "isAccessible": false },
  { "from": "b3_bl_stair4", "to": "b2_bl_stair6", "type": "stair", "isAccessible": false },
  { "from": "b2_bl_escalator4", "to": "b3_bl_escalator1", "type": "escalator", "isAccessible": false },
  { "from": "b3_bl_escalator1", "to": "b2_bl_escalator4", "type": "escalator", "isAccessible": false },
  { "from": "b2_bl_escalator5", "to": "b3_bl_escalator2", "type": "escalator", "isAccessible": false },
  { "from": "b3_bl_escalator2", "to": "b2_bl_escalator5", "type": "escalator", "isAccessible": false },
  { "from": "b2_bl_escalator6", "to": "b3_bl_escalator3", "type": "escalator", "isAccessible": false },
  { "from": "b3_bl_escalator3", "to": "b2_bl_escalator6", "type": "escalator", "isAccessible": false },
  { "from": "b2_bl_escalator7", "to": "b3_bl_escalator4", "type": "escalator", "isAccessible": false },
  { "from": "b3_bl_escalator4", "to": "b2_bl_escalator7", "type": "escalator", "isAccessible": false },
  { "from": "b2_elevator3", "to": "b3_bl_elevator", "type": "elevator", "isAccessible": true },
  { "from": "b3_bl_elevator", "to": "b2_elevator3", "type": "elevator", "isAccessible": true },
  { "from": "b1d_road2", "to": "b1d_escalator1", "type": "flat", "isAccessible": true },
  { "from": "b1d_road2", "to": "b1d_escalator2", "type": "flat", "isAccessible": true },
  { "from": "b1d_road4", "to": "b1d_escalator3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road10", "to": "b1d_escalator3", "type": "flat", "isAccessible": true },
  { "from": "b1d_road4", "to": "b1d_escalator4", "type": "flat", "isAccessible": true },
  { "from": "b1d_road6", "to": "b1d_escalator5", "type": "flat", "isAccessible": true },
  { "from": "b1d_escalator2", "to": "b2_escalator1", "type": "escalator", "isAccessible": false },
  { "from": "b1d_escalator3", "to": "b2_escalator2", "type": "escalator", "isAccessible": false },
  { "from": "b1d_escalator4", "to": "b2_escalator3", "type": "escalator", "isAccessible": false },
  { "from": "b1d_escalator5", "to": "b2_escalator4", "type": "escalator", "isAccessible": false },
  { "from": "b2_escalator1", "to": "b2_road4", "type": "flat", "isAccessible": true },
  { "from": "b2_escalator2", "to": "b2_road3", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_escalator3", "type": "flat", "isAccessible": true },
  { "from": "b2_escalator3", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_escalator4", "type": "flat", "isAccessible": true },
  { "from": "b2_escalator4", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_road4", "to": "b2_road5", "type": "flat", "isAccessible": true },
  { "from": "b2_road5", "to": "b2_road4", "type": "flat", "isAccessible": true },
];

// ── 全域狀態 ──────────────────────────────────────────────
let nodesData   = {};
let edgesData   = [];
let graphLoaded = false;

let currentFloor    = 'B1';
let currentMode     = '';
let currentSubMode  = '';
let isNavigating    = false;
let animFrameId     = null;

const MAP_SCALE = 200 / 2560;   // 像素 → 公尺換算

// ── 捷運板南線車站清單 ────────────────────────────────────
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
        dirText:   toNangang ? "往 南港展覽館" : "往 頂埔"
    };
});

// ── 可選起點節點清單 ──────────────────────────────────────
const ORIGIN_OPTIONS = [
    { id: "b1b_hsr_gate4",    label: "高鐵B1入口",      zone: "B1" },
    { id: "b1d_exit1",        label: "M5 出口",         zone: "B1" },
    { id: "b1d_exit2",        label: "M6 出口",         zone: "B1" },
    { id: "b1d_exit3",        label: "M4 出口",         zone: "B1" },
    { id: "b1d_exit4",        label: "M8 出口",         zone: "B1" },
    { id: "b1d_exit5",        label: "M7 出口",         zone: "B1" },
    { id: "b1c_exit",         label: "M3 出口",         zone: "B1" },
    { id: "b1c_elevator",     label: "K1 出口（電梯）", zone: "B1" },
    { id: "b1d_stair1",       label: "K區地下街（樓梯）", zone: "B1" },
    { id: "b1d_stair2",       label: "Z區地下街（樓梯）", zone: "B1" },
    { id: "b1d_elevator1",    label: "Z區地下街（電梯）", zone: "B1" },
    { id: "b1d_elevator3",    label: "M4 出口（電梯）", zone: "B1" },
    { id: "b2_elevator1",     label: "淡水信義線（電梯）", zone: "B2" },
    { id: "b2_bl_stair1",     label: "淡水信義線（樓梯 1）", zone: "B2" },
    { id: "b2_bl_stair2",     label: "淡水信義線（樓梯 2）", zone: "B2" },
    { id: "b2_bl_escalator2", label: "淡水信義線（手扶梯）", zone: "B2" },
];

// 目前選定的起點 node ID（預設第一個）
let selectedOriginId = ORIGIN_OPTIONS[0].id;

// ── 可選終點節點清單 ──────────────────────────────────────
const DEST_OPTIONS = [
    // 板南線月台方向（動態決定 goal node，依樓層不同）
    { id: "__nangang__", label: "往南港展覽館方向月台", zone: "BL", isDynamic: true },
    { id: "__dingpu__",  label: "往頂埔方向月台",       zone: "BL", isDynamic: true },
    // 固定出口節點
    { id: "b1b_hsr_gate4",    label: "高鐵B1入口",      zone: "B1" },
    { id: "b1d_exit1",        label: "M5 出口",              zone: "B1" },
    { id: "b1d_exit2",        label: "M6 出口",              zone: "B1" },
    { id: "b1d_exit3",        label: "M4 出口",              zone: "B1" },
    { id: "b1d_exit4",        label: "M8 出口",              zone: "B1" },
    { id: "b1d_exit5",        label: "M7 出口",              zone: "B1" },
    { id: "b1c_exit",         label: "M3 出口",              zone: "B1" },
    { id: "b1c_elevator",     label: "K1 出口（電梯）",      zone: "B1" },
    { id: "b1d_stair1",       label: "K區地下街（樓梯）",    zone: "B1" },
    { id: "b1d_stair2",       label: "Z區地下街（樓梯）",    zone: "B1" },
    { id: "b1d_elevator1",    label: "Z區地下街（電梯）",    zone: "B1" },
    { id: "b1d_elevator3",    label: "M4 出口（電梯）",      zone: "B1" },
    { id: "b2_elevator1",     label: "淡水信義線（電梯）",   zone: "B2" },
    { id: "b2_bl_stair1",     label: "淡水信義線（樓梯 1）", zone: "B2" },
    { id: "b2_bl_stair2",     label: "淡水信義線（樓梯 2）", zone: "B2" },
    { id: "b2_bl_escalator2", label: "淡水信義線（手扶梯）", zone: "B2" },
];

// 目前選定的終點 ID（預設往南港展覽館）
let selectedDestId = "__nangang__";

// 板南線月台動態終點節點（依樓層）
const PLATFORM_GOAL = {
    __nangang__: { B1: "b1d_elevator4", B2: "b2_elevator3", B3: "b3_bl_road12" },
    __dingpu__:  { B1: "b1d_elevator2", B2: "b2_elevator3", B3: "b3_bl_road1"  }
};

// 已計算的完整跨樓層路徑快取（重新開始導航時更新）
let cachedFullPath = null;

// ── 初始化圖形資料（直接讀取內嵌常數，不需 fetch） ────────
function loadGraphData() {
    nodesData   = NODES_INLINE;
    edgesData   = EDGES_INLINE;
    graphLoaded = true;
    console.log(`圖形資料初始化完成：${Object.keys(nodesData).length} 節點、${edgesData.length} 邊`);

    // 預填起點顯示
    const originInput = document.getElementById('origin-input');
    if (originInput && ORIGIN_OPTIONS.length > 0) {
        originInput.value = ORIGIN_OPTIONS[0].label;
        selectedOriginId  = ORIGIN_OPTIONS[0].id;
    }
    // 預填終點顯示
    const destInput = document.getElementById('dest-input');
    if (destInput && DEST_OPTIONS.length > 0) {
        destInput.value = DEST_OPTIONS[0].label;
        selectedDestId  = DEST_OPTIONS[0].id;
    }
}

// ── Dijkstra 最短路徑 ──────────────────────────────────────
/**
 * @param {string} startId   起始節點 ID
 * @param {string} goalId    終點節點 ID
 * @param {Function} edgeFilter  (edge) => boolean，用來過濾允許的邊
 * @returns {string[]|null}  節點 ID 陣列（含起終點），找不到則回傳 null
 *
 * 注意：EDGES_INLINE 中已有雙向邊（每條路徑均有 from→to 和 to→from 兩筆），
 * 此處直接按有向邊建圖，不再額外反向，確保樓梯/手扶梯方向正確。
 */
function dijkstra(startId, goalId, edgeFilter, weightFn) {
    weightFn = weightFn || ((edge, w) => w);

    // 建立有向鄰接表
    const adj = {};
    for (const id in nodesData) adj[id] = [];

    for (const edge of edgesData) {
        if (!edgeFilter(edge)) continue;
        const { from, to } = edge;
        if (!nodesData[from] || !nodesData[to]) continue;

        const dx = nodesData[to].x - nodesData[from].x;
        const dy = nodesData[to].y - nodesData[from].y;
        const baseW = Math.sqrt(dx * dx + dy * dy) + 1; // +1 避免零距離邊
        const w  = weightFn(edge, baseW);

        adj[from].push({ id: to, w });
        // 注意：不再反向加邊，因為 EDGES_INLINE 已含雙向資料
    }

    const dist    = {};
    const prev    = {};
    const visited = new Set();

    for (const id in nodesData) { dist[id] = Infinity; prev[id] = null; }
    dist[startId] = 0;

    const pq = [{ id: startId, d: 0 }];

    while (pq.length > 0) {
        pq.sort((a, b) => a.d - b.d);
        const { id: u } = pq.shift();
        if (visited.has(u)) continue;
        visited.add(u);
        if (u === goalId) break;

        for (const { id: v, w } of (adj[u] || [])) {
            if (visited.has(v)) continue;
            const nd = dist[u] + w;
            if (nd < dist[v]) {
                dist[v] = nd;
                prev[v] = u;
                pq.push({ id: v, d: nd });
            }
        }
    }

    if (dist[goalId] === Infinity) return null;

    // 回溯路徑
    const path = [];
    let cur = goalId;
    while (cur !== null) { path.unshift(cur); cur = prev[cur]; }
    return path;
}

// ── 根據模式建立 edgeFilter ────────────────────────────────
function buildEdgeFilter(mode, subMode) {
    if (mode === 'accessible') {
        return (e) => e.isAccessible === true;
    }
    switch (subMode) {
        case 'stairs':    return (e) => ['flat', 'ramp', 'stair'].includes(e.type);
        case 'escalator': return (e) => ['flat', 'ramp', 'escalator'].includes(e.type);
        case 'elevator':  return (e) => ['flat', 'ramp', 'elevator'].includes(e.type);
        case 'best':
        default:          return (_e) => true;
    }
}

// ── 一般路線權重調整：盡量避免無障礙坡道，除非沒有其他路可走 ──
const RAMP_PENALTY = 50; // 倍數，數值越大越不傾向使用坡道
function buildEdgeWeight(mode) {
    if (mode === 'accessible') return (_e, w) => w;
    return (edge, w) => (edge.type === 'ramp' ? w * RAMP_PENALTY : w);
}

// ── 解析終點 goalId ────────────────────────────────────────
// 對於動態月台選項（__nangang__ / __dingpu__），依目標樓層取對應節點
// 對於固定節點選項，直接回傳節點 ID
function resolveGoalId(destId, targetFloor) {
    if (PLATFORM_GOAL[destId]) {
        return PLATFORM_GOAL[destId][targetFloor] || null;
    }
    return destId || null;
}

// ── 取得終點所在樓層 ──────────────────────────────────────
function resolveDestFloor(destId) {
    if (PLATFORM_GOAL[destId]) return 'B1'; // 動態月台最終終點在 B3，但路徑從 B1 開始
    const node = nodesData[destId];
    return node ? node.floor : 'B1';
}

// ── 取得本次導航的起點與終點（跨樓層完整路徑）────────────
function resolveFullGoalId(destId) {
    // 動態月台：找最深樓層的終點（路徑會跨越所有樓層）
    if (PLATFORM_GOAL[destId]) {
        // 先試 B3，再 B2，再 B1（找最深可達的）
        for (const fl of ['B3', 'B2', 'B1']) {
            const gid = PLATFORM_GOAL[destId][fl];
            if (gid && nodesData[gid]) return gid;
        }
    }
    return destId;
}

// ── 計算路線統計 ───────────────────────────────────────────
function calcRouteStats(nodeIds) {
    let totalPx = 0;
    for (let i = 1; i < nodeIds.length; i++) {
        const a = nodesData[nodeIds[i - 1]];
        const b = nodesData[nodeIds[i]];
        if (!a || !b) continue;
        totalPx += Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
    const meters  = Math.round(totalPx * MAP_SCALE);
    const seconds = Math.round(meters / 1.2);
    const mins    = Math.floor(seconds / 60);
    const secs    = seconds % 60;
    return { meters, timeStr: mins > 0 ? `${mins} 分 ${secs} 秒` : `${secs} 秒` };
}

// ── 畫出起點/終點標記 ──────────────────────────────────────
function drawMarkers(startNode, endNode) {
    const svg = document.getElementById('svg-layer');
    svg.querySelectorAll('.route-marker').forEach(el => el.remove());

    function makeMarker(node, color, label) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'route-marker');

        const outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outer.setAttribute('cx', node.x); outer.setAttribute('cy', node.y);
        outer.setAttribute('r', 32); outer.setAttribute('fill', color); outer.setAttribute('opacity', '0.25');

        const mid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        mid.setAttribute('cx', node.x); mid.setAttribute('cy', node.y);
        mid.setAttribute('r', 22); mid.setAttribute('fill', 'none');
        mid.setAttribute('stroke', color); mid.setAttribute('stroke-width', '3'); mid.setAttribute('opacity', '0.6');

        const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        inner.setAttribute('cx', node.x); inner.setAttribute('cy', node.y);
        inner.setAttribute('r', 14); inner.setAttribute('fill', color);
        inner.setAttribute('stroke', '#ffffff'); inner.setAttribute('stroke-width', '3');

        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', node.x); txt.setAttribute('y', node.y - 40);
        txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('fill', color);
        txt.setAttribute('font-size', '22'); txt.setAttribute('font-weight', 'bold');
        txt.setAttribute('letter-spacing', '1');
        txt.textContent = label;

        g.append(outer, mid, inner, txt);
        return g;
    }

    svg.append(
        makeMarker(startNode, '#2ecc71', '起點'),
        makeMarker(endNode,   '#ff3f34', '終點')
    );
}

// ── 路線動畫 ───────────────────────────────────────────────
function animateRoute(pathElement, color, onComplete) {
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }

    const totalLength = pathElement.getTotalLength();
    pathElement.style.transition     = 'none';
    pathElement.style.strokeDasharray  = `${totalLength}`;
    pathElement.style.strokeDashoffset = `${totalLength}`;
    pathElement.style.stroke  = color;
    pathElement.style.opacity = '1';

    pathElement.getBoundingClientRect();
    pathElement.style.transition      = 'stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)';
    pathElement.style.strokeDashoffset = '0';

    setTimeout(() => {
        startFlowAnimation(pathElement, color);
        if (onComplete) onComplete();
    }, 1700);
}

function startFlowAnimation(pathElement, color) {
    const dashLen = 80, gapLen = 60, pattern = dashLen + gapLen;
    let offset = 0;
    pathElement.style.transition     = 'none';
    pathElement.style.strokeDasharray = `${dashLen} ${gapLen}`;
    pathElement.style.stroke          = color;

    function step() {
        offset = (offset + 3) % pattern;
        pathElement.style.strokeDashoffset = -offset;
        animFrameId = requestAnimationFrame(step);
    }
    animFrameId = requestAnimationFrame(step);
}

// ── 主導航邏輯 ────────────────────────────────────────────
/**
 * startNav 分兩個情況：
 * 1. 第一次開始（cachedFullPath 為 null）→ 計算完整路徑並快取
 * 2. 換樓層後重繪（cachedFullPath 已存在）→ 直接從快取切片顯示
 *
 * 這樣可以確保：換樓層後起點不會跳回原始入口，
 * 而是正確顯示該樓層的路段。
 */
function startNav(recompute = true) {
    if (!selectedDestId) { alert("⚠️ 請先選擇終點！"); return; }
    if (!currentMode)    { alert("⚠️ 請先選擇導航模式（無障礙或一般路線）！"); return; }
    if (currentMode === 'general' && !currentSubMode) {
        alert("⚠️ 請先選擇一般路線的方式（樓梯／扶梯／電梯／最佳）！"); return;
    }
    if (!graphLoaded) { alert("⚠️ 地圖資料尚未載入完成，請稍候再試。"); return; }

    isNavigating = true;
    document.getElementById('reset-nav-btn').style.display = 'block';

    const isAccessible = currentMode === 'accessible';
    const color        = isAccessible ? '#2ecc71' : '#f39c12';

    // ── 1. 計算或取得完整路徑快取 ──
    if (recompute || !cachedFullPath) {
        const edgeFilter = buildEdgeFilter(currentMode, currentSubMode);
        const edgeWeight = buildEdgeWeight(currentMode);
        const startId    = selectedOriginId;
        const goalId     = resolveFullGoalId(selectedDestId);

        if (!startId || !nodesData[startId]) {
            alert(`⚠️ 起點節點 "${startId}" 不存在，請重新選擇起點。`); return;
        }
        if (!goalId || !nodesData[goalId]) {
            alert(`⚠️ 終點節點 "${goalId}" 不存在，請重新選擇終點。`); return;
        }

        const pathIds = dijkstra(startId, goalId, edgeFilter, edgeWeight);
        if (!pathIds) {
            alert(`⚠️ 找不到可行路線！\n可能原因：起終點不連通，或所選模式下無可通行的邊。`);
            return;
        }
        cachedFullPath = pathIds;
    }

    // ── 2. 從快取路徑切出當前樓層的連續片段 ──
    // 找出 cachedFullPath 中屬於 currentFloor 且連續的最長片段
    const floorPathIds = getFloorSegment(cachedFullPath, currentFloor);

    if (floorPathIds.length < 2) {
        const nextFloorContainer = document.getElementById('next-floor-container');
        nextFloorContainer.style.display = 'block';

        // 計算下一個有路段的樓層
        const allFloors = [...new Set(cachedFullPath.map(id => nodesData[id]?.floor).filter(Boolean))];
        const floorIndex = allFloors.indexOf(currentFloor);
        const nextFloor  = allFloors[floorIndex + 1] || null;

        let msg = `<div class="route-stats">此樓層無需移動。`;
        if (nextFloor) msg += ` 請切換至 <strong>${nextFloor}</strong> 繼續。`;
        msg += `</div>`;
        nextFloorContainer.innerHTML = msg;
        return;
    }

    // ── 3. 畫路線 ──
    const pathElement = document.getElementById('route-path');
    let d = `M ${nodesData[floorPathIds[0]].x} ${nodesData[floorPathIds[0]].y}`;
    for (let i = 1; i < floorPathIds.length; i++) {
        d += ` L ${nodesData[floorPathIds[i]].x} ${nodesData[floorPathIds[i]].y}`;
    }
    pathElement.setAttribute('d', d);

    drawMarkers(nodesData[floorPathIds[0]], nodesData[floorPathIds[floorPathIds.length - 1]]);

    const { meters, timeStr } = calcRouteStats(floorPathIds);

    // ── 4. 動畫與統計資訊 ──
    animateRoute(pathElement, color, () => {
        const nextFloorContainer = document.getElementById('next-floor-container');
        nextFloorContainer.style.display = 'block';

        const allFloors  = [...new Set(cachedFullPath.map(id => nodesData[id]?.floor).filter(Boolean))];
        const floorIndex = allFloors.indexOf(currentFloor);
        const nextFloor  = allFloors[floorIndex + 1] || null;
        const needChange = allFloors.length > 1 && nextFloor;

        let statsHtml = `<div class="route-stats">本段約 ${meters} 公尺 ⏱ 步行約 ${timeStr}</div>`;
        if (needChange) {
            statsHtml += `<div class="route-stats" style="border-color:#f39c12;color:#f39c12;">
                ⬇ 接著請移動至 <strong>${nextFloor}</strong>，切換樓層後路線會自動更新
            </div>`;
        } else {
            statsHtml += `<div class="route-stats" style="border-color:#2ecc71;color:#2ecc71;">
                ✅ 已到達終點所在樓層
            </div>`;
        }
        nextFloorContainer.innerHTML = statsHtml;
    });
}

// ── 從完整路徑中取出指定樓層的連續片段 ───────────────────
// 找出路徑中屬於該樓層的最長連續子陣列（保留原本順序）
function getFloorSegment(fullPath, floor) {
    let best = [], cur = [];
    for (const id of fullPath) {
        if (nodesData[id] && nodesData[id].floor === floor) {
            cur.push(id);
            if (cur.length > best.length) best = [...cur];
        } else {
            cur = [];
        }
    }
    return best;
}

// ── 樓層切換 ──────────────────────────────────────────────
function changeFloor(direction) {
    const floors = ['B1', 'B2', 'B3'];
    const idx    = floors.indexOf(currentFloor);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= floors.length) return;

    currentFloor = floors[newIdx];

    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }

    document.getElementById('current-floor-display').innerText = `${currentFloor} 樓層`;
    document.getElementById('next-floor-container').style.display = 'none';

    const mapImg = document.getElementById('map-img');
    if      (currentFloor === 'B1') mapImg.src = 'taipei_b1.png';
    else if (currentFloor === 'B2') mapImg.src = 'taipei_b2.png';
    else if (currentFloor === 'B3') mapImg.src = 'taipei_b3.png';

    // 清除舊路線
    const pathElement = document.getElementById('route-path');
    pathElement.setAttribute('d', '');
    pathElement.style.strokeDasharray  = '';
    pathElement.style.strokeDashoffset = '';
    document.getElementById('svg-layer').querySelectorAll('.route-marker').forEach(el => el.remove());

    // 若導航中，從快取重繪此樓層路段（不重新計算）
    if (isNavigating && cachedFullPath) {
        if (currentMode === 'general' && !currentSubMode) return;
        setTimeout(() => startNav(false), 100);  // false = 使用快取，不重算
    }

    // 樓層切換後重繪設施標記
    renderFacilityMarkers();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dest-search-wrapper')) {
        const dd = document.getElementById('dest-dropdown');
        if (dd) dd.style.display = 'none';
    }
    if (!e.target.closest('.origin-search-wrapper')) {
        const od = document.getElementById('origin-dropdown');
        if (od) od.style.display = 'none';
    }
});
function renderDestDropdown(list) {
    const dd = document.getElementById('dest-dropdown');
    if (!dd) return;
    if (list.length === 0) {
        dd.innerHTML = '<div class="dd-item dd-empty">找不到符合選項</div>';
    } else {
        dd.innerHTML = list.map(o => {
            let tag = '';
            if (o.zone === 'BL') {
                tag = `<span class="dd-dir nangang">板南線</span>`;
            } else if (o.zone === 'B2') {
                tag = `<span class="dd-dir nangang">B2</span>`;
            } else {
                tag = `<span class="dd-dir dingpu">B1</span>`;
            }
            return `<div class="dd-item" onclick="selectDest('${o.id}')">${o.label} ${tag}</div>`;
        }).join('');
    }
    dd.style.display = 'block';
}

function filterDests(query) {
    const list = query.trim() === ''
        ? DEST_OPTIONS
        : DEST_OPTIONS.filter(o => o.label.includes(query.trim()) || o.id.includes(query.trim()));
    renderDestDropdown(list);
    const exact = DEST_OPTIONS.find(o => o.label === query.trim());
    if (exact) selectDest(exact.id, false);
}

function showDestDropdown() {
    renderDestDropdown(DEST_OPTIONS);
}

function selectDest(id, updateInput = true) {
    selectedDestId  = id;
    cachedFullPath  = null; // 終點改變，清除舊快取
    const opt = DEST_OPTIONS.find(o => o.id === id);
    if (updateInput && opt) {
        document.getElementById('dest-input').value = opt.label;
    }
    document.getElementById('dest-dropdown').style.display = 'none';

    // 更新 badge（只顯示板南線月台方向）
    const badge = document.getElementById('direction-badge');
    if (id === '__nangang__') {
        badge.style.display = 'block';
        badge.className = 'direction-badge nangang';
        badge.innerHTML = `🚇 板南線 <span>往 南港展覽館 ▶</span>`;
    } else if (id === '__dingpu__') {
        badge.style.display = 'block';
        badge.className = 'direction-badge dingpu';
        badge.innerHTML = `🚇 板南線 <span>◀ 往 頂埔</span>`;
    } else {
        badge.style.display = 'none';
    }

    // 若已在導航中則重繪
    if (isNavigating && currentMode) {
        if (currentMode === 'general' && !currentSubMode) return;
        startNav(true);
    }
}

// ── 模式切換 ──────────────────────────────────────────────
function setMode(mode) {
    currentMode = mode;
    cachedFullPath = null; // 模式改變，清除快取
    document.getElementById('btn-accessible').classList.remove('active');
    document.getElementById('btn-general').classList.remove('active');
    document.getElementById(`btn-${mode}`).classList.add('active');

    const generalOptions = document.getElementById('general-route-options');
    if (mode === 'general') {
        generalOptions.style.display = 'flex';
    } else {
        generalOptions.style.display = 'none';
        currentSubMode = '';
        document.querySelectorAll('.sub-mode-btn').forEach(btn => btn.classList.remove('active'));
    }

    if (isNavigating && selectedDestId && (mode === 'accessible' || (mode === 'general' && currentSubMode))) {
        startNav(true);
    }
}

function setSubMode(subMode) {
    currentSubMode = subMode;
    cachedFullPath = null; // 子模式改變，清除快取
    document.querySelectorAll('.sub-mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-sub-${subMode}`).classList.add('active');

    if (isNavigating && selectedDestId && currentMode === 'general') {
        startNav(true);
    }
}

// ── 起點選擇 UI ───────────────────────────────────────────
function renderOriginDropdown(list) {
    const dd = document.getElementById('origin-dropdown');
    if (!dd) return;
    if (list.length === 0) {
        dd.innerHTML = '<div class="dd-item dd-empty">找不到符合選項</div>';
    } else {
        dd.innerHTML = list.map(o => {
            const zoneTag = o.zone === 'B2'
                ? `<span class="dd-dir nangang">B2</span>`
                : `<span class="dd-dir dingpu">B1</span>`;
            return `<div class="dd-item" onclick="selectOrigin('${o.id}')">${o.label} ${zoneTag}</div>`;
        }).join('');
    }
    dd.style.display = 'block';
}

function filterOrigins(query) {
    const list = query.trim() === ''
        ? ORIGIN_OPTIONS
        : ORIGIN_OPTIONS.filter(o => o.label.includes(query.trim()) || o.id.includes(query.trim()));
    renderOriginDropdown(list);
    const exact = ORIGIN_OPTIONS.find(o => o.label === query.trim());
    if (exact) selectOrigin(exact.id, false);
}

function showOriginDropdown() {
    renderOriginDropdown(ORIGIN_OPTIONS);
}

function selectOrigin(id, updateInput = true) {
    selectedOriginId = id;
    cachedFullPath   = null; // 起點改變，清除快取
    const opt = ORIGIN_OPTIONS.find(o => o.id === id);
    if (updateInput && opt) {
        document.getElementById('origin-input').value = opt.label;
    }
    document.getElementById('origin-dropdown').style.display = 'none';

    // 若已在導航中則重繪
    if (isNavigating && selectedDestId && currentMode) {
        if (currentMode === 'general' && !currentSubMode) return;
        startNav(true);
    }
}

// ── 側邊欄收合 ────────────────────────────────────────────
function toggleSidebar() {
    const controls  = document.getElementById('controls');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    controls.classList.toggle('collapsed');
    toggleBtn.innerText = controls.classList.contains('collapsed') ? '▶' : '◀';
}

// ── 重設導航 ──────────────────────────────────────────────
function resetNavigation() {
    // 清除快取路徑
    cachedFullPath = null;

    // 重設目的地輸入
    const destInput = document.getElementById('dest-input');
    if (destInput && DEST_OPTIONS.length > 0) {
        destInput.value = DEST_OPTIONS[0].label;
        selectedDestId  = DEST_OPTIONS[0].id;
    }
    document.getElementById('direction-badge').style.display = 'none';

    // 重設起點回預設
    if (ORIGIN_OPTIONS.length > 0) {
        selectedOriginId = ORIGIN_OPTIONS[0].id;
        const originInput = document.getElementById('origin-input');
        if (originInput) originInput.value = ORIGIN_OPTIONS[0].label;
    }

    document.getElementById('next-floor-container').style.display = 'none';
    document.getElementById('reset-nav-btn').style.display = 'none';

    const pathElement = document.getElementById('route-path');
    pathElement.setAttribute('d', '');
    pathElement.style.strokeDasharray  = '';
    pathElement.style.strokeDashoffset = '';
    document.getElementById('svg-layer').querySelectorAll('.route-marker').forEach(el => el.remove());

    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }

    isNavigating   = false;
    currentMode    = '';
    currentSubMode = '';

    // 回到 B1
    const floors = ['B1', 'B2', 'B3'];
    const idx    = floors.indexOf(currentFloor);
    if (idx > 0) changeFloor(-idx);

    document.querySelectorAll('.mode-btn, .sub-mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('general-route-options').style.display = 'none';
    console.log("導航已重設");
}

// ── 無障礙設施標記 ────────────────────────────────────────

const FACILITY_TYPES = {
    elevator:  { keywords: ['elevator'],                 color: '#e74c3c', emoji: '🛗',  label: '電梯'  },
    stair:     { keywords: ['stair'],                    color: '#e67e22', emoji: '🪜',  label: '樓梯'  },
    escalator: { keywords: ['escalator'],                color: '#9b59b6', emoji: '🔼',  label: '手扶梯' },
    ramp:      { keywords: ['ramp'],                     color: '#27ae60', emoji: '♿',  label: '坡道'  },
    exit:      { keywords: ['exit', 'entrance', 'gate'], color: '#2980b9', emoji: '🚪',  label: '出入口' },
    info:      { keywords: ['info'],                     color: '#16a085', emoji: 'ℹ',  label: '詢問處' },
};

const FACILITY_GROUP_ID = 'facility-markers-group';

function getFacilityType(nodeId) {
    for (const [type, def] of Object.entries(FACILITY_TYPES)) {
        if (def.keywords.some(kw => nodeId.includes(kw))) return type;
    }
    return null;
}

function renderFacilityMarkers() {
    const svgLayer = document.getElementById('svg-layer');
    const old = document.getElementById(FACILITY_GROUP_ID);
    if (old) old.remove();

    const active = {};
    Object.keys(FACILITY_TYPES).forEach(type => {
        const el = document.getElementById('fac-' + type);
        active[type] = el ? el.checked : false;
    });
    if (!Object.values(active).some(Boolean)) return;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', FACILITY_GROUP_ID);

    const floor = currentFloor || 'B1';
    const rendered = new Set();

    Object.entries(nodesData || NODES_INLINE).forEach(([nodeId, node]) => {
        if (node.floor !== floor) return;
        const type = getFacilityType(nodeId);
        if (!type || !active[type]) return;

        const posKey = node.x + ',' + node.y;
        if (rendered.has(posKey)) return;
        rendered.add(posKey);

        const def = FACILITY_TYPES[type];
        const cx = node.x, cy = node.y;
        const r = 24;

        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', cx); glow.setAttribute('cy', cy);
        glow.setAttribute('r', r + 10);
        glow.setAttribute('fill', def.color); glow.setAttribute('opacity', '0.2');
        group.appendChild(glow);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx); circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', def.color); circle.setAttribute('opacity', '0.92');
        circle.setAttribute('stroke', '#fff'); circle.setAttribute('stroke-width', '4');
        group.appendChild(circle);
    });

    svgLayer.appendChild(group);
}

function toggleFacilityPanel() {
    const box = document.getElementById('facility-checkboxes');
    const arrow = document.getElementById('facility-arrow');
    const isHidden = box.style.display === 'none';
    box.style.display = isHidden ? 'grid' : 'none';
    arrow.textContent = isHidden ? '▼' : '▶';
}

// ── 縮放與拖曳 ────────────────────────────────────────────
let scale = 0.3;
const MIN_SCALE = 0.1;
const MAX_SCALE = 2.0;

function applyTransform() {
    document.getElementById('map-wrapper').style.transform = `scale(${scale})`;
}

window.addEventListener('DOMContentLoaded', () => {
    applyTransform();
    loadGraphData();   // ← 初始化內嵌資料

    const viewport = document.getElementById('viewport');

    // 滾輪縮放
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect   = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left + viewport.scrollLeft;
        const mouseY = e.clientY - rect.top  + viewport.scrollTop;
        const delta  = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
        viewport.scrollLeft = mouseX * (newScale / scale) - (e.clientX - rect.left);
        viewport.scrollTop  = mouseY * (newScale / scale) - (e.clientY - rect.top);
        scale = newScale;
        applyTransform();
    }, { passive: false });

    // 手機雙指縮放
    let lastDist = null;
    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2)
            lastDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && lastDist !== null) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * (dist / lastDist)));
            lastDist = dist;
            applyTransform();
        }
    }, { passive: false });

    viewport.addEventListener('touchend', () => { lastDist = null; });

    // 滑鼠拖曳
    let isDragging = false, startX, startY, scrollLeft, scrollTop;

    viewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.station-dropdown')) return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        scrollLeft = viewport.scrollLeft; scrollTop = viewport.scrollTop;
        viewport.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        viewport.scrollLeft = scrollLeft - (e.clientX - startX);
        viewport.scrollTop  = scrollTop  - (e.clientY - startY);
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) { isDragging = false; viewport.style.cursor = 'grab'; }
    });

    // 手機單指拖曳
    let touchStartX, touchStartY, touchScrollLeft, touchScrollTop;
    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
            touchScrollLeft = viewport.scrollLeft; touchScrollTop = viewport.scrollTop;
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            viewport.scrollLeft = touchScrollLeft - (e.touches[0].clientX - touchStartX);
            viewport.scrollTop  = touchScrollTop  - (e.touches[0].clientY - touchStartY);
            e.preventDefault();
        }
    }, { passive: false });
});