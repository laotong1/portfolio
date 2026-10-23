/* =========================================================
   作品集 · 内容配置
   ---------------------------------------------------------
   所有文字/链接/视频都在这个文件里改，不用动 HTML。
   改完保存，刷新浏览器即可看到。
   ========================================================= */

window.SITE = {

  /* ---------- 首屏 ---------- */
  name: "佟子易",
  role: "AI 短剧导演 / 执行导演 · 男频打斗题材",

  // 一句话定位（支持 <b> 强调）
  tagline: "能把一部男频打斗短剧<b>从文字变成可交付成片</b>，并且知道每个环节会在哪里崩掉。",

  meta: ["男频打斗", "破亿播放", "全流程导演", "国内 / 海外双版本"],

  keywords: [
    "剧本拆解", "分镜脚本", "动作设计", "镜头语言", "节奏与剪辑",
    "ComfyUI", "Blender 预演", "首尾帧过渡", "角色一致性", "提示词工程",
    "多模型横评", "FlowAIGC", "国内 / 海外双版本"
  ],

  /* ---------- 联系方式 ---------- */
  email: "3142775683@qq.com",
  phone: "+86 186 1001 9010",
  phoneHref: "+8618610019010",
  github: "laotong1",
  githubUrl: "https://github.com/laotong1",
  flowUrl: "https://github.com/laotong1/FlowAIGC",
  resume: {
    director: "assets/pdf/resume-director.pdf",
    tech: "assets/pdf/resume-aigc.pdf"
  },

  /* ---------- 数据 ----------
     数字来自《作品数据.xlsx》的后台累计播放（截至 2026-10）。 */
  stats: [
    { n: 6.3, decimals: 1, suffix: " 亿", label: "累计播放", sub: "23 部在架作品合计" },
    { n: 23,  suffix: " 部", label: "在架作品", sub: "2026.02 – 2026.10" },
    { n: 909, suffix: " 集", label: "在架总集数", sub: "平均约 40 集 / 部" },
    { n: 2,   suffix: " 部", label: "播放破亿", sub: "含《749局猎神》1.0 亿" }
  ],

  statsNote: "数据来自作品后台累计播放（截至 2026-10）：23 部在架作品合计 6.33 亿，其中 2 部破亿、7 部过千万；另有 AI 管线使制作成本下降约 40%、综合人效提升 60% 以上（星火剧能）。",

  /* ---------- 代表作 ----------
     video.bilibili 填 BV 号即可（如 "BV1xx411c7mD"），国内 HR 点开就能播。
     也可以填 video.mp4 指向本地视频文件。
     stills[].image 留空会显示“待插入”占位框，放了图就填路径，例如 "assets/img/749-01.jpg"。 */
  projects: [
    {
      id: "749",
      tags: ["国内发行", "男频打斗", "全流程"],
      title: "《749局猎神》",
      sub: "导演 / 全流程制作",
      highlight: "累计播放 1.0 亿+ · 破亿短剧",
      meta: [
        { k: "角色", v: "导演 · 剧本改编 · 分镜 · 生成 · 剪辑" },
        { k: "体量", v: "40 集 · 播放 100,592,178" },
        { k: "产线", v: "自研 FlowAIGC 画布" }
      ],
      video: { bilibili: "", mp4: "assets/video/749.mp4", poster: "assets/img/749-poster.jpg", orientation: "portrait" },
      stills: [
        { label: "开场", caption: "母子在村口，先给关系", image: "assets/img/749-1.jpg" },
        { label: "对峙", caption: "男人的反应镜头", image: "assets/img/749-2.jpg" },
        { label: "收束", caption: "白衣人背影，留扣", image: "assets/img/749-3.jpg" }
      ],
      bullets: [
        "单部 40 集，后台累计播放 1.0 亿+，是这个账号跑得最好的一部。",
        "从剧本改编、人物形象与资产设定，到分镜与成片生成，全流程一个人扛完。",
        "全部镜头在自研 FlowAIGC 画布上生产，边做片边迭代工具。"
      ],
      breakdown: [
        "剧本 → 可执行镜头清单，逐场定景别、机位与节奏点",
        "参考图锁主角，先钉死人物与场景，再进入批量生成",
        "按镜头类型选模型与提示词模板，出动态镜头",
        "动作接不上就补首尾帧，把断裂处缝起来",
        "单镜头不过关不进剪辑，返工控制在最小颗粒度"
      ]
    },
    {
      id: "witcher",
      tags: ["海外发行", "出海", "版本化"],
      title: "《猎魔人》",
      sub: "导演 / 全流程制作",
      meta: [
        { k: "角色", v: "导演 · 节奏重制 · 海外版本" },
        { k: "发行", v: "海外平台" },
        { k: "版本", v: "国内版 / 海外版并行" }
      ],
      video: { bilibili: "", mp4: "assets/video/witcher.mp4", poster: "assets/img/witcher-poster.jpg", orientation: "portrait" },
      stills: [
        { label: "爆点", caption: "火场，声音先到", image: "assets/img/witcher-1.jpg" },
        { label: "转场", caption: "绿色传送门，空间切换", image: "assets/img/witcher-2.jpg" },
        { label: "冲击", caption: "法术对撞，能量方向", image: "assets/img/witcher-3.jpg" }
      ],
      bullets: [
        "面向海外市场的男频题材，在海外平台跑出较好的流量表现。",
        "按海外观看习惯重做节奏、时长与字幕版本，而不是直接搬运国内版。",
        "同一套模板与参数规范复用，新片筹备期明显缩短。"
      ],
      breakdown: [
        "对标海外平台的开场节奏，重排前 15 秒",
        "按单集时长重切爽点密度，压缩解释性镜头",
        "字幕与配音本地化，重做信息密度",
        "按市场做内容合规与时长版本化"
      ]
    },
    {
      id: "dragon",
      tags: ["海外发行", "产线复用", "系列化"],
      title: "《驯龙高手》",
      sub: "导演 / 全流程制作",
      meta: [
        { k: "角色", v: "导演 · 全流程制作" },
        { k: "发行", v: "海外平台" },
        { k: "意义", v: "验证产线可跨题材复用" }
      ],
      video: { bilibili: "", mp4: "assets/video/dragon.mp4", poster: "assets/img/dragon-poster.jpg", orientation: "portrait" },
      stills: [
        { label: "出征", caption: "骑手与长枪，力量朝右", image: "assets/img/dragon-1.jpg" },
        { label: "对峙", caption: "龙与人的体量差", image: "assets/img/dragon-2.jpg" },
        { label: "反派", caption: "Morkor 登场，紫光标识", image: "assets/img/dragon-3.jpg" }
      ],
      bullets: [
        "同一条 AI 产线支撑的出海作品，题材换了、模板没换。",
        "验证了“模板 + 参数规范”可复用到不同题材，缩短新片筹备期。",
        "同系列及同类作品另有多部，可按需提供完整片单与作品链接。"
      ],
      breakdown: [
        "沿用上一部的角色一致性与首尾帧模板",
        "只重做题材相关的资产与提示词库",
        "用同一套验收标准做质检，减少试错"
      ]
    },
    {
      id: "revenge",
      tags: ["同类作品", "都市复仇", "63 集"],
      title: "《以牙还牙》",
      sub: "同类作品 · 同一条 AI 产线",
      meta: [
        { k: "体量", v: "63 集" },
        { k: "题材", v: "都市复仇" },
        { k: "产线", v: "同一套模板与参数规范" }
      ],
      video: { bilibili: "", mp4: "assets/video/more-revenge.mp4", poster: "assets/img/more-revenge.jpg", orientation: "portrait" },
      stills: [
        { label: "开场", caption: "车内对峙，先给压迫感", image: "assets/img/more-revenge-1.jpg" },
        { label: "推进", caption: "后视镜里的追踪视点", image: "assets/img/more-revenge-2.jpg" },
        { label: "收束", caption: "公路上的二次对峙", image: "assets/img/more-revenge-3.jpg" }
      ],
      bullets: [
        "都市复仇题材，开场十秒进冲突，每集结尾留扣。",
        "63 集连续产出，靠同一套模板与命名规范维持人物和画面一致。"
      ],
      breakdown: []
    },
    {
      id: "aether",
      tags: ["同类作品", "西幻战争", "60 集"],
      title: "《艾瑟尔加德》",
      sub: "同类作品 · 同一条 AI 产线",
      meta: [
        { k: "体量", v: "60 集" },
        { k: "题材", v: "西幻守城" },
        { k: "产线", v: "群像与大场面合成" }
      ],
      video: { bilibili: "", mp4: "assets/video/more-aether.mp4", poster: "assets/img/more-aether.jpg", orientation: "portrait" },
      stills: [
        { label: "破门", caption: "金色能量爆开城门", image: "assets/img/more-aether-1.jpg" },
        { label: "王", caption: "Aiden 的眼睛先亮", image: "assets/img/more-aether-2.jpg" },
        { label: "反派", caption: "法杖登场，紫光作标识", image: "assets/img/more-aether-3.jpg" }
      ],
      bullets: [
        "雪原守城战，群像与攻城节奏，大场面靠合成而不是堆素材。",
        "同一条产线换了题材，角色一致性与首尾帧模板直接复用。"
      ],
      breakdown: []
    },
    {
      id: "river",
      tags: ["同类作品", "749 秘档", "40 集"],
      title: "《749秘档之灵族入海》",
      sub: "同类作品 · 同一条 AI 产线",
      meta: [
        { k: "体量", v: "40 集 · 播放 18,415,674" },
        { k: "题材", v: "民国 · 超自然" },
        { k: "产线", v: "年代质感统一" }
      ],
      video: { bilibili: "", mp4: "assets/video/more-river.mp4", poster: "assets/img/more-river.jpg", orientation: "portrait" },
      stills: [
        { label: "街", caption: "人力车与围观人群", image: "assets/img/more-river-1.jpg" },
        { label: "车", caption: "督导局长到场", image: "assets/img/more-river-2.jpg" },
        { label: "人", caption: "白西装与礼帽的分量", image: "assets/img/more-river-3.jpg" }
      ],
      bullets: [
        "749 秘档系列，民国背景加超自然事件，气氛先于动作。",
        "同一套管线切到年代戏：服装、街景、色调要一起钉死。"
      ],
      breakdown: []
    },
    {
      id: "city",
      tags: ["同类作品", "都市悬疑", "41 集"],
      title: "《撕开机器人的伪装》",
      sub: "同类作品 · 同一条 AI 产线",
      meta: [
        { k: "体量", v: "41 集 · 播放 2,000,274" },
        { k: "题材", v: "都市情感 + 机器人" },
        { k: "产线", v: "对白驱动，剪辑定节奏" }
      ],
      video: { bilibili: "", mp4: "assets/video/more-city.mp4", poster: "assets/img/more-city.jpg", orientation: "portrait" },
      stills: [
        { label: "情绪", caption: "Victoria 的崩溃特写", image: "assets/img/more-city-1.jpg" },
        { label: "反转", caption: "同一个人，换一副面孔", image: "assets/img/more-city-2.jpg" },
        { label: "幕后", caption: "AR 与董事会摊牌", image: "assets/img/more-city-3.jpg" }
      ],
      bullets: [
        "都市情感加机器人设定，反转靠信息差，靠对白推进。",
        "同一产线做现代戏，重点从动作转到表演与反应镜头。"
      ],
      breakdown: []
    }
  ],

  /* ---------- 动作戏专项 ---------- */
  action: {
    intro: "打斗不是把动作生成出来就完了。观众感觉到的“力量”来自分镜的呼吸：哪里停、哪里快、哪一刀只给声音。我给每场打戏固定四段结构——起势、交锋、爆点、收势——再在这个骨架上做镜头。",
    steps: [
      { k: "起势", en: "SETUP", text: "3 秒内交代谁强谁弱：一个全景建立空间，一个手部特写给力量。", detail: "全景 + 特写 / 关键帧锁重心与兵器朝向" },
      { k: "交锋", en: "CLASH", text: "快切 0.4–0.8 秒一镜，轴线不越，用首尾帧把两镜之间的动作缝上。", detail: "0.4–0.8s / 镜 · 首尾帧接动作" },
      { k: "爆点", en: "IMPACT", text: "全片只给一次升格：命中瞬间停 0.3 秒，声音先到、画面后到。", detail: "唯一升格 · 0.3s 停顿 · 声先画后" },
      { k: "收势", en: "SETTLE", text: "拉回全景，留 2 秒空镜让情绪落地，再接下一场钩子。", detail: "全景收 · 2s 空镜 · 留扣" }
    ],
    quote: "改参数解决不了“不好看”。人物漂移查参考图，动作断裂查首尾帧，镜头跳切查分镜衔接——先判断缺陷属于哪一层，再决定改哪一层。同一类问题只修一次模板，不逐条片子修。",
    cite: "工作方法 · 缺陷分层排查"
  },

  /* ---------- 产线（技术页滚动动画） ----------
     六环节从左到右，滚动到哪一环亮到哪一环。 */
  pipeline: {
    label: "END-TO-END PIPELINE",
    title: "一条产线，六个环节",
    desc: "从剧本到成片，不换工具、不倒素材。每个环节的产物直接成为下一环的输入。",
    steps: [
      { k: "剧本", s: "镜头清单" },
      { k: "分镜", s: "景别 · 机位" },
      { k: "参考图", s: "锁角色 / 场景" },
      { k: "图生视频", s: "模型 · 提示词" },
      { k: "首尾帧", s: "补动作过渡" },
      { k: "剪辑验收", s: "节奏 · 质检" }
    ]
  },

  /* ---------- 技术页 ---------- */
  tech: [
    {
      label: "01 / PIPELINE",
      title: "ComfyUI 节点化生产",
      en: "NODE-BASED GENERATION",
      points: [
        "角色一致性、首尾帧过渡、图生视频、局部重绘与扩图的节点模板",
        "提示词模板、负面词库、种子与参数归档，结果可复现、问题可追溯",
        "支持多人协同与批量出片，不必每次从零调参"
      ]
    },
    {
      label: "02 / 3D",
      title: "AI × Blender 管线",
      en: "PREVIS TO GENERATION",
      points: [
        "用 bpy 脚本驱动场景搭建、材质与贴图生成、镜头预演与批量渲染",
        "打通“3D 预演 → AI 生成 → 合成输出”，给短剧稳定的镜头与场景资产",
        "镜头机位先在 3D 里定死，再进生成，减少反复"
      ]
    },
    {
      label: "03 / REVIEW",
      title: "模型横评与选型",
      en: "MODEL BENCHMARK",
      points: [
        "固定维度跑片：构图遵循、角色一致性、动作连贯、畸变率、时长与成本",
        "输出选型报告，按题材与镜头类型给模型组合建议",
        "新模型发布即上手，把结论回写到模板与规范"
      ]
    },
    {
      label: "04 / CONSISTENCY",
      title: "角色一致性系统",
      en: "CHARACTER LOCK",
      points: [
        "定妆先行：每个角色先出正侧三视图与表情参考，锁死脸型、发型、服装，再进批量生成",
        "换机位不换脸：参考图直接进节点，漂了就回滚到参考图重跑，不逐帧修",
        "验收门槛：同一角色 5 个机位横向对比，可用率不达标不出片"
      ]
    }
  ],

  sop: {
    head: ["维度", "测什么", "怎么判"],
    rows: [
      ["构图遵循", "提示词与参考图是否被准确执行", "同提示词跑 4 条，人工盲评 1–5 分"],
      ["角色一致性", "跨镜头脸型、服装、体型漂移程度", "同一角色 5 个机位对比，统计可用率"],
      ["动作连贯", "起势到落点能否接上，有无断裂、穿模", "关键帧逐帧比对，记录断裂点"],
      ["畸变与细节", "文字、手部、边缘伪影", "抽帧检查，按镜头类型分类统计"],
      ["时长与成本", "单条生成耗时、单集成本", "同规格任务计时 + 单条计价"],
      ["批量稳定性", "同参数下结果的方差", "重复 10 次，统计可用条数占比"]
    ]
  },

  /* ---------- 联系 ---------- */
  contact: [
    { label: "邮箱", value: "3142775683@qq.com", href: "mailto:3142775683@qq.com" },
    { label: "电话", value: "+86 186 1001 9010", href: "tel:+8618610019010" },
    { label: "GitHub", value: "github.com/laotong1", href: "https://github.com/laotong1" },
    { label: "简历", value: "执行导演版 / AIGC 技术版", href: "assets/pdf/resume-director.pdf" }
  ]
};
