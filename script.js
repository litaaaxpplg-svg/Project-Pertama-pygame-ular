// =========================================================
// CANVAS
// =========================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const homePage = document.getElementById("homePage");
const gamePage = document.getElementById("gamePage");

const gameOverBox = document.getElementById("gameOver");

const scoreText = document.getElementById("scoreText");
const bestText = document.getElementById("bestText");
const levelText = document.getElementById("levelText");
const finalScore = document.getElementById("finalScore");

const startButton = document.getElementById("startButton");
const exitHomeButton = document.getElementById("exitHomeButton");

const restartButton = document.getElementById("restartButton");
const exitGameButton = document.getElementById("exitGameButton");

const upButton = document.getElementById("upButton");
const leftButton = document.getElementById("leftButton");
const downButton = document.getElementById("downButton");
const rightButton = document.getElementById("rightButton");


// =========================================================
// UKURAN
// =========================================================

const GRID_SIZE = 20;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;


// =========================================================
// WARNA
// =========================================================

const WHITE = "#ffffff";
const BLACK = "#2d3241";

const BLUE = "#64aaeB";
const DARK_BLUE = "#4169b4";
const LIGHT_BLUE = "#b9e1ff";

const PINK = "#ff91b9";
const LIGHT_PINK = "#ffd2e1";

const RED = "#eb4655";

const GREEN = "#5abe6e";
const LIGHT_GREEN = "#b4e69a";

const YELLOW = "#ffd24b";
const ORANGE = "#ff9b4b";

const PURPLE = "#af7de1";

const BG = "#cdeefa";
const GRID = "#b9dcec";
const SHADOW = "#96bed7";


// =========================================================
// WARNA ULAR
// =========================================================

const WARNA_ULANG = [
    ["#3c8cd2", "#64b4f0", "#8cc8fa"],
    ["#50b464", "#78dc8c", "#a0f0aa"],
    ["#965ad2", "#b482e6", "#d2aaf5"],
    ["#f09632", "#fab45a", "#ffd282"],
    ["#dc465a", "#f06e78", "#fa96a0"]
];


// =========================================================
// STATUS GAME
// =========================================================

let snake = [];
let makanan = [];

let arah = {
    x: GRID_SIZE,
    y: 0
};

let skor = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

let warnaIndex = 0;

let gameOver = false;
let sedangBermain = false;

let gameTimer = null;

let kecepatanAwal = 7;
let kecepatanMaksimal = 22;


// =========================================================
// MAKANAN
// =========================================================

const jenisMakanan = [
    ["apel", RED],
    ["stroberi", PINK],
    ["jeruk", YELLOW],
    ["anggur", PURPLE],
    ["apel_hijau", GREEN]
];


// =========================================================
// RESIZE CANVAS
// =========================================================

function resizeCanvas() {

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// =========================================================
// POSISI MAKANAN ACAK
// =========================================================

function buatPosisiAcakMakanan() {

    const kolomMaks = Math.max(1, Math.floor(WIDTH / GRID_SIZE));
    const barisMaks = Math.max(1, Math.floor(HEIGHT / GRID_SIZE));

    for (let i = 0; i < 100; i++) {

        const x =
            Math.floor(Math.random() * kolomMaks) *
            GRID_SIZE;

        const y =
            Math.floor(Math.random() * barisMaks) *
            GRID_SIZE;

        const makananBaru = {
            x: x,
            y: y
        };

        let bertabrakan = false;

        for (const bagian of snake) {

            if (
                bagian.x === makananBaru.x &&
                bagian.y === makananBaru.y
            ) {
                bertabrakan = true;
                break;
            }
        }

        if (!bertabrakan) {
            return makananBaru;
        }
    }

    return {
        x: GRID_SIZE,
        y: GRID_SIZE
    };
}


// =========================================================
// BUAT SEMUA MAKANAN
// =========================================================

function buatSemuaMakanan(jumlah = 8) {

    makanan = [];

    for (let i = 0; i < jumlah; i++) {

        const posisi = buatPosisiAcakMakanan();

        const jenis =
            jenisMakanan[
                Math.floor(
                    Math.random() * jenisMakanan.length
                )
            ];

        makanan.push({
            x: posisi.x,
            y: posisi.y,
            jenis: jenis[0],
            warna: jenis[1]
        });
    }
}


// =========================================================
// RESET GAME
// =========================================================

function resetGame() {

    const xAwal =
        Math.floor(WIDTH / 2 / GRID_SIZE) *
        GRID_SIZE;

    const yAwal =
        Math.floor(HEIGHT / 2 / GRID_SIZE) *
        GRID_SIZE;

    snake = [
        {
            x: xAwal,
            y: yAwal
        },
        {
            x: xAwal - GRID_SIZE,
            y: yAwal
        },
        {
            x: xAwal - GRID_SIZE * 2,
            y: yAwal
        }
    ];

    arah = {
        x: GRID_SIZE,
        y: 0
    };

    skor = 0;
    warnaIndex = 0;

    gameOver = false;

    buatSemuaMakanan();

    updateInfo();

    gameOverBox.classList.add("hidden");
}


// =========================================================
// KECEPATAN
// =========================================================

function hitungKecepatan() {

    // Setiap skor bertambah,
    // kecepatan ular langsung bertambah

    let speed =
        kecepatanAwal + skor;

    if (speed > kecepatanMaksimal) {
        speed = kecepatanMaksimal;
    }

    return speed;
}


// =========================================================
// UBAH ARAH
// =========================================================

function ubahArah(x, y) {

    // Tidak boleh langsung berbalik

    if (
        x === -arah.x &&
        y === -arah.y
    ) {
        return;
    }

    arah.x = x;
    arah.y = y;
}


// =========================================================
// UPDATE INFO
// =========================================================

function updateInfo() {

    scoreText.textContent =
        "SKOR " + skor;

    bestText.textContent =
        highScore;

    levelText.textContent =
        skor + 1;

    finalScore.textContent =
        skor;
}


// =========================================================
// MULAI GAME
// =========================================================

function mulaiGame() {

    homePage.classList.add("hidden");
    gamePage.classList.remove("hidden");

    sedangBermain = true;
    gameOver = false;

    resetGame();

    mulaiTimer();
}


// =========================================================
// TIMER GAME
// =========================================================

function mulaiTimer() {

    if (gameTimer !== null) {
        clearInterval(gameTimer);
    }

    gameTimer = setInterval(
        updateGame,
        1000 / hitungKecepatan()
    );
}


// =========================================================
// UPDATE TIMER SETELAH MAKAN
// =========================================================

function updateKecepatanGame() {

    if (gameTimer !== null) {
        clearInterval(gameTimer);
    }

    gameTimer = setInterval(
        updateGame,
        1000 / hitungKecepatan()
    );
}


// =========================================================
// UPDATE GAME
// =========================================================

function updateGame() {

    if (!sedangBermain || gameOver) {
        return;
    }

    const kepalaLama = snake[0];

    const kepalaBaru = {
        x: kepalaLama.x + arah.x,
        y: kepalaLama.y + arah.y
    };

    snake.unshift(kepalaBaru);


    // =============================================
    // CEK MAKANAN
    // =============================================

    let makananKena = null;

    for (const item of makanan) {

        if (
            kepalaBaru.x === item.x &&
            kepalaBaru.y === item.y
        ) {
            makananKena = item;
            break;
        }
    }


    if (makananKena !== null) {

        skor++;

        if (skor > highScore) {

            highScore = skor;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );
        }

        warnaIndex =
            (warnaIndex + 1) %
            WARNA_ULANG.length;

        makanan =
            makanan.filter(
                item => item !== makananKena
            );

        const posisiBaru =
            buatPosisiAcakMakanan();

        const jenisBaru =
            jenisMakanan[
                Math.floor(
                    Math.random() *
                    jenisMakanan.length
                )
            ];

        makanan.push({
            x: posisiBaru.x,
            y: posisiBaru.y,
            jenis: jenisBaru[0],
            warna: jenisBaru[1]
        });

        updateInfo();

        // Kecepatan langsung berubah
        // setiap skor bertambah
        updateKecepatanGame();

    } else {

        snake.pop();
    }


    // =============================================
    // TABRAK DINDING
    // =============================================

    if (
        kepalaBaru.x < 0 ||
        kepalaBaru.x >= WIDTH ||
        kepalaBaru.y < 0 ||
        kepalaBaru.y >= HEIGHT
    ) {

        selesaiGame();
        return;
    }


    // =============================================
    // TABRAK TUBUH
    // =============================================

    for (let i = 1; i < snake.length; i++) {

        if (
            kepalaBaru.x === snake[i].x &&
            kepalaBaru.y === snake[i].y
        ) {

            selesaiGame();
            return;
        }
    }
}


// =========================================================
// GAME OVER
// =========================================================

function selesaiGame() {

    gameOver = true;

    if (gameTimer !== null) {

        clearInterval(gameTimer);

        gameTimer = null;
    }

    finalScore.textContent = skor;

    gameOverBox.classList.remove("hidden");
}


// =========================================================
// GAMBAR BACKGROUND
// =========================================================

function gambarBackgroundGame() {

    ctx.fillStyle = BG;
    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Grid

    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;

    for (
        let x = 0;
        x < WIDTH;
        x += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);

        ctx.stroke();
    }

    for (
        let y = 0;
        y < HEIGHT;
        y += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);

        ctx.stroke();
    }


    // Awan

    gambarAwan(
        70,
        85
    );

    gambarAwan(
        WIDTH - 180,
        100
    );


    // Bukit

    const tanahY =
        HEIGHT - 85;

    ctx.fillStyle = "#b4e69a";

    ctx.beginPath();
    ctx.arc(
        WIDTH / 5,
        tanahY,
        110,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#5abe6e";

    ctx.beginPath();
    ctx.arc(
        WIDTH / 2,
        tanahY + 20,
        140,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#b4e69a";

    ctx.beginPath();
    ctx.arc(
        WIDTH - WIDTH / 6,
        tanahY,
        115,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#5abe6e";

    ctx.fillRect(
        0,
        tanahY,
        WIDTH,
        85
    );
}


// =========================================================
// GAMBAR AWAN
// =========================================================

function gambarAwan(x, y) {

    ctx.fillStyle = WHITE;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        20,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 25,
        y - 10,
        28,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 52,
        y,
        21,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        x,
        y,
        52,
        22
    );
}


// =========================================================
// GAMBAR ULAR
// =========================================================

function gambarUlar() {

    const warna =
        WARNA_ULANG[warnaIndex];

    for (
        let i = 0;
        i < snake.length;
        i++
    ) {

        let warnaBagian;

        if (i === 0) {
            warnaBagian = warna[0];
        } else if (i % 2 === 0) {
            warnaBagian = warna[1];
        } else {
            warnaBagian = warna[2];
        }

        const bagian = snake[i];

        ctx.fillStyle = warnaBagian;

        ctx.beginPath();

        ctx.arc(
            bagian.x + GRID_SIZE / 2,
            bagian.y + GRID_SIZE / 2,
            GRID_SIZE / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 1;

        ctx.stroke();
    }


    gambarMataUlar();
}


// =========================================================
// MATA ULAR
// =========================================================

function gambarMataUlar() {

    const kepala = snake[0];

    let mata1;
    let mata2;

    if (arah.x > 0) {

        mata1 = {
            x: kepala.x + GRID_SIZE - 6,
            y: kepala.y + 6
        };

        mata2 = {
            x: kepala.x + GRID_SIZE - 6,
            y: kepala.y + GRID_SIZE - 6
        };

    } else if (arah.x < 0) {

        mata1 = {
            x: kepala.x + 6,
            y: kepala.y + 6
        };

        mata2 = {
            x: kepala.x + 6,
            y: kepala.y + GRID_SIZE - 6
        };

    } else if (arah.y < 0) {

        mata1 = {
            x: kepala.x + 6,
            y: kepala.y + 6
        };

        mata2 = {
            x: kepala.x + GRID_SIZE - 6,
            y: kepala.y + 6
        };

    } else {

        mata1 = {
            x: kepala.x + 6,
            y: kepala.y + GRID_SIZE - 6
        };

        mata2 = {
            x: kepala.x + GRID_SIZE - 6,
            y: kepala.y + GRID_SIZE - 6
        };
    }


    [mata1, mata2].forEach(
        mata => {

            ctx.fillStyle = WHITE;

            ctx.beginPath();

            ctx.arc(
                mata.x,
                mata.y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = BLACK;

            ctx.beginPath();

            ctx.arc(
                mata.x,
                mata.y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    );
}


// =========================================================
// GAMBAR MAKANAN
// =========================================================

function gambarMakanan(item) {

    const cx =
        item.x + GRID_SIZE / 2;

    const cy =
        item.y + GRID_SIZE / 2;

    const r =
        Math.max(
            7,
            GRID_SIZE / 2 - 2
        );


    // Apel

    if (
        item.jenis === "apel" ||
        item.jenis === "apel_hijau"
    ) {

        ctx.fillStyle = item.warna;

        ctx.beginPath();

        ctx.arc(
            cx - 3,
            cy + 2,
            r - 1,
            0,
            Math.PI * 2
        );

        ctx.arc(
            cx + 4,
            cy + 2,
            r - 1,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            cx,
            cy - r + 2
        );

        ctx.lineTo(
            cx + 2,
            cy - r - 5
        );

        ctx.stroke();

        ctx.fillStyle = GREEN;

        ctx.beginPath();

        ctx.ellipse(
            cx + 6,
            cy - r - 4,
            5,
            3,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    // Stroberi

    else if (
        item.jenis === "stroberi"
    ) {

        ctx.fillStyle = item.warna;

        ctx.beginPath();

        ctx.moveTo(
            cx,
            cy + r
        );

        ctx.lineTo(
            cx - r,
            cy - r / 2
        );

        ctx.lineTo(
            cx - r / 2,
            cy - r
        );

        ctx.lineTo(
            cx + r / 2,
            cy - r
        );

        ctx.lineTo(
            cx + r,
            cy - r / 2
        );

        ctx.closePath();

        ctx.fill();


        ctx.fillStyle = WHITE;

        [
            [-4, 0],
            [4, 3],
            [2, -4]
        ].forEach(
            titik => {

                ctx.beginPath();

                ctx.arc(
                    cx + titik[0],
                    cy + titik[1],
                    2,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        );
    }


    // Jeruk

    else if (
        item.jenis === "jeruk"
    ) {

        ctx.fillStyle = item.warna;

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            r,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = ORANGE;

        ctx.beginPath();

        ctx.arc(
            cx - 3,
            cy - 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.arc(
            cx + 4,
            cy + 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    // Anggur

    else if (
        item.jenis === "anggur"
    ) {

        ctx.fillStyle = item.warna;

        const titik = [
            [0, -r + 2],
            [-6, 0],
            [6, 0],
            [-7, 7],
            [0, 7],
            [7, 7],
            [0, 13]
        ];

        titik.forEach(
            pos => {

                ctx.beginPath();

                ctx.arc(
                    cx + pos[0],
                    cy + pos[1],
                    5,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        );
    }
}


// =========================================================
// GAMBAR GAME
// =========================================================

function gambarGame() {

    gambarBackgroundGame();

    for (const item of makanan) {
        gambarMakanan(item);
    }

    gambarUlar();

    updateInfo();
}


// =========================================================
// GAME LOOP TAMPILAN
// =========================================================

function render() {

    if (!gamePage.classList.contains("hidden")) {
        gambarGame();
    }

    requestAnimationFrame(render);
}

render();


// =========================================================
// KEMBALI KE HOME
// =========================================================

function kembaliKeHome() {

    sedangBermain = false;
    gameOver = false;

    if (gameTimer !== null) {

        clearInterval(gameTimer);

        gameTimer = null;
    }

    gameOverBox.classList.add("hidden");

    gamePage.classList.add("hidden");
    homePage.classList.remove("hidden");
}


// =========================================================
// MAIN LAGI
// =========================================================

function mainLagi() {

    gameOverBox.classList.add("hidden");

    sedangBermain = true;

    resetGame();

    mulaiTimer();
}


// =========================================================
// TOMBOL HOME
// =========================================================

startButton.addEventListener(
    "click",
    mulaiGame
);


// Tombol keluar dari halaman awal

exitHomeButton.addEventListener(
    "click",
    () => {

        // Mencoba menutup halaman
        window.close();

        // Jika browser tidak mengizinkan,
        // tampilkan pesan sederhana

        setTimeout(() => {

            if (!document.hidden) {

                alert(
                    "Game selesai. Silakan tutup tab ini."
                );
            }

        }, 100);
    }
);


// =========================================================
// TOMBOL GAME OVER
// =========================================================

// MAIN LAGI

restartButton.addEventListener(
    "click",
    mainLagi
);


// KELUAR GAME OVER
// Kembali ke halaman HOME

exitGameButton.addEventListener(
    "click",
    kembaliKeHome
);


// =========================================================
// TOMBOL ARAH
// =========================================================

upButton.addEventListener(
    "click",
    () => ubahArah(0, -GRID_SIZE)
);

leftButton.addEventListener(
    "click",
    () => ubahArah(-GRID_SIZE, 0)
);

downButton.addEventListener(
    "click",
    () => ubahArah(0, GRID_SIZE)
);

rightButton.addEventListener(
    "click",
    () => ubahArah(GRID_SIZE, 0)
);


// =========================================================
// KEYBOARD
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        // HOME

        if (
            !gamePage.classList.contains("hidden")
        ) {

            if (
                event.key === "Escape"
            ) {

                kembaliKeHome();

                return;
            }
        }


        // GAME OVER

        if (gameOver) {

            if (
                event.key === "r" ||
                event.key === "R" ||
                event.key === "Enter"
            ) {

                mainLagi();

            } else if (
                event.key === "Escape"
            ) {

                kembaliKeHome();
            }

            return;
        }


        // GAME

        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === "W"
        ) {

            ubahArah(
                0,
                -GRID_SIZE
            );

        } else if (
            event.key === "ArrowDown" ||
            event.key === "s" ||
            event.key === "S"
        ) {

            ubahArah(
                0,
                GRID_SIZE
            );

        } else if (
            event.key === "ArrowLeft" ||
            event.key === "a" ||
            event.key === "A"
        ) {

            ubahArah(
                -GRID_SIZE,
                0
            );

        } else if (
            event.key === "ArrowRight" ||
            event.key === "d" ||
            event.key === "D"
        ) {

            ubahArah(
                GRID_SIZE,
                0
            );
        }
    }
);


// =========================================================
// TOUCH HP
// =========================================================

// Mencegah layar ikut scroll saat bermain

document.addEventListener(
    "touchmove",
    function(event) {

        event.preventDefault();

    },
    {
        passive: false
    }
);