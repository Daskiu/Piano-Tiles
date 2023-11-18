let socket;
let tiles = [];
let columnWidth;
let tileHeight = 100;
let spaceBetweenTiles = 100;
let fallSpeed = 4; // Puedes ajustar la velocidad de caída
let columnKeys = ['a', 's', 'd', 'f']; // Teclas asignadas a cada columna
let score = 0;
let startTime;
let duration = 45; // Duración en segundos
let timeBetweenTiles = 2000; // Tiempo en milisegundos entre la generación de tiles
let gameOver = false;

function setup() {
  createCanvas(400, 600);
  columnWidth = width / 4; // Calcula el ancho de cada columna

  socket = io();

  // Inicializar el juego y enviar actualizaciones al servidor
  // Implementar la lógica del juego aquí

  startTime = millis(); // Inicia el temporizador
}

function draw() {
  background(200);

  // Dibuja las líneas verticales para dividir el canvas en 4 columnas
  for (let i = 1; i < 4; i++) {
    let x = i * columnWidth;
    line(x, 0, x, height);
  }

  // Verifica si el juego ha terminado
  if (!gameOver) {
    // Verifica si el tiempo de juego ha alcanzado la duración deseada
    let currentTime = millis();
    if ((currentTime - startTime) / 1000 < duration) {
      // Si aún no ha pasado el tiempo deseado, continúa generando tiles
      generateTiles();
    } else {
      // Si ha pasado el tiempo deseado, establece el estado de game over
      gameOver = true;
    }

    // Actualiza la posición vertical de las tiles para que caigan
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].y += fallSpeed;

      // Si la tile ha alcanzado la parte inferior, indica el game over
      if (tiles[i].y > height) {
        gameOver = true;
      }

      // Dibuja las tiles
      fill(0, 0, 0); // Establece el color de las tiles (en este caso, azul)
      rect(tiles[i].x - tiles[i].width / 2, tiles[i].y, tiles[i].width, tiles[i].height);
    }

    // Verifica si se ha presionado una tecla sin una tile correspondiente
    checkWrongKeyPress();
  } else {
    // Si el juego ha terminado, muestra un mensaje de game over
    fill(255, 0, 0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
  }

  // Muestra la puntuación en la pantalla
  fill(0);
  textSize(20);
  text('Puntuación: ' + score, 20, 20);
}

// Manejar eventos del mouse, teclado, etc.
function keyPressed() {
    // Verifica si el juego está en curso
    if (!gameOver) {
      let keyMatched = false;
  
      // Verifica si se ha presionado una tecla asignada a una columna
      for (let i = 0; i < tiles.length; i++) {
        if (key === tiles[i].column) {
          // Realiza la acción correspondiente
          tiles.splice(i, 1); // Elimina la tile
          score++; // Aumenta la puntuación
          keyMatched = true;
          break;
        }
      }
  
      // Si la tecla presionada no coincide con ninguna columna, resta un punto
      if (!keyMatched) {
        score--;
      }
    }
  }

function generateTiles() {
  // Verifica si ha pasado suficiente tiempo desde la generación de la última tile
  let currentTime = millis();
  if (currentTime - (tiles.length > 0 ? tiles[tiles.length - 1].generationTime : startTime) > timeBetweenTiles) {
    // Crea una nueva tile
    for (let i = 0; i < 4; i++) {
      if (random() < 0.25) {
        let x = i * columnWidth + columnWidth / 2; // Centro de cada columna
        let y = 50; // Altura desde la parte superior
        let tileWidth = columnWidth - 10; // Ancho de la tile (5 píxeles menos de cada lado)
        let tile = { x, y, width: tileWidth, height: tileHeight, column: columnKeys[i], generationTime: currentTime };
        tiles.push(tile);
        break; // Genera solo una tile por ciclo
      }
    }
  }
}

function checkWrongKeyPress() {
    // Verifica si se ha presionado una tecla sin una tile correspondiente
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      if (tile.y > tileHeight + spaceBetweenTiles && !tile.wrongKeyProcessed) {
        // Si la tile ha pasado la posición donde debería haber sido presionada, resta un punto
        score--;
        tile.wrongKeyProcessed = true; // Marca la tile como procesada para evitar el doble conteo
      }
    }
  }