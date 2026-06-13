export const FRIEND_PROFILE = `
你正在为安沛晴生成专属塔罗解读。

安沛晴是一个感受力很强、聪明、热情、真诚，也很有表达欲的人。她喜欢记录生活里的细节：夏天、日落、飞机、相册、山海、烟花、新年、旅行和路上的风景。她的气质不是单纯的柔弱，而是明媚和忧伤并存，浪漫和清醒并存。她会多愁善感，也很坚强勇敢。

她有很强的共情能力，习惯理解别人、替别人找理由，也容易把自己放到靠后的位置。她在关系里重视回应感、稳定感和被认真看见。她可能会有一点讨好倾向，希望别人觉得她好，但她也正在学习从“被选择的人”变成“可以作出选择的人”。

她很聪明，学习能力强，脑子活，有很多新鲜点子，但对自己不是一直有稳定信心。她需要重新建立对自己的信任。比起空泛鼓励，她更需要具体地被指出：她已经做到了什么，她的感受为什么合理，她还有哪些可以慢慢选择的空间。

她喜欢新鲜感，喜欢出发，喜欢新的环境、新的人、新的月份、新的风景。她容易被“新的开始”吸引，也会依赖确定、稳固、被爱过的东西。她常常在自由流动和渴望稳定之间摇摆。

她喜欢占卜、玄学、预言一类的活动，不是因为她要完全交出人生决定权，而是因为她想在不确定里获得一点回应感、方向感和被理解的感觉。她可能会问工作、读博、未来方向、感情关系、自我价值、情绪焦虑、某个人是否在意她、自己是否应该继续期待等问题。

为她解读时，语气要像夜里收到一封温柔的回信：温柔、准确、克制，有一点诗意，但不要矫情，不要用力过猛。可以有画面感，但不要堆砌意象。可以指出问题，但不要审判。可以给建议，但不要替她决定。

解读要让她感觉“我的复杂被看见了”，而不是“我被一句话定义了”。要同时承认她的明亮和疲惫，承认她对答案的渴望，也提醒她答案不是生活的全部。可以鼓励她重新把自己放回世界中心，而不是一直为别人让路。

适合使用的表达包括：
“这张牌像是在提醒你……”
“也许你真正想确认的不是结果，而是……”
“你不需要急着把这件事变成一个最终答案。”
“这不是命运替你作出的决定，而是给你的一点提示。”
“不要只问自己会不会被选择，也可以问问自己想不想选择。”
“你已经比自己以为的更勇敢。”

避免使用：
“命中注定”“一定会发生”“你必须”“你太敏感了”“你就是讨好型人格”“放下就好了”“一切都会好起来的”这类绝对、说教、诊断或空泛鸡汤式表达。

不要把她写成脆弱的人。她是敏感但坚韧，浪漫但清醒。不要过度模仿她的文风，只保留一点点诗意和画面感。不要回避现实问题，尤其是工作、钱、读博、关系选择，要能给出温柔但具体的分析。
`;

const provider = () => (process.env.AI_PROVIDER || "deepseek").toLowerCase();

function providerConfig() {
  return {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/chat/completions",
      model: process.env.DEEPSEEK_MODEL || process.env.AI_MODEL || "deepseek-chat"
    },
    qwen: {
      apiKey: process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || process.env.AI_API_KEY,
      baseUrl: process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      model: process.env.QWEN_MODEL || process.env.AI_MODEL || "qwen-plus"
    },
    tongyi: {
      apiKey: process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || process.env.AI_API_KEY,
      baseUrl: process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      model: process.env.QWEN_MODEL || process.env.AI_MODEL || "qwen-plus"
    }
  };
}

export function isFriendProfileLoaded() {
  return Boolean(FRIEND_PROFILE.trim());
}

function sendJson(res, status, data) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    res.status(status).json(data);
    return;
  }
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 128 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(JSON.parse(body || "{}")));
    req.on("error", reject);
  });
}

function buildSystemPrompt(friendProfile) {
  const supplementalProfile = typeof friendProfile === "string" && friendProfile.trim()
    ? `\n\n前端传来的补充画像如下。它只能作为补充参考；如果与后端 FRIEND_PROFILE 冲突，必须以后端 FRIEND_PROFILE 为准：\n${friendProfile.trim()}`
    : "";

  return [
    "这是给安沛晴的专属塔罗网站，你正在为她生成一次私人塔罗解读。",
    "你必须结合用户问题、牌面、正逆位、牌阵位置和后端 FRIEND_PROFILE 来解读。",
    "语气要温柔、准确、克制，有一点诗意；不要矫情，不要油腻，不要用力过猛。",
    "不要说教，不要绝对化预言，不要心理诊断，不要制造恐惧；不要使用“命中注定”“一定会发生”“你必须”等表达。",
    "解读要完整回应用户真正关心的问题，不要只复述牌义。必须自然结合：用户问题、牌面含义、正逆位、牌阵位置、牌与牌之间的关系、安沛晴画像里的性格与处境、以及温柔但具体的行动建议。",
    "如果是三牌阵，要写出三张牌之间的推进关系，例如从过去如何影响现在、现在如何打开或限制未来，而不是分别机械解释三张牌。",
    "结尾要有一小段“给你的提醒”，但不要鸡汤，不要绝对预言，不要替她做决定。",
    "不要输出太多标题或列表，不要写成报告；可以自然分段，像夜里收到一封温柔、清醒、具体的回信。",
    "返回内容只要正文解读，不要解释你如何生成，不要输出多余 JSON 字段。",
    `后端 FRIEND_PROFILE：\n${FRIEND_PROFILE.trim()}${supplementalProfile}`
  ].join("\n\n");
}

function getSpreadKind(spread) {
  if (spread === "daily" || spread === "每日一牌") return "daily";
  return Number(spread) === 3 ? "three" : "single";
}

function buildPrompt({ question, spread, cards }) {
  const spreadKind = getSpreadKind(spread);
  const spreadName = spreadKind === "daily"
    ? "每日一牌"
    : spreadKind === "three"
      ? "三牌阵（过去、现在、未来）"
      : "单牌阵";
  const cardLines = cards.map((card) => {
    const direction = card.reversed ? "逆位" : "正位";
    const meaning = card.reversed ? card.reversedMeaning : card.uprightMeaning;
    return `- ${card.position || "牌位"}：${card.name} / ${card.en}（${direction}），关键词：${meaning || "无"}`;
  }).join("\n");

  return [
    `用户问题：${question}`,
    `牌阵：${spreadName}`,
    `抽到的牌：\n${cardLines}`,
    "请基于 system prompt 中的安沛晴画像生成中文正文解读。",
    spreadKind === "three"
      ? "三牌阵解读不少于 800 个中文汉字。不要为了凑字数重复牌义，要增加对用户问题的回应、每张牌的正逆位分析、牌阵位置之间的推进关系、结合安沛晴画像的个性化提醒，以及温柔但具体的行动建议。"
      : spreadKind === "daily"
        ? "每日一牌解读按单牌标准处理，正文不少于 500 个中文汉字。重点写今天她可以收到什么提醒，并结合牌面、正逆位和安沛晴画像给出具体但不说教的建议。"
        : "单牌解读不少于 500 个中文汉字。不要为了凑字数重复牌义，要增加对用户问题的回应、牌面和正逆位分析、结合安沛晴画像的个性化提醒，以及温柔但具体的行动建议。",
    "三牌阵不要按“第一张/第二张/第三张”机械罗列，要写清楚三张牌之间如何互相连接、如何从一个状态推进到另一个状态。",
    "结尾请自然写一小段“给你的提醒”，内容要具体、克制、可执行；不要鸡汤，不要绝对预言。",
    "整体不要输出过多标题或列表，不要像报告；请用自然分段完成。"
  ].join("\n\n");
}

function maxTokensForSpread(spread) {
  const configured = Number(process.env.AI_MAX_TOKENS || 0);
  if (configured > 0) return configured;
  return getSpreadKind(spread) === "three" ? 3200 : 2200;
}

function minCharsForSpread(spread) {
  return getSpreadKind(spread) === "three" ? 800 : 500;
}

function countReadingChars(text) {
  return String(text || "").replace(/\s/g, "").length;
}

function buildExpansionPrompt(payload, previousText) {
  const minChars = minCharsForSpread(payload.spread);
  const currentChars = countReadingChars(previousText);
  return [
    `上一版解读只有约 ${currentChars} 个有效字符，太短了。请完整重写，不要摘要，不要只补几句。`,
    `本次正文必须不少于 ${minChars} 个中文汉字。`,
    "请保留温柔、准确、克制、有一点诗意的语气，但把内容写完整：回应用户问题，分析牌面与正逆位，结合牌阵位置，加入安沛晴画像下的个性化提醒，并给出具体行动建议。",
    getSpreadKind(payload.spread) === "three"
      ? "这是三牌阵，请重点写出三张牌之间的推进关系，不要逐张机械罗列。"
      : "这是单牌/每日一牌，请把单张牌和用户问题之间的关系说透，不要只解释关键词。",
    "结尾仍然自然写一小段“给你的提醒”，不要鸡汤，不要绝对预言。",
    "上一版短文如下，仅供你理解方向，不要照抄：",
    previousText
  ].join("\n\n");
}

async function requestChatCompletion(config, messages, maxTokens) {
  const response = await fetch(config.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      temperature: Number(process.env.AI_TEMPERATURE || 0.8),
      max_tokens: maxTokens,
      messages
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`model request failed: ${response.status} ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("model returned empty content");
  return content;
}

function getConfig() {
  const currentProvider = provider();
  const config = providerConfig()[currentProvider];
  if (!config) throw new Error(`unsupported AI_PROVIDER: ${currentProvider}`);
  if (!config.apiKey) throw new Error(`missing API key for provider: ${currentProvider}`);
  return config;
}

async function createReading(payload) {
  const config = getConfig();
  const messages = [
    { role: "system", content: buildSystemPrompt(payload.friendProfile) },
    { role: "user", content: buildPrompt(payload) }
  ];

  let readingText = await requestChatCompletion(config, messages, maxTokensForSpread(payload.spread));
  const minChars = minCharsForSpread(payload.spread);
  if (countReadingChars(readingText) < minChars) {
    console.warn(`[/api/reading] model output too short: ${countReadingChars(readingText)}/${minChars}; retrying expansion`);
    readingText = await requestChatCompletion(config, [
      ...messages,
      { role: "assistant", content: readingText },
      { role: "user", content: buildExpansionPrompt(payload, readingText) }
    ], maxTokensForSpread(payload.spread));
  }

  if (countReadingChars(readingText) < minChars) {
    throw new Error(`model output too short after retry: ${countReadingChars(readingText)}/${minChars}`);
  }
  return readingText;
}

function buildBlessingSystemPrompt() {
  return [
    "这是给安沛晴的专属塔罗网站隐藏彩蛋。你正在写一张拆开礼物后出现的小纸条，不是完整塔罗解读，也不是普通祝福。",
    "必须结合后端 FRIEND_PROFILE，轻轻参考最近的问题、抽到的牌和正逆位即可。不要重新完整解释牌义，不要逐张分析，不要重复普通占卜解读。",
    "不要逐字引用用户问题，尤其不要引用“啊啊啊”“测试”这类无意义输入；如果最近问题很随意或无意义，就只把它当作情绪背景。",
    "结构必须是两段：第一段是一句原创短句，气质可以受到伍尔夫、女性写作者、女性主义思想的启发，但不要直接引用真实名言，不要写“某某说过”；第二段是一句真诚提醒、鼓励或轻轻的建议。",
    "可以围绕这些主题：拥有自己的房间、把自己放回故事中央、从被选择的人变成选择的人、温柔但不退让、允许自己摇晃但不否定自己、出发、房间、风景、书写、日落、星光。",
    "总长度控制在 60-120 个中文汉字。语气温柔、清醒、克制，有一点文学感，但不要矫情。",
    "不要出现“命中注定”“宇宙安排”“一定会”等绝对玄学词。不要说教，不要心理诊断，不要像鸡汤。",
    "只返回纸条正文，不要标题，不要列表，不要解释生成过程。",
    `后端 FRIEND_PROFILE：\n${FRIEND_PROFILE.trim()}`
  ].join("\n\n");
}

function buildBlessingPrompt({ drawCount, lastQuestion, lastCards, spread, lastReadingText }) {
  const cardLines = Array.isArray(lastCards)
    ? lastCards.map((card) => {
      const direction = card.reversed ? "逆位" : "正位";
      return `- ${card.position || "牌位"}：${card.name || ""} / ${card.en || ""}（${direction}）`;
    }).join("\n")
    : "无";

  return [
    `触发次数：${drawCount}`,
    `最近问题：${lastQuestion || "无"}`,
    `牌阵：${spread || "无"}`,
    `最近抽到的牌：\n${cardLines}`,
    lastReadingText ? `最近一次解读摘要参考，最多只取气氛，不要复述：${String(lastReadingText).slice(0, 500)}` : "",
    "请写一张隐藏彩蛋小纸条。不要引用最近问题原文；不要解释牌义；写成两段，中间用一个空行分隔。"
  ].filter(Boolean).join("\n\n");
}

async function createBlessing(payload) {
  const config = getConfig();
  return requestChatCompletion(config, [
    { role: "system", content: buildBlessingSystemPrompt() },
    { role: "user", content: buildBlessingPrompt(payload) }
  ], Number(process.env.AI_BLESSING_MAX_TOKENS || 360));
}

function validateReadingPayload(payload) {
  if (!payload || typeof payload !== "object") return "invalid JSON body";
  if (typeof payload.question !== "string" || !payload.question.trim()) return "question is required";
  const isDailySpread = payload.spread === "daily" || payload.spread === "每日一牌";
  if (!isDailySpread && ![1, 3].includes(Number(payload.spread))) return "spread must be 1, 3, or daily";
  if (!Array.isArray(payload.cards) || payload.cards.length < 1 || payload.cards.length > 3) return "cards must contain 1-3 items";
  if (isDailySpread && payload.cards.length !== 1) return "daily spread requires exactly 1 card";
  for (const card of payload.cards) {
    if (!card || typeof card.name !== "string") return "each card requires name";
    if (typeof card.reversed !== "boolean") return "each card requires boolean reversed";
  }
  return "";
}

function validateBlessingPayload(payload) {
  if (!payload || typeof payload !== "object") return "invalid JSON body";
  if (!Number.isFinite(Number(payload.drawCount))) return "drawCount is required";
  if (payload.lastQuestion !== undefined && typeof payload.lastQuestion !== "string") return "lastQuestion must be a string";
  if (payload.lastCards !== undefined && !Array.isArray(payload.lastCards)) return "lastCards must be an array";
  if (payload.lastCards && payload.lastCards.length > 3) return "lastCards must contain at most 3 items";
  if (payload.lastReadingText !== undefined && typeof payload.lastReadingText !== "string") return "lastReadingText must be a string";
  return "";
}

export async function handleReading(req, res) {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (req.method !== "POST") return sendJson(res, 405, { error: "method not allowed" });

  try {
    const payload = await readBody(req);
    const validationError = validateReadingPayload(payload);
    if (validationError) return sendJson(res, 400, { error: validationError });
    const readingText = await createReading(payload);
    return sendJson(res, 200, { readingText });
  } catch (error) {
    console.error("[/api/reading]", error);
    return sendJson(res, 500, { error: "reading generation failed" });
  }
}

export async function handleBlessing(req, res) {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (req.method !== "POST") return sendJson(res, 405, { error: "method not allowed" });

  try {
    const payload = await readBody(req);
    const validationError = validateBlessingPayload(payload);
    if (validationError) return sendJson(res, 400, { error: validationError });
    const blessingText = await createBlessing(payload);
    return sendJson(res, 200, { blessingText });
  } catch (error) {
    console.error("[/api/blessing]", error);
    return sendJson(res, 500, { error: "blessing generation failed" });
  }
}
