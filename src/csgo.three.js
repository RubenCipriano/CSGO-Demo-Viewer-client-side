import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { FontLoader, TextGeometry } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

const SIZE = 1;

var currentRound = 0;
var currentTick = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, -1 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth / SIZE, window.innerHeight / SIZE);
document.body.appendChild( renderer.domElement );

const playersMesh = [];

camera.position.x = -500 * SIZE;
camera.position.y = -750 * SIZE;
camera.position.z = (5000 * SIZE) - (1000 * SIZE);

var play = false;

// Create a texture loader so we can load our image file
var loader = new THREE.TextureLoader();

// Load an image file into a custom material
var material = new THREE.MeshLambertMaterial({
  map: loader.load(`/src/map/${demoFile.header.mapName}.png`)
});

// create a plane geometry for the image with a width of 10
// and a height that preserves the image's aspect ratio
var geometry = new THREE.PlaneGeometry(5000 * SIZE, 5000 * SIZE);

// combine our image geometry and material into a mesh
var mesh = new THREE.Mesh(geometry, material);

// set the position of the image mesh in the x,y,z dimensions
mesh.position.set(-650 * SIZE, -800 * SIZE,0)

// add the image to the scene
scene.add(mesh);

// Add a point light with #fff color, .7 intensity, and 0 distance
var light = new THREE.PointLight( 0xffffff, 1, 0 );

// Specify the light's position
light.position.set(1, 1, 5000 );

// Add the light to the scene
scene.add(light)

var playerNames = []
var playerNamesMeshs = []

const fontLoader = new FontLoader();

function animate() {

    if(play) {
        intervalPlay = setTimeout(() => {
            if(currentTick < arrayOfticks.length) buttonNextTick.click()
        }, 150)
    }


    if(arrayOfticks[currentTick]) {
        if(playersMesh.length < 1) {
            if(arrayOfticks[currentTick].players) {
                arrayOfticks[currentTick].players.forEach((player, index) => {
                    var material = null;

                    const geometry = new THREE.CircleGeometry( 50 * SIZE, 32);
                    if(player.teamNumber == 3)
                        material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                    else
                        material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

                    playerNames.push(player.name);
                    playersMesh.push({userId: player.userId, mesh: new THREE.Mesh( geometry, material )});
                })
                
                playersMesh.forEach((playerMesh, index) => {
                    scene.add(playerMesh.mesh);

                    fontLoader.load('./src/fonts/ubuntu.json', (font) => {
                        var textGeometry = new TextGeometry( playerNames[index], {
                            font: font,
                            size: 50 * SIZE,
                            height: 75 * SIZE,
                        } );
                        var textMesh = new THREE.Mesh(textGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff }))

                        scene.add(textMesh);

                        playerNamesMeshs.push(textMesh);

                        textMesh.position.set(playerMesh.mesh.position.x, playerMesh.mesh.position.y, 1)
                    })
                })
            }
        }
        
        if(arrayOfticks[currentTick].players && playerNamesMeshs.length > 0) {
            arrayOfticks[currentTick].players.forEach((player, index) => {
                if(player.isAlive) {
                    playerNamesMeshs[index].position.set(player.position.x * SIZE, player.position.y * SIZE, 1);
                    playersMesh.find((playerMesh) => playerMesh.userId == player.userId).mesh.position.set(player.position.x * SIZE, player.position.y * SIZE, 1);
                } else {
                    playerNamesMeshs[index].position.set(1, 1, -1000);
                    playersMesh.find((playerMesh) => playerMesh.userId == player.userId).mesh.position.set(1, 1, -1000);
                }

                if(currentTick == 767) {
                    console.log(playerNamesMeshs[index])
                    console.log(arrayOfticks[currentTick].players)
                }
            })
        }
    }

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();

const buttonPrevTick = document.createElement('button');
buttonPrevTick.textContent = "Prev Tick"
buttonPrevTick.onclick = () => {
    currentTick - 1 < 0 ? currentTick = 0 : currentTick--
    if(tickCount) tickCount.textContent = arrayOfticks[currentTick].currentTick;
};
document.body.append(buttonPrevTick);

const buttonNextTick = document.createElement('button');
buttonNextTick.textContent = "Next Tick"
buttonNextTick.onclick = () => {
    currentTick + 1 > arrayOfticks.length ? currentTick = arrayOfticks.length - 1 : currentTick++;
    if(tickCount) tickCount.textContent = arrayOfticks[currentTick].currentTick;
}
document.body.append(buttonNextTick);

const playButton = document.createElement('button');
playButton.textContent = "Play"
playButton.onclick = () => {
    play = true;
}
document.body.append(playButton);


const pauseButton = document.createElement('button');
pauseButton.textContent = "Pause"
pauseButton.onclick = () => {
    play = false;
}
document.body.append(pauseButton);

const buttonPrevRound = document.createElement('button');
buttonPrevRound.textContent = "Prev Round"
buttonPrevRound.onclick = () => {
    currentRound - 1 <= 0 ? currentRound = 0 : currentRound--;
    currentTick = arrayOfticks.findIndex(tick => tick.currentTick == roundTicks[currentRound]) + 1;
    if(tickCount) tickCount.textContent = arrayOfticks[currentTick].currentTick;
};
document.body.append(buttonPrevRound);

const buttonNextRound = document.createElement('button');
buttonNextRound.textContent = "Next Round"
buttonNextRound.onclick = () => {
    currentRound + 1 >= roundTicks.length ? currentRound = (roundTicks.length - 1) : currentRound++;
    currentTick = arrayOfticks.findIndex(tick => tick.currentTick == roundTicks[currentRound]) + 1;
    if(tickCount) tickCount.textContent = arrayOfticks[currentTick].currentTick;
}
document.body.append(buttonNextRound);

const tickCount = document.createElement('p');
tickCount.textContent = arrayOfticks[currentTick].currentTick;;
document.body.append(tickCount);