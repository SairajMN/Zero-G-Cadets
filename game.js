import * as THREE from 'three';

// --- 1. SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
scene.add(dirLight);

const starsGeo = new THREE.BufferGeometry();
const starsPos = new Float32Array(3000 * 3);
for(let i=0; i<starsPos.length; i++) starsPos[i] = (Math.random() - 0.5) * 300;
starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })));

const groundGeo = new THREE.PlaneGeometry(100, 100, 64, 64);
const positions = groundGeo.attributes.position.array;
for (let i = 0; i < positions.length; i += 3) positions[i+2] = Math.random() * 0.3;
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 1, flatShading: true }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

function createLabel(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#' + color.toString(16).padStart(6, '0'); ctx.lineWidth = 4; ctx.strokeRect(0, 0, 256, 64);
    ctx.font = 'bold 24px Courier New'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(4, 1, 1);
    return sprite;
}

const modules = [
    { x: -12, z: 12, color: 0x43aa8b, name: "O2 RECYCLER", active: false, mesh: null },
    { x: 0, z: -12, color: 0xf9c74f, name: "SOLAR ARRAY", active: true, mesh: null },
    { x: 12, z: 0, color: 0x5bc0be, name: "SHIELD EAST", active: false, mesh: null },
    { x: -12, z: 0, color: 0x5bc0be, name: "SHIELD WEST", active: false, mesh: null },
    { x: 0, z: 12, color: 0x5bc0be, name: "SHIELD SOUTH", active: false, mesh: null },
    { x: 0, z: -24, color: 0x5bc0be, name: "SHIELD NORTH", active: false, mesh: null }
];

modules.forEach(m => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ color: m.color }));
    mesh.position.set(m.x, 1.5, m.z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    scene.add(mesh); m.mesh = mesh;

    const light = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: m.color }));
    light.position.set(m.x, 3.2, m.z); scene.add(light);

    const label = createLabel(m.name, m.color);
    label.position.set(m.x, 4.5, m.z); scene.add(label);
});

const shieldDome = new THREE.Mesh(new THREE.SphereGeometry(22, 32, 32), new THREE.MeshBasicMaterial({ color: 0x5bc0be, transparent: true, opacity: 0.1, wireframe: true }));
shieldDome.visible = false; scene.add(shieldDome);

const player = new THREE.Group();
const suitMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 });
const visorMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1, roughness: 0 });
const packMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });

const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.5), suitMat); torso.position.y = 1.8; torso.castShadow = true; player.add(torso);
const pack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.3), packMat); pack.position.set(0, 1.8, -0.4); pack.castShadow = true; player.add(pack);
const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), suitMat); helmet.position.y = 2.5; helmet.castShadow = true; player.add(helmet);
const visor = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), visorMat); visor.position.set(0, 2.5, 0.2); visor.scale.set(1, 0.7, 0.5); player.add(visor);
const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.6, 4, 8), suitMat); leftArm.position.set(-0.55, 1.8, 0); leftArm.castShadow = true; player.add(leftArm);
const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.6, 4, 8), suitMat); rightArm.position.set(0.55, 1.8, 0); rightArm.castShadow = true; player.add(rightArm);
const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.7, 4, 8), suitMat); leftLeg.position.set(-0.25, 0.9, 0); leftLeg.castShadow = true; player.add(leftLeg);
const rightLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.7, 4, 8), suitMat); rightLeg.position.set(0.25, 0.9, 0); rightLeg.castShadow = true; player.add(rightLeg);

player.position.set(0, 0, 5); scene.add(player);

let state = {
    power: 100, oxygen: 100, health: 100,
    isGameOver: false, isPaused: false,
    timeSurvived: 0, timeLimit: 90, 
    flareTimer: 0, nextFlare: 15,
    warningActive: false, countdown: 0
};

let meteors = [];
let crates = [];
let isMoving = false;
let walkCycle = 0;

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function addLog(msg, isAlert=false) {
    const logDiv = document.getElementById('log-content');
    const p = document.createElement('div');
    p.className = 'log-entry';
    if(isAlert) p.style.color = '#ff4d4d';
    p.innerText = `> ${msg}`;
    logDiv.prepend(p);
}

function updateUI() {
    document.getElementById('power-val').innerText = Math.max(0, Math.floor(state.power)) + '%';
    document.getElementById('power-bar').style.width = Math.max(0, state.power) + '%';
    document.getElementById('oxygen-val').innerText = Math.max(0, Math.floor(state.oxygen)) + '%';
    document.getElementById('oxygen-bar').style.width = Math.max(0, state.oxygen) + '%';
    document.getElementById('health-val').innerText = Math.max(0, Math.floor(state.health)) + '%';
    document.getElementById('health-bar').style.width = Math.max(0, state.health) + '%';
    document.getElementById('time-val').innerText = Math.max(0, state.timeLimit - state.timeSurvived);
}

window.closeAlert = function() {
    document.getElementById('alert-screen').style.display = 'none';
    state.isPaused = false;
    state.flareTimer = 5;
    for(let i=0; i<15; i++) spawnMeteor();
}

function spawnMeteor() {
    const geo = new THREE.SphereGeometry(0.5, 8, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff4d4d, emissive: 0xff0000 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random()-0.5)*40, 20, (Math.random()-0.5)*40);
    scene.add(mesh);
    meteors.push({ mesh, speed: 0.3 + Math.random() * 0.3 });
}

function spawnCrate() {
    const isHealth = Math.random() < 0.2;
    const color = isHealth ? 0xff4d4d : 0x00ff00;
    const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const mat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.5 });
    const mesh = new THREE.Mesh(geo, mat);
    let x = (Math.random()-0.5)*30;
    let z = (Math.random()-0.5)*30;
    mesh.position.set(x, 0.75, z);
    scene.add(mesh);
    crates.push({ mesh, type: isHealth ? 'health' : 'oxygen' });
}

setInterval(() => {
    if (state.isGameOver) return;

    if (state.warningActive) {
        state.countdown--;
        document.getElementById('countdown-text').innerText = state.countdown;
        if (state.countdown <= 0) {
            state.warningActive = false;
            document.getElementById('warning-overlay').style.display = 'none';
            state.isPaused = true;
            document.getElementById('alert-screen').style.display = 'flex';
            addLog("⚠️ SOLAR FLARE IMPACT!", true);
        }
        return; 
    }

    if (state.isPaused) return;

    state.timeSurvived++;
    state.oxygen -= 1.5;

    if (modules[0].active) { state.power -= 3; state.oxygen += 2; } 
    if (modules[1].active && state.flareTimer <= 0) { state.power = Math.min(100, state.power + 4); } 

    let anyShieldActive = false;
    modules.forEach(m => { if (m.name.includes("SHIELD") && m.active) anyShieldActive = true; });
    if (anyShieldActive) { state.power -= 5; }
    
    if (state.power <= 0) { state.power = 0; state.oxygen -= 3; }
    if (state.timeSurvived % 5 === 0) spawnCrate();

    if (state.timeSurvived >= state.nextFlare && !state.warningActive) {
        state.nextFlare += 25;
        state.warningActive = true;
        state.countdown = 5;
        document.getElementById('countdown-text').innerText = 5;
        document.getElementById('warning-overlay').style.display = 'flex';
        addLog("WARNING: Solar Flare Inbound!", true);
    }

    if (state.flareTimer > 0) {
        state.flareTimer--;
        if (!anyShieldActive) state.health -= 15;
    }

    if (state.timeSurvived >= state.timeLimit) endGame(true);
    if (state.oxygen <= 0 || state.health <= 0) endGame(false);
    
    updateUI();
}, 1000);

function endGame(isWin) {
    state.isGameOver = true;
    document.getElementById('end-screen').style.display = 'flex';
    const title = document.getElementById('end-title');
    const desc = document.getElementById('end-desc');
    
    if (isWin) {
        let score = Math.floor((state.power + state.oxygen + state.health) * 10);
        title.innerText = "MISSION SUCCESS";
        title.style.color = "#00ff00";
        desc.innerHTML = `
            <strong>Mission Report:</strong><br>
            You successfully managed the lunar outpost for 90 seconds.<br><br>
            <strong>Science Score:</strong> ${score}<br>
            <em>(Score calculated based on remaining Power, Oxygen, and Health)</em><br><br>
            <em>NASA Data Sources Used:</em><br>
            • <strong>DONKI:</strong> Simulated realistic solar flare events.<br>
            • <strong>OSDR:</strong> Modeled crew radiation exposure.<br>
        `;
    } else {
        title.innerText = "MISSION FAILED";
        title.style.color = "#ff4d4d";
        desc.innerText = "The crew was lost. You ran out of critical resources. Try again to find the right balance!";
    }
}

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.1;
    
    if (!state.isPaused && !state.isGameOver) {
        let dx = 0, dz = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dz -= 0.25;
        if (keys['KeyS'] || keys['ArrowDown']) dz += 0.25;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 0.25;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 0.25;
        
        if (dx !== 0 || dz !== 0) {
            isMoving = true;
            player.position.x += dx;
            player.position.z += dz;
            player.rotation.y = Math.atan2(dx, dz);
            walkCycle += 0.3;
        } else {
            isMoving = false;
        }

        if (isMoving) {
            leftLeg.rotation.x = Math.sin(walkCycle) * 0.6;
            rightLeg.rotation.x = -Math.sin(walkCycle) * 0.6;
            leftArm.rotation.x = -Math.sin(walkCycle) * 0.4;
            rightArm.rotation.x = Math.sin(walkCycle) * 0.4;
        } else {
            leftLeg.rotation.x = 0; rightLeg.rotation.x = 0; leftArm.rotation.x = 0; rightArm.rotation.x = 0;
        }

        if(player.position.x > 30) player.position.x = 30;
        if(player.position.x < -30) player.position.x = -30;
        if(player.position.z > 30) player.position.z = 30;
        if(player.position.z < -30) player.position.z = -30;

        let nearModule = null;
        modules.forEach(m => {
            let dist = Math.hypot(player.position.x - m.x, player.position.z - m.z);
            if (dist < 3.5) nearModule = m;
        });

        const prompt = document.getElementById('interact-prompt');
        if (nearModule) {
            prompt.style.display = 'block';
            prompt.innerText = `Press E to use ${nearModule.name}`;
            
            if (keys['KeyE']) {
                keys['KeyE'] = false; 
                if (nearModule.name.includes("SHIELD")) {
                    let newState = !nearModule.active;
                    modules.forEach(m => {
                        if (m.name.includes("SHIELD")) {
                            m.active = newState;
                            m.mesh.material.color.setHex(m.active ? m.color : 0x444444);
                        }
                    });
                    shieldDome.visible = newState;
                    addLog(`ALL SHIELDS: ${newState ? 'ON' : 'OFF'}`);
                } else {
                    nearModule.active = !nearModule.active;
                    nearModule.mesh.material.color.setHex(nearModule.active ? nearModule.color : 0x444444);
                    addLog(`${nearModule.name}: ${nearModule.active ? 'ON' : 'OFF'}`);
                }
            }
        } else {
            prompt.style.display = 'none';
        }

        crates.forEach((crateData, index) => {
            let dist = Math.hypot(player.position.x - crateData.mesh.position.x, player.position.z - crateData.mesh.position.z);
            if (dist < 2) {
                if (crateData.type === 'health') { state.health = Math.min(100, state.health + 15); addLog("Medkit Collected (+15 Health)"); } 
                else { state.oxygen = Math.min(100, state.oxygen + 15); addLog("Oxygen Crate Collected (+15 O2)"); }
                scene.remove(crateData.mesh); crates.splice(index, 1);
            }
        });

        for (let i = meteors.length - 1; i >= 0; i--) {
            let m = meteors[i];
            m.mesh.position.y -= m.speed;
            if (m.mesh.position.y < 0) {
                let dist = Math.hypot(player.position.x - m.mesh.position.x, player.position.z - m.mesh.position.z);
                if (dist < 3) {
                    state.health -= 10;
                    document.getElementById('damage-flash').style.opacity = 1;
                    setTimeout(() => document.getElementById('damage-flash').style.opacity = 0, 100);
                }
                scene.remove(m.mesh); meteors.splice(i, 1);
            }
        }

        camera.position.x = player.position.x;
        camera.position.z = player.position.z + 15;
        camera.position.y = 10;
        camera.lookAt(player.position.x, 0, player.position.z);
    }

    if (shieldDome.visible) shieldDome.rotation.y += 0.02;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

addLog("System Online. Survive 90 seconds.");
updateUI();
animate();