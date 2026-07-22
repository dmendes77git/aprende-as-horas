/**
 * HTML5 Canvas Interactive Clock Engine with Drag-and-Drop Hands
 */
class InteractiveClock {
  constructor(canvasId, onChangeCallback) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onChange = onChangeCallback;

    // State
    this.hour = 3;    // 1 to 24
    this.minute = 0;  // 0 to 59
    this.isPm = false;
    this.activeHand = null; // 'hour' | 'minute' | null

    this.initEvents();
    this.redraw();
  }

  setPmMode(isPm) {
    this.isPm = isPm;
    if (this.isPm && this.hour <= 12) {
      this.hour += 12;
    } else if (!this.isPm && this.hour > 12) {
      this.hour -= 12;
    }
    this.redraw();
    this.notifyChange();
  }

  setTime(hour, minute, isPm = null) {
    if (isPm !== null) this.isPm = isPm;
    this.hour = hour;
    this.minute = minute;
    this.redraw();
    this.notifyChange();
  }

  getFormattedDigitalStr() {
    let displayH = this.hour;
    if (this.isPm && displayH <= 12) displayH += 12;
    if (!this.isPm && displayH > 12) displayH -= 12;
    const hStr = String(displayH).padStart(2, '0');
    const mStr = String(this.minute).padStart(2, '0');
    return `${hStr}:${mStr}`;
  }

  notifyChange() {
    if (typeof this.onChange === 'function') {
      this.onChange({
        hour: this.hour,
        minute: this.minute,
        isPm: this.isPm,
        digitalStr: this.getFormattedDigitalStr()
      });
    }
  }

  redraw() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.44;

    this.ctx.clearRect(0, 0, width, height);

    // 1. Outer Shadow & Rim
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    this.ctx.shadowBlur = 20;
    this.ctx.shadowOffsetY = 10;

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.isPm ? '#7c2d12' : '#1e3a8a';
    this.ctx.fill();
    this.ctx.restore();

    // Inner Face Gradient
    this.ctx.save();
    const faceGradient = this.ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 0.95);
    faceGradient.addColorStop(0, '#ffffff');
    faceGradient.addColorStop(1, '#f1f5f9');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius * 0.94, 0, Math.PI * 2);
    this.ctx.fillStyle = faceGradient;
    this.ctx.fill();
    this.ctx.restore();

    // 2. Minute & Hour Ticks
    for (let m = 0; m < 60; m++) {
      const angleRad = (Math.PI / 180) * (90 - m * 6);
      const isMajor = m % 5 === 0;

      const rOuter = radius * 0.90;
      const rInner = isMajor ? radius * 0.82 : radius * 0.86;

      const x1 = cx + rOuter * Math.cos(angleRad);
      const y1 = cy - rOuter * Math.sin(angleRad);
      const x2 = cx + rInner * Math.cos(angleRad);
      const y2 = cy - rInner * Math.sin(angleRad);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.lineWidth = isMajor ? 3 : 1.5;
      this.ctx.strokeStyle = isMajor ? '#334155' : '#cbd5e1';
      this.ctx.stroke();
    }

    // 3. Number Labels (1-12 in AM, 13-24 in PM)
    const numFontSize = Math.max(16, Math.floor(radius * 0.13));
    this.ctx.font = `700 ${numFontSize}px 'Fredoka', sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = this.isPm ? '#c2410c' : '#1e3a8a';

    for (let h = 1; h <= 12; h++) {
      const displayNum = this.isPm ? h + 12 : h;
      const angleDeg = 90 - h * 30;
      const angleRad = (Math.PI / 180) * angleDeg;

      const rNum = radius * 0.70;
      const nx = cx + rNum * Math.cos(angleRad);
      const ny = cy - rNum * Math.sin(angleRad);

      this.ctx.fillText(displayNum, nx, ny);
    }

    // 4. Minute Hand (Blue - Long)
    const minAngleDeg = 90 - this.minute * 6;
    const minAngleRad = (Math.PI / 180) * minAngleDeg;
    const minLength = radius * 0.74;
    const mx = cx + minLength * Math.cos(minAngleRad);
    const my = cy - minLength * Math.sin(minAngleRad);

    this.ctx.save();
    this.ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(mx, my);
    this.ctx.lineWidth = Math.max(5, radius * 0.035);
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#2563eb';
    this.ctx.stroke();
    this.ctx.restore();

    // 5. Hour Hand (Red - Short)
    const hour12 = this.hour % 12;
    const hourAngleDeg = 90 - (hour12 * 30 + this.minute * 0.5);
    const hourAngleRad = (Math.PI / 180) * hourAngleDeg;
    const hourLength = radius * 0.48;
    const hx = cx + hourLength * Math.cos(hourAngleRad);
    const hy = cy - hourLength * Math.sin(hourAngleRad);

    this.ctx.save();
    this.ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(hx, hy);
    this.ctx.lineWidth = Math.max(8, radius * 0.055);
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.stroke();
    this.ctx.restore();

    // 6. Center Pin
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fill();
  }

  // Input Handling: Touch & Mouse Drag Detection
  initEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const handleStart = (e) => {
      const pos = getPos(e);
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const dist = Math.hypot(pos.x - cx, pos.y - cy);
      const radius = Math.min(this.canvas.width, this.canvas.height) * 0.44;

      if (dist < radius * 0.55) {
        this.activeHand = 'hour';
      } else if (dist < radius * 1.1) {
        this.activeHand = 'minute';
      } else {
        this.activeHand = null;
      }

      if (this.activeHand) {
        this.updateHandPosition(pos);
      }
    };

    const handleMove = (e) => {
      if (this.activeHand) {
        e.preventDefault();
        const pos = getPos(e);
        this.updateHandPosition(pos);
      }
    };

    const handleEnd = () => {
      this.activeHand = null;
    };

    this.canvas.addEventListener('mousedown', handleStart);
    this.canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    this.canvas.addEventListener('touchstart', handleStart, { passive: false });
    this.canvas.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  }

  updateHandPosition(pos) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const dx = pos.x - cx;
    const dy = cy - pos.y; // Standard cartesian (Y up)

    let rad = Math.atan2(dy, dx);
    let deg = (180 / Math.PI) * rad;
    let clockDeg = (90 - deg + 360) % 360;

    if (this.activeHand === 'minute') {
      this.minute = Math.round(clockDeg / 6.0) % 60;
    } else if (this.activeHand === 'hour') {
      let selected12h = Math.floor(clockDeg / 30) % 12;
      if (selected12h === 0) selected12h = 12;

      if (this.isPm) {
        this.hour = selected12h + 12;
      } else {
        this.hour = selected12h;
      }
    }

    this.redraw();
    this.notifyChange();
  }
}
