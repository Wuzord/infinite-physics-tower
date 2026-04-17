{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const \{ Engine, Render, Runner, Bodies, Composite, Body, Events \} = Matter;\
\
const engine = Engine.create();\
const world = engine.world;\
\
const canvas = document.getElementById("game");\
\
const render = Render.create(\{\
  canvas,\
  engine,\
  options: \{\
    width: window.innerWidth,\
    height: window.innerHeight,\
    wireframes: false,\
    background: "#111"\
  \}\
\});\
\
Render.run(render);\
Runner.run(Runner.create(), engine);\
\
// --- Ground ---\
const ground = Bodies.rectangle(\
  window.innerWidth / 2,\
  window.innerHeight - 50,\
  400,\
  40,\
  \{ isStatic: true, render: \{ fillStyle: "#555" \} \}\
);\
\
Composite.add(world, ground);\
\
// --- State ---\
let blocks = [];\
let current = null;\
let maxHeight = 0;\
let gameOver = false;\
\
// --- Load shapes ---\
const assets = [\
  "assets/block1.png",\
  "assets/block2.png"\
];\
\
let vertexCache = [];\
\
async function loadShapes() \{\
  for (let url of assets) \{\
    const verts = await imageToVertices(url);\
    vertexCache.push(verts);\
  \}\
\}\
\
function createBlock(x, y) \{\
  const verts = vertexCache[Math.floor(Math.random() * vertexCache.length)];\
\
  const body = Bodies.fromVertices(x, y, verts, \{\
    friction: 0.8,\
    restitution: 0.1,\
    render: \{\
      fillStyle: "#ccc"\
    \}\
  \}, true);\
\
  return body;\
\}\
\
// --- Spawn ---\
function spawn() \{\
  if (gameOver) return;\
\
  current = createBlock(window.innerWidth / 2, 100);\
  Body.setStatic(current, true);\
  Composite.add(world, current);\
\}\
\
// --- Drop ---\
window.addEventListener("click", () => \{\
  if (!current || gameOver) return;\
\
  Body.setStatic(current, false);\
  blocks.push(current);\
  current = null;\
\
  setTimeout(spawn, 600);\
\});\
\
// --- Camera ---\
Events.on(engine, "beforeUpdate", () => \{\
  if (blocks.length === 0) return;\
\
  const highest = Math.min(...blocks.map(b => b.position.y));\
  maxHeight = Math.max(maxHeight, window.innerHeight - highest);\
\
  render.bounds.min.y = highest - 300;\
  render.bounds.max.y = highest + window.innerHeight - 300;\
  render.options.hasBounds = true;\
\});\
\
// --- Instability ---\
Events.on(engine, "beforeUpdate", () => \{\
  blocks.forEach((b, i) => \{\
    Body.applyForce(b, b.position, \{\
      x: Math.sin(Date.now() * 0.001 + i) * 0.00025,\
      y: 0\
    \});\
  \});\
\});\
\
// --- Game Over ---\
Events.on(engine, "afterUpdate", () => \{\
  blocks.forEach(b => \{\
    if (b.position.y > window.innerHeight + 300) \{\
      gameOver = true;\
      setTimeout(() => \{\
        alert("Game Over\\nHeight: " + Math.floor(maxHeight));\
        location.reload();\
      \}, 100);\
    \}\
  \});\
\});\
\
// --- Init ---\
(async () => \{\
  await loadShapes();\
  spawn();\
\})();\
\
// --- Resize ---\
window.addEventListener("resize", () => \{\
  render.canvas.width = window.innerWidth;\
  render.canvas.height = window.innerHeight;\
\});}