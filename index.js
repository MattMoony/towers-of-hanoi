function find(n) {
    for (let i = 0; i < towers.length; i++) {
        if (towers[i].includes(n))
            return i;
    }

    return -1;
}
function find_free_tower() {
    for (let i = 0; i < towers.length; i++) {
        if (towers[i].length == 0)
            return i;
    }

    return -1;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function format(n, cu) {
    draw_towers();
    await sleep(format_sleep_pause);

    if (cu == n) {
        towers[find_free_tower()].unshift(towers[find(n)].splice(0, 1)[0]);
    } else if (cu % 2 != n % 2) {
        towers[find(cu)].unshift(towers[find(n)].splice(0, 1)[0]);
    } else {
        let n_t_index = find(n),
            cu_t_index = find(cu),
            choices = [0, 1, 2];

        choices.splice(choices.indexOf(n_t_index), 1);
        choices.splice(choices.indexOf(cu_t_index), 1);

        // console.log('nt-index: ' + n_t_index + ', cu-tower: ' + cu_t_index);
        // console.log('choice: ' + choices[0]);

        towers[choices[0]].unshift(towers[n_t_index].splice(0, 1)[0]);
    }

    // console.log('format(' + n + ', ' + cu + '): ... ');
    // towers.forEach(v => {
    //     console.log(v.reverse());
    //     v.reverse();
    // });

    for (let i = 1; i < n; i++) {
        await format(i, n);
    }
}

async function solve_towers() {
    if (towers.length != 3)
        console.log(" [ERROR]: Length ... ");
    else if (towers[0].length == 0 || towers[1].length > 0 || towers[2].length > 0)
        console.log(" [ERROR]: Individual tower lengths error ... ")
    else if (towers[0][0] != 1)
        console.log(" [ERROR]: Tower 0 doesn't start with 1 ... ")
    else {
        for (let i = 0; i < towers[0].length - 1; i++) {
            if (towers[0][i] > towers[0][i + 1]) {
                console.log(" [ERROR]: First tower not sorted ... ")
                return;
            }
        }

        var max = towers[0][towers[0].length - 1];

        // Move 1 ... 
        towers[max % 2 + 1].unshift(towers[0].splice(0, 1)[0]);

        for (let i = 2; i <= max; i++) {
            await format(i, i);
        }
    }
}

async function draw_towers() {
    ctx.clearRect(0, 0, canvas_specs.width, canvas_specs.height);
    c_towers = [];

    for (let i = canvas_specs.h_padding; i <= canvas_specs.width - canvas_specs.h_padding; i +=
        Math.floor((canvas_specs.width - 2 * canvas_specs.h_padding) / 2)) {
        // ctx.moveTo(i, 50);
        // ctx.lineTo(i, 550);
        // ctx.stroke();

        c_towers.push(i);
    }

    for (let t = 0; t < towers.length; t++) {
        var cu_h = canvas_specs.height - canvas_specs.v_padding;

        ctx.beginPath();
        ctx.fillStyle = "#FFA05A";

        for (let i = towers[t].length - 1; i >= 0; i--) {
            ctx.rect(Math.floor(c_towers[t] - (towers[t][i] * canvas_specs.piece_width) / 2), cu_h, Math.floor(c_towers[t] +
                ((towers[t][i] * canvas_specs.piece_width) / 2)) - Math.floor(c_towers[t] - ((towers[t][i] * canvas_specs.piece_width) / 2)), 
                cu_h - (cu_h - canvas_specs.piece_height));
            cu_h -= canvas_specs.piece_height + 2;
        }

        ctx.fill();
        ctx.stroke();
    }
}

async function towers_of_hanoi(n, specs, callback_function) {
    canvas = document.getElementById('main_canvas');
    ctx = canvas.getContext('2d');

    canvas_specs = {
        width: (specs ? specs.width || 1500 : 1500),
        height: (specs ? specs.height || 800 : 800),
        h_padding: (specs ? specs.h_padding || 200 : 200),
        v_padding: (specs ? specs.v_padding || 50 : 50),
        piece_width: (specs ? specs.piece_width || 25 : 25),
        piece_height: (specs ? specs.piece_height || 15 : 15)
    };

    console.log(canvas_specs);

    towers = [[], [], []];
    for (let i = 1; i <= (n||4); i++)
        towers[0].push(i);

    format_sleep_pause = specs ? specs.format_sleep_pause || 100 : 100;

    await draw_towers();
    await solve_towers();
    await draw_towers();

    console.log(' -- RESULT -- ');
    towers.forEach(v => {
        console.log(v);
    });

    if (callback_function) {
        callback_function();
    }
}