{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 async function imageToVertices(url) \{\
  const img = new Image();\
  img.src = url;\
\
  await img.decode();\
\
  const canvas = document.createElement("canvas");\
  const ctx = canvas.getContext("2d");\
\
  canvas.width = img.width;\
  canvas.height = img.height;\
\
  ctx.drawImage(img, 0, 0);\
\
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;\
\
  const points = [];\
\
  // SIMPLE EDGE DETECTION (beta-level)\
  for (let y = 0; y < canvas.height; y += 2) \{\
    for (let x = 0; x < canvas.width; x += 2) \{\
      const i = (y * canvas.width + x) * 4;\
      const alpha = data[i + 3];\
\
      if (alpha > 200) \{\
        // check neighbor transparency \uc0\u8594  edge\
        const right = ((y * canvas.width + (x + 2)) * 4);\
        if (data[right + 3] < 200) \{\
          points.push(\{ x, y \});\
        \}\
      \}\
    \}\
  \}\
\
  // fallback if too few points\
  if (points.length < 10) \{\
    return [\
      \{ x: 0, y: 0 \},\
      \{ x: img.width, y: 0 \},\
      \{ x: img.width, y: img.height \},\
      \{ x: 0, y: img.height \}\
    ];\
  \}\
\
  return points;\
\}}