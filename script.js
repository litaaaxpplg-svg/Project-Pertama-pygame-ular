// =========================
// PENGATURAN GAME
// =========================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const home = document.getElementById("home");
const game = document.getElementById("game");

const mulai = document.getElementById("mulai");
const keluar = document.getElementById("keluar");

const skorText = document.getElementById("skor");
const gameOverBox = document.getElementById("gameOver");
const skorAkhir = document.getElementById("skorAkhir");

const GRID_SIZE = 20;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

// =========================
// WARNA
// =========================

const warnaUlang = [
    ["#3c8cd2", "#64b4f0", "#8cc8fa"],
    ["#50b464", "#78dc8c", "#a0f0aa"],
    ["#965ad2", "#b482e6", "#d2aaf5"],
    ["#f09632", "#fab45a", "#ffd282"],
    ["#dc465a", "#f06e78", "#fa96a0"]
];

const warnaMakanan = {
    apel: "#eb4655",
    stroberi: "#ff91b9",
    jeruk: "#ffd24b",
    anggur: "#af7de1",
    apel_hijau: "#5abe6e"
};

const jenisMakanan = [
    "apel",
    "stroberi",
    "jeruk",
    "anggur",
    "apel_hijau"
];

// =========================
// DATA GAME
// =========================

let snake = [];
let makanan = [];

let arah = {
    x: 1,
    y: 0
};

let skor = 0;
let warnaIndex = 0;

let gameOver = false;
let sedangMain = false;

let kecepatan = 120;
let waktuTerakhir = 0;

// =========================
// UKURAN LAYAR
// =========================

function ubahUkuran() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}

window.addEventListener("resize", ubahUkuran);

// =========================
// RESET GAME
// =========================

function resetGame() {
    let x = Math.floor(WIDTH / 2 / GRID_SIZE) * GRID_SIZE;
    let y = Math.floor(HEIGHT / 2 / GRID_SIZE) * GRID_SIZE;

    snake = [
        { x: x, y: y },
        { x: x - GRID_SIZE, y: y },
        { x: x - GRID_SIZE * 2, y: y }
    ];

    arah = {
        x: 1,
        y: 0
    };

    skor = 0;
    warnaIndex = 0;
    gameOver = false;

    kecepatan = 120;

    makanan = [];

    for (let i = 0; i < 8; i++) {
        buatMakanan();
    }

    skorText.innerText = "SKOR 0";
    gameOverBox.style.display = "none";
}

// =========================
// MEMBUAT MAKANAN
// =========================

function buatMakanan() {
    let posisi;

    for (let percobaan = 0; percobaan < 100; percobaan++) {

        let x = Math.floor(
            Math.random() * (WIDTH / GRID_SIZE)
        ) * GRID_SIZE;

        let y = Math.floor(
            Math.random() * (HEIGHT / GRID_SIZE)
        ) * GRID_SIZE;

        posisi = {
            x: x,
            y: y,
            jenis: jenisMakanan[
                Math.floor(Math.random() * jenisMakanan.length)
            ]
        };

        let kenaUlar = false;

        for (let bagian of snake) {
            if (
                posisi.x === bagian.x &&
                posisi.y === bagian.y
            ) {
                kenaUlar = true;
                break;
            }
        }

        if (!kenaUlar) {
            makanan.push(posisi);
            return;
        }
    }
}

// =========================
// MENGUBAH ARAH
// =========================

function ubahArah(x, y) {

    // Ular tidak boleh langsung berbalik arah
    if (x === -arah.x && y === -arah.y) {
        return;
    }

    arah.x = x;
    arah.y = y;
}

// =========================
// GAMBAR BACKGROUND
// =========================

function gambarBackground() {

    ctx.fillStyle = "#cdebf8";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Grid
    ctx.strokeStyle = "#b9dcf0";
    ctx.lineWidth = 1;

    for (let x = 0; x < WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y < HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    // Bukit
    ctx.fillStyle = "#b4e69a";

    ctx.beginPath();
    ctx.arc(
        WIDTH / 5,
        HEIGHT - 85,
        110,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#5abe6e";

    ctx.beginPath();
    ctx.arc(
        WIDTH / 2,
        HEIGHT - 65,
        140,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#b4e69a";

    ctx.beginPath();
    ctx.arc(
        WIDTH - WIDTH / 6,
        HEIGHT - 85,
        115,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#5abe6e";
    ctx.fillRect(0, HEIGHT - 85, WIDTH, 85);

    // Bunga
    for (let x = 30; x < WIDTH; x += 100) {

        let y = HEIGHT - 45;

        ctx.strokeStyle = "#5abe6e";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 25);
        ctx.stroke();

        ctx.fillStyle = "#ff91b9";

        ctx.beginPath();
        ctx.arc(x - 5, y - 5, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffd24b";

        ctx.beginPath();
        ctx.arc(x + 5, y - 5, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.arc(x, y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Awan
    gambarAwan(70, 85);
    gambarAwan(WIDTH - 180, 100);
}

// =========================
// GAMBAR AWAN
// =========================

function gambarAwan(x, y) {

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 25, y - 10, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 52, y, 21, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(x, y, 52, 22);
}

// =========================
// GAMBAR MAKANAN
// =========================

function gambarMakanan(item) {

    let x = item.x + GRID_SIZE / 2;
    let y = item.y + GRID_SIZE / 2;

    let r = GRID_SIZE / 2 - 2;

    ctx.fillStyle = warnaMakanan[item.jenis];

    if (
        item.jenis === "apel" ||
        item.jenis === "apel_hijau"
    ) {

        ctx.beginPath();
        ctx.arc(x - 3, y + 2, r - 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 4, y + 2, r - 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#2d3241";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x, y - r + 2);
        ctx.lineTo(x + 2, y - r - 5);
        ctx.stroke();

        ctx.fillStyle = "#5abe6e";
        ctx.beginPath();
        ctx.ellipse(
            x + 6,
            y - r - 4,
            5,
            3,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

    } else if (item.jenis === "stroberi") {

        ctx.fillStyle = "#ff91b9";

        ctx.beginPath();
        ctx.moveTo(x, y + r);
        ctx.lineTo(x - r, y - r / 2);
        ctx.lineTo(x - r / 2, y - r);
        ctx.lineTo(x + r / 2, y - r);
        ctx.lineTo(x + r, y - r / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.arc(x - 4, y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 4, y + 3, 2, 0, Math.PI * 2);
        ctx.fill();

    } else if (item.jenis === "jeruk") {

        ctx.fillStyle = "#ffd24b";

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

    } else if (item.jenis === "anggur") {

        ctx.fillStyle = "#af7de1";

        let titik = [
            [x, y - 5],
            [x - 6, y],
            [x + 6, y],
            [x - 7, y + 7],
            [x, y + 7],
            [x + 7, y + 7],
            [x, y + 13]
        ];

        for (let pos of titik) {
            ctx.beginPath();
            ctx.arc(pos[0], pos[1], 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// =========================
// GAMBAR ULAR
// =========================

function gambarSnake() {

    let warna = warnaUlang[warnaIndex];

    for (let i = snake.length - 1; i >= 0; i--) {

        let bagian = snake[i];

        if (i === 0) {
            ctx.fillStyle = warna[0];
        } else if (i % 2 === 0) {
            ctx.fillStyle = warna[1];
        } else {
            ctx.fillStyle = warna[2];
        }

        ctx.beginPath();

        ctx.arc(
            bagian.x + GRID_SIZE / 2,
            bagian.y + GRID_SIZE / 2,
            GRID_SIZE / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    gambarMata();
}

// =========================
// MATA ULAR
// =========================

function gambarMata() {

    let kepala = snake[0];

    let x1;
    let y1;
    let x2;
    let y2;

    if (arah.x === 1) {

        x1 = kepala.x + 14;
        y1 = kepala.y + 6;

        x2 = kepala.x + 14;
        y2 = kepala.y + 14;

    } else if (arah.x === -1) {

        x1 = kepala.x + 6;
        y1 = kepala.y + 6;

        x2 = kepala.x + 6;
        y2 = kepala.y + 14;

    } else if (arah.y === -1) {

        x1 = kepala.x + 6;
        y1 = kepala.y + 6;

        x2 = kepala.x + 14;
        y2 = kepala.y + 6;

    } else {

        x1 = kepala.x + 6;
        y1 = kepala.y + 14;

        x2 = kepala.x + 14;
        y2 = kepala.y + 14;
    }

    gambarMataSatu(x1, y1);
    gambarMataSatu(x2, y2);
}

function gambarMataSatu(x, y) {

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2d3241";

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
}

// =========================
// GERAK ULAR
// =========================

function gerakSnake() {

    let kepala = snake[0];

    let kepalaBaru = {
        x: kepala.x + arah.x * GRID_SIZE,
        y: kepala.y + arah.y * GRID_SIZE
    };

    snake.unshift(kepalaBaru);

    let makananKena = -1;

    // Collision makanan
    for (let i = 0; i < makanan.length; i++) {

        if (
            kepalaBaru.x === makanan[i].x &&
            kepalaBaru.y === makanan[i].y
        ) {
            makananKena = i;
            break;
        }
    }

    if (makananKena !== -1) {

        // Ular bertambah panjang
        skor++;

        warnaIndex =
            (warnaIndex + 1) % warnaUlang.length;

        makanan.splice(makananKena, 1);

        // Makanan baru muncul
        buatMakanan();

        // Kecepatan bertambah
        kecepatan = Math.max(
            55,
            120 - Math.floor(skor / 3) * 10
        );

    } else {

        // Kalau tidak makan, ekor dihapus
        snake.pop();
    }

    // =========================
    // COLLISION DINDING
    // =========================

    if (
        kepalaBaru.x < 0 ||
        kepalaBaru.x >= WIDTH ||
        kepalaBaru.y < 0 ||
        kepalaBaru.y >= HEIGHT
    ) {
        selesaiGame();
        return;
    }

    // =========================
    // COLLISION TUBUH
    // =========================

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

// =========================
// GAME OVER
// =========================

function selesaiGame() {

    gameOver = true;

    skorAkhir.innerText =
        "SKOR AKHIR : " + skor;

    gameOverBox.style.display = "flex";
}

// =========================
// UPDATE GAME
// =========================

function updateGame(waktu) {

    if (!sedangMain) {
        return;
    }

    if (!gameOver) {

        if (
            waktu - waktuTerakhir >= kecepatan
        ) {
            gerakSnake();
            waktuTerakhir = waktu;
        }
    }

    gambarBackground();

    for (let item of makanan) {
        gambarMakanan(item);
    }

    gambarSnake();

    skorText.innerText =
        "SKOR " + skor;

    requestAnimationFrame(updateGame);
}

// =========================
// MULAI GAME
// =========================

function mulaiGame() {

    resetGame();

    home.style.display = "none";
    game.style.display = "block";

    sedangMain = true;

    waktuTerakhir = performance.now();

    requestAnimationFrame(updateGame);
}

// =========================
// KEMBALI KE HOME
// =========================

function kembaliHome() {

    sedangMain = false;

    game.style.display = "none";
    home.style.display = "block";

    gameOverBox.style.display = "none";
}

// =========================
// BUTTON HOME
// =========================

mulai.addEventListener("click", function() {
    mulaiGame();
});

keluar.addEventListener("click", function() {
    window.close();
});

// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown", function(event) {

    if (!sedangMain) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            mulaiGame();
        }

        return;
    }

    if (!gameOver) {

        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === "W"
        ) {
            ubahArah(0, -1);
        }

        else if (
            event.key === "ArrowDown" ||
            event.key === "s" ||
            event.key === "S"
        ) {
            ubahArah(0, 1);
        }

        else if (
            event.key === "ArrowLeft" ||
            event.key === "a" ||
            event.key === "A"
        ) {
            ubahArah(-1, 0);
        }

        else if (
            event.key === "ArrowRight" ||
            event.key === "d" ||
            event.key === "D"
        ) {
            ubahArah(1, 0);
        }

        else if (event.key === "Escape") {
            kembaliHome();
        }

    } else {

        if (
            event.key === "r" ||
            event.key === "R"
        ) {
            mulaiGame();
        }

        else if (event.key === "Escape") {
            kembaliHome();
        }
    }
});

// =========================
// TOMBOL HP
// =========================

document.getElementById("atas").addEventListener(
    "click",
    function() {
        if (!gameOver) {
            ubahArah(0, -1);
        }
    }
);

document.getElementById("bawah").addEventListener(
    "click",
    function() {
        if (!gameOver) {
            ubahArah(0, 1);
        }
    }
);

document.getElementById("kiri").addEventListener(
    "click",
    function() {
        if (!gameOver) {
            ubahArah(-1, 0);
        }
    }
);

document.getElementById("kanan").addEventListener(
    "click",
    function() {
        if (!gameOver) {
            ubahArah(1, 0);
        }
    }
);

// =========================
// AWAL PROGRAM
// =========================

home.style.display = "block";
game.style.display = "none";