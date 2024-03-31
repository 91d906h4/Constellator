// Share.
async function share() {
    const url = window.location.href;

    if (navigator.share) {
        await navigator.share({
            url,
        });
    }
    else {
        await navigator.clipboard.writeText(url);
        alert("URL 複製成功！");
    }
}

// Random example.
function random_example() {
    const description = [
        "勇敢無畏，充滿了活力和冒險精神，喜歡追求挑戰，敢於冒險，常常是行動派的領導者。",
        "穩重可靠，以堅韌的意志力和耐心著稱，注重安全和舒適，並對物質生活有著強烈的執著。",
        "機智聰明，好奇心旺盛，喜歡交際和表達自己，具有多才多藝的特質，常常充滿了靈活的思維和活力。",
        "情感豐富，善解人意，對家庭和親密關係非常重視，總是充滿了溫柔和關懷，是很好的傾聽者和支持者。",
        "自信大方，追求著成為焦點的慾望，充滿了熱情和活力，喜歡引領和影響身邊的人，時常展現出優越感和領導能力。",
        "細心謹慎，追求完美，善於分析和解決問題，注重細節和有組織性，常常是值得信賴的夥伴和顧問。",
        "追求和諧，優雅而公正，注重平衡和公平，善於溝通協調，是很好的調解者和中介者。",
        "神秘內斂，充滿了熱情和直覺，擁有強烈的意志力和洞察力，常常是充滿挑戰性和魅力的個體。",
        "自由奔放，熱愛冒險和探索，追求著廣闊的視野和新鮮的體驗，時常充滿了樂觀和幽默。",
        "勤奮負責，追求事業成功和社會地位，具有堅毅的意志力和耐心，常常是穩健和實際的決策者。",
        "獨立思考，充滿了理想主義和創意，追求著獨特的生活方式和社會價值觀，常常是前衛和不拘一格的個體。",
        "敏感善良，充滿了同情心和想像力，常常是理想主義者和夢想家，追求著內心的情感和精神實踐。",
    ];

    // Randomly select an example.
    text_input.value = description[Math.floor(Math.random() * description.length)];
}

// Text-to-Array.
function text_to_arr() {
    var array = Array();
    var padding = word2index["<PAD>"];

    // Using Jieba to split text.
    call_jieba_cut(text_input.value, function (result) {
        result.forEach((e) => {
            if (word2index[e] == undefined) array.push(padding);
            else array.push(word2index[e]);
        });
    });

    // If Jieba didn't work correctly, use alternative function to split text.
    if (array.length == 0) {
        // In Chinese, most words is 4 characters or less, so we set the max match
        // length to 4.
        let max_match = 4, i = 0;

        try {
            while (i < text_input.value.length) {
                let matched = false;

                for (let j = max_match; j > 0; j--) {
                    let temp = text_input.value.slice(i, i + j);

                    // Check if word exists.
                    if (temp in word2index) {
                        array.push(word2index[temp]);
                        i += j;
                        matched = true;
                        break;
                    }
                }

                // If didn't match any word, use <PAD>.
                if (!matched) {
                    array.push(padding);
                    i++;
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    while (array.length < 32) {
        array.push(padding);
    }

    return array.slice(0, 32);
}

// Run-AI.
async function run_ai(array) {
    try {
        // Load model.
        const model = await ort.InferenceSession.create('./constellator.onnx');

        // Convert array to tensor.
        const tensor = new ort.Tensor('int64', array, [1, 32]);

        // Get output from model.
        const results = await model.run({ "input.1": tensor });

        // Read result.
        const data = results["677"].cpuData;

        return data;
    }
    catch (e) {
        waiting_text.innerHTML = "AI 分析中錯誤，請重新載入或檢查 onnx 模型是否正確。";
        console.log(e);
    }
}

// Draw graph.
function draw_graph(array) {
    // Normolize array.
    const min = Math.min(...array);
    array = array.map(element => element - min);
    const max = Math.max(...array);
    array = array.map(element => element * 100 / max);

    const labels = [
        '牡羊',
        '金牛',
        '雙子',
        '巨蠍',
        '獅子',
        '處女',
        '天秤',
        '天蠍',
        '射手',
        '魔羯',
        '水瓶',
        '雙魚',
    ];

    // Get index of max and min score.
    const max_index = array.indexOf(100);
    const min_index = array.indexOf(0);

    // Set result text.
    analysis_result.innerHTML = "您最像「" + labels[max_index] + "座」，最不像「" + labels[min_index] + "座」！";
    analysis_result.removeAttribute("hidden");

    const ctx = document.getElementById('chart');

    const data = {
        labels: labels,
        datasets: [{
            label: '星座元素分析(%)',
            data: array,
            fill: true,
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    pointLabels: {
                        font: {
                            size: 15,
                        },
                    },
                },
            },
        },
    };

    // Hide waiting text.
    waiting_text.setAttribute("hidden", true);

    // Draw graph.
    window.myChart = new Chart(ctx, config);
}