let missions = [];
let shells = [];
let currentMission = null;

async function loadData() {
    missions = await fetch("data/missions.json").then(r => r.json());
    shells = await fetch("data/shells.json").then(r => r.json());
    loadMission(0);
}

function loadMission(index) {
    currentMission = missions[index];
    document.getElementById("missionText").innerText = currentMission.description;
}

function kmToM(km) {
    return km * 1000;
}

function effectiveVelocity(baseVel, powder, maxPowder) {
    const factor = powder / maxPowder;
    return baseVel * (0.5 + factor * 0.5);
}

function calculateAngle(distanceM, velocity) {
    const g = 9.81;
    const inside = (distanceM * g) / (velocity * velocity);

    if (inside > 1) return -1;

    const angleRad = 0.5 * Math.asin(inside);
    return angleRad * (180 / Math.PI);
}

function calculateSolution() {
    const distKm = Math.hypot(
        currentMission.targetPos.x - currentMission.turretPos.x,
        currentMission.targetPos.y - currentMission.turretPos.y
    );

    const distM = kmToM(distKm);

    const shellId = document.getElementById("shellSelect").value;
    const shell = shells.find(s => s.id === shellId);

    const powder = Number(document.getElementById("powder").value);

    const vel = effectiveVelocity(shell.baseVelocity, powder, 5);
    const angle = calculateAngle(distM, vel);

    const output = document.getElementById("output");

    if (angle < 0) {
        output.innerText = "Target out of range";
    } else {
        output.innerText = "Solution angle: " + angle.toFixed(1) + "°";
    }
}
