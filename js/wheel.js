<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Birthday Wheel</title>
  <style>
    body {
      background: #1e2a78; /* Dark blue background for playful vibe */
      font-family: 'Comic Sans MS', cursive, sans-serif;
      color: #fff;
      text-align: center;
      padding: 30px;
    }
    #wheel-container {
      position: relative;
      display: inline-block;
      margin-top: 40px;
    }
    canvas#wheel {
      background: #f7f7f7;
      border-radius: 50%;
      box-shadow: 0 0 20px #ff6eb4;
      display: block;
      margin: 0 auto;
    }
    #spinBtn {
      margin-top: 30px;
      padding: 14px 40px;
      font-size: 1.4rem;
      border-radius: 30px;
      border: none;
      background: linear-gradient(45deg, #ffde59, #ff6eb4, #5adb5a);
      color: #222222;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 0 25px #ffde59;
      transition: background 0.3s ease;
    }
    #spinBtn:hover {
      background: linear-gradient(45deg, #ff6eb4, #5adb5a, #ffde59);
    }
    #result {
      margin-top: 25px;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 0 10px #fff;
    }
    /* Redirect button style (will be injected dynamically) */
  </style>
</head>
<body>

  <h1>Spin the Birthday Wheel!</h1>

  <div id="wheel-container">
    <canvas id="wheel" width="400" height="400"></canvas>
    <!-- The redirect button will be dynamically created here -->
  </div>

  <button id="spinBtn">Spin 🎉</button>

  <div id="result"></div>

  <script>
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const resultDiv = document.getElementById('result');

    const segments = [
      { label: 'Letter', color: '#ffde59', url: 'future-letter.html' },  // yellow
      { label: 'Chess', color: '#5adb5a', url: 'chess.html' },           // bright green
      { label: 'Quiz', color: '#ff6eb4', url: 'quiz.html' },             // pink
      { label: 'Letter', color: '#ffde59', url: 'future-letter.html' },
      { label: 'Chess', color: '#5adb5a', url: 'chess.html' },
      { label: 'Quiz', color: '#ff6eb4', url: 'quiz.html' },
    ];

    const numSegments = segments.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    let currentAngle = 0;
    let spinTimeout = null;
    let spinVelocity = 0;
    let isSpinning = false;
    let selectedSegment = null;

    function drawWheel() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw segments
      for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment + currentAngle;
        const endAngle = startAngle + anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segments[i].color;
        ctx.fill();

        // Text styling & placement
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#222222';  // dark text for contrast
        ctx.font = 'bold 24px "Comic Sans MS", cursive, sans-serif';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 3;
        ctx.fillText(segments[i].label.toUpperCase(), radius - 20, 12);
        ctx.restore();
      }

      // Center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 70, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffde59';  // bright yellow center
      ctx.shadowColor = '#ff6eb4';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#5adb5a';  // green border
      ctx.stroke();

      // Pointer
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius - 15);
      ctx.lineTo(centerX - 18, centerY - radius + 33);
      ctx.lineTo(centerX + 18, centerY - radius + 33);
      ctx.closePath();
      ctx.fillStyle = '#ff6eb4';  // pink pointer
      ctx.shadowColor = '#ff6eb4';
      ctx.shadowBlur = 10;
      ctx.fill();
    }

    function spin() {
      if (isSpinning) return;
      isSpinning = true;
      spinVelocity = Math.random() * 0.3 + 0.3;

      removeRedirectBtn();

      function animate() {
        if (spinVelocity <= 0.002) {
          isSpinning = false;
          determineSegment();
          return;
        }
        currentAngle += spinVelocity;
        currentAngle %= 2 * Math.PI;
        spinVelocity *= 0.97;

        drawWheel();
        spinTimeout = requestAnimationFrame(animate);
      }

      animate();
    }

    function determineSegment() {
      const normalizedAngle = (2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
      const index = Math.floor(normalizedAngle / anglePerSegment);
      selectedSegment = segments[index];
      resultDiv.textContent = `You landed on: ${selectedSegment.label}!`;

      createRedirectBtn(selectedSegment);
    }

    function createRedirectBtn(segment) {
      removeRedirectBtn();

      if (!segment) return;

      const btn = document.createElement('button');
      btn.id = 'redirectBtn';
      btn.textContent = `Lesss goooo → ${segment.label}`;
      btn.style.position = 'absolute';
      btn.style.left = '50%';
      btn.style.top = '50%';
      btn.style.transform = 'translate(-50%, -50%)';
      btn.style.padding = '16px 40px';
      btn.style.fontSize = '1.5rem';
      btn.style.backgroundColor = '#ff6eb4';  // pinkish
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.borderRadius = '30px';
      btn.style.cursor = 'pointer';
      btn.style.boxShadow = '0 0 25px #ff6eb4';
      btn.style.fontWeight = '700';
      btn.style.transition = 'background-color 0.3s ease';

      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#d05287';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = '#ff6eb4';
      });

      btn.addEventListener('click', () => {
        window.location.href = segment.url;
      });

      const container = canvas.parentElement;
      container.style.position = 'relative'; // ensure relative for absolute child
      container.appendChild(btn);
    }

    function removeRedirectBtn() {
      const existingBtn = document.getElementById('redirectBtn');
      if (existingBtn) existingBtn.remove();
    }

    drawWheel();
    spinBtn.addEventListener('click', spin);
  </script>

</body>
</html>
