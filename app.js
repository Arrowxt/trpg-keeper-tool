
// =====================
// 数据库
// =====================

let monsters = [];
let weapons = [];
let armors = [];
let magicItems = [];
let treasureTables = [];
let gems = [];
let artObjects = [];

// =====================
// 工具函数
// =====================

function getRandom(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(p) {
    return Math.random() < p / 100;
}

// =====================
// JSON加载
// =====================

async function loadJSON(path) {
    const res = await fetch(path);
    return await res.json();
}

// =====================
// 初始化数据库
// =====================

async function loadDatabase() {
    try {
        monsters = await loadJSON("data/monsters.json");
        weapons = await loadJSON("data/weapons.json");
        armors = await loadJSON("data/armor.json");
        magicItems = await loadJSON("data/magicItems.json");
        treasureTables = await loadJSON("data/treasureTables.json");
        gems = await loadJSON("data/gems.json");
        artObjects = await loadJSON("data/artObjects.json");

        initMonsterList();

        console.log("✅ 数据库加载成功");
    } catch (err) {
        console.error("❌ 数据库加载失败", err);
    }
}

// =====================
// 怪物列表初始化
// =====================

function initMonsterList() {
    const select = document.getElementById("corpseType");
    if (!select) return;

    select.innerHTML = "";

    monsters.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.name;
        opt.textContent = m.name;
        select.appendChild(opt);
    });
}

// =====================
// 查表
// =====================

function getTreasureTable(cr) {
    return treasureTables.find(t => cr >= t.crMin && cr <= t.crMax);
}

// =====================
// UI卡牌输出（兼容你原HTML）
// =====================

function addResult(html, className = "") {
    const output = document.getElementById("output");

    const div = document.createElement("div");
    div.className = "card " + className;
    div.innerHTML = html;

    output.appendChild(div);
}

// =====================
// 掉落核心（避免“什么都不出”的体验问题）
// =====================

function rollLootTier(cr) {
    let d = roll(1, 100);
    let bonus = Math.min(cr * 2, 20);
    let total = d + bonus;

    if (total <= 40) return "junk";
    if (total <= 70) return "normal";
    if (total <= 90) return "good";
    return "rare";
}

// =====================
// 主函数（替换核心）
// =====================

function searchBody() {

    const corpseType = document.getElementById("corpseType").value;
    const level = parseInt(document.getElementById("level").value);
    const success = document.getElementById("success").value;

    const output = document.getElementById("output");
    output.innerHTML = "";

    const monster = monsters.find(m => m.name === corpseType);

    if (!monster) {
        addResult("<h3>找不到怪物</h3>");
        return;
    }

    const table = getTreasureTable(monster.cr);

    if (!table) {
        addResult("<h3>没有宝藏表</h3>");
        return;
    }

    // =====================
    // 标题
    // =====================

    addResult(`
        <h2>${monster.name}</h2>
        <p>CR ${monster.cr}</p>
    `);

    // =====================
    // 金币（稳定掉落）
    // =====================

    let gold = roll(table.gold[0], table.gold[1]);
    gold = Math.floor(gold * Math.max(0.5, level / 2));

    addResult(`<h3>💰 金币</h3><p>${gold}</p>`, "gold");

    // =====================
    // 掉落等级
    // =====================

    const tier = rollLootTier(monster.cr);

    // =====================
    // 宝石 / 艺术品（稳定出现，不再消失）
    // =====================

    if (tier !== "junk") {

        if (chance(60)) {
            const g = getRandom(gems);
            if (g) {
                addResult(`<h3>💎 宝石</h3><p>${g.name}</p>`);
            }
        }

        if (chance(40)) {
            const a = getRandom(artObjects);
            if (a) {
                addResult(`<h3>🏺 艺术品</h3><p>${a.name}</p>`);
            }
        }
    }

    // =====================
    // 武器
    // =====================

    if (tier !== "junk" && chance(table.weaponChance)) {

        const pool = weapons.filter(
            w => w.rarity === table.weaponRarity
        );

        const w = getRandom(pool);

        if (w) {
            addResult(`<h3>⚔ 武器</h3><p>${w.name}</p>`);
        }
    }

    // =====================
    // 护甲
    // =====================

    if (tier !== "junk" && chance(table.armorChance)) {

        const pool = armors.filter(
            a => a.rarity === table.armorRarity
        );

        const a = getRandom(pool);

        if (a) {
            addResult(`<h3>🛡 护甲</h3><p>${a.name}</p>`);
        }
    }

    // =====================
    // 魔法物品
    // =====================

    if (tier === "rare" && chance(table.magicChance)) {

        const pool = magicItems.filter(
            m => m.rarity === table.magicRarity
        );

        const m = getRandom(pool);

        if (m) {
            addResult(`<h3>🔮 魔法物品</h3><p>${m.name}</p>`);
        }
    }

    // =====================
    // 成功奖励
    // =====================

    if (success === "困难成功") {
        addResult("<p>🟢 额外发现线索</p>");
    }

    if (success === "极难成功") {
        addResult("<p>🔵 找到隐藏夹层</p>");
    }

    if (success === "大成功") {
        addResult("<h3>✨ 大成功</h3><p>隐藏宝藏</p>", "gold");

        const legendary = getRandom(
            magicItems.filter(i => i.rarity === "legendary")
        );

        if (legendary) {
            addResult(`<p style="color:#ff9900;">🟠 ${legendary.name}</p>`);
        }
    }
}

// =====================
// 启动
// =====================

window.onload = async function () {
    await loadDatabase();
};