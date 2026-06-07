function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initJobs() {

    const jobSelect =
        document.getElementById("job");

    if (!jobSelect) {
        return;
    }

    jobSelect.innerHTML = "";

    Object.keys(occupations).forEach(job => {

        const option =
            document.createElement("option");

        option.value = job;
        option.textContent = job;

        jobSelect.appendChild(option);

    });
}

function searchBody() {

    const job =
        document.getElementById("job").value;

    const era =
        document.getElementById("era").value;

    const success =
        document.getElementById("success").value;

    const corpse =
        document.getElementById("corpse").value;

    const output =
        document.getElementById("output");

    const data =
        occupations[job];

    if (!data) {

        output.innerHTML =
            "<p>未找到职业数据</p>";

        return;
    }

    const eraData =
        data.eras[era];

    if (!eraData) {

        output.innerHTML =
            "<p>未找到年代数据</p>";

        return;
    }

    let html = "";

    html += `<h3>${job}</h3>`;
    html += `<p>📅 年代：${era}</p>`;
    html += `<p>⚰️ 尸体状态：${corpse}</p>`;

    const money =
        roll(
            eraData.money[0],
            eraData.money[1]
        );

    html += `
        <p class="money">
            💰 ${money} 美元
        </p>
    `;

    const itemPool = [

        ...data.commonItems,

        ...eraData.items

    ];

    const itemCount =
        roll(2, 4);

    html += `<h4>发现物品</h4>`;

    for(let i = 0; i < itemCount; i++) {

        html += `
            <p>
                📦 ${getRandom(itemPool)}
            </p>
        `;
    }

    if (
        success === "困难成功" ||
        success === "极难成功" ||
        success === "大成功"
    ) {

        html += `
            <hr>
            <p class="clue">
                📜 线索：
                ${getRandom(data.clues)}
            </p>
        `;
    }

    if (
        success === "极难成功" ||
        success === "大成功"
    ) {

        html += `
            <p class="mythos">
                ⚠ 神话发现：
                ${getRandom(data.mythos)}
            </p>
        `;
    }

    if(success === "大成功") {

        html += `
            <p class="legendary">
                ⭐ 发现隐藏夹层
            </p>
        `;

        html += `
            <p class="legendary">
                🎁 额外物品：
                ${getRandom(itemPool)}
            </p>
        `;
    }

    output.innerHTML = html;
}

window.onload = function() {

    initJobs();

};