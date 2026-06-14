(function () {
  const WIDTH = 1080;
  const MIN_HEIGHT = 1600;
  const BRAND = "安の晴夜预言";
  const PANEL_X = 90;
  const PANEL_W = 900;
  const PAD = 54;
  const CONTENT_X = PANEL_X + PAD;
  const CONTENT_W = PANEL_W - PAD * 2;
  const TOP_Y = 302;

  const FONT_CN = "'Noto Serif SC', 'Songti SC', 'STSong', serif";
  const FONT_EN = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";
  const TEXT = "rgba(255, 250, 255, .94)";
  const MUTED = "rgba(255, 235, 249, .72)";
  const CARD_SCALE = 1.1;

  function pixelRatio(height) {
    return height > 2600 ? 1 : Math.max(1, Math.min(1.55, window.devicePixelRatio || 1));
  }

  function createDynamicCanvas(height = MIN_HEIGHT) {
    const ratio = pixelRatio(height);
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    return { canvas, ctx, height };
  }

  function measureContext() {
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = MIN_HEIGHT;
    return canvas.getContext("2d");
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function fillRounded(ctx, x, y, width, height, radius, fillStyle) {
    roundedRect(ctx, x, y, width, height, radius);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  function strokeRounded(ctx, x, y, width, height, radius, strokeStyle, lineWidth = 2) {
    roundedRect(ctx, x, y, width, height, radius);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function drawMoon(ctx) {
    ctx.save();
    const moonX = 888;
    const moonY = 126;
    const moonR = 70;
    const glow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 142);
    glow.addColorStop(0, "rgba(255, 238, 247, .24)");
    glow.addColorStop(0.5, "rgba(255, 226, 244, .10)");
    glow.addColorStop(1, "rgba(255, 229, 247, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 142, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.78;
    ctx.shadowColor = "rgba(255, 232, 247, .38)";
    ctx.shadowBlur = 22;
    const crescent = ctx.createLinearGradient(moonX - 42, moonY - 70, moonX + 54, moonY + 70);
    crescent.addColorStop(0, "rgba(255, 248, 238, .88)");
    crescent.addColorStop(0.54, "rgba(255, 226, 203, .74)");
    crescent.addColorStop(1, "rgba(255, 235, 220, .42)");
    ctx.fillStyle = crescent;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, -Math.PI * 0.54, Math.PI * 0.54, false);
    ctx.arc(moonX - 38, moonY, moonR * 0.94, Math.PI * 0.48, -Math.PI * 0.48, true);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.2;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 232, 220, .62)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(moonX - 5, moonY + 3, moonR + 24, -Math.PI * 0.28, Math.PI * 0.52);
    ctx.stroke();
    ctx.restore();
  }

  function drawShareBackground(ctx, height) {
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, height);
    gradient.addColorStop(0, "#59417d");
    gradient.addColorStop(0.4, "#79509a");
    gradient.addColorStop(0.72, "#ad68a8");
    gradient.addColorStop(1, "#e78bc2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, height);

    const glowOne = ctx.createRadialGradient(218, 190, 0, 218, 190, 560);
    glowOne.addColorStop(0, "rgba(242, 181, 214, .42)");
    glowOne.addColorStop(0.52, "rgba(242, 181, 214, .14)");
    glowOne.addColorStop(1, "rgba(242, 181, 214, 0)");
    ctx.fillStyle = glowOne;
    ctx.fillRect(0, 0, WIDTH, height);

    const glowTwo = ctx.createRadialGradient(900, Math.min(height - 180, 1340), 0, 900, Math.min(height - 180, 1340), 720);
    glowTwo.addColorStop(0, "rgba(246, 130, 197, .36)");
    glowTwo.addColorStop(0.58, "rgba(246, 130, 197, .13)");
    glowTwo.addColorStop(1, "rgba(246, 130, 197, 0)");
    ctx.fillStyle = glowTwo;
    ctx.fillRect(0, 0, WIDTH, height);

    drawMoon(ctx);

    ctx.save();
    ctx.globalAlpha = 0.48;
    ctx.fillStyle = "#fff7ff";
    for (let y = 150; y < height - 60; y += 250) {
      const row = Math.round(y / 250);
      [
        [106 + row % 2 * 18, y, 3],
        [314, y + 92, 2],
        [526 + row % 3 * 20, y - 26, 2.5],
        [790, y + 30, 2],
        [944 - row % 2 * 18, y + 124, 3]
      ].forEach(([x, sy, r]) => {
        ctx.beginPath();
        ctx.arc(x, sy, r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.restore();
  }

  function drawShareHeader(ctx, title) {
    ctx.textAlign = "center";
    ctx.fillStyle = TEXT;
    ctx.font = `400 68px ${FONT_CN}`;
    ctx.fillText(title, WIDTH / 2, 156);
    ctx.fillStyle = "rgba(255, 250, 255, .68)";
    ctx.font = `34px ${FONT_CN}`;
    ctx.fillText("── ✦ ☾ ✦ ──", WIDTH / 2, 236);
  }

  function drawGlassPanel(ctx, x, y, width, height, radius = 38) {
    const fill = ctx.createLinearGradient(x, y, x + width, y + height);
    fill.addColorStop(0, "rgba(255, 245, 253, .20)");
    fill.addColorStop(0.52, "rgba(255, 236, 251, .13)");
    fill.addColorStop(1, "rgba(255, 244, 253, .18)");
    fillRounded(ctx, x, y, width, height, radius, fill);
    strokeRounded(ctx, x, y, width, height, radius, "rgba(255, 250, 255, .44)", 2);
    ctx.save();
    ctx.globalAlpha = 0.24;
    const shine = ctx.createLinearGradient(x, y, x + width, y + height);
    shine.addColorStop(0, "rgba(255,255,255,.46)");
    shine.addColorStop(0.38, "rgba(255,255,255,0)");
    shine.addColorStop(1, "rgba(255,255,255,.12)");
    fillRounded(ctx, x + 2, y + 2, width - 4, height - 4, radius - 2, shine);
    ctx.restore();
  }

  function drawDivider(ctx, y) {
    const gradient = ctx.createLinearGradient(CONTENT_X, y, CONTENT_X + CONTENT_W, y);
    gradient.addColorStop(0, "rgba(255,250,255,0)");
    gradient.addColorStop(0.5, "rgba(255,250,255,.42)");
    gradient.addColorStop(1, "rgba(255,250,255,0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CONTENT_X, y);
    ctx.lineTo(CONTENT_X + CONTENT_W, y);
    ctx.stroke();
  }

  function normalizeText(value) {
    const text = String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
    if (text.includes("\n") || text.length < 150) return text;
    const sentences = text.match(/[^。！？!?]+[。！？!?]?/g) || [text];
    const groups = [];
    for (let i = 0; i < sentences.length; i += 2) {
      groups.push(sentences.slice(i, i + 2).join("").trim());
    }
    return groups.filter(Boolean).join("\n");
  }

  function wrapParagraph(ctx, text, maxWidth) {
    const lines = [];
    let line = "";
    for (const char of String(text || "").trim()) {
      const next = line + char;
      if (ctx.measureText(next).width <= maxWidth || !line) {
        line = next;
      } else {
        lines.push(line);
        line = char;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function wrapText(ctx, text, maxWidth, options = {}) {
    const maxLines = options.maxLines || Infinity;
    const paragraphs = normalizeText(text).split(/\n+/);
    const lines = [];
    for (const paragraph of paragraphs) {
      wrapParagraph(ctx, paragraph, maxWidth).forEach((line) => lines.push(line));
      if (paragraph !== paragraphs[paragraphs.length - 1]) lines.push("");
      if (lines.length >= maxLines) break;
    }
    if (lines.length > maxLines) lines.length = maxLines;
    if (Number.isFinite(maxLines) && lines.length === maxLines) {
      const last = lines.length - 1;
      while (lines[last] && ctx.measureText(`${lines[last]}…`).width > maxWidth) {
        lines[last] = lines[last].slice(0, -1);
      }
      lines[last] = `${lines[last]}…`;
    }
    return lines;
  }

  function textHeight(lines, lineHeight, paragraphGap = 14) {
    return lines.reduce((height, line, index) => {
      return height + lineHeight + (line === "" && index !== lines.length - 1 ? paragraphGap : 0);
    }, 0);
  }

  function measureWrappedText(ctx, text, maxWidth, options = {}) {
    const lines = wrapText(ctx, text, maxWidth, options);
    return {
      lines,
      height: textHeight(lines, options.lineHeight || 50, options.paragraphGap || 14)
    };
  }

  function drawTextBlock(ctx, lines, x, y, lineHeight, options = {}) {
    ctx.textAlign = options.align || "left";
    let currentY = y;
    lines.forEach((line) => {
      if (line) ctx.fillText(line, x, currentY);
      currentY += lineHeight + (line === "" ? (options.paragraphGap || 14) : 0);
    });
    return currentY;
  }

  function drawMetaLine(ctx, items, y) {
    const text = items.filter(Boolean).join("   ·   ");
    ctx.textAlign = "center";
    ctx.font = `30px ${FONT_CN}`;
    ctx.fillStyle = "rgba(255, 244, 252, .84)";
    ctx.fillText(`✦  ${text}  ✦`, WIDTH / 2, y + 30);
    const lineY = y + 58;
    const gradient = ctx.createLinearGradient(CONTENT_X + 120, lineY, CONTENT_X + CONTENT_W - 120, lineY);
    gradient.addColorStop(0, "rgba(255,250,255,0)");
    gradient.addColorStop(0.5, "rgba(255,250,255,.32)");
    gradient.addColorStop(1, "rgba(255,250,255,0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(CONTENT_X + 120, lineY);
    ctx.lineTo(CONTENT_X + CONTENT_W - 120, lineY);
    ctx.stroke();
    return y + 70;
  }

  function drawQuestionBlock(ctx, lines, y) {
    if (!lines.length) return y;
    const blockX = CONTENT_X + 28;
    const blockW = CONTENT_W - 56;
    const blockH = Math.max(70, lines.length * 42 + 28);
    const fill = ctx.createLinearGradient(blockX, y, blockX + blockW, y + blockH);
    fill.addColorStop(0, "rgba(255, 244, 253, .14)");
    fill.addColorStop(1, "rgba(255, 232, 249, .08)");
    fillRounded(ctx, blockX, y, blockW, blockH, 26, fill);
    strokeRounded(ctx, blockX, y, blockW, blockH, 26, "rgba(255, 250, 255, .26)", 1.2);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,246,253,.84)";
    ctx.font = `28px ${FONT_CN}`;
    drawTextBlock(ctx, lines, blockX + 28, y + 45, 42);
    return y + blockH;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function drawCardAura(ctx, x, y, width, height) {
    ctx.save();
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const glow = ctx.createRadialGradient(centerX, centerY, width * 0.18, centerX, centerY, Math.max(width, height) * 0.72);
    glow.addColorStop(0, "rgba(255, 229, 249, .34)");
    glow.addColorStop(0.5, "rgba(245, 178, 228, .16)");
    glow.addColorStop(1, "rgba(245, 178, 228, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 96, y - 96, width + 192, height + 192);
    ctx.restore();
  }

  function drawSoftOutline(ctx, x, y, width, height, inset, alpha) {
    const left = x - inset;
    const top = y - inset;
    const right = x + width + inset;
    const bottom = y + height + inset;
    const wave = Math.max(10, width * 0.025);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "rgba(255, 224, 248, .44)";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "rgba(255, 240, 252, .62)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(left + width * 0.18, top + wave);
    ctx.bezierCurveTo(left + width * 0.34, top - wave, right - width * 0.34, top - wave, right - width * 0.18, top + wave);
    ctx.bezierCurveTo(right + wave, top + height * 0.24, right + wave, bottom - height * 0.24, right - width * 0.14, bottom - wave);
    ctx.bezierCurveTo(right - width * 0.32, bottom + wave, left + width * 0.32, bottom + wave, left + width * 0.14, bottom - wave);
    ctx.bezierCurveTo(left - wave, bottom - height * 0.24, left - wave, top + height * 0.24, left + width * 0.18, top + wave);
    ctx.stroke();
    ctx.restore();
  }

  function drawCardFrame(ctx, x, y, width, height) {
    drawSoftOutline(ctx, x, y, width, height, Math.max(16, width * 0.035), 0.7);
    drawSoftOutline(ctx, x, y, width, height, Math.max(28, width * 0.055), 0.34);

    const corner = Math.min(54, Math.max(28, width * 0.13));
    const inset = Math.max(13, width * 0.038);
    const left = x - inset;
    const top = y - inset;
    const right = x + width + inset;
    const bottom = y + height + inset;

    ctx.save();
    ctx.shadowColor = "rgba(255, 225, 247, .52)";
    ctx.shadowBlur = 20;
    ctx.strokeStyle = "rgba(255, 238, 250, .68)";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    [
      [left, top, left + corner, top, left, top + corner],
      [right, top, right - corner, top, right, top + corner],
      [left, bottom, left + corner, bottom, left, bottom - corner],
      [right, bottom, right - corner, bottom, right, bottom - corner]
    ].forEach(([a, b, c, d, e, f]) => {
      ctx.beginPath();
      ctx.moveTo(a, b);
      ctx.lineTo(c, d);
      ctx.moveTo(a, b);
      ctx.lineTo(e, f);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawGalleryCardStage(ctx, x, y, width, height) {
    const stageX = x - 76;
    const stageY = y - 42;
    const stageW = width + 152;
    const stageH = height + 106;

    ctx.save();
    const glow = ctx.createRadialGradient(x + width / 2, y + height * 0.52, width * 0.14, x + width / 2, y + height * 0.52, width * 0.92);
    glow.addColorStop(0, "rgba(255, 231, 248, .34)");
    glow.addColorStop(0.58, "rgba(255, 211, 239, .14)");
    glow.addColorStop(1, "rgba(255, 211, 239, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(stageX - 80, stageY - 80, stageW + 160, stageH + 160);

    const frame = ctx.createLinearGradient(stageX, stageY, stageX, stageY + stageH);
    frame.addColorStop(0, "rgba(255, 231, 181, .82)");
    frame.addColorStop(0.5, "rgba(255, 247, 255, .48)");
    frame.addColorStop(1, "rgba(255, 220, 174, .72)");
    ctx.shadowColor = "rgba(255, 226, 187, .38)";
    ctx.shadowBlur = 20;
    strokeRounded(ctx, stageX, stageY, stageW, stageH, 58, frame, 2.2);
    strokeRounded(ctx, stageX + 10, stageY + 10, stageW - 20, stageH - 20, 48, "rgba(255, 246, 255, .34)", 1.3);

    ctx.fillStyle = "rgba(255, 235, 186, .92)";
    ctx.shadowBlur = 16;
    [
      [stageX + stageW / 2, stageY - 2, 8],
      [stageX + stageW / 2, stageY + stageH + 2, 8],
      [stageX - 2, stageY + stageH * 0.5, 7],
      [stageX + stageW + 2, stageY + stageH * 0.5, 7]
    ].forEach(([sx, sy, size]) => {
      ctx.beginPath();
      ctx.moveTo(sx, sy - size);
      ctx.lineTo(sx + size * 0.32, sy - size * 0.32);
      ctx.lineTo(sx + size, sy);
      ctx.lineTo(sx + size * 0.32, sy + size * 0.32);
      ctx.lineTo(sx, sy + size);
      ctx.lineTo(sx - size * 0.32, sy + size * 0.32);
      ctx.lineTo(sx - size, sy);
      ctx.lineTo(sx - size * 0.32, sy - size * 0.32);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  function drawContainedImage(ctx, image, x, y, width, height, radius = 18, options = {}) {
    const imageRatio = image.width / image.height;
    const boxRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    if (imageRatio > boxRatio) drawHeight = width / imageRatio;
    else drawWidth = height * imageRatio;
    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;

    drawCardAura(ctx, drawX, drawY, drawWidth, drawHeight);
    ctx.save();
    ctx.shadowColor = "rgba(50, 25, 70, .26)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 18;
    if (options.reversed) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(Math.PI);
      ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    } else {
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    }
    ctx.restore();
  }

  function drawFooter(ctx, tail, date, y, options = {}) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,245,252,.82)";
    ctx.font = `italic 32px ${FONT_EN}`;
    ctx.fillText(`· ${BRAND} ·`, WIDTH / 2, y);
  }

  function downloadCanvas(canvas, filename) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function todayText(dateValue) {
    const date = dateValue ? new Date(dateValue) : new Date();
    if (Number.isNaN(date.getTime())) return String(dateValue || "");
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  }

  function safeFilename(value) {
    return String(value || Date.now()).replace(/[\\/:*?"<>|]/g, "-");
  }

  function drawReadingCards(ctx, cards, y) {
    const isThree = cards.length > 1;
    const cardWidth = Math.round((isThree ? 220 : 346) * CARD_SCALE);
    const cardHeight = Math.round((isThree ? 330 : 519) * CARD_SCALE);
    const gap = isThree ? 34 : 0;
    const totalWidth = cards.length * cardWidth + Math.max(0, cards.length - 1) * gap;
    let x = (WIDTH - totalWidth) / 2;
    return Promise.all(cards.map(async (card) => {
      const image = await loadImage(card.image);
      drawContainedImage(ctx, image, x, y, cardWidth, cardHeight, 22, { reversed: card.reversed });
      ctx.textAlign = "center";
      ctx.fillStyle = TEXT;
      ctx.font = isThree ? `27px ${FONT_CN}` : `38px ${FONT_CN}`;
      const title = card.position ? `${card.position} · ${card.name}` : card.name;
      ctx.fillText(title, x + cardWidth / 2, y + cardHeight + 46);
      ctx.fillStyle = MUTED;
      ctx.font = `25px ${FONT_CN}`;
      ctx.fillText(card.reversed ? "逆位" : "正位", x + cardWidth / 2, y + cardHeight + 84);
      x += cardWidth + gap;
    }));
  }

  function readingLayout(data) {
    const ctx = measureContext();
    ctx.font = `31px ${FONT_CN}`;
    const measured = measureWrappedText(ctx, data.readingText || "", CONTENT_W, {
      lineHeight: 51,
      paragraphGap: 16
    });
    ctx.font = `28px ${FONT_CN}`;
    const questionText = String(data.question || "").trim();
    const questionLines = questionText
      ? wrapText(ctx, `你问：${questionText}`, CONTENT_W - 112, { maxLines: 3 })
      : [];
    const questionAreaHeight = questionLines.length ? Math.max(70, questionLines.length * 42 + 28) + 36 : 0;
    const cards = Array.isArray(data.cards) ? data.cards.slice(0, 3) : [];
    const cardAreaHeight = cards.length > 1 ? 512 : 712;
    const panelHeight = 86 + questionAreaHeight + cardAreaHeight + 44 + 76 + measured.height + 72;
    const height = Math.max(MIN_HEIGHT, TOP_Y + panelHeight + 176);
    return { cards, cardAreaHeight, questionLines, readingLines: measured.lines, panelHeight, height };
  }

  async function drawReadingShare(data) {
    const layout = readingLayout(data);
    const { canvas, ctx, height } = createDynamicCanvas(layout.height);
    drawShareBackground(ctx, height);
    drawShareHeader(ctx, "星夜牌语");

    drawGlassPanel(ctx, PANEL_X, TOP_Y, PANEL_W, layout.panelHeight);
    let y = TOP_Y + 42;
    y = drawMetaLine(ctx, [data.spreadLabel || "单牌", todayText(data.date)], y);
    if (layout.questionLines.length) {
      y += 20;
      y = drawQuestionBlock(ctx, layout.questionLines, y);
      y += 38;
    } else {
      y += 42;
    }

    await drawReadingCards(ctx, layout.cards, y);
    y += layout.cardAreaHeight;
    drawDivider(ctx, y);
    y += 64;

    ctx.textAlign = "left";
    ctx.fillStyle = TEXT;
    ctx.font = `38px ${FONT_CN}`;
    ctx.fillText("本次解读", CONTENT_X, y);
    y += 60;
    ctx.fillStyle = "rgba(255,246,253,.86)";
    ctx.font = `31px ${FONT_CN}`;
    drawTextBlock(ctx, layout.readingLines, CONTENT_X, y, 51, { paragraphGap: 16 });
    drawFooter(ctx, "", "", height - 92);
    downloadCanvas(canvas, `tarot-reading-${Date.now()}.png`);
  }

  function dailyLayout(data) {
    const ctx = measureContext();
    ctx.font = `31px ${FONT_CN}`;
    const measured = measureWrappedText(ctx, data.readingText || "", CONTENT_W, {
      lineHeight: 51,
      paragraphGap: 16
    });
    const cardAreaHeight = 728;
    const panelHeight = 86 + cardAreaHeight + 44 + 76 + measured.height + 72;
    const height = Math.max(MIN_HEIGHT, TOP_Y + panelHeight + 176);
    return { readingLines: measured.lines, cardAreaHeight, panelHeight, height };
  }

  async function drawDailyShare(data) {
    const layout = dailyLayout(data);
    const { canvas, ctx, height } = createDynamicCanvas(layout.height);
    drawShareBackground(ctx, height);
    drawShareHeader(ctx, "今日星牌");

    drawGlassPanel(ctx, PANEL_X, TOP_Y, PANEL_W, layout.panelHeight);
    let y = TOP_Y + 42;
    y = drawMetaLine(ctx, ["今日一牌", todayText(data.date)], y);
    y += 42;

    const image = await loadImage(data.image);
    const dailyCardW = Math.round(340 * CARD_SCALE);
    const dailyCardH = Math.round(510 * CARD_SCALE);
    drawContainedImage(ctx, image, (WIDTH - dailyCardW) / 2, y, dailyCardW, dailyCardH, 22, { reversed: data.reversed });
    ctx.textAlign = "center";
    ctx.fillStyle = TEXT;
    ctx.font = `42px ${FONT_CN}`;
    ctx.fillText(data.name || "", WIDTH / 2, y + dailyCardH + 72);
    ctx.fillStyle = MUTED;
    ctx.font = `30px ${FONT_CN}`;
    ctx.fillText(data.reversed ? "逆位" : "正位", WIDTH / 2, y + dailyCardH + 118);
    y += layout.cardAreaHeight;
    drawDivider(ctx, y);
    y += 64;

    ctx.textAlign = "left";
    ctx.fillStyle = TEXT;
    ctx.font = `38px ${FONT_CN}`;
    ctx.fillText("今日提醒", CONTENT_X, y);
    y += 60;
    ctx.fillStyle = "rgba(255,246,253,.86)";
    ctx.font = `31px ${FONT_CN}`;
    drawTextBlock(ctx, layout.readingLines, CONTENT_X, y, 51, { paragraphGap: 16 });
    drawFooter(ctx, "", "", height - 92);
    downloadCanvas(canvas, `daily-card-${Date.now()}.png`);
  }

  async function drawCardShare(data) {
    const ctxMeasure = measureContext();
    ctxMeasure.font = `28px ${FONT_CN}`;
    const meaningGap = 42;
    const meaningX = CONTENT_X - 18;
    const meaningW = CONTENT_W + 36;
    const columnW = (meaningW - meaningGap) / 2;
    const uprightMeasured = measureWrappedText(ctxMeasure, data.meaning || "", columnW, {
      lineHeight: 43,
      paragraphGap: 12
    });
    const reversedMeasured = measureWrappedText(ctxMeasure, data.reversedMeaning || "", columnW, {
      lineHeight: 43,
      paragraphGap: 12
    });
    const cardBoxW = Math.round(650 * CARD_SCALE);
    const cardBoxH = Math.round(1120 * CARD_SCALE);
    const cardX = (WIDTH - cardBoxW) / 2;
    const cardY = TOP_Y + 34;
    const nameY = cardY + cardBoxH + 148;
    const enY = nameY + 58;
    const metaY = enY + 66;
    const dividerY = metaY + 92;
    const headingY = dividerY + 74;
    const textY = headingY + 58;
    const contentBottom = textY + Math.max(uprightMeasured.height, reversedMeasured.height);
    const height = Math.max(2260, contentBottom + 210);
    const { canvas, ctx } = createDynamicCanvas(height);
    drawShareBackground(ctx, height);
    drawShareHeader(ctx, "塔罗图鉴");

    const image = await loadImage(data.image);
    drawGalleryCardStage(ctx, cardX, cardY, cardBoxW, cardBoxH);
    drawContainedImage(ctx, image, cardX, cardY, cardBoxW, cardBoxH, 22);
    ctx.textAlign = "center";
    ctx.fillStyle = TEXT;
    ctx.font = `58px ${FONT_CN}`;
    ctx.fillText(data.name || "", WIDTH / 2, nameY);
    ctx.fillStyle = "rgba(255,232,248,.76)";
    ctx.font = `italic 34px ${FONT_EN}`;
    drawTextBlock(ctx, wrapText(ctx, data.en || "", 700, { maxLines: 2 }), WIDTH / 2, enY, 42, { align: "center" });
    drawMetaLine(ctx, [data.suitLabel || ""], metaY);
    drawDivider(ctx, dividerY);

    ctx.textAlign = "left";
    ctx.fillStyle = TEXT;
    ctx.font = `34px ${FONT_CN}`;
    ctx.fillText("正位牌义", meaningX, headingY);
    ctx.textAlign = "right";
    ctx.fillText("逆位牌义", meaningX + meaningW, headingY);

    const centerX = meaningX + columnW + meaningGap / 2;
    const vertical = ctx.createLinearGradient(centerX, headingY + 18, centerX, textY + Math.max(uprightMeasured.height, reversedMeasured.height));
    vertical.addColorStop(0, "rgba(255,250,255,0)");
    vertical.addColorStop(0.5, "rgba(255,245,252,.26)");
    vertical.addColorStop(1, "rgba(255,250,255,0)");
    ctx.strokeStyle = vertical;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(centerX, headingY + 20);
    ctx.lineTo(centerX, textY + Math.max(uprightMeasured.height, reversedMeasured.height) - 8);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 242, 252, .78)";
    ctx.font = `22px ${FONT_CN}`;
    ctx.fillText("✦", centerX, headingY + 6);

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,246,253,.84)";
    ctx.font = `28px ${FONT_CN}`;
    drawTextBlock(ctx, uprightMeasured.lines, meaningX, textY, 43, { paragraphGap: 12 });
    drawTextBlock(ctx, reversedMeasured.lines, meaningX + columnW + meaningGap, textY, 43, { paragraphGap: 12 });
    drawDivider(ctx, height - 174);
    drawFooter(ctx, "", "", height - 92);
    downloadCanvas(canvas, `tarot-card-${safeFilename(data.en || data.name)}.png`);
  }

  function drawPosterGift(ctx, centerX, topY, scale = 1) {
    const w = 154 * scale;
    const bodyW = 132 * scale;
    const lidH = 40 * scale;
    const bodyH = 82 * scale;
    const bodyX = centerX - bodyW / 2;
    const lidX = centerX - w / 2;
    const bodyY = topY + 44 * scale;
    const lidY = topY + 18 * scale;

    ctx.save();
    ctx.shadowColor = "rgba(51, 24, 72, .28)";
    ctx.shadowBlur = 22 * scale;
    ctx.shadowOffsetY = 14 * scale;

    const bodyFill = ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyW, bodyY + bodyH);
    bodyFill.addColorStop(0, "#edaddd");
    bodyFill.addColorStop(0.5, "#d98bce");
    bodyFill.addColorStop(1, "#bd72b8");
    fillRounded(ctx, bodyX, bodyY, bodyW, bodyH, 20 * scale, bodyFill);
    strokeRounded(ctx, bodyX, bodyY, bodyW, bodyH, 20 * scale, "rgba(255, 246, 253, .58)", 1.4 * scale);

    const lidFill = ctx.createLinearGradient(lidX, lidY, lidX + w, lidY + lidH);
    lidFill.addColorStop(0, "#f6bde5");
    lidFill.addColorStop(0.5, "#df92d2");
    lidFill.addColorStop(1, "#c97bc0");
    fillRounded(ctx, lidX, lidY, w, lidH, 16 * scale, lidFill);
    strokeRounded(ctx, lidX, lidY, w, lidH, 16 * scale, "rgba(255, 248, 253, .62)", 1.4 * scale);

    ctx.shadowBlur = 0;
    const ribbon = "rgba(255, 246, 253, .34)";
    fillRounded(ctx, centerX - 9 * scale, lidY, 18 * scale, lidH, 999, ribbon);
    fillRounded(ctx, centerX - 9 * scale, bodyY, 18 * scale, bodyH, 999, ribbon);
    fillRounded(ctx, bodyX + 18 * scale, bodyY + 24 * scale, bodyW - 36 * scale, 15 * scale, 999, "rgba(255, 246, 253, .25)");

    const bowY = topY + 2 * scale;
    ctx.fillStyle = "rgba(255, 232, 248, .90)";
    ctx.strokeStyle = "rgba(255, 250, 255, .58)";
    ctx.lineWidth = 1.2 * scale;
    ctx.beginPath();
    ctx.ellipse(centerX - 22 * scale, bowY + 20 * scale, 24 * scale, 15 * scale, -0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(centerX + 22 * scale, bowY + 20 * scale, 24 * scale, 15 * scale, 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 249, 253, .96)";
    ctx.beginPath();
    ctx.arc(centerX, bowY + 22 * scale, 10 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 239, 204, .9)";
    ctx.shadowColor = "rgba(255, 232, 190, .46)";
    ctx.shadowBlur = 10 * scale;
    [
      [centerX - 88 * scale, topY + 68 * scale, 7 * scale],
      [centerX + 88 * scale, topY + 88 * scale, 6 * scale],
      [centerX + 6 * scale, topY - 10 * scale, 5 * scale]
    ].forEach(([x, y, size]) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.3, y - size * 0.3);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size * 0.3, y + size * 0.3);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.3, y + size * 0.3);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x - size * 0.3, y - size * 0.3);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  async function drawBlessingShare(data) {
    const ctxMeasure = measureContext();
    ctxMeasure.font = `36px ${FONT_CN}`;
    const noteW = 780;
    const noteX = (WIDTH - noteW) / 2;
    const textX = noteX + 58;
    const textW = noteW - 116;
    const measured = measureWrappedText(ctxMeasure, data.text || "", textW, {
      lineHeight: 60,
      paragraphGap: 18
    });
    const giftTop = TOP_Y + 30;
    const noteY = giftTop + 178;
    const noteHeight = Math.max(500, measured.height + 184);
    const panelY = TOP_Y;
    const panelHeight = noteY + noteHeight - panelY + 62;
    const height = Math.max(1240, panelY + panelHeight + 126);
    const { canvas, ctx } = createDynamicCanvas(height);
    drawShareBackground(ctx, height);
    drawShareHeader(ctx, "晴夜秘语");

    drawGlassPanel(ctx, PANEL_X, panelY, PANEL_W, panelHeight, 42);
    drawPosterGift(ctx, WIDTH / 2, giftTop, 1.08);

    const paper = ctx.createLinearGradient(noteX, noteY, noteX + noteW, noteY + noteHeight);
    paper.addColorStop(0, "rgba(255, 250, 253, .88)");
    paper.addColorStop(1, "rgba(249, 229, 246, .78)");
    fillRounded(ctx, noteX, noteY, noteW, noteHeight, 38, paper);
    strokeRounded(ctx, noteX, noteY, noteW, noteHeight, 38, "rgba(255,255,255,.64)", 1.6);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(109, 57, 132, .72)";
    ctx.font = `30px ${FONT_CN}`;
    ctx.fillText("写给安的一张小纸条", WIDTH / 2, noteY + 70);

    const divider = ctx.createLinearGradient(noteX + 86, noteY + 104, noteX + noteW - 86, noteY + 104);
    divider.addColorStop(0, "rgba(116, 61, 139, 0)");
    divider.addColorStop(0.5, "rgba(116, 61, 139, .22)");
    divider.addColorStop(1, "rgba(116, 61, 139, 0)");
    ctx.strokeStyle = divider;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(noteX + 86, noteY + 104);
    ctx.lineTo(noteX + noteW - 86, noteY + 104);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(80, 40, 102, .92)";
    ctx.font = `36px ${FONT_CN}`;
    drawTextBlock(ctx, measured.lines, textX, noteY + 166, 60, { paragraphGap: 18 });
    drawFooter(ctx, "", "", panelY + panelHeight + 70);
    downloadCanvas(canvas, `hidden-blessing-${Date.now()}.png`);
  }

  window.TarotShare = {
    drawReadingShare,
    drawCardShare,
    drawBlessingShare,
    drawDailyShare
  };
})();
