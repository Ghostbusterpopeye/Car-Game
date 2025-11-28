const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

let player = {
    speed: 7,
    // Perbaikan: Inisialisasi properti yang dibutuhkan
    start: false,
    score: 0,
    car: null // Referensi mobil akan disimpan di sini
};

startScreen.addEventListener("click", startGame);

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

function keyDown(e) {
    e.preventDefault();
    // Gunakan 'e.key' yang sesuai dengan objek keys
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
}
function keyUp(e) {
    e.preventDefault();
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
}

function gamePlay() {
    let car = player.car; // Menggunakan referensi yang disimpan
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemyCar(car);

        // Pergerakan Mobil
        if (keys.ArrowUp && player.y > road.top + 150) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < road.bottom - 80) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < road.width - 70) {
            player.x += player.speed;
        }

        car.style.top = `${player.y}px`;
        car.style.left = `${player.x}px`;

        // Loop Game
        window.requestAnimationFrame(gamePlay);

        // Update Score
        player.score++;
        score.innerHTML = "Score: " + player.score;
    }
}
function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach((line) => {
        // Asumsi line.y sudah diset di startGame
        if (line.y >= 700) {
            line.y -= 750;
        }
        line.y += player.speed;
        line.style.top = line.y + "px";
    });
}

function isCollide(car, enemyCar) {
    const carRect = car.getBoundingClientRect();
    const enemyCarRect = enemyCar.getBoundingClientRect();

    return !(
        carRect.top > enemyCarRect.bottom ||
        carRect.left > enemyCarRect.right ||
        carRect.right < enemyCarRect.left ||
        carRect.bottom < enemyCarRect.top
    );
}

function moveEnemyCar(car) {
    let enemyCars = document.querySelectorAll(".enemyCar");
    enemyCars.forEach((enemyCar) => {
        if (isCollide(car, enemyCar)) {
            endGame();
        }

        // Ketika mobil musuh keluar dari layar bawah
        if (enemyCar.y >= 750) {
            enemyCar.y = -300;
            enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
            // Jika Anda ingin kecepatan mobil musuh lebih cepat dari garis jalan:
            // enemyCar.speedOffset = Math.floor(Math.random() * 5); 
        }
        
        // Pergerakan mobil musuh disinkronkan dengan kecepatan jalan
        enemyCar.y += player.speed;
        enemyCar.style.top = enemyCar.y + "px";
    });
}

function startGame() {
    score.classList.remove("hide");
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    
    window.requestAnimationFrame(gamePlay);

    // 1. Membuat Garis Jalan
    for (let i = 0; i < 5; i++) {
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "line");
        roadLine.y = i * 150;
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    // 2. Membuat Mobil Pemain
    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);
    
    // Perbaikan: Simpan referensi ke player.car
    player.car = car; 

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // 3. Membuat Mobil Musuh
    for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement("div");
        enemyCar.setAttribute("class", "enemyCar");
        // Menggunakan properti 'y' pada elemen DOM untuk pelacakan posisi
        enemyCar.y = (i + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundImage = `url("./images/car${i + 1}.png")`;
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }
}

function endGame() {
    player.start = false;
    startScreen.classList.remove("hide");
    startScreen.innerHTML = `Game Over<br>Skor Akhir Anda adalah: ${player.score}<br>Klik untuk memulai kembali.`;
}