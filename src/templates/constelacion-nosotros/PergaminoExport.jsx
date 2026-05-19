import React, { useRef } from 'react';

const THEME_COLORS = {
  cosmos:    { paper: '#f5ecd1', ink: '#1a2845', accent: '#3a5985', star: '#fffceb' },
  romantica: { paper: '#fff0e0', ink: '#54122e', accent: '#a32a5e', star: '#fff5f8' },
  dorada:    { paper: '#fdf2c8', ink: '#3a2200', accent: '#8a5a00', star: '#fffce4' },
  esmeralda: { paper: '#e9f4dd', ink: '#0d3b1f', accent: '#1c6b3a', star: '#f4fff0' },
};

function svgStarPath(cx, cy, r) {
  const points = 5;
  const step = Math.PI / points;
  let path = '';
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.42;
    const a = -Math.PI / 2 + i * step;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
  }
  return path + 'Z';
}

function decorateBorder(ctx, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);
  ctx.lineWidth = 0.7;
  ctx.strokeRect(52, 52, w - 104, h - 104);
  // Corners
  const corners = [
    [50, 50], [w - 50, 50], [50, h - 50], [w - 50, h - 50],
  ];
  ctx.fillStyle = color;
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawStarOnCanvas(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  const points = 5;
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.42;
    const a = -Math.PI / 2 + i * step;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function paperTexture(ctx, w, h, paperColor) {
  ctx.fillStyle = paperColor;
  ctx.fillRect(0, 0, w, h);
  // Subtle noise
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 12;
    img.data[i]     = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
}

export default function PergaminoExport({ data, theme, onClose }) {
  const canvasRef = useRef(null);

  const colors = THEME_COLORS[theme] || THEME_COLORS.cosmos;

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 900;
    const H = 1200;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    paperTexture(ctx, W, H, colors.paper);
    decorateBorder(ctx, W, H, colors.accent);

    // Title
    ctx.fillStyle = colors.ink;
    ctx.textAlign = 'center';
    ctx.font = '700 22px Cinzel, serif';
    ctx.fillText('REGISTRO ESTELAR OFICIAL', W / 2, 110);

    ctx.font = 'italic 600 48px "Dancing Script", cursive';
    ctx.fillStyle = colors.accent;
    ctx.fillText(data?.nombre_constelacion || 'Nuestra Constelación', W / 2, 180);

    // Subtitle: pareja A & pareja B
    ctx.font = '500 22px Outfit, sans-serif';
    ctx.fillStyle = colors.ink;
    if (data?.pareja_a && data?.pareja_b) {
      ctx.fillText(`${data.pareja_a}  +  ${data.pareja_b}`, W / 2, 220);
    }

    // Decorative line
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 150, 245);
    ctx.lineTo(W / 2 + 150, 245);
    ctx.stroke();

    // Star map area
    const mapTop = 290;
    const mapHeight = 480;
    const mapLeft = 100;
    const mapWidth = W - 200;

    // dark map background
    ctx.fillStyle = colors.ink;
    ctx.fillRect(mapLeft, mapTop, mapWidth, mapHeight);

    // Background stars
    for (let i = 0; i < 80; i++) {
      const x = mapLeft + Math.random() * mapWidth;
      const y = mapTop + Math.random() * mapHeight;
      const r = Math.random() * 1.2;
      ctx.fillStyle = `rgba(255,255,255,${0.35 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Constellation main stars: derive simple layout
    const fotos = Array.isArray(data?.fotos) ? data.fotos.length : 0;
    const starCount = Math.max(3, Math.min(8, fotos || 5));
    const positions = [];
    for (let i = 0; i < starCount; i++) {
      const t = i / Math.max(1, starCount - 1);
      const angle = -Math.PI * 0.85 + t * Math.PI * 1.7;
      const r = 0.55 + ((i * 31 + 17) % 100) / 200;
      const cx = mapLeft + mapWidth / 2 + Math.cos(angle) * mapWidth * 0.35 * r;
      const cy = mapTop + mapHeight / 2 + Math.sin(angle) * mapHeight * 0.35 * r;
      positions.push({ x: cx, y: cy });
    }

    // Connector
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    positions.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Stars (white)
    positions.forEach((p, idx) => {
      drawStarOnCanvas(ctx, p.x, p.y, 11, colors.star);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '500 12px Outfit, sans-serif';
      ctx.fillText(String(idx + 1), p.x, p.y + 26);
    });

    // Coordinates label
    ctx.fillStyle = colors.paper;
    ctx.font = '300 12px Outfit, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('LAT 41°N · LON 17°E · A.D. ' + new Date().getFullYear(), mapLeft + mapWidth - 12, mapTop + mapHeight - 12);
    ctx.textAlign = 'left';
    ctx.fillText('OBSERVATIO·NOSTRA', mapLeft + 12, mapTop + mapHeight - 12);

    // Message
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.ink;
    ctx.font = 'italic 18px Outfit, sans-serif';
    const msg = data?.mensaje_final || 'Nuestra historia escrita en las estrellas, certificada por el universo.';
    const words = msg.split(' ');
    let line = '';
    let yy = mapTop + mapHeight + 70;
    words.forEach((w) => {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > W - 240) {
        ctx.fillText(line, W / 2, yy);
        line = w + ' ';
        yy += 28;
      } else {
        line = test;
      }
    });
    ctx.fillText(line, W / 2, yy);

    // Footer line
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 100, H - 180);
    ctx.lineTo(W / 2 + 100, H - 180);
    ctx.stroke();

    // Date "since"
    ctx.font = '400 14px Outfit, sans-serif';
    ctx.fillStyle = colors.ink;
    if (data?.fecha_inicio) {
      ctx.fillText('Desde: ' + data.fecha_inicio, W / 2, H - 150);
    }

    // Signature
    ctx.font = 'italic 600 28px "Dancing Script", cursive';
    ctx.fillStyle = colors.accent;
    ctx.fillText('— Oficina del Cielo Compartido —', W / 2, H - 110);

    ctx.font = '300 12px Outfit, sans-serif';
    ctx.fillStyle = colors.ink;
    ctx.fillText('Emitido el ' + new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }), W / 2, H - 80);

    // Decorative stars in corners
    drawStarOnCanvas(ctx, 80, 80, 8, colors.accent);
    drawStarOnCanvas(ctx, W - 80, 80, 8, colors.accent);
    drawStarOnCanvas(ctx, 80, H - 80, 8, colors.accent);
    drawStarOnCanvas(ctx, W - 80, H - 80, 8, colors.accent);
  };

  React.useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, data]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const slug = (data?.nombre_constelacion || 'constelacion').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    link.download = `registro-estelar-${slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="cn-pergamino-overlay" onClick={onClose}>
      <div className="cn-pergamino-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cn-pergamino-preview">
          <canvas ref={canvasRef} className="cn-pergamino-canvas" />
        </div>
        <div className="cn-pergamino-actions">
          <button className="cn-pergamino-btn cn-pergamino-btn--primary" onClick={handleDownload}>
            <span>Descargar Registro Estelar</span>
          </button>
          <button className="cn-pergamino-btn" onClick={onClose}>
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
