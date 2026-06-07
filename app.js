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

    return arr[
        Math.floor(
            Math.random() * arr.length
        )
    ];

}

function roll(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}

function chance(percent) {

    return (
        Math.random() * 100
    ) < percent;

}

// =====================
// 加载数据库
// =====================

async function loadJSON(path) {

    const response =
        await fetch(path);

    return await response.json();

}

async function loadDatabase() {

    try {

        monsters =
            await loadJSON(
                "data/monsters.json"
            );

        weapons =
            await loadJSON(
                "data/weapons.json"
            );

        armors =
            await loadJSON(
                "data/armor.json"
            );

        magicItems =
            await loadJSON(
                "data/magicItems.json"
            );

        treasureTables =
            await loadJSON(
                "data/treasureTables.json"
            );
        gems =
            await loadJSON(
               "data/gems.json"
            );

        artObjects =
            await loadJSON(
               "data/artObjects.json"
            );
        initMonsterList();

        console.log(
            "数据库加载成功"
        );

    }

    catch(error) {

        console.error(
            "数据库加载失败",
            error
        );

    }

}

// =====================
// 怪物列表
// =====================

function initMonsterList() {

    const select =
        document.getElementById(
            "corpseType"
        );

    select.innerHTML = "";

    monsters.forEach(monster => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            monster.name;

        option.textContent =
            monster.name;

        select.appendChild(
            option
        );

    });

}

// =====================
// 宝藏等级
// =====================

function getTreasureTable(cr) {

    return treasureTables.find(

        table =>

            cr >= table.crMin &&
            cr <= table.crMax

    );

}

// =====================
// 品质颜色
// =====================

function rarityColor(rarity) {

    switch(rarity) {

        case "common":
            return "#cccccc";

        case "uncommon":
            return "#00ff66";

        case "rare":
            return "#3399ff";

        case "veryRare":
            return "#bb66ff";

        case "legendary":
            return "#ff9900";

        case "artifact":
            return "#ff3333";

        default:
            return "white";

    }

}

// =====================
// 搜尸体
// =====================

function searchBody() {

    const corpseType =
        document.getElementById(
            "corpseType"
        ).value;

    const level =
        parseInt(
            document.getElementById(
                "level"
            ).value
        );

    const success =
        document.getElementById(
            "success"
        ).value;

    const output =
        document.getElementById(
            "output"
        );

    const monster =
        monsters.find(

            m =>
                m.name ===
                corpseType

        );

    if (!monster) {

        output.innerHTML =
            "<h3>找不到怪物</h3>";

        return;

    }

    const table =
        getTreasureTable(
            monster.cr
        );

    if (!table) {

        output.innerHTML =
            "<h3>没有对应宝藏表</h3>";

        return;

    }

    let html = "";

    html += `
        <h2>${monster.name}</h2>

        <p>
            CR：
            ${monster.cr}
        </p>

        <hr>
    `;

    // =====================
    // 金币
    // =====================

    let gold =
        roll(
            table.gold[0],
            table.gold[1]
        );

    gold =
        Math.floor(
            gold *
            (level / 2)
        );
    if(chance(40)){


    html += `
        <p class="gold">
            💰 ${gold} 金币
        </p>
    `;
    if(chance(40)){

    const gem =
        getRandom(gems);

    html += `
        <p>
            💎 ${gem.name}
            (${gem.value}gp)
        </p>
    `;

}

if(chance(20)){

    const art =
        getRandom(artObjects);

    html += `
        <p>
            🏺 ${art.name}
            (${art.value}gp)
        </p>
    `;

}
    html += `
        <h3>
            战利品
        </h3>
    `;

    // =====================
    // 武器
    // =====================

    if (
        chance(
            table.weaponChance
        )
    ) {

        const pool =
            weapons.filter(

                w =>
                    w.rarity ===
                    table.weaponRarity

            );

        if(pool.length > 0) {

            const weapon =
                getRandom(pool);

            html += `
                <p
                style="
                color:
                ${rarityColor(
                    weapon.rarity
                )}
                ">
                ⚔
                ${weapon.name}
                </p>
            `;

        }

    }

    // =====================
    // 护甲
    // =====================

    if (
        chance(
            table.armorChance
        )
    ) {

        const pool =
            armors.filter(

                a =>
                    a.rarity ===
                    table.armorRarity

            );

        if(pool.length > 0) {

            const armor =
                getRandom(pool);

            html += `
                <p
                style="
                color:
                ${rarityColor(
                    armor.rarity
                )}
                ">
                🛡
                ${armor.name}
                </p>
            `;

        }

    }

    // =====================
    // 魔法物品
    // =====================

    if (
        chance(
            table.magicChance
        )
    ) {

        const pool =
            magicItems.filter(

                item =>
                    item.rarity ===
                    table.magicRarity

            );

        if(pool.length > 0) {

            const item =
                getRandom(pool);

            html += `
                <p
                style="
                color:
                ${rarityColor(
                    item.rarity
                )}
                ">
                🔮
                ${item.name}
                </p>
            `;

        }

    }

    // =====================
    // 成功奖励
    // =====================

    if (
        success === "困难成功"
    ) {

        html += `
            <p>
                🟢 发现额外金币
            </p>
        `;

    }

    if (
        success === "极难成功"
    ) {

        html += `
            <p>
                🔵 发现隐藏口袋
            </p>
        `;

    }

    if (
        success === "大成功"
    ) {

        html += `
            <p
            style="
            color:gold;
            font-weight:bold;
            ">
            ✨ 发现隐藏宝藏
            </p>
        `;

        const legendaryPool =

            magicItems.filter(

                item =>

                    item.rarity ===
                    "legendary"

            );

        if(
            legendaryPool.length > 0
        ) {

            const legendary =

                getRandom(
                    legendaryPool
                );

            html += `
                <p
                style="
                color:#ff9900;
                ">
                🟠
                ${legendary.name}
                </p>
            `;

        }

    }

    output.innerHTML = html;

}

// =====================
// 启动
// =====================

window.onload =
async function() {

    await loadDatabase();

};