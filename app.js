
(function() {
'use strict';

/* ========== CDN 加载与错误处理 ========== */
function loadTransformers() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      try {
        import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
        window.TransformersPipeline = pipeline;
        window.dispatchEvent(new CustomEvent('transformers-loaded'));
      } catch (err) {
        window.dispatchEvent(new CustomEvent('transformers-error', { detail: err.message }));
      }
    `;
    document.head.appendChild(script);
    
    window.addEventListener('transformers-loaded', () => resolve(), { once: true });
    window.addEventListener('transformers-error', (e) => reject(new Error(e.detail)), { once: true });
    setTimeout(() => reject(new Error('加载超时')), 30000);
  });
}

// 尝试预加载
loadTransformers().catch(err => {
  console.warn('Transformers.js 预加载失败:', err);
});


const COLORS = ['#e94560','#533483','#0f3460','#00d4ff','#f7b731','#4ecdc4'];
const MIN_SUBTITLE_DURATION = 500; // ms

// ========== 200+ 内置术语规则 ==========
const DEFAULT_TERM_RULES = [
  {pattern:'iphone',replacement:'iPhone',enabled:true,builtin:true},
  {pattern:'ipad',replacement:'iPad',enabled:true,builtin:true},
  {pattern:'ipod',replacement:'iPod',enabled:true,builtin:true},
  {pattern:'imac',replacement:'iMac',enabled:true,builtin:true},
  {pattern:'macbook',replacement:'MacBook',enabled:true,builtin:true},
  {pattern:'macos',replacement:'macOS',enabled:true,builtin:true},
  {pattern:'ios',replacement:'iOS',enabled:true,builtin:true},
  {pattern:'ipados',replacement:'iPadOS',enabled:true,builtin:true},
  {pattern:'watchos',replacement:'watchOS',enabled:true,builtin:true},
  {pattern:'tvos',replacement:'tvOS',enabled:true,builtin:true},
  {pattern:'airpods',replacement:'AirPods',enabled:true,builtin:true},
  {pattern:'airtag',replacement:'AirTag',enabled:true,builtin:true},
  {pattern:'apple watch',replacement:'Apple Watch',enabled:true,builtin:true},
  {pattern:'apple tv',replacement:'Apple TV',enabled:true,builtin:true},
  {pattern:'apple music',replacement:'Apple Music',enabled:true,builtin:true},
  {pattern:'apple pay',replacement:'Apple Pay',enabled:true,builtin:true},
  {pattern:'app store',replacement:'App Store',enabled:true,builtin:true},
  {pattern:'facetime',replacement:'FaceTime',enabled:true,builtin:true},
  {pattern:'imessage',replacement:'iMessage',enabled:true,builtin:true},
  {pattern:'siri',replacement:'Siri',enabled:true,builtin:true},
  {pattern:'icloud',replacement:'iCloud',enabled:true,builtin:true},
  {pattern:'itunes',replacement:'iTunes',enabled:true,builtin:true},
  {pattern:'quicktime',replacement:'QuickTime',enabled:true,builtin:true},
  {pattern:'final cut',replacement:'Final Cut',enabled:true,builtin:true},
  {pattern:'logic pro',replacement:'Logic Pro',enabled:true,builtin:true},
  {pattern:'garageband',replacement:'GarageBand',enabled:true,builtin:true},
  {pattern:'aperture',replacement:'Aperture',enabled:true,builtin:true},
  {pattern:'xcode',replacement:'Xcode',enabled:true,builtin:true},
  {pattern:'swift',replacement:'Swift',enabled:true,builtin:true},
  {pattern:'objective-c',replacement:'Objective-C',enabled:true,builtin:true},
  // 大疆
  {pattern:'dji',replacement:'DJI',enabled:true,builtin:true},
  {pattern:'mavic',replacement:'Mavic',enabled:true,builtin:true},
  {pattern:'phantom',replacement:'Phantom',enabled:true,builtin:true},
  {pattern:'inspire',replacement:'Inspire',enabled:true,builtin:true},
  {pattern:'osmo',replacement:'Osmo',enabled:true,builtin:true},
  {pattern:'ronin',replacement:'Ronin',enabled:true,builtin:true},
  {pattern:'mini',replacement:'Mini',enabled:true,builtin:true},
  {pattern:'air',replacement:'Air',enabled:true,builtin:true},
  {pattern:'fpv',replacement:'FPV',enabled:true,builtin:true},
  {pattern:'tello',replacement:'Tello',enabled:true,builtin:true},
  {pattern:'robomaster',replacement:'RoboMaster',enabled:true,builtin:true},
  {pattern:'dji go',replacement:'DJI GO',enabled:true,builtin:true},
  {pattern:'dji fly',replacement:'DJI Fly',enabled:true,builtin:true},
  {pattern:'dji mini',replacement:'DJI Mini',enabled:true,builtin:true},
  {pattern:'dji mavic',replacement:'DJI Mavic',enabled:true,builtin:true},
  {pattern:'dji air',replacement:'DJI Air',enabled:true,builtin:true},
  // OPPO
  {pattern:'oppo',replacement:'OPPO',enabled:true,builtin:true},
  {pattern:'find x',replacement:'Find X',enabled:true,builtin:true},
  {pattern:'find n',replacement:'Find N',enabled:true,builtin:true},
  {pattern:'reno',replacement:'Reno',enabled:true,builtin:true},
  {pattern:'coloros',replacement:'ColorOS',enabled:true,builtin:true},
  {pattern:'supervooc',replacement:'SuperVOOC',enabled:true,builtin:true},
  // vivo
  {pattern:'vivo',replacement:'vivo',enabled:true,builtin:true},
  {pattern:'iqoo',replacement:'iQOO',enabled:true,builtin:true},
  {pattern:'originos',replacement:'OriginOS',enabled:true,builtin:true},
  {pattern:'funtouch',replacement:'Funtouch',enabled:true,builtin:true},
  // 小米
  {pattern:'xiaomi',replacement:'Xiaomi',enabled:true,builtin:true},
  {pattern:'redmi',replacement:'Redmi',enabled:true,builtin:true},
  {pattern:'poco',replacement:'POCO',enabled:true,builtin:true},
  {pattern:'miui',replacement:'MIUI',enabled:true,builtin:true},
  {pattern:'hyperos',replacement:'HyperOS',enabled:true,builtin:true},
  {pattern:'mi band',replacement:'Mi Band',enabled:true,builtin:true},
  {pattern:'mi tv',replacement:'Mi TV',enabled:true,builtin:true},
  {pattern:'mix',replacement:'MIX',enabled:true,builtin:true},
  // 华为
  {pattern:'huawei',replacement:'HUAWEI',enabled:true,builtin:true},
  {pattern:'honor',replacement:'HONOR',enabled:true,builtin:true},
  {pattern:'harmonyos',replacement:'HarmonyOS',enabled:true,builtin:true},
  {pattern:'emui',replacement:'EMUI',enabled:true,builtin:true},
  {pattern:'mate',replacement:'Mate',enabled:true,builtin:true},
  {pattern:'pura',replacement:'Pura',enabled:true,builtin:true},
  {pattern:'p series',replacement:'P Series',enabled:true,builtin:true},
  {pattern:'nova',replacement:'nova',enabled:true,builtin:true},
  {pattern:'ascend',replacement:'Ascend',enabled:true,builtin:true},
  {pattern:'kirin',replacement:'Kirin',enabled:true,builtin:true},
  // 三星
  {pattern:'samsung',replacement:'Samsung',enabled:true,builtin:true},
  {pattern:'galaxy',replacement:'Galaxy',enabled:true,builtin:true},
  {pattern:'galaxy s',replacement:'Galaxy S',enabled:true,builtin:true},
  {pattern:'galaxy note',replacement:'Galaxy Note',enabled:true,builtin:true},
  {pattern:'galaxy z',replacement:'Galaxy Z',enabled:true,builtin:true},
  {pattern:'galaxy watch',replacement:'Galaxy Watch',enabled:true,builtin:true},
  {pattern:'galaxy buds',replacement:'Galaxy Buds',enabled:true,builtin:true},
  {pattern:'one ui',replacement:'One UI',enabled:true,builtin:true},
  {pattern:'exynos',replacement:'Exynos',enabled:true,builtin:true},
  // 一加
  {pattern:'oneplus',replacement:'OnePlus',enabled:true,builtin:true},
  {pattern:'oxygenos',replacement:'OxygenOS',enabled:true,builtin:true},
  {pattern:'hydrogenos',replacement:'HydrogenOS',enabled:true,builtin:true},
  {pattern:'dash charge',replacement:'Dash Charge',enabled:true,builtin:true},
  {pattern:'warp charge',replacement:'Warp Charge',enabled:true,builtin:true},
  // 魅族
  {pattern:'meizu',replacement:'MEIZU',enabled:true,builtin:true},
  {pattern:'flyme',replacement:'Flyme',enabled:true,builtin:true},
  // 联想
  {pattern:'lenovo',replacement:'Lenovo',enabled:true,builtin:true},
  {pattern:'moto',replacement:'Moto',enabled:true,builtin:true},
  {pattern:'motorola',replacement:'Motorola',enabled:true,builtin:true},
  {pattern:'thinkpad',replacement:'ThinkPad',enabled:true,builtin:true},
  {pattern:'yoga',replacement:'Yoga',enabled:true,builtin:true},
  {pattern:'legion',replacement:'Legion',enabled:true,builtin:true},
  {pattern:'zuk',replacement:'ZUK',enabled:true,builtin:true},
  // 索尼
  {pattern:'sony',replacement:'Sony',enabled:true,builtin:true},
  {pattern:'playstation',replacement:'PlayStation',enabled:true,builtin:true},
  {pattern:'ps5',replacement:'PS5',enabled:true,builtin:true},
  {pattern:'ps4',replacement:'PS4',enabled:true,builtin:true},
  {pattern:'xperia',replacement:'Xperia',enabled:true,builtin:true},
  {pattern:'walkman',replacement:'Walkman',enabled:true,builtin:true},
  {pattern:'bravia',replacement:'BRAVIA',enabled:true,builtin:true},
  {pattern:'alpha',replacement:'Alpha',enabled:true,builtin:true},
  // 微软
  {pattern:'microsoft',replacement:'Microsoft',enabled:true,builtin:true},
  {pattern:'windows',replacement:'Windows',enabled:true,builtin:true},
  {pattern:'windows 11',replacement:'Windows 11',enabled:true,builtin:true},
  {pattern:'windows 10',replacement:'Windows 10',enabled:true,builtin:true},
  {pattern:'surface',replacement:'Surface',enabled:true,builtin:true},
  {pattern:'surface pro',replacement:'Surface Pro',enabled:true,builtin:true},
  {pattern:'xbox',replacement:'Xbox',enabled:true,builtin:true},
  {pattern:'xbox series',replacement:'Xbox Series',enabled:true,builtin:true},
  {pattern:'office',replacement:'Office',enabled:true,builtin:true},
  {pattern:'office 365',replacement:'Office 365',enabled:true,builtin:true},
  {pattern:'teams',replacement:'Teams',enabled:true,builtin:true},
  {pattern:'edge',replacement:'Edge',enabled:true,builtin:true},
  {pattern:'onedrive',replacement:'OneDrive',enabled:true,builtin:true},
  {pattern:'visual studio',replacement:'Visual Studio',enabled:true,builtin:true},
  {pattern:'vscode',replacement:'VS Code',enabled:true,builtin:true},
  {pattern:'azure',replacement:'Azure',enabled:true,builtin:true},
  {pattern:'bing',replacement:'Bing',enabled:true,builtin:true},
  // 谷歌
  {pattern:'google',replacement:'Google',enabled:true,builtin:true},
  {pattern:'android',replacement:'Android',enabled:true,builtin:true},
  {pattern:'pixel',replacement:'Pixel',enabled:true,builtin:true},
  {pattern:'chrome',replacement:'Chrome',enabled:true,builtin:true},
  {pattern:'chromebook',replacement:'Chromebook',enabled:true,builtin:true},
  {pattern:'youtube',replacement:'YouTube',enabled:true,builtin:true},
  {pattern:'gmail',replacement:'Gmail',enabled:true,builtin:true},
  {pattern:'drive',replacement:'Drive',enabled:true,builtin:true},
  {pattern:'maps',replacement:'Maps',enabled:true,builtin:true},
  {pattern:'play',replacement:'Play',enabled:true,builtin:true},
  {pattern:'nest',replacement:'Nest',enabled:true,builtin:true},
  {pattern:'stadia',replacement:'Stadia',enabled:true,builtin:true},
  {pattern:'tensorflow',replacement:'TensorFlow',enabled:true,builtin:true},
  // Meta/Facebook
  {pattern:'facebook',replacement:'Facebook',enabled:true,builtin:true},
  {pattern:'instagram',replacement:'Instagram',enabled:true,builtin:true},
  {pattern:'whatsapp',replacement:'WhatsApp',enabled:true,builtin:true},
  {pattern:'messenger',replacement:'Messenger',enabled:true,builtin:true},
  {pattern:'oculus',replacement:'Oculus',enabled:true,builtin:true},
  {pattern:'meta',replacement:'Meta',enabled:true,builtin:true},
  // 亚马逊
  {pattern:'amazon',replacement:'Amazon',enabled:true,builtin:true},
  {pattern:'alexa',replacement:'Alexa',enabled:true,builtin:true},
  {pattern:'echo',replacement:'Echo',enabled:true,builtin:true},
  {pattern:'kindle',replacement:'Kindle',enabled:true,builtin:true},
  {pattern:'aws',replacement:'AWS',enabled:true,builtin:true},
  {pattern:'prime',replacement:'Prime',enabled:true,builtin:true},
  // 腾讯
  {pattern:'tencent',replacement:'Tencent',enabled:true,builtin:true},
  {pattern:'wechat',replacement:'WeChat',enabled:true,builtin:true},
  {pattern:'weixin',replacement:'Weixin',enabled:true,builtin:true},
  {pattern:'qq',replacement:'QQ',enabled:true,builtin:true},
  {pattern:'tim',replacement:'TIM',enabled:true,builtin:true},
  // 阿里
  {pattern:'alibaba',replacement:'Alibaba',enabled:true,builtin:true},
  {pattern:'taobao',replacement:'Taobao',enabled:true,builtin:true},
  {pattern:'tmall',replacement:'Tmall',enabled:true,builtin:true},
  {pattern:'alipay',replacement:'Alipay',enabled:true,builtin:true},
  {pattern:'dingtalk',replacement:'DingTalk',enabled:true,builtin:true},
  {pattern:'lazada',replacement:'Lazada',enabled:true,builtin:true},
  {pattern:'trendyol',replacement:'Trendyol',enabled:true,builtin:true},
  // 字节
  {pattern:'bytedance',replacement:'ByteDance',enabled:true,builtin:true},
  {pattern:'tiktok',replacement:'TikTok',enabled:true,builtin:true},
  {pattern:'douyin',replacement:'Douyin',enabled:true,builtin:true},
  {pattern:'toutiao',replacement:'Toutiao',enabled:true,builtin:true},
  {pattern:'capcut',replacement:'CapCut',enabled:true,builtin:true},
  {pattern:'lark',replacement:'Lark',enabled:true,builtin:true},
  // 百度
  {pattern:'baidu',replacement:'Baidu',enabled:true,builtin:true},
  {pattern:'apollo',replacement:'Apollo',enabled:true,builtin:true},
  {pattern:'paddle',replacement:'Paddle',enabled:true,builtin:true},
  // 京东
  {pattern:'jd',replacement:'JD',enabled:true,builtin:true},
  {pattern:'jingdong',replacement:'Jingdong',enabled:true,builtin:true},
  // 蔚来/小鹏/理想
  {pattern:'nio',replacement:'NIO',enabled:true,builtin:true},
  {pattern:'xpeng',replacement:'XPeng',enabled:true,builtin:true},
  {pattern:'li auto',replacement:'Li Auto',enabled:true,builtin:true},
  {pattern:'xiaopeng',replacement:'Xpeng',enabled:true,builtin:true},
  {pattern:'xiaomi auto',replacement:'Xiaomi Auto',enabled:true,builtin:true},
  {pattern:'su7',replacement:'SU7',enabled:true,builtin:true},
  // 特斯拉
  {pattern:'tesla',replacement:'Tesla',enabled:true,builtin:true},
  {pattern:'model s',replacement:'Model S',enabled:true,builtin:true},
  {pattern:'model 3',replacement:'Model 3',enabled:true,builtin:true},
  {pattern:'model x',replacement:'Model X',enabled:true,builtin:true},
  {pattern:'model y',replacement:'Model Y',enabled:true,builtin:true},
  {pattern:'cybertruck',replacement:'Cybertruck',enabled:true,builtin:true},
  {pattern:'autopilot',replacement:'Autopilot',enabled:true,builtin:true},
  {pattern:'full self-driving',replacement:'Full Self-Driving',enabled:true,builtin:true},
  {pattern:'supercharger',replacement:'Supercharger',enabled:true,builtin:true},
  // NVIDIA
  {pattern:'nvidia',replacement:'NVIDIA',enabled:true,builtin:true},
  {pattern:'geforce',replacement:'GeForce',enabled:true,builtin:true},
  {pattern:'rtx',replacement:'RTX',enabled:true,builtin:true},
  {pattern:'gtx',replacement:'GTX',enabled:true,builtin:true},
  {pattern:'cuda',replacement:'CUDA',enabled:true,builtin:true},
  {pattern:'tesla',replacement:'Tesla',enabled:true,builtin:true},
  {pattern:'quadro',replacement:'Quadro',enabled:true,builtin:true},
  {pattern:'shield',replacement:'Shield',enabled:true,builtin:true},
  // AMD
  {pattern:'amd',replacement:'AMD',enabled:true,builtin:true},
  {pattern:'ryzen',replacement:'Ryzen',enabled:true,builtin:true},
  {pattern:'radeon',replacement:'Radeon',enabled:true,builtin:true},
  {pattern:'epyc',replacement:'EPYC',enabled:true,builtin:true},
  // Intel
  {pattern:'intel',replacement:'Intel',enabled:true,builtin:true},
  {pattern:'core',replacement:'Core',enabled:true,builtin:true},
  {pattern:'xeon',replacement:'Xeon',enabled:true,builtin:true},
  {pattern:'arc',replacement:'Arc',enabled:true,builtin:true},
  {pattern:'iris',replacement:'Iris',enabled:true,builtin:true},
  {pattern:'pentium',replacement:'Pentium',enabled:true,builtin:true},
  {pattern:'celeron',replacement:'Celeron',enabled:true,builtin:true},
  // 其他芯片
  {pattern:'qualcomm',replacement:'Qualcomm',enabled:true,builtin:true},
  {pattern:'snapdragon',replacement:'Snapdragon',enabled:true,builtin:true},
  {pattern:'mediatek',replacement:'MediaTek',enabled:true,builtin:true},
  {pattern:'dimensity',replacement:'Dimensity',enabled:true,builtin:true},
  {pattern:'helio',replacement:'Helio',enabled:true,builtin:true},
  {pattern:'unisoc',replacement:'UNISOC',enabled:true,builtin:true},
  // 相机
  {pattern:'canon',replacement:'Canon',enabled:true,builtin:true},
  {pattern:'nikon',replacement:'Nikon',enabled:true,builtin:true},
  {pattern:'fujifilm',replacement:'Fujifilm',enabled:true,builtin:true},
  {pattern:'olympus',replacement:'Olympus',enabled:true,builtin:true},
  {pattern:'panasonic',replacement:'Panasonic',enabled:true,builtin:true},
  {pattern:'leica',replacement:'Leica',enabled:true,builtin:true},
  {pattern:'hasselblad',replacement:'Hasselblad',enabled:true,builtin:true},
  {pattern:'gopro',replacement:'GoPro',enabled:true,builtin:true},
  {pattern:'insta360',replacement:'Insta360',enabled:true,builtin:true},
  {pattern:'dji osmo',replacement:'DJI Osmo',enabled:true,builtin:true},
  // 软件
  {pattern:'adobe',replacement:'Adobe',enabled:true,builtin:true},
  {pattern:'photoshop',replacement:'Photoshop',enabled:true,builtin:true},
  {pattern:'premiere',replacement:'Premiere',enabled:true,builtin:true},
  {pattern:'after effects',replacement:'After Effects',enabled:true,builtin:true},
  {pattern:'illustrator',replacement:'Illustrator',enabled:true,builtin:true},
  {pattern:'lightroom',replacement:'Lightroom',enabled:true,builtin:true},
  {pattern:'audition',replacement:'Audition',enabled:true,builtin:true},
  {pattern:'acrobat',replacement:'Acrobat',enabled:true,builtin:true},
  {pattern:'creative cloud',replacement:'Creative Cloud',enabled:true,builtin:true},
  {pattern:'davinci resolve',replacement:'DaVinci Resolve',enabled:true,builtin:true},
  {pattern:'final cut pro',replacement:'Final Cut Pro',enabled:true,builtin:true},
  {pattern:'premiere pro',replacement:'Premiere Pro',enabled:true,builtin:true},
  {pattern:'blender',replacement:'Blender',enabled:true,builtin:true},
  {pattern:'maya',replacement:'Maya',enabled:true,builtin:true},
  {pattern:'cinema 4d',replacement:'Cinema 4D',enabled:true,builtin:true},
  {pattern:'unity',replacement:'Unity',enabled:true,builtin:true},
  {pattern:'unreal engine',replacement:'Unreal Engine',enabled:true,builtin:true},
  {pattern:'autocad',replacement:'AutoCAD',enabled:true,builtin:true},
  {pattern:'sketchup',replacement:'SketchUp',enabled:true,builtin:true},
  {pattern:'figma',replacement:'Figma',enabled:true,builtin:true},
  {pattern:'sketch',replacement:'Sketch',enabled:true,builtin:true},
  {pattern:'invision',replacement:'InVision',enabled:true,builtin:true},
  {pattern:'notion',replacement:'Notion',enabled:true,builtin:true},
  {pattern:'obsidian',replacement:'Obsidian',enabled:true,builtin:true},
  {pattern:'roam research',replacement:'Roam Research',enabled:true,builtin:true},
  {pattern:'evernote',replacement:'Evernote',enabled:true,builtin:true},
  {pattern:'slack',replacement:'Slack',enabled:true,builtin:true},
  {pattern:'discord',replacement:'Discord',enabled:true,builtin:true},
  {pattern:'telegram',replacement:'Telegram',enabled:true,builtin:true},
  {pattern:'zoom',replacement:'Zoom',enabled:true,builtin:true},
  {pattern:'webex',replacement:'Webex',enabled:true,builtin:true},
  // 游戏
  {pattern:'steam',replacement:'Steam',enabled:true,builtin:true},
  {pattern:'epic games',replacement:'Epic Games',enabled:true,builtin:true},
  {pattern:'unreal engine',replacement:'Unreal Engine',enabled:true,builtin:true},
  {pattern:'unity',replacement:'Unity',enabled:true,builtin:true},
  {pattern:'godot',replacement:'Godot',enabled:true,builtin:true},
  {pattern:'nintendo',replacement:'Nintendo',enabled:true,builtin:true},
  {pattern:'switch',replacement:'Switch',enabled:true,builtin:true},
  {pattern:'wii',replacement:'Wii',enabled:true,builtin:true},
  {pattern:'gameboy',replacement:'Game Boy',enabled:true,builtin:true},
  {pattern:'xbox',replacement:'Xbox',enabled:true,builtin:true},
  {pattern:'playstation',replacement:'PlayStation',enabled:true,builtin:true},
  // 流媒体
  {pattern:'netflix',replacement:'Netflix',enabled:true,builtin:true},
  {pattern:'spotify',replacement:'Spotify',enabled:true,builtin:true},
  {pattern:'disney+',replacement:'Disney+',enabled:true,builtin:true},
  {pattern:'hulu',replacement:'Hulu',enabled:true,builtin:true},
  {pattern:'hbo',replacement:'HBO',enabled:true,builtin:true},
  {pattern:'twitch',replacement:'Twitch',enabled:true,builtin:true},
  {pattern:'bilibili',replacement:'Bilibili',enabled:true,builtin:true},
  {pattern:'iqiyi',replacement:'iQiyi',enabled:true,builtin:true},
  {pattern:'youku',replacement:'Youku',enabled:true,builtin:true},
  {pattern:'tencent video',replacement:'Tencent Video',enabled:true,builtin:true},
  // 支付
  {pattern:'paypal',replacement:'PayPal',enabled:true,builtin:true},
  {pattern:'stripe',replacement:'Stripe',enabled:true,builtin:true},
  {pattern:'visa',replacement:'Visa',enabled:true,builtin:true},
  {pattern:'mastercard',replacement:'Mastercard',enabled:true,builtin:true},
  {pattern:'unionpay',replacement:'UnionPay',enabled:true,builtin:true},
  // 云服务
  {pattern:'aws',replacement:'AWS',enabled:true,builtin:true},
  {pattern:'azure',replacement:'Azure',enabled:true,builtin:true},
  {pattern:'gcp',replacement:'GCP',enabled:true,builtin:true},
  {pattern:'google cloud',replacement:'Google Cloud',enabled:true,builtin:true},
  {pattern:'alibaba cloud',replacement:'Alibaba Cloud',enabled:true,builtin:true},
  {pattern:'tencent cloud',replacement:'Tencent Cloud',enabled:true,builtin:true},
  {pattern:'cloudflare',replacement:'Cloudflare',enabled:true,builtin:true},
  {pattern:'digitalocean',replacement:'DigitalOcean',enabled:true,builtin:true},
  {pattern:'linode',replacement:'Linode',enabled:true,builtin:true},
  {pattern:'vultr',replacement:'Vultr',enabled:true,builtin:true},
  {pattern:'heroku',replacement:'Heroku',enabled:true,builtin:true},
  {pattern:'vercel',replacement:'Vercel',enabled:true,builtin:true},
  {pattern:'netlify',replacement:'Netlify',enabled:true,builtin:true},
  {pattern:'github',replacement:'GitHub',enabled:true,builtin:true},
  {pattern:'gitlab',replacement:'GitLab',enabled:true,builtin:true},
  {pattern:'bitbucket',replacement:'Bitbucket',enabled:true,builtin:true},
  // AI
  {pattern:'chatgpt',replacement:'ChatGPT',enabled:true,builtin:true},
  {pattern:'openai',replacement:'OpenAI',enabled:true,builtin:true},
  {pattern:'gpt-4',replacement:'GPT-4',enabled:true,builtin:true},
  {pattern:'gpt-3',replacement:'GPT-3',enabled:true,builtin:true},
  {pattern:'dall-e',replacement:'DALL-E',enabled:true,builtin:true},
  {pattern:'claude',replacement:'Claude',enabled:true,builtin:true},
  {pattern:'anthropic',replacement:'Anthropic',enabled:true,builtin:true},
  {pattern:'midjourney',replacement:'Midjourney',enabled:true,builtin:true},
  {pattern:'stable diffusion',replacement:'Stable Diffusion',enabled:true,builtin:true},
  {pattern:'llama',replacement:'LLaMA',enabled:true,builtin:true},
  {pattern:'gemini',replacement:'Gemini',enabled:true,builtin:true},
  {pattern:'bard',replacement:'Bard',enabled:true,builtin:true},
  {pattern:'copilot',replacement:'Copilot',enabled:true,builtin:true},
  {pattern:'kimi',replacement:'Kimi',enabled:true,builtin:true},
  {pattern:'deepseek',replacement:'DeepSeek',enabled:true,builtin:true},
  {pattern:'qwen',replacement:'Qwen',enabled:true,builtin:true},
  {pattern:'ernie',replacement:'Ernie',enabled:true,builtin:true},
  {pattern:'pangu',replacement:'Pangu',enabled:true,builtin:true},
  {pattern:'hunyuan',replacement:'Hunyuan',enabled:true,builtin:true},
  {pattern:'spark',replacement:'Spark',enabled:true,builtin:true},
  // 其他科技
  {pattern:'spacex',replacement:'SpaceX',enabled:true,builtin:true},
  {pattern:'starlink',replacement:'Starlink',enabled:true,builtin:true},
  {pattern:'neuralink',replacement:'Neuralink',enabled:true,builtin:true},
  {pattern:'boring company',replacement:'Boring Company',enabled:true,builtin:true},
  {pattern:'hyperloop',replacement:'Hyperloop',enabled:true,builtin:true},
  {pattern:'waymo',replacement:'Waymo',enabled:true,builtin:true},
  {pattern:'cruise',replacement:'Cruise',enabled:true,builtin:true},
  {pattern:'uber',replacement:'Uber',enabled:true,builtin:true},
  {pattern:'lyft',replacement:'Lyft',enabled:true,builtin:true},
  {pattern:'airbnb',replacement:'Airbnb',enabled:true,builtin:true},
  {pattern:'booking',replacement:'Booking',enabled:true,builtin:true},
  {pattern:'expedia',replacement:'Expedia',enabled:true,builtin:true},
  {pattern:'tripadvisor',replacement:'TripAdvisor',enabled:true,builtin:true},
  {pattern:'didi',replacement:'DiDi',enabled:true,builtin:true},
  {pattern:'grab',replacement:'Grab',enabled:true,builtin:true},
  {pattern:'gojek',replacement:'Gojek',enabled:true,builtin:true},
  {pattern:'ola',replacement:'Ola',enabled:true,builtin:true},
  {pattern:'bolt',replacement:'Bolt',enabled:true,builtin:true},
  // 学术/教育
  {pattern:'coursera',replacement:'Coursera',enabled:true,builtin:true},
  {pattern:'udemy',replacement:'Udemy',enabled:true,builtin:true},
  {pattern:'edx',replacement:'edX',enabled:true,builtin:true},
  {pattern:'khan academy',replacement:'Khan Academy',enabled:true,builtin:true},
  {pattern:'duolingo',replacement:'Duolingo',enabled:true,builtin:true},
  {pattern:'masterclass',replacement:'MasterClass',enabled:true,builtin:true},
  {pattern:'skillshare',replacement:'Skillshare',enabled:true,builtin:true},
  {pattern:'linkedin learning',replacement:'LinkedIn Learning',enabled:true,builtin:true},
  // 运动/健身
  {pattern:'nike',replacement:'Nike',enabled:true,builtin:true},
  {pattern:'adidas',replacement:'adidas',enabled:true,builtin:true},
  {pattern:'under armour',replacement:'Under Armour',enabled:true,builtin:true},
  {pattern:'puma',replacement:'PUMA',enabled:true,builtin:true},
  {pattern:'lululemon',replacement:'lululemon',enabled:true,builtin:true},
  {pattern:'garmin',replacement:'Garmin',enabled:true,builtin:true},
  {pattern:'fitbit',replacement:'Fitbit',enabled:true,builtin:true},
  {pattern:'apple fitness',replacement:'Apple Fitness',enabled:true,builtin:true},
  // 其他常用
  {pattern:'uber eats',replacement:'Uber Eats',enabled:true,builtin:true},
  {pattern:'doordash',replacement:'DoorDash',enabled:true,builtin:true},
  {pattern:'grubhub',replacement:'Grubhub',enabled:true,builtin:true},
  {pattern:'postmates',replacement:'Postmates',enabled:true,builtin:true},
  {pattern:'instacart',replacement:'Instacart',enabled:true,builtin:true},
  {pattern:'swiggy',replacement:'Swiggy',enabled:true,builtin:true},
  {pattern:'zomato',replacement:'Zomato',enabled:true,builtin:true},
  {pattern:'meituan',replacement:'Meituan',enabled:true,builtin:true},
  {pattern:'eleme',replacement:'Ele.me',enabled:true,builtin:true},
  {pattern:'starbucks',replacement:'Starbucks',enabled:true,builtin:true},
  {pattern:'costa',replacement:'Costa',enabled:true,builtin:true},
  {pattern:'luckin',replacement:'Luckin',enabled:true,builtin:true},
  {pattern:'coco',replacement:'CoCo',enabled:true,builtin:true},
  {pattern:'heytea',replacement:'HEYTEA',enabled:true,builtin:true},
  {pattern:'nayuki',replacement:'Nayuki',enabled:true,builtin:true},
  {pattern:'mcdonalds',replacement:'McDonald\'s',enabled:true,builtin:true},
  {pattern:'kfc',replacement:'KFC',enabled:true,builtin:true},
  {pattern:'burger king',replacement:'Burger King',enabled:true,builtin:true},
  {pattern:'pizza hut',replacement:'Pizza Hut',enabled:true,builtin:true},
  {pattern:'dominos',replacement:'Domino\'s',enabled:true,builtin:true},
  {pattern:'subway',replacement:'Subway',enabled:true,builtin:true},
  {pattern:'dunkin',replacement:'Dunkin\'s',enabled:true,builtin:true},
  {pattern:'wendy',replacement:'Wendy\'s',enabled:true,builtin:true},
  {pattern:'taco bell',replacement:'Taco Bell',enabled:true,builtin:true},
  {pattern:'chipotle',replacement:'Chipotle',enabled:true,builtin:true},
  {pattern:'shake shack',replacement:'Shake Shack',enabled:true,builtin:true},
  {pattern:'five guys',replacement:'Five Guys',enabled:true,builtin:true},
  {pattern:'in-n-out',replacement:'In-N-Out',enabled:true,builtin:true},
  {pattern:'popeyes',replacement:'Popeyes',enabled:true,builtin:true},
  {pattern:'chick-fil-a',replacement:'Chick-fil-A',enabled:true,builtin:true},
  // 科技缩写
  {pattern:'cpu',replacement:'CPU',enabled:true,builtin:true},
  {pattern:'gpu',replacement:'GPU',enabled:true,builtin:true},
  {pattern:'ram',replacement:'RAM',enabled:true,builtin:true},
  {pattern:'ssd',replacement:'SSD',enabled:true,builtin:true},
  {pattern:'hdd',replacement:'HDD',enabled:true,builtin:true},
  {pattern:'usb',replacement:'USB',enabled:true,builtin:true},
  {pattern:'hdmi',replacement:'HDMI',enabled:true,builtin:true},
  {pattern:'dp',replacement:'DP',enabled:true,builtin:true},
  {pattern:'vga',replacement:'VGA',enabled:true,builtin:true},
  {pattern:'dvi',replacement:'DVI',enabled:true,builtin:true},
  {pattern:'wifi',replacement:'Wi-Fi',enabled:true,builtin:true},
  {pattern:'bluetooth',replacement:'Bluetooth',enabled:true,builtin:true},
  {pattern:'nfc',replacement:'NFC',enabled:true,builtin:true},
  {pattern:'gps',replacement:'GPS',enabled:true,builtin:true},
  {pattern:'oled',replacement:'OLED',enabled:true,builtin:true},
  {pattern:'amoled',replacement:'AMOLED',enabled:true,builtin:true},
  {pattern:'lcd',replacement:'LCD',enabled:true,builtin:true},
  {pattern:'led',replacement:'LED',enabled:true,builtin:true},
  {pattern:'hdr',replacement:'HDR',enabled:true,builtin:true},
  {pattern:'dolby vision',replacement:'Dolby Vision',enabled:true,builtin:true},
  {pattern:'dolby atmos',replacement:'Dolby Atmos',enabled:true,builtin:true},
  {pattern:'dts',replacement:'DTS',enabled:true,builtin:true},
  {pattern:'hifi',replacement:'Hi-Fi',enabled:true,builtin:true},
  {pattern:'hires',replacement:'Hi-Res',enabled:true,builtin:true},
  {pattern:'ldac',replacement:'LDAC',enabled:true,builtin:true},
  {pattern:'aptx',replacement:'aptX',enabled:true,builtin:true},
  {pattern:'lhdc',replacement:'LHDC',enabled:true,builtin:true},
  {pattern:'aac',replacement:'AAC',enabled:true,builtin:true},
  {pattern:'flac',replacement:'FLAC',enabled:true,builtin:true},
  {pattern:'alac',replacement:'ALAC',enabled:true,builtin:true},
  {pattern:'mp3',replacement:'MP3',enabled:true,builtin:true},
  {pattern:'wav',replacement:'WAV',enabled:true,builtin:true},
  {pattern:'opus',replacement:'Opus',enabled:true,builtin:true},
  {pattern:'vorbis',replacement:'Vorbis',enabled:true,builtin:true},
  {pattern:'hevc',replacement:'HEVC',enabled:true,builtin:true},
  {pattern:'h.264',replacement:'H.264',enabled:true,builtin:true},
  {pattern:'h.265',replacement:'H.265',enabled:true,builtin:true},
  {pattern:'av1',replacement:'AV1',enabled:true,builtin:true},
  {pattern:'vp9',replacement:'VP9',enabled:true,builtin:true},
  {pattern:'mpeg',replacement:'MPEG',enabled:true,builtin:true},
  {pattern:'jpeg',replacement:'JPEG',enabled:true,builtin:true},
  {pattern:'png',replacement:'PNG',enabled:true,builtin:true},
  {pattern:'gif',replacement:'GIF',enabled:true,builtin:true},
  {pattern:'webp',replacement:'WebP',enabled:true,builtin:true},
  {pattern:'heif',replacement:'HEIF',enabled:true,builtin:true},
  {pattern:'raw',replacement:'RAW',enabled:true,builtin:true},
  {pattern:'iso',replacement:'ISO',enabled:true,builtin:true},
  {pattern:'shutter speed',replacement:'shutter speed',enabled:true,builtin:true},
  {pattern:'aperture',replacement:'aperture',enabled:true,builtin:true},
  {pattern:'f/1.4',replacement:'f/1.4',enabled:true,builtin:true},
  {pattern:'f/1.8',replacement:'f/1.8',enabled:true,builtin:true},
  {pattern:'f/2.0',replacement:'f/2.0',enabled:true,builtin:true},
  {pattern:'f/2.8',replacement:'f/2.8',enabled:true,builtin:true},
  {pattern:'ois',replacement:'OIS',enabled:true,builtin:true},
  {pattern:'eis',replacement:'EIS',enabled:true,builtin:true},
  {pattern:'ibis',replacement:'IBIS',enabled:true,builtin:true},
  {pattern:'cmos',replacement:'CMOS',enabled:true,builtin:true},
  {pattern:'ccd',replacement:'CCD',enabled:true,builtin:true},
  {pattern:'bsi',replacement:'BSI',enabled:true,builtin:true},
  {pattern:'tof',replacement:'ToF',enabled:true,builtin:true},
  {pattern:'lidar',replacement:'LiDAR',enabled:true,builtin:true},
  // 5G
  {pattern:'5g',replacement:'5G',enabled:true,builtin:true},
  {pattern:'4g',replacement:'4G',enabled:true,builtin:true},
  {pattern:'lte',replacement:'LTE',enabled:true,builtin:true},
  {pattern:'volte',replacement:'VoLTE',enabled:true,builtin:true},
  {pattern:'mmwave',replacement:'mmWave',enabled:true,builtin:true},
  {pattern:'sub-6',replacement:'Sub-6',enabled:true,builtin:true},
  // 协议
  {pattern:'http',replacement:'HTTP',enabled:true,builtin:true},
  {pattern:'https',replacement:'HTTPS',enabled:true,builtin:true},
  {pattern:'ftp',replacement:'FTP',enabled:true,builtin:true},
  {pattern:'smtp',replacement:'SMTP',enabled:true,builtin:true},
  {pattern:'imap',replacement:'IMAP',enabled:true,builtin:true},
  {pattern:'pop3',replacement:'POP3',enabled:true,builtin:true},
  {pattern:'tcp',replacement:'TCP',enabled:true,builtin:true},
  {pattern:'udp',replacement:'UDP',enabled:true,builtin:true},
  {pattern:'ip',replacement:'IP',enabled:true,builtin:true},
  {pattern:'ipv4',replacement:'IPv4',enabled:true,builtin:true},
  {pattern:'ipv6',replacement:'IPv6',enabled:true,builtin:true},
  {pattern:'dns',replacement:'DNS',enabled:true,builtin:true},
  {pattern:'dhcp',replacement:'DHCP',enabled:true,builtin:true},
  {pattern:'nat',replacement:'NAT',enabled:true,builtin:true},
  {pattern:'vpn',replacement:'VPN',enabled:true,builtin:true},
  {pattern:'lan',replacement:'LAN',enabled:true,builtin:true},
  {pattern:'wan',replacement:'WAN',enabled:true,builtin:true},
  {pattern:'wlan',replacement:'WLAN',enabled:true,builtin:true},
  {pattern:'ssid',replacement:'SSID',enabled:true,builtin:true},
  // 更多...
  {pattern:'tik tok',replacement:'TikTok',enabled:true,builtin:true},
  {pattern:'we chat',replacement:'WeChat',enabled:true,builtin:true},
  {pattern:'face book',replacement:'Facebook',enabled:true,builtin:true},
  {pattern:'you tube',replacement:'YouTube',enabled:true,builtin:true},
  {pattern:'whats app',replacement:'WhatsApp',enabled:true,builtin:true},
  {pattern:'linked in',replacement:'LinkedIn',enabled:true,builtin:true},
  {pattern:'git hub',replacement:'GitHub',enabled:true,builtin:true},
  {pattern:'visualstudio',replacement:'Visual Studio',enabled:true,builtin:true},
  {pattern:'vs code',replacement:'VS Code',enabled:true,builtin:true},
  {pattern:'vs studio',replacement:'Visual Studio',enabled:true,builtin:true},
  {pattern:'mac book',replacement:'MacBook',enabled:true,builtin:true},
  {pattern:'mac os',replacement:'macOS',enabled:true,builtin:true},
  {pattern:'i phone',replacement:'iPhone',enabled:true,builtin:true},
  {pattern:'i pad',replacement:'iPad',enabled:true,builtin:true},
  {pattern:'i pod',replacement:'iPod',enabled:true,builtin:true},
  {pattern:'i mac',replacement:'iMac',enabled:true,builtin:true},
  {pattern:'apple watch',replacement:'Apple Watch',enabled:true,builtin:true},
  {pattern:'apple tv',replacement:'Apple TV',enabled:true,builtin:true},
  {pattern:'air pods',replacement:'AirPods',enabled:true,builtin:true},
  {pattern:'air tag',replacement:'AirTag',enabled:true,builtin:true},
  {pattern:'air drop',replacement:'AirDrop',enabled:true,builtin:true},
  {pattern:'app store',replacement:'App Store',enabled:true,builtin:true},
  {pattern:'i tunes',replacement:'iTunes',enabled:true,builtin:true},
  {pattern:'i cloud',replacement:'iCloud',enabled:true,builtin:true},
  {pattern:'i message',replacement:'iMessage',enabled:true,builtin:true},
  {pattern:'face time',replacement:'FaceTime',enabled:true,builtin:true},
  {pattern:'dji mini',replacement:'DJI Mini',enabled:true,builtin:true},
  {pattern:'dji mavic',replacement:'DJI Mavic',enabled:true,builtin:true},
  {pattern:'dji air',replacement:'DJI Air',enabled:true,builtin:true},
  {pattern:'dji fpv',replacement:'DJI FPV',enabled:true,builtin:true},
  {pattern:'dji osmo',replacement:'DJI Osmo',enabled:true,builtin:true},
  {pattern:'dji ronin',replacement:'DJI Ronin',enabled:true,builtin:true},
  {pattern:'oppo find',replacement:'OPPO Find',enabled:true,builtin:true},
  {pattern:'oppo reno',replacement:'OPPO Reno',enabled:true,builtin:true},
  {pattern:'vivo x',replacement:'vivo X',enabled:true,builtin:true},
  {pattern:'one plus',replacement:'OnePlus',enabled:true,builtin:true},
  {pattern:'xiaomi mi',replacement:'Xiaomi Mi',enabled:true,builtin:true},
  {pattern:'huawei mate',replacement:'HUAWEI Mate',enabled:true,builtin:true},
  {pattern:'huawei p',replacement:'HUAWEI P',enabled:true,builtin:true},
  {pattern:'huawei nova',replacement:'HUAWEI nova',enabled:true,builtin:true},
  {pattern:'samsung galaxy',replacement:'Samsung Galaxy',enabled:true,builtin:true},
  {pattern:'google pixel',replacement:'Google Pixel',enabled:true,builtin:true},
  {pattern:'microsoft surface',replacement:'Microsoft Surface',enabled:true,builtin:true},
  {pattern:'sony xperia',replacement:'Sony Xperia',enabled:true,builtin:true},
  {pattern:'play station',replacement:'PlayStation',enabled:true,builtin:true},
  {pattern:'x box',replacement:'Xbox',enabled:true,builtin:true},
  {pattern:'nintendo switch',replacement:'Nintendo Switch',enabled:true,builtin:true},
  {pattern:' unreal engine',replacement:'Unreal Engine',enabled:true,builtin:true},
  {pattern:'final cut',replacement:'Final Cut',enabled:true,builtin:true},
  {pattern:'finalcutpro',replacement:'Final Cut Pro',enabled:true,builtin:true},
  {pattern:'premierepro',replacement:'Premiere Pro',enabled:true,builtin:true},
  {pattern:'aftereffects',replacement:'After Effects',enabled:true,builtin:true},
  {pattern:'davinciresolve',replacement:'DaVinci Resolve',enabled:true,builtin:true},
  {pattern:'lightroom',replacement:'Lightroom',enabled:true,builtin:true},
  {pattern:'photoshop',replacement:'Photoshop',enabled:true,builtin:true},
  {pattern:'illustrator',replacement:'Illustrator',enabled:true,builtin:true},
  {pattern:'audition',replacement:'Audition',enabled:true,builtin:true},
  {pattern:'creativecloud',replacement:'Creative Cloud',enabled:true,builtin:true},
  {pattern:'chrome os',replacement:'Chrome OS',enabled:true,builtin:true},
  {pattern:'chromebook',replacement:'Chromebook',enabled:true,builtin:true},
  {pattern:'google drive',replacement:'Google Drive',enabled:true,builtin:true},
  {pattern:'google maps',replacement:'Google Maps',enabled:true,builtin:true},
  {pattern:'google photos',replacement:'Google Photos',enabled:true,builtin:true},
  {pattern:'google play',replacement:'Google Play',enabled:true,builtin:true},
  {pattern:'google assistant',replacement:'Google Assistant',enabled:true,builtin:true},
  {pattern:'amazon prime',replacement:'Amazon Prime',enabled:true,builtin:true},
  {pattern:'amazon echo',replacement:'Amazon Echo',enabled:true,builtin:true},
  {pattern:'aws lambda',replacement:'AWS Lambda',enabled:true,builtin:true},
  {pattern:'aws ec2',replacement:'AWS EC2',enabled:true,builtin:true},
  {pattern:'aws s3',replacement:'AWS S3',enabled:true,builtin:true},
  {pattern:'azure devops',replacement:'Azure DevOps',enabled:true,builtin:true},
  {pattern:'github actions',replacement:'GitHub Actions',enabled:true,builtin:true},
  {pattern:'ci/cd',replacement:'CI/CD',enabled:true,builtin:true},
  {pattern:'docker',replacement:'Docker',enabled:true,builtin:true},
  {pattern:'kubernetes',replacement:'Kubernetes',enabled:true,builtin:true},
  {pattern:'k8s',replacement:'K8s',enabled:true,builtin:true},
  {pattern:'redis',replacement:'Redis',enabled:true,builtin:true},
  {pattern:'mongodb',replacement:'MongoDB',enabled:true,builtin:true},
  {pattern:'postgresql',replacement:'PostgreSQL',enabled:true,builtin:true},
  {pattern:'mysql',replacement:'MySQL',enabled:true,builtin:true},
  {pattern:'mariadb',replacement:'MariaDB',enabled:true,builtin:true},
  {pattern:'sqlite',replacement:'SQLite',enabled:true,builtin:true},
  {pattern:'elasticsearch',replacement:'Elasticsearch',enabled:true,builtin:true},
  {pattern:'kafka',replacement:'Kafka',enabled:true,builtin:true},
  {pattern:'rabbitmq',replacement:'RabbitMQ',enabled:true,builtin:true},
  {pattern:'nginx',replacement:'Nginx',enabled:true,builtin:true},
  {pattern:'apache',replacement:'Apache',enabled:true,builtin:true},
  {pattern:'tomcat',replacement:'Tomcat',enabled:true,builtin:true},
  {pattern:'spring',replacement:'Spring',enabled:true,builtin:true},
  {pattern:'spring boot',replacement:'Spring Boot',enabled:true,builtin:true},
  {pattern:'django',replacement:'Django',enabled:true,builtin:true},
  {pattern:'flask',replacement:'Flask',enabled:true,builtin:true},
  {pattern:'fastapi',replacement:'FastAPI',enabled:true,builtin:true},
  {pattern:'express',replacement:'Express',enabled:true,builtin:true},
  {pattern:'react',replacement:'React',enabled:true,builtin:true},
  {pattern:'vue',replacement:'Vue',enabled:true,builtin:true},
  {pattern:'angular',replacement:'Angular',enabled:true,builtin:true},
  {pattern:'svelte',replacement:'Svelte',enabled:true,builtin:true},
  {pattern:'next.js',replacement:'Next.js',enabled:true,builtin:true},
  {pattern:'nuxt',replacement:'Nuxt',enabled:true,builtin:true},
  {pattern:'remix',replacement:'Remix',enabled:true,builtin:true},
  {pattern:'astro',replacement:'Astro',enabled:true,builtin:true},
  {pattern:'solid',replacement:'Solid',enabled:true,builtin:true},
  {pattern:'qwik',replacement:'Qwik',enabled:true,builtin:true},
  {pattern:'lit',replacement:'Lit',enabled:true,builtin:true},
  {pattern:'electron',replacement:'Electron',enabled:true,builtin:true},
  {pattern:'tauri',replacement:'Tauri',enabled:true,builtin:true},
  {pattern:'flutter',replacement:'Flutter',enabled:true,builtin:true},
  {pattern:'dart',replacement:'Dart',enabled:true,builtin:true},
  {pattern:'kotlin',replacement:'Kotlin',enabled:true,builtin:true},
  {pattern:'java',replacement:'Java',enabled:true,builtin:true},
  {pattern:'python',replacement:'Python',enabled:true,builtin:true},
  {pattern:'javascript',replacement:'JavaScript',enabled:true,builtin:true},
  {pattern:'typescript',replacement:'TypeScript',enabled:true,builtin:true},
  {pattern:'golang',replacement:'Go',enabled:true,builtin:true},
  {pattern:'rust',replacement:'Rust',enabled:true,builtin:true},
  {pattern:'c++',replacement:'C++',enabled:true,builtin:true},
  {pattern:'c#',replacement:'C#',enabled:true,builtin:true},
  {pattern:'php',replacement:'PHP',enabled:true,builtin:true},
  {pattern:'ruby',replacement:'Ruby',enabled:true,builtin:true},
  {pattern:'rails',replacement:'Rails',enabled:true,builtin:true},
  {pattern:'laravel',replacement:'Laravel',enabled:true,builtin:true},
  {pattern:'symfony',replacement:'Symfony',enabled:true,builtin:true},
  {pattern:'node.js',replacement:'Node.js',enabled:true,builtin:true},
  {pattern:'deno',replacement:'Deno',enabled:true,builtin:true},
  {pattern:'bun',replacement:'Bun',enabled:true,builtin:true},
  {pattern:'webpack',replacement:'Webpack',enabled:true,builtin:true},
  {pattern:'vite',replacement:'Vite',enabled:true,builtin:true},
  {pattern:'rollup',replacement:'Rollup',enabled:true,builtin:true},
  {pattern:'parcel',replacement:'Parcel',enabled:true,builtin:true},
  {pattern:'esbuild',replacement:'esbuild',enabled:true,builtin:true},
  {pattern:'swc',replacement:'SWC',enabled:true,builtin:true},
  {pattern:'turbopack',replacement:'Turbopack',enabled:true,builtin:true},
  {pattern:'babel',replacement:'Babel',enabled:true,builtin:true},
  {pattern:'eslint',replacement:'ESLint',enabled:true,builtin:true},
  {pattern:'prettier',replacement:'Prettier',enabled:true,builtin:true},
  {pattern:'jest',replacement:'Jest',enabled:true,builtin:true},
  {pattern:'vitest',replacement:'Vitest',enabled:true,builtin:true},
  {pattern:'cypress',replacement:'Cypress',enabled:true,builtin:true},
  {pattern:'playwright',replacement:'Playwright',enabled:true,builtin:true},
  {pattern:'storybook',replacement:'Storybook',enabled:true,builtin:true},
  {pattern:'tailwind',replacement:'Tailwind',enabled:true,builtin:true},
  {pattern:'bootstrap',replacement:'Bootstrap',enabled:true,builtin:true},
  {pattern:'sass',replacement:'Sass',enabled:true,builtin:true},
  {pattern:'less',replacement:'Less',enabled:true,builtin:true},
  {pattern:'stylus',replacement:'Stylus',enabled:true,builtin:true},
  {pattern:'postcss',replacement:'PostCSS',enabled:true,builtin:true},
  {pattern:'css',replacement:'CSS',enabled:true,builtin:true},
  {pattern:'html',replacement:'HTML',enabled:true,builtin:true},
  {pattern:'svg',replacement:'SVG',enabled:true,builtin:true},
  {pattern:'canvas',replacement:'Canvas',enabled:true,builtin:true},
  {pattern:'webgl',replacement:'WebGL',enabled:true,builtin:true},
  {pattern:'webgpu',replacement:'WebGPU',enabled:true,builtin:true},
  {pattern:'wasm',replacement:'WebAssembly',enabled:true,builtin:true},
  {pattern:'pwa',replacement:'PWA',enabled:true,builtin:true},
  {pattern:'spa',replacement:'SPA',enabled:true,builtin:true},
  {pattern:'ssr',replacement:'SSR',enabled:true,builtin:true},
  {pattern:'ssg',replacement:'SSG',enabled:true,builtin:true},
  {pattern:'csr',replacement:'CSR',enabled:true,builtin:true},
  {pattern:'api',replacement:'API',enabled:true,builtin:true},
  {pattern:'rest',replacement:'REST',enabled:true,builtin:true},
  {pattern:'graphql',replacement:'GraphQL',enabled:true,builtin:true},
  {pattern:'grpc',replacement:'gRPC',enabled:true,builtin:true},
  {pattern:'websocket',replacement:'WebSocket',enabled:true,builtin:true},
  {pattern:'webrtc',replacement:'WebRTC',enabled:true,builtin:true},
  {pattern:'oauth',replacement:'OAuth',enabled:true,builtin:true},
  {pattern:'jwt',replacement:'JWT',enabled:true,builtin:true},
  {pattern:'saml',replacement:'SAML',enabled:true,builtin:true},
  {pattern:'ldap',replacement:'LDAP',enabled:true,builtin:true},
  {pattern:'sso',replacement:'SSO',enabled:true,builtin:true},
  {pattern:'mfa',replacement:'MFA',enabled:true,builtin:true},
  {pattern:'2fa',replacement:'2FA',enabled:true,builtin:true},
  {pattern:'totp',replacement:'TOTP',enabled:true,builtin:true},
  {pattern:'hmac',replacement:'HMAC',enabled:true,builtin:true},
  {pattern:'sha',replacement:'SHA',enabled:true,builtin:true},
  {pattern:'md5',replacement:'MD5',enabled:true,builtin:true},
  {pattern:'rsa',replacement:'RSA',enabled:true,builtin:true},
  {pattern:'ecc',replacement:'ECC',enabled:true,builtin:true},
  {pattern:'aes',replacement:'AES',enabled:true,builtin:true},
  {pattern:'tls',replacement:'TLS',enabled:true,builtin:true},
  {pattern:'ssl',replacement:'SSL',enabled:true,builtin:true},
  {pattern:'https',replacement:'HTTPS',enabled:true,builtin:true},
  {pattern:'cors',replacement:'CORS',enabled:true,builtin:true},
  {pattern:'csrf',replacement:'CSRF',enabled:true,builtin:true},
  {pattern:'xss',replacement:'XSS',enabled:true,builtin:true},
  {pattern:'sqli',replacement:'SQLi',enabled:true,builtin:true},
  {pattern:'ddos',replacement:'DDoS',enabled:true,builtin:true},
  {pattern:'cdn',replacement:'CDN',enabled:true,builtin:true},
  {pattern:'waf',replacement:'WAF',enabled:true,builtin:true},
  {pattern:'ids',replacement:'IDS',enabled:true,builtin:true},
  {pattern:'ips',replacement:'IPS',enabled:true,builtin:true},
  {pattern:'siem',replacement:'SIEM',enabled:true,builtin:true},
  {pattern:'soc',replacement:'SOC',enabled:true,builtin:true},
  {pattern:'iam',replacement:'IAM',enabled:true,builtin:true},
  {pattern:'pim',replacement:'PIM',enabled:true,builtin:true},
  {pattern:'pam',replacement:'PAM',enabled:true,builtin:true},
  {pattern:'rbac',replacement:'RBAC',enabled:true,builtin:true},
  {pattern:'abac',replacement:'ABAC',enabled:true,builtin:true},
  {pattern:'mac',replacement:'MAC',enabled:true,builtin:true},
  {pattern:'dac',replacement:'DAC',enabled:true,builtin:true},
  {pattern:'acl',replacement:'ACL',enabled:true,builtin:true},
  {pattern:'cap',replacement:'CAP',enabled:true,builtin:true},
  {pattern:'base',replacement:'BASE',enabled:true,builtin:true},
  {pattern:'acid',replacement:'ACID',enabled:true,builtin:true},
  {pattern:'solr',replacement:'SOLR',enabled:true,builtin:true},
  {pattern:'crud',replacement:'CRUD',enabled:true,builtin:true},
  {pattern:'mvc',replacement:'MVC',enabled:true,builtin:true},
  {pattern:'mvvm',replacement:'MVVM',enabled:true,builtin:true},
  {pattern:'mvp',replacement:'MVP',enabled:true,builtin:true},
  {pattern:'orm',replacement:'ORM',enabled:true,builtin:true},
  {pattern:'odm',replacement:'ODM',enabled:true,builtin:true},
  {pattern:'dao',replacement:'DAO',enabled:true,builtin:true},
  {pattern:'dto',replacement:'DTO',enabled:true,builtin:true},
  {pattern:'vo',replacement:'VO',enabled:true,builtin:true},
  {pattern:'po',replacement:'PO',enabled:true,builtin:true},
  {pattern:'bo',replacement:'BO',enabled:true,builtin:true},
  {pattern:'so',replacement:'SO',enabled:true,builtin:true},
  {pattern:'entity',replacement:'Entity',enabled:true,builtin:true},
  {pattern:'value object',replacement:'Value Object',enabled:true,builtin:true},
  {pattern:'aggregate',replacement:'Aggregate',enabled:true,builtin:true},
  {pattern:'repository',replacement:'Repository',enabled:true,builtin:true},
  {pattern:'unit of work',replacement:'Unit of Work',enabled:true,builtin:true},
  {pattern:'factory',replacement:'Factory',enabled:true,builtin:true},
  {pattern:'builder',replacement:'Builder',enabled:true,builtin:true},
  {pattern:'singleton',replacement:'Singleton',enabled:true,builtin:true},
  {pattern:'prototype',replacement:'Prototype',enabled:true,builtin:true},
  {pattern:'adapter',replacement:'Adapter',enabled:true,builtin:true},
  {pattern:'bridge',replacement:'Bridge',enabled:true,builtin:true},
  {pattern:'composite',replacement:'Composite',enabled:true,builtin:true},
  {pattern:'decorator',replacement:'Decorator',enabled:true,builtin:true},
  {pattern:'facade',replacement:'Facade',enabled:true,builtin:true},
  {pattern:'flyweight',replacement:'Flyweight',enabled:true,builtin:true},
  {pattern:'proxy',replacement:'Proxy',enabled:true,builtin:true},
  {pattern:'observer',replacement:'Observer',enabled:true,builtin:true},
  {pattern:'strategy',replacement:'Strategy',enabled:true,builtin:true},
  {pattern:'command',replacement:'Command',enabled:true,builtin:true},
  {pattern:'state',replacement:'State',enabled:true,builtin:true},
  {pattern:'visitor',replacement:'Visitor',enabled:true,builtin:true},
  {pattern:'iterator',replacement:'Iterator',enabled:true,builtin:true},
  {pattern:'mediator',replacement:'Mediator',enabled:true,builtin:true},
  {pattern:'memento',replacement:'Memento',enabled:true,builtin:true},
  {pattern:'template',replacement:'Template',enabled:true,builtin:true},
  {pattern:'pipeline',replacement:'Pipeline',enabled:true,builtin:true},
  {pattern:'chain of responsibility',replacement:'Chain of Responsibility',enabled:true,builtin:true},
  {pattern:'dependency injection',replacement:'Dependency Injection',enabled:true,builtin:true},
  {pattern:'inversion of control',replacement:'Inversion of Control',enabled:true,builtin:true},
  {pattern:'aspect oriented',replacement:'Aspect-Oriented',enabled:true,builtin:true},
  {pattern:'event driven',replacement:'Event-Driven',enabled:true,builtin:true},
  {pattern:'message queue',replacement:'Message Queue',enabled:true,builtin:true},
  {pattern:'event bus',replacement:'Event Bus',enabled:true,builtin:true},
  {pattern:'saga',replacement:'Saga',enabled:true,builtin:true},
  {pattern:'outbox',replacement:'Outbox',enabled:true,builtin:true},
  {pattern:'inbox',replacement:'Inbox',enabled:true,builtin:true},
  {pattern:'cqrs',replacement:'CQRS',enabled:true,builtin:true},
  {pattern:'event sourcing',replacement:'Event Sourcing',enabled:true,builtin:true},
  {pattern:'materialized view',replacement:'Materialized View',enabled:true,builtin:true},
  {pattern:'projection',replacement:'Projection',enabled:true,builtin:true},
  {pattern:'read model',replacement:'Read Model',enabled:true,builtin:true},
  {pattern:'write model',replacement:'Write Model',enabled:true,builtin:true},
  {pattern:'bounded context',replacement:'Bounded Context',enabled:true,builtin:true},
  {pattern:'ubiquitous language',replacement:'Ubiquitous Language',enabled:true,builtin:true},
  {pattern:'domain driven design',replacement:'Domain-Driven Design',enabled:true,builtin:true},
  {pattern:'test driven development',replacement:'Test-Driven Development',enabled:true,builtin:true},
  {pattern:'behavior driven development',replacement:'Behavior-Driven Development',enabled:true,builtin:true},
  {pattern:'acceptance test',replacement:'Acceptance Test',enabled:true,builtin:true},
  {pattern:'integration test',replacement:'Integration Test',enabled:true,builtin:true},
  {pattern:'unit test',replacement:'Unit Test',enabled:true,builtin:true},
  {pattern:'e2e test',replacement:'E2E Test',enabled:true,builtin:true},
  {pattern:'regression test',replacement:'Regression Test',enabled:true,builtin:true},
  {pattern:'smoke test',replacement:'Smoke Test',enabled:true,builtin:true},
  {pattern:'sanity test',replacement:'Sanity Test',enabled:true,builtin:true},
  {pattern:'load test',replacement:'Load Test',enabled:true,builtin:true},
  {pattern:'stress test',replacement:'Stress Test',enabled:true,builtin:true},
  {pattern:'performance test',replacement:'Performance Test',enabled:true,builtin:true},
  {pattern:'penetration test',replacement:'Penetration Test',enabled:true,builtin:true},
  {pattern:'fuzz test',replacement:'Fuzz Test',enabled:true,builtin:true},
  {pattern:'mutation test',replacement:'Mutation Test',enabled:true,builtin:true},
  {pattern:'property based',replacement:'Property-Based',enabled:true,builtin:true},
  {pattern:'snapshot test',replacement:'Snapshot Test',enabled:true,builtin:true},
  {pattern:'visual regression',replacement:'Visual Regression',enabled:true,builtin:true},
  {pattern:'accessibility test',replacement:'Accessibility Test',enabled:true,builtin:true},
  {pattern:'usability test',replacement:'Usability Test',enabled:true,builtin:true},
  {pattern:'a/b test',replacement:'A/B Test',enabled:true,builtin:true},
  {pattern:'multivariate test',replacement:'Multivariate Test',enabled:true,builtin:true},
  {pattern:'canary release',replacement:'Canary Release',enabled:true,builtin:true},
  {pattern:'blue green',replacement:'Blue-Green',enabled:true,builtin:true},
  {pattern:'feature flag',replacement:'Feature Flag',enabled:true,builtin:true},
  {pattern:'dark launch',replacement:'Dark Launch',enabled:true,builtin:true},
  {pattern:'shadow release',replacement:'Shadow Release',enabled:true,builtin:true},
  {pattern:'staged rollout',replacement:'Staged Rollout',enabled:true,builtin:true},
  {pattern:'traffic splitting',replacement:'Traffic Splitting',enabled:true,builtin:true},
  {pattern:'circuit breaker',replacement:'Circuit Breaker',enabled:true,builtin:true},
  {pattern:'bulkhead',replacement:'Bulkhead',enabled:true,builtin:true},
  {pattern:'retry',replacement:'Retry',enabled:true,builtin:true},
  {pattern:'timeout',replacement:'Timeout',enabled:true,builtin:true},
  {pattern:'fallback',replacement:'Fallback',enabled:true,builtin:true},
  {pattern:'rate limiter',replacement:'Rate Limiter',enabled:true,builtin:true},
  {pattern:'throttle',replacement:'Throttle',enabled:true,builtin:true},
  {pattern:'debounce',replacement:'Debounce',enabled:true,builtin:true},
  {pattern:'backoff',replacement:'Backoff',enabled:true,builtin:true},
  {pattern:'jitter',replacement:'Jitter',enabled:true,builtin:true},
  {pattern:'hedging',replacement:'Hedging',enabled:true,builtin:true},
  {pattern:'load balancing',replacement:'Load Balancing',enabled:true,builtin:true},
  {pattern:'sticky session',replacement:'Sticky Session',enabled:true,builtin:true},
  {pattern:'session affinity',replacement:'Session Affinity',enabled:true,builtin:true},
  {pattern:'health check',replacement:'Health Check',enabled:true,builtin:true},
  {pattern:'readiness probe',replacement:'Readiness Probe',enabled:true,builtin:true},
  {pattern:'liveness probe',replacement:'Liveness Probe',enabled:true,builtin:true},
  {pattern:'startup probe',replacement:'Startup Probe',enabled:true,builtin:true},
  {pattern:'graceful shutdown',replacement:'Graceful Shutdown',enabled:true,builtin:true},
  {pattern:'zero downtime',replacement:'Zero Downtime',enabled:true,builtin:true},
  {pattern:'rolling update',replacement:'Rolling Update',enabled:true,builtin:true},
  {pattern:'hot swap',replacement:'Hot Swap',enabled:true,builtin:true},
  {pattern:'live reload',replacement:'Live Reload',enabled:true,builtin:true},
  {pattern:'hmr',replacement:'HMR',enabled:true,builtin:true},
  {pattern:'watch mode',replacement:'Watch Mode',enabled:true,builtin:true},
  {pattern:'incremental build',replacement:'Incremental Build',enabled:true,builtin:true},
  {pattern:'parallel build',replacement:'Parallel Build',enabled:true,builtin:true},
  {pattern:'distributed build',replacement:'Distributed Build',enabled:true,builtin:true},
  {pattern:'remote build',replacement:'Remote Build',enabled:true,builtin:true},
  {pattern:'cloud build',replacement:'Cloud Build',enabled:true,builtin:true},
  {pattern:'build cache',replacement:'Build Cache',enabled:true,builtin:true},
  {pattern:'artifact',replacement:'Artifact',enabled:true,builtin:true},
  {pattern:'dependency cache',replacement:'Dependency Cache',enabled:true,builtin:true},
  {pattern:'layer caching',replacement:'Layer Caching',enabled:true,builtin:true},
  {pattern:'multi stage',replacement:'Multi-Stage',enabled:true,builtin:true},
  {pattern:'buildkit',replacement:'BuildKit',enabled:true,builtin:true},
  {pattern:'kaniko',replacement:'Kaniko',enabled:true,builtin:true},
  {pattern:'dind',replacement:'DinD',enabled:true,builtin:true},
  {pattern:'rootless',replacement:'Rootless',enabled:true,builtin:true},
  {pattern:'unprivileged',replacement:'Unprivileged',enabled:true,builtin:true},
  {pattern:'seccomp',replacement:'Seccomp',enabled:true,builtin:true},
  {pattern:'apparmor',replacement:'AppArmor',enabled:true,builtin:true},
  {pattern:'selinux',replacement:'SELinux',enabled:true,builtin:true},
  {pattern:'capabilities',replacement:'Capabilities',enabled:true,builtin:true},
  {pattern:'namespaces',replacement:'Namespaces',enabled:true,builtin:true},
  {pattern:'cgroups',replacement:'cgroups',enabled:true,builtin:true},
  {pattern:'systemd',replacement:'systemd',enabled:true,builtin:true},
  {pattern:'sysvinit',replacement:'SysVinit',enabled:true,builtin:true},
  {pattern:'openrc',replacement:'OpenRC',enabled:true,builtin:true},
  {pattern:'runit',replacement:'runit',enabled:true,builtin:true},
  {pattern:'s6',replacement:'s6',enabled:true,builtin:true},
  {pattern:'tini',replacement:'tini',enabled:true,builtin:true},
  {pattern:'dumb-init',replacement:'dumb-init',enabled:true,builtin:true},
  {pattern:'supervisord',replacement:'supervisord',enabled:true,builtin:true},
  {pattern:'monit',replacement:'Monit',enabled:true,builtin:true},
  {pattern:'consul',replacement:'Consul',enabled:true,builtin:true},
  {pattern:'etcd',replacement:'etcd',enabled:true,builtin:true},
  {pattern:'zookeeper',replacement:'ZooKeeper',enabled:true,builtin:true},
  {pattern:'serf',replacement:'Serf',enabled:true,builtin:true},
  {pattern:'nomad',replacement:'Nomad',enabled:true,builtin:true},
  {pattern:'vault',replacement:'Vault',enabled:true,builtin:true},
  {pattern:'boundary',replacement:'Boundary',enabled:true,builtin:true},
  {pattern:'waypoint',replacement:'Waypoint',enabled:true,builtin:true},
  {pattern:'packer',replacement:'Packer',enabled:true,builtin:true},
  {pattern:'terraform',replacement:'Terraform',enabled:true,builtin:true},
  {pattern:'pulumi',replacement:'Pulumi',enabled:true,builtin:true},
  {pattern:'ansible',replacement:'Ansible',enabled:true,builtin:true},
  {pattern:'chef',replacement:'Chef',enabled:true,builtin:true},
  {pattern:'puppet',replacement:'Puppet',enabled:true,builtin:true},
  {pattern:'saltstack',replacement:'SaltStack',enabled:true,builtin:true},
  {pattern:'vagrant',replacement:'Vagrant',enabled:true,builtin:true},
  {pattern:'vsphere',replacement:'vSphere',enabled:true,builtin:true},
  {pattern:'hyper-v',replacement:'Hyper-V',enabled:true,builtin:true},
  {pattern:'kvm',replacement:'KVM',enabled:true,builtin:true},
  {pattern:'xen',replacement:'Xen',enabled:true,builtin:true},
  {pattern:'proxmox',replacement:'Proxmox',enabled:true,builtin:true},
  {pattern:'openstack',replacement:'OpenStack',enabled:true,builtin:true},
  {pattern:'opennebula',replacement:'OpenNebula',enabled:true,builtin:true},
  {pattern:'cloudstack',replacement:'CloudStack',enabled:true,builtin:true},
  {pattern:'eucalyptus',replacement:'Eucalyptus',enabled:true,builtin:true},
  {pattern:'openshift',replacement:'OpenShift',enabled:true,builtin:true},
  {pattern:'rancher',replacement:'Rancher',enabled:true,builtin:true},
  {pattern:'k3s',replacement:'K3s',enabled:true,builtin:true},
  {pattern:'k3d',replacement:'k3d',enabled:true,builtin:true},
  {pattern:'kind',replacement:'KIND',enabled:true,builtin:true},
  {pattern:'minikube',replacement:'Minikube',enabled:true,builtin:true},
  {pattern:'microk8s',replacement:'MicroK8s',enabled:true,builtin:true},
  {pattern:'crc',replacement:'CRC',enabled:true,builtin:true},
  {pattern:'okd',replacement:'OKD',enabled:true,builtin:true},
  {pattern:'rosa',replacement:'ROSA',enabled:true,builtin:true},
  {pattern:'aro',replacement:'ARO',enabled:true,builtin:true},
  {pattern:'gke',replacement:'GKE',enabled:true,builtin:true},
  {pattern:'eks',replacement:'EKS',enabled:true,builtin:true},
  {pattern:'aks',replacement:'AKS',enabled:true,builtin:true},
  {pattern:'fargate',replacement:'Fargate',enabled:true,builtin:true},
  {pattern:'ecs',replacement:'ECS',enabled:true,builtin:true},
  {pattern:'ec2',replacement:'EC2',enabled:true,builtin:true},
  {pattern:'s3',replacement:'S3',enabled:true,builtin:true},
  {pattern:'rds',replacement:'RDS',enabled:true,builtin:true},
  {pattern:'dynamodb',replacement:'DynamoDB',enabled:true,builtin:true},
  {pattern:'documentdb',replacement:'DocumentDB',enabled:true,builtin:true},
  {pattern:'neptune',replacement:'Neptune',enabled:true,builtin:true},
  {pattern:'keyspaces',replacement:'Keyspaces',enabled:true,builtin:true},
  {pattern:'timestream',replacement:'Timestream',enabled:true,builtin:true},
  {pattern:'quicksight',replacement:'QuickSight',enabled:true,builtin:true},
  {pattern:'redshift',replacement:'Redshift',enabled:true,builtin:true},
  {pattern:'athena',replacement:'Athena',enabled:true,builtin:true},
  {pattern:'glue',replacement:'Glue',enabled:true,builtin:true},
  {pattern:'kinesis',replacement:'Kinesis',enabled:true,builtin:true},
  {pattern:'managed streaming',replacement:'Managed Streaming',enabled:true,builtin:true},
  {pattern:'msk',replacement:'MSK',enabled:true,builtin:true},
  {pattern:'kafka connect',replacement:'Kafka Connect',enabled:true,builtin:true},
  {pattern:'debezium',replacement:'Debezium',enabled:true,builtin:true},
  {pattern:'schema registry',replacement:'Schema Registry',enabled:true,builtin:true},
  {pattern:'ksql',replacement:'ksqlDB',enabled:true,builtin:true},
  {pattern:'flink',replacement:'Flink',enabled:true,builtin:true},
  {pattern:'spark streaming',replacement:'Spark Streaming',enabled:true,builtin:true},
  {pattern:'storm',replacement:'Storm',enabled:true,builtin:true},
  {pattern:'samza',replacement:'Samza',enabled:true,builtin:true},
  {pattern:'pulsar',replacement:'Pulsar',enabled:true,builtin:true},
  {pattern:'bookkeeper',replacement:'BookKeeper',enabled:true,builtin:true},
  {pattern:'herd',replacement:'Herd',enabled:true,builtin:true},
  {pattern:'nifi',replacement:'NiFi',enabled:true,builtin:true},
  {pattern:'airflow',replacement:'Airflow',enabled:true,builtin:true},
  {pattern:'prefect',replacement:'Prefect',enabled:true,builtin:true},
  {pattern:'dagster',replacement:'Dagster',enabled:true,builtin:true},
  {pattern:'luigi',replacement:'Luigi',enabled:true,builtin:true},
  {pattern:'argo',replacement:'Argo',enabled:true,builtin:true},
  {pattern:'tekton',replacement:'Tekton',enabled:true,builtin:true},
  {pattern:'jenkins',replacement:'Jenkins',enabled:true,builtin:true},
  {pattern:'gitlab ci',replacement:'GitLab CI',enabled:true,builtin:true},
  {pattern:'github actions',replacement:'GitHub Actions',enabled:true,builtin:true},
  {pattern:'circleci',replacement:'CircleCI',enabled:true,builtin:true},
  {pattern:'travis ci',replacement:'Travis CI',enabled:true,builtin:true},
  {pattern:'drone',replacement:'Drone',enabled:true,builtin:true},
  {pattern:'teamcity',replacement:'TeamCity',enabled:true,builtin:true},
  {pattern:'bamboo',replacement:'Bamboo',enabled:true,builtin:true},
  {pattern:'azure devops',replacement:'Azure DevOps',enabled:true,builtin:true},
  {pattern:'azure pipelines',replacement:'Azure Pipelines',enabled:true,builtin:true},
  {pattern:'gcp cloud build',replacement:'GCP Cloud Build',enabled:true,builtin:true},
  {pattern:'bitbucket pipelines',replacement:'Bitbucket Pipelines',enabled:true,builtin:true},
  {pattern:'semaphore',replacement:'Semaphore',enabled:true,builtin:true},
  {pattern:'buddy',replacement:'Buddy',enabled:true,builtin:true},
  {pattern:'codeship',replacement:'Codeship',enabled:true,builtin:true},
  {pattern:'wercker',replacement:'Wercker',enabled:true,builtin:true},
  {pattern:'shippable',replacement:'Shippable',enabled:true,builtin:true},
  {pattern:'solano',replacement:'Solano',enabled:true,builtin:true},
  {pattern:'appveyor',replacement:'AppVeyor',enabled:true,builtin:true},
  {pattern:'buildkite',replacement:'Buildkite',enabled:true,builtin:true},
  {pattern:'concourse',replacement:'Concourse',enabled:true,builtin:true},
  {pattern:'spinnaker',replacement:'Spinnaker',enabled:true,builtin:true},
  {pattern:'flux',replacement:'Flux',enabled:true,builtin:true},
  {pattern:'flagger',replacement:'Flagger',enabled:true,builtin:true},
  {pattern:'keptn',replacement:'Keptn',enabled:true,builtin:true},
  {pattern:'litmus',replacement:'Litmus',enabled:true,builtin:true},
  {pattern:'chaos mesh',replacement:'Chaos Mesh',enabled:true,builtin:true},
  {pattern:'chaos monkey',replacement:'Chaos Monkey',enabled:true,builtin:true},
  {pattern:'gremlin',replacement:'Gremlin',enabled:true,builtin:true},
  {pattern:'steadybit',replacement:'Steadybit',enabled:true,builtin:true},
  {pattern:'chaosblade',replacement:'ChaosBlade',enabled:true,builtin:true},
  {pattern:'toxiproxy',replacement:'Toxiproxy',enabled:true,builtin:true},
  {pattern:'pumba',replacement:'Pumba',enabled:true,builtin:true},
  {pattern:'powerfulseal',replacement:'PowerfulSeal',enabled:true,builtin:true},
  {pattern:'chaoskube',replacement:'ChaosKube',enabled:true,builtin:true},
  {pattern:'monkey-ops',replacement:'Monkey-Ops',enabled:true,builtin:true},
  {pattern:'awssmm',replacement:'AWS SSM',enabled:true,builtin:true},
  {pattern:'parameter store',replacement:'Parameter Store',enabled:true,builtin:true},
  {pattern:'secrets manager',replacement:'Secrets Manager',enabled:true,builtin:true},
  {pattern:'key management',replacement:'Key Management',enabled:true,builtin:true},
  {pattern:'hsm',replacement:'HSM',enabled:true,builtin:true},
  {pattern:'cloudhsm',replacement:'CloudHSM',enabled:true,builtin:true},
  {pattern:'dedicated hsm',replacement:'Dedicated HSM',enabled:true,builtin:true},
  {pattern:'thales',replacement:'Thales',enabled:true,builtin:true},
  {pattern:'utimaco',replacement:'Utimaco',enabled:true,builtin:true},
  {pattern:'futurex',replacement:'Futurex',enabled:true,builtin:true},
  {pattern:'entrust',replacement:'Entrust',enabled:true,builtin:true},
  {pattern:'nshield',replacement:'nShield',enabled:true,builtin:true},
  {pattern:'luna',replacement:'Luna',enabled:true,builtin:true},
  {pattern:'payshield',replacement:'PayShield',enabled:true,builtin:true},
  {pattern:'identity manager',replacement:'Identity Manager',enabled:true,builtin:true},
  {pattern:'access manager',replacement:'Access Manager',enabled:true,builtin:true},
  {pattern:' privileged access',replacement:'Privileged Access',enabled:true,builtin:true},
  {pattern:'cyberark',replacement:'CyberArk',enabled:true,builtin:true},
  {pattern:'beyondtrust',replacement:'BeyondTrust',enabled:true,builtin:true},
  {pattern:'centrify',replacement:'Centrify',enabled:true,builtin:true},
  {pattern:'thycotic',replacement:'Thycotic',enabled:true,builtin:true},
  {pattern:'delinea',replacement:'Delinea',enabled:true,builtin:true},
  {pattern:'hashicorp',replacement:'HashiCorp',enabled:true,builtin:true},
  {pattern:'terraform cloud',replacement:'Terraform Cloud',enabled:true,builtin:true},
  {pattern:'terraform enterprise',replacement:'Terraform Enterprise',enabled:true,builtin:true},
  {pattern:'consul enterprise',replacement:'Consul Enterprise',enabled:true,builtin:true},
  {pattern:'vault enterprise',replacement:'Vault Enterprise',enabled:true,builtin:true},
  {pattern:'nomad enterprise',replacement:'Nomad Enterprise',enabled:true,builtin:true},
  {pattern:'sentinel',replacement:'Sentinel',enabled:true,builtin:true},
  {pattern:'hcl',replacement:'HCL',enabled:true,builtin:true},
  {pattern:'cdktf',replacement:'CDKTF',enabled:true,builtin:true},
  {pattern:'tfe',replacement:'TFE',enabled:true,builtin:true},
  {pattern:'tfc',replacement:'TFC',enabled:true,builtin:true},
  {pattern:'module registry',replacement:'Module Registry',enabled:true,builtin:true},
  {pattern:'private registry',replacement:'Private Registry',enabled:true,builtin:true},
  {pattern:'run tasks',replacement:'Run Tasks',enabled:true,builtin:true},
  {pattern:'cost estimation',replacement:'Cost Estimation',enabled:true,builtin:true},
  {pattern:'policy check',replacement:'Policy Check',enabled:true,builtin:true},
  {pattern:'speculative plan',replacement:'Speculative Plan',enabled:true,builtin:true},
  {pattern:'remote operations',replacement:'Remote Operations',enabled:true,builtin:true},
  {pattern:'local operations',replacement:'Local Operations',enabled:true,builtin:true},
  {pattern:'agent pool',replacement:'Agent Pool',enabled:true,builtin:true},
  {pattern:'agent token',replacement:'Agent Token',enabled:true,builtin:true},
  {pattern:'workload identity',replacement:'Workload Identity',enabled:true,builtin:true},
  {pattern:'federated identity',replacement:'Federated Identity',enabled:true,builtin:true},
  {pattern:'managed identity',replacement:'Managed Identity',enabled:true,builtin:true},
  {pattern:'service principal',replacement:'Service Principal',enabled:true,builtin:true},
  {pattern:'service account',replacement:'Service Account',enabled:true,builtin:true},
  {pattern:'impersonation',replacement:'Impersonation',enabled:true,builtin:true},
  {pattern:'delegation',replacement:'Delegation',enabled:true,builtin:true},
  {pattern:'on-behalf-of',replacement:'On-Behalf-Of',enabled:true,builtin:true},
  {pattern:'s4u2self',replacement:'S4U2self',enabled:true,builtin:true},
  {pattern:'s4u2proxy',replacement:'S4U2proxy',enabled:true,builtin:true},
  {pattern:'constrained delegation',replacement:'Constrained Delegation',enabled:true,builtin:true},
  {pattern:'resource-based',replacement:'Resource-Based',enabled:true,builtin:true},
  {pattern:'claim-based',replacement:'Claim-Based',enabled:true,builtin:true},
  {pattern:'token-based',replacement:'Token-Based',enabled:true,builtin:true},
  {pattern:'certificate-based',replacement:'Certificate-Based',enabled:true,builtin:true},
  {pattern:'biometric',replacement:'Biometric',enabled:true,builtin:true},
  {pattern:'fido',replacement:'FIDO',enabled:true,builtin:true},
  {pattern:'u2f',replacement:'U2F',enabled:true,builtin:true},
  {pattern:'webauthn',replacement:'WebAuthn',enabled:true,builtin:true},
  {pattern:'passkey',replacement:'Passkey',enabled:true,builtin:true},
  {pattern:'passwordless',replacement:'Passwordless',enabled:true,builtin:true},
  {pattern:'magic link',replacement:'Magic Link',enabled:true,builtin:true},
  {pattern:'social login',replacement:'Social Login',enabled:true,builtin:true},
  {pattern:'enterprise sso',replacement:'Enterprise SSO',enabled:true,builtin:true},
  {pattern:'identity provider',replacement:'Identity Provider',enabled:true,builtin:true},
  {pattern:'service provider',replacement:'Service Provider',enabled:true,builtin:true},
  {pattern:'relying party',replacement:'Relying Party',enabled:true,builtin:true},
  {pattern:'authenticator',replacement:'Authenticator',enabled:true,builtin:true},
  {pattern:'attestation',replacement:'Attestation',enabled:true,builtin:true},
  {pattern:'assertion',replacement:'Assertion',enabled:true,builtin:true},
  {pattern:'credential',replacement:'Credential',enabled:true,builtin:true},
  {pattern:'public key',replacement:'Public Key',enabled:true,builtin:true},
  {pattern:'private key',replacement:'Private Key',enabled:true,builtin:true},
  {pattern:'key pair',replacement:'Key Pair',enabled:true,builtin:true},
  {pattern:'certificate chain',replacement:'Certificate Chain',enabled:true,builtin:true},
  {pattern:'root ca',replacement:'Root CA',enabled:true,builtin:true},
  {pattern:'intermediate ca',replacement:'Intermediate CA',enabled:true,builtin:true},
  {pattern:'issuing ca',replacement:'Issuing CA',enabled:true,builtin:true},
  {pattern:'subordinate ca',replacement:'Subordinate CA',enabled:true,builtin:true},
  {pattern:'cross-signing',replacement:'Cross-Signing',enabled:true,builtin:true},
  {pattern:'certificate pinning',replacement:'Certificate Pinning',enabled:true,builtin:true},
  {pattern:'key pinning',replacement:'Key Pinning',enabled:true,builtin:true},
  {pattern:'hpkp',replacement:'HPKP',enabled:true,builtin:true},
  {pattern:'crl',replacement:'CRL',enabled:true,builtin:true},
  {pattern:'ocsp',replacement:'OCSP',enabled:true,builtin:true},
  {pattern:'ocsp stapling',replacement:'OCSP Stapling',enabled:true,builtin:true},
  {pattern:'must-staple',replacement:'Must-Staple',enabled:true,builtin:true},
  {pattern:'ct log',replacement:'CT Log',enabled:true,builtin:true},
  {pattern:'certificate transparency',replacement:'Certificate Transparency',enabled:true,builtin:true},
  {pattern:'sct',replacement:'SCT',enabled:true,builtin:true},
  {pattern:'dnssec',replacement:'DNSSEC',enabled:true,builtin:true},
  {pattern:'ds record',replacement:'DS Record',enabled:true,builtin:true},
  {pattern:'rrsig',replacement:'RRSIG',enabled:true,builtin:true},
  {pattern:'nsec',replacement:'NSEC',enabled:true,builtin:true},
  {pattern:'nsec3',replacement:'NSEC3',enabled:true,builtin:true},
  {pattern:'dlv',replacement:'DLV',enabled:true,builtin:true},
  {pattern:'tlsa',replacement:'TLSA',enabled:true,builtin:true},
  {pattern:'smimea',replacement:'SMIMEA',enabled:true,builtin:true},
  {pattern:'openpgpkey',replacement:'OPENPGPKEY',enabled:true,builtin:true},
  {pattern:'ipseckey',replacement:'IPSECKEY',enabled:true,builtin:true},
  {pattern:'sshfp',replacement:'SSHFP',enabled:true,builtin:true},
  {pattern:'cds',replacement:'CDS',enabled:true,builtin:true},
  {pattern:'cdnskey',replacement:'CDNSKEY',enabled:true,builtin:true},
  {pattern:'csync',replacement:'CSYNC',enabled:true,builtin:true},
  {pattern:'zsk',replacement:'ZSK',enabled:true,builtin:true},
  {pattern:'ksk',replacement:'KSK',enabled:true,builtin:true},
  {pattern:'key signing',replacement:'Key Signing',enabled:true,builtin:true},
  {pattern:'zone signing',replacement:'Zone Signing',enabled:true,builtin:true},
  {pattern:'trust anchor',replacement:'Trust Anchor',enabled:true,builtin:true},
  {pattern:'icann',replacement:'ICANN',enabled:true,builtin:true},
  {pattern:'iana',replacement:'IANA',enabled:true,builtin:true},
  {pattern:'ripe',replacement:'RIPE',enabled:true,builtin:true},
  {pattern:'arin',replacement:'ARIN',enabled:true,builtin:true},
  {pattern:'apnic',replacement:'APNIC',enabled:true,builtin:true},
  {pattern:'lacnic',replacement:'LACNIC',enabled:true,builtin:true},
  {pattern:'afrinic',replacement:'AFRINIC',enabled:true,builtin:true},
  {pattern:'rfc',replacement:'RFC',enabled:true,builtin:true},
  {pattern:'bcp',replacement:'BCP',enabled:true,builtin:true},
  {pattern:'std',replacement:'STD',enabled:true,builtin:true},
  {pattern:'fyi',replacement:'FYI',enabled:true,builtin:true},
  {pattern:'draft',replacement:'Draft',enabled:true,builtin:true},
  {pattern:'proposed standard',replacement:'Proposed Standard',enabled:true,builtin:true},
  {pattern:'draft standard',replacement:'Draft Standard',enabled:true,builtin:true},
  {pattern:'internet standard',replacement:'Internet Standard',enabled:true,builtin:true},
  {pattern:'informational',replacement:'Informational',enabled:true,builtin:true},
  {pattern:'experimental',replacement:'Experimental',enabled:true,builtin:true},
  {pattern:'historical',replacement:'Historical',enabled:true,builtin:true},
  {pattern:'best current practice',replacement:'Best Current Practice',enabled:true,builtin:true},
  {pattern:'request for comments',replacement:'Request for Comments',enabled:true,builtin:true}
];

// ========== 工具函数 ==========
function msToSRTTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const msPart = Math.floor(ms % 1000);
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ',' + String(msPart).padStart(3, '0');
}

function srtTimeToMs(timeStr) {
  const match = timeStr.match(/(\d+):(\d+):(\d+),(\d+)/);
  if (!match) return 0;
  return parseInt(match[1]) * 3600000 + parseInt(match[2]) * 60000 + parseInt(match[3]) * 1000 + parseInt(match[4]);
}

function formatTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const msPart = Math.floor(ms % 1000);
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ',' + String(msPart).padStart(3, '0');
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========== SRT 解析/序列化 ==========
function parseSRT(content) {
  const subtitles = [];
  const blocks = content.trim().split(/\n\s*\n/);
  let id = 1;
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 2) continue;
    const timeLine = lines.find(l => l.includes('-->'));
    if (!timeLine) continue;
    const times = timeLine.split('-->');
    if (times.length !== 2) continue;
    const start = srtTimeToMs(times[0].trim());
    const end = srtTimeToMs(times[1].trim());
    const textLines = lines.slice(lines.indexOf(timeLine) + 1);
    const text = textLines.join('\n').trim();
    if (!text) continue;
    subtitles.push({ id: id++, start, end, text, lines: textLines });
  }
  return subtitles;
}

function stringifySRT(subtitles) {
  return subtitles.map((sub, i) => {
    return (i + 1) + '\n' + msToSRTTime(sub.start) + ' --> ' + msToSRTTime(sub.end) + '\n' + sub.text + '\n';
  }).join('\n');
}

// ========== 文本预处理 ==========
function addCJKSpaces(text) {
  // 在CJK字符和ASCII字符之间加空格
  return text
    .replace(/([\u4e00-\u9fff\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([a-zA-Z0-9])/g, '$1 $2')
    .replace(/([a-zA-Z0-9])([\u4e00-\u9fff\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g, '$1 $2');
}

function applyTermRules(text, rules) {
  let result = text;
  for (const rule of rules) {
    if (!rule.enabled) continue;
    const pattern = rule.pattern;
    const replacement = rule.replacement;
    // 使用正则表达式，确保是单词边界匹配
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
    result = result.replace(regex, replacement);
  }
  return result;
}

function preprocessText(text, settings) {
  let result = text;
  if (settings.autoSpace) {
    result = addCJKSpaces(result);
  }
  if (settings.termCorrection) {
    const allRules = [...getBuiltinRules(), ...settings.customRules];
    result = applyTermRules(result, allRules);
  }
  return result;
}

function getBuiltinRules() {
  return DEFAULT_TERM_RULES;
}

// ========== 智能断句 ==========
function findBreakPoints(text, maxChars) {
  const breakpoints = [];
  const breakChars = ['。', '？', '！', '；', '，', '、', '：', '…'];
  const conjunctions = ['和', '或', '以及', '但是', '然而', '不过', '只是', '因为', '所以', '因此', '如果', '即使', '虽然', '尽管', '而且', '并且', '同时', '另外', '此外', '其次', '首先', '然后', '接着', '最后', '总之', '例如', '比如', '像是', '就像', '正如', '好比', '以及', '还有', '另外', '此外', '加之', '况且', '何况', '再说', '再者', '否则', '不然', '要不', '要么', '与其', '不如', '宁可', '宁愿', '除了', '除非', '不论', '不管', '无论', '尽管', '即使', '即便', '哪怕', '尽管', '虽然', '虽说', '固然', '尽管', '不过', '只是', '但是', '可是', '然而', '不过', '却', '只是', '偏偏', '反而', '反倒', '竟然', '居然', '果然', '自然', '当然', '其实', '实际上', '事实上', '本来', '原来', '原来', '压根', '根本', '简直', '几乎', '差不多', '大概', '也许', '或许', '可能', '应该', '想必', '一定', '必须', '必然', '未必', '不一定', '不见得', '难免', '未免', '未必', '何尝', '何必', '何妨', '何不', '何必', '难道', '莫非', '别是', '怕是', '恐怕是', '大概是', '也许是', '或许是', '可能是', '应该是', '想必是', '一定是', '必须是', '必然是', '未必是', '不一定是', '不见得是', '难免是', '未免是', '何曾是', '何尝是', '何必是', '何妨是', '何不是', '何必是', '难道是', '莫非是', '别是', '怕是', '恐怕是', '大概是', '也许是', '或许是', '可能是', '应该是', '想必是', '定是', '须是', '必然是', '未必是', '不一定是', '不见得是', '难免是', '未免是', '何曾是', '何尝是', '何必是', '何妨是', '何不是', '何必是', '难道是', '莫非是'];
  
  // 优先在标点处断句
  for (let i = 0; i < text.length; i++) {
    if (breakChars.includes(text[i])) {
      breakpoints.push({ pos: i + 1, priority: breakChars.indexOf(text[i]) });
    }
  }
  
  // 在连词处断句
  for (const conj of conjunctions) {
    let idx = text.indexOf(conj);
    while (idx !== -1) {
      breakpoints.push({ pos: idx, priority: 10 });
      idx = text.indexOf(conj, idx + 1);
    }
  }
  
  breakpoints.sort((a, b) => a.pos - b.pos);
  return breakpoints;
}

function splitSubtitleSmart(subtitle, maxChars) {
  const text = subtitle.text;
  if (text.length <= maxChars) {
    return [subtitle];
  }
  
  const breakpoints = findBreakPoints(text, maxChars);
  const parts = [];
  let start = 0;
  let currentPos = 0;
  
  while (currentPos < text.length) {
    let endPos = Math.min(currentPos + maxChars, text.length);
    
    // 找最佳断点
    let bestBreak = endPos;
    for (const bp of breakpoints) {
      if (bp.pos > currentPos && bp.pos <= endPos) {
        if (bp.priority < 5) { // 标点优先
          bestBreak = bp.pos;
        } else if (bestBreak === endPos) {
          bestBreak = bp.pos;
        }
      }
    }
    
    // 避免在英文单词或数字中间截断
    if (bestBreak < text.length) {
      // 检查断点前后是否是英文/数字
      const before = text[bestBreak - 1];
      const after = text[bestBreak];
      if (/[a-zA-Z0-9]/.test(before) && /[a-zA-Z0-9]/.test(after)) {
        // 向后找空格或标点
        let adjust = bestBreak;
        while (adjust > currentPos && /[a-zA-Z0-9]/.test(text[adjust - 1])) {
          adjust--;
        }
        if (adjust > currentPos) {
          bestBreak = adjust;
        } else {
          // 向前找
          adjust = bestBreak;
          while (adjust < text.length && /[a-zA-Z0-9]/.test(text[adjust])) {
            adjust++;
          }
          bestBreak = adjust;
        }
      }
    }
    
    parts.push(text.substring(currentPos, bestBreak));
    currentPos = bestBreak;
  }
  
  // 均分时间
  const totalDuration = subtitle.end - subtitle.start;
  const durationPerPart = totalDuration / parts.length;
  
  return parts.map((part, i) => ({
    id: subtitle.id + (i > 0 ? '_split_' + i : ''),
    start: subtitle.start + Math.round(i * durationPerPart),
    end: subtitle.start + Math.round((i + 1) * durationPerPart),
    text: part,
    lines: part.split('\n')
  }));
}

function splitAllSubtitles(subtitles, maxChars) {
  const result = [];
  for (const sub of subtitles) {
    const parts = splitSubtitleSmart(sub, maxChars);
    result.push(...parts);
  }
  // 重新分配id
  return result.map((sub, i) => ({ ...sub, id: i + 1 }));
}

// ========== 状态管理 ==========
let state = {
  subtitles: [],
  audioBuffer: null,
  audioFileName: '',
  audioContext: null,
  audioSource: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  selectedId: null,
  settings: {
    autoSpace: true,
    termCorrection: true,
    customRules: [],
    maxLineChars: 12,
    defaultModel: 'tiny'
  },
  // 时间轴
  zoom: 1, // 像素/秒
  scrollOffset: 0, // 像素
  // 波形
  waveformData: null,
  // 历史
  history: [],
  historyIndex: -1
};

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      state.settings = { ...state.settings, ...parsed.settings };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      settings: state.settings
    }));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

function pushHistory() {
  // 移除当前指针之后的历史
  state.history = state.history.slice(0, state.historyIndex + 1);
  // 添加新状态
  state.history.push({
    subtitles: JSON.parse(JSON.stringify(state.subtitles)),
    timestamp: Date.now()
  });
  // 限制历史长度
  if (state.history.length > 50) {
    state.history.shift();
  } else {
    state.historyIndex++;
  }
}

function undo() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    state.subtitles = JSON.parse(JSON.stringify(state.history[state.historyIndex].subtitles));
    renderSubtitleList();
    renderTimeline();
  }
}

function redo() {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++;
    state.subtitles = JSON.parse(JSON.stringify(state.history[state.historyIndex].subtitles));
    renderSubtitleList();
    renderTimeline();
  }
}

function setSubtitles(subs) {
  state.subtitles = subs;
  pushHistory();
  renderSubtitleList();
  renderTimeline();
  updateSubtitleCount();
}

function updateSubtitle(id, updates) {
  const idx = state.subtitles.findIndex(s => s.id === id);
  if (idx >= 0) {
    state.subtitles[idx] = { ...state.subtitles[idx], ...updates };
    pushHistory();
    renderSubtitleList();
    renderTimeline();
  }
}

function deleteSubtitle(id) {
  state.subtitles = state.subtitles.filter(s => s.id !== id);
  if (state.selectedId === id) state.selectedId = null;
  pushHistory();
  renderSubtitleList();
  renderTimeline();
  updateSubtitleCount();
}

function addSubtitle(newSub) {
  state.subtitles.push(newSub);
  state.subtitles.sort((a, b) => a.start - b.start);
  // 重新编号
  state.subtitles = state.subtitles.map((s, i) => ({ ...s, id: i + 1 }));
  pushHistory();
  renderSubtitleList();
  renderTimeline();
  updateSubtitleCount();
}

function preprocessAllSubtitles() {
  for (const sub of state.subtitles) {
    sub.text = preprocessText(sub.text, state.settings);
  }
  pushHistory();
  renderSubtitleList();
  renderTimeline();
}

// ========== UI渲染 ==========
function updateSubtitleCount() {
  document.getElementById('subtitleCount').textContent = state.subtitles.length + ' 条';
}

function renderSubtitleList() {
  const container = document.getElementById('subtitleList');
  if (state.subtitles.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">📝</div><p>导入SRT文件开始编辑</p></div>';
    return;
  }
  
  let html = '';
  for (const sub of state.subtitles) {
    const isSelected = sub.id === state.selectedId;
    const isActive = sub.start <= state.currentTime && sub.end >= state.currentTime;
    const classes = ['subtitle-item'];
    if (isSelected) classes.push('selected');
    if (isActive) classes.push('active');
    
    html += '<div class="' + classes.join(' ') + '" data-id="' + sub.id + '">' +
      '<div class="num">' + sub.id + '</div>' +
      '<div class="time">' + msToSRTTime(sub.start) + '</div>' +
      '<div class="text">' + escapeHtml(sub.text) + '</div>' +
      '</div>';
  }
  container.innerHTML = html;
  
  // 绑定事件
  for (const el of container.querySelectorAll('.subtitle-item')) {
    el.addEventListener('click', () => {
      state.selectedId = parseInt(el.dataset.id);
      const sub = state.subtitles.find(s => s.id === state.selectedId);
      if (sub) {
        state.currentTime = sub.start;
        updateTimeDisplay();
        renderSubtitleList();
        renderTimeline();
      }
    });
    el.addEventListener('dblclick', () => {
      state.selectedId = parseInt(el.dataset.id);
      openEditModal();
    });
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      state.selectedId = parseInt(el.dataset.id);
      showContextMenu(e.clientX, e.clientY);
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== 时间轴渲染 ==========
let rulerCanvas, waveformCanvas, subtitleCanvas;
let rulerCtx, waveformCtx, subtitleCtx;

function initCanvases() {
  rulerCanvas = document.getElementById('rulerCanvas');
  waveformCanvas = document.getElementById('waveformCanvas');
  subtitleCanvas = document.getElementById('subtitleCanvas');
  rulerCtx = rulerCanvas.getContext('2d');
  waveformCtx = waveformCanvas.getContext('2d');
  subtitleCtx = subtitleCanvas.getContext('2d');
  
  resizeCanvases();
  window.addEventListener('resize', debounce(resizeCanvases, 100));
}

function resizeCanvases() {
  const rulerRect = document.getElementById('timelineRuler').getBoundingClientRect();
  const waveformRect = document.getElementById('timelineWaveform').getBoundingClientRect();
  const subtitleRect = document.getElementById('timelineSubtitles').getBoundingClientRect();
  
  rulerCanvas.width = rulerRect.width * window.devicePixelRatio;
  rulerCanvas.height = rulerRect.height * window.devicePixelRatio;
  rulerCanvas.style.width = rulerRect.width + 'px';
  rulerCanvas.style.height = rulerRect.height + 'px';
  rulerCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  waveformCanvas.width = waveformRect.width * window.devicePixelRatio;
  waveformCanvas.height = waveformRect.height * window.devicePixelRatio;
  waveformCanvas.style.width = waveformRect.width + 'px';
  waveformCanvas.style.height = waveformRect.height + 'px';
  waveformCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  subtitleCanvas.width = subtitleRect.width * window.devicePixelRatio;
  subtitleCanvas.height = subtitleRect.height * window.devicePixelRatio;
  subtitleCanvas.style.width = subtitleRect.width + 'px';
  subtitleCanvas.style.height = subtitleRect.height + 'px';
  subtitleCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  renderTimeline();
}

function renderTimeline() {
  if (!rulerCanvas) return;
  renderRuler();
  renderWaveform();
  renderSubtitleBlocks();
  updatePlayhead();
}

function renderRuler() {
  const width = rulerCanvas.width / window.devicePixelRatio;
  const height = rulerCanvas.height / window.devicePixelRatio;
  const ctx = rulerCtx;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0f3460';
  ctx.fillRect(0, 0, width, height);
  
  const zoom = state.zoom || 1;
  const offset = state.scrollOffset || 0;
  const pxPerSecond = 50 * zoom;
  
  // 主刻度（秒）
  const startTime = offset / pxPerSecond;
  const endTime = (offset + width) / pxPerSecond;
  
  ctx.strokeStyle = '#3d3d5c';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#a0a0a0';
  ctx.font = '10px Consolas, monospace';
  ctx.textAlign = 'center';
  
  for (let t = Math.floor(startTime); t <= Math.ceil(endTime); t++) {
    const x = (t * pxPerSecond) - offset;
    if (x < 0 || x > width) continue;
    
    ctx.beginPath();
    ctx.moveTo(x, height - 10);
    ctx.lineTo(x, height);
    ctx.stroke();
    
    const timeStr = String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
    ctx.fillText(timeStr, x, height - 14);
    
    // 半秒刻度
    if (zoom > 1.5) {
      const halfX = x + pxPerSecond / 2;
      if (halfX >= 0 && halfX <= width) {
        ctx.beginPath();
        ctx.moveTo(halfX, height - 5);
        ctx.lineTo(halfX, height);
        ctx.stroke();
      }
    }
  }
  
  // 边框
  ctx.strokeStyle = '#3d3d5c';
  ctx.beginPath();
  ctx.moveTo(0, height - 0.5);
  ctx.lineTo(width, height - 0.5);
  ctx.stroke();
}

function renderWaveform() {
  const width = waveformCanvas.width / window.devicePixelRatio;
  const height = waveformCanvas.height / window.devicePixelRatio;
  const ctx = waveformCtx;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);
  
  if (!state.waveformData) {
    // 没有波形数据，显示提示
    ctx.fillStyle = '#a0a0a0';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('导入音频文件显示波形', width / 2, height / 2);
    return;
  }
  
  const zoom = state.zoom || 1;
  const offset = state.scrollOffset || 0;
  const pxPerSecond = 50 * zoom;
  const samplesPerPx = state.waveformData.length / (state.duration * pxPerSecond);
  const startSample = Math.floor(offset / pxPerSecond * (state.waveformData.length / state.duration));
  
  ctx.fillStyle = '#00d4ff';
  ctx.globalAlpha = 0.6;
  
  const barWidth = Math.max(1, zoom * 0.5);
  
  for (let x = 0; x < width; x += barWidth) {
    const sampleIdx = startSample + Math.floor(x * samplesPerPx);
    if (sampleIdx >= 0 && sampleIdx < state.waveformData.length) {
      const amplitude = state.waveformData[sampleIdx];
      const barHeight = amplitude * height * 0.9;
      const y = (height - barHeight) / 2;
      ctx.fillRect(x, y, barWidth - 0.5, barHeight);
    }
  }
  
  ctx.globalAlpha = 1;
  
  // 中心线
  ctx.strokeStyle = '#3d3d5c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
}

function renderSubtitleBlocks() {
  const width = subtitleCanvas.width / window.devicePixelRatio;
  const height = subtitleCanvas.height / window.devicePixelRatio;
  const ctx = subtitleCtx;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#2d2d44';
  ctx.fillRect(0, 0, width, height);
  
  const zoom = state.zoom || 1;
  const offset = state.scrollOffset || 0;
  const pxPerSecond = 50 * zoom;
  const blockHeight = Math.min(40, height - 16);
  const y = (height - blockHeight) / 2;
  
  for (let i = 0; i < state.subtitles.length; i++) {
    const sub = state.subtitles[i];
    const x1 = (sub.start / 1000 * pxPerSecond) - offset;
    const x2 = (sub.end / 1000 * pxPerSecond) - offset;
    const blockWidth = x2 - x1;
    
    if (x2 < 0 || x1 > width) continue;
    
    const color = COLORS[i % COLORS.length];
    const isSelected = sub.id === state.selectedId;
    const isActive = sub.start <= state.currentTime && sub.end >= state.currentTime;
    
    // 背景
    ctx.fillStyle = color;
    ctx.globalAlpha = isActive ? 0.8 : (isSelected ? 0.6 : 0.35);
    
    const rx = 4;
    ctx.beginPath();
    ctx.roundRect(Math.max(0, x1), y, Math.max(0, blockWidth), blockHeight, rx);
    ctx.fill();
    
    // 边框
    ctx.globalAlpha = isSelected ? 1 : 0.5;
    ctx.strokeStyle = color;
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(Math.max(0, x1), y, Math.max(0, blockWidth), blockHeight, rx);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    
    // 文字
    if (blockWidth > 30) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const text = sub.text.length > 20 ? sub.text.substring(0, 20) + '...' : sub.text;
      ctx.fillText(text, Math.max(2, x1 + 4), y + blockHeight / 2);
    }
    
    // 调整手柄
    if (isSelected) {
      ctx.fillStyle = '#ffffff';
      const handleWidth = 4;
      const handleHeight = blockHeight;
      // 左手柄
      ctx.fillRect(Math.max(0, x1 - handleWidth/2), y, handleWidth, handleHeight);
      // 右手柄
      ctx.fillRect(Math.max(0, x2 - handleWidth/2), y, handleWidth, handleHeight);
    }
  }
  
  // 网格线
  ctx.strokeStyle = 'rgba(61, 61, 92, 0.3)';
  ctx.lineWidth = 1;
  const startTime = offset / pxPerSecond;
  const endTime = (offset + width) / pxPerSecond;
  for (let t = Math.floor(startTime); t <= Math.ceil(endTime); t += 1) {
    const x = (t * pxPerSecond) - offset;
    if (x < 0 || x > width) continue;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function updatePlayhead() {
  const playhead = document.getElementById('playhead');
  const zoom = state.zoom || 1;
  const offset = state.scrollOffset || 0;
  const pxPerSecond = 50 * zoom;
  const x = (state.currentTime / 1000 * pxPerSecond) - offset;
  playhead.style.left = x + 'px';
  playhead.style.display = x >= 0 ? 'block' : 'none';
}

function updateTimeDisplay() {
  document.getElementById('timeDisplay').textContent = formatTime(state.currentTime);
}

// ========== 音频处理 ==========
async function loadAudioFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  state.audioFileName = file.name;
  
  if (!state.audioContext) {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  state.audioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
  state.duration = state.audioBuffer.duration * 1000;
  
  // 提取波形数据
  extractWaveformData();
  
  // 更新UI
  renderTimeline();
  
  // 调整zoom以适应整个音频
  const panelWidth = document.getElementById('rightPanel').getBoundingClientRect().width;
  state.zoom = panelWidth / (state.duration / 1000) / 50;
  state.scrollOffset = 0;
  renderTimeline();
}

function extractWaveformData() {
  if (!state.audioBuffer) return;
  
  const channelData = state.audioBuffer.getChannelData(0);
  const targetSamples = 2000; // 目标采样数
  const samplesPerBin = Math.max(1, Math.floor(channelData.length / targetSamples));
  const data = [];
  
  for (let i = 0; i < targetSamples; i++) {
    let max = 0;
    const start = i * samplesPerBin;
    const end = Math.min(start + samplesPerBin, channelData.length);
    for (let j = start; j < end; j++) {
      const abs = Math.abs(channelData[j]);
      if (abs > max) max = abs;
    }
    data.push(max);
  }
  
  state.waveformData = data;
}

function playAudio() {
  if (!state.audioBuffer || !state.audioContext) return;
  
  stopAudio();
  
  const source = state.audioContext.createBufferSource();
  source.buffer = state.audioBuffer;
  source.connect(state.audioContext.destination);
  source.start(0, state.currentTime / 1000);
  state.audioSource = source;
  state.isPlaying = true;
  state.playStartTime = state.audioContext.currentTime;
  state.playStartOffset = state.currentTime / 1000;
  
  document.getElementById('playBtn').innerHTML = '⏸️ 暂停';
  
  // 动画循环
  function update() {
    if (!state.isPlaying) return;
    const elapsed = (state.audioContext.currentTime - state.playStartTime) * 1000;
    state.currentTime = Math.min(state.playStartOffset * 1000 + elapsed, state.duration);
    updateTimeDisplay();
    renderTimeline();
    
    // 更新活跃字幕
    const activeSub = state.subtitles.find(s => s.start <= state.currentTime && s.end >= state.currentTime);
    if (activeSub) {
      const listItems = document.querySelectorAll('.subtitle-item');
      for (const item of listItems) {
        const id = parseInt(item.dataset.id);
        if (id === activeSub.id) {
          item.classList.add('active');
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          item.classList.remove('active');
        }
      }
    }
    
    if (state.currentTime >= state.duration) {
      stopAudio();
      return;
    }
    
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
  
  source.onended = () => {
    state.isPlaying = false;
    document.getElementById('playBtn').innerHTML = '▶️ 播放';
  };
}

function stopAudio() {
  if (state.audioSource) {
    try { state.audioSource.stop(); } catch (e) {}
    state.audioSource = null;
  }
  state.isPlaying = false;
  document.getElementById('playBtn').innerHTML = '▶️ 播放';
}

function togglePlay() {
  if (state.isPlaying) {
    stopAudio();
  } else {
    playAudio();
  }
}

// ========== 文件操作 ==========
function downloadSRT() {
  if (state.subtitles.length === 0) {
    alert('没有字幕可导出');
    return;
  }
  const content = stringifySRT(state.subtitles);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'subtitles.srt';
  a.click();
  URL.revokeObjectURL(url);
}

// ========== 事件绑定 ==========
function bindEvents() {
  // 导入SRT
  document.getElementById('importSrt').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const subtitles = parseSRT(text);
    if (subtitles.length > 0) {
      setSubtitles(subtitles);
      alert('成功导入 ' + subtitles.length + ' 条字幕');
    } else {
      alert('无法解析SRT文件');
    }
    e.target.value = '';
  });
  
  // 导入音频
  document.getElementById('importAudio').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await loadAudioFile(file);
    e.target.value = '';
  });
  
  // 导出
  document.getElementById('exportSrt').addEventListener('click', downloadSRT);
  
  // 播放控制
  document.getElementById('playBtn').addEventListener('click', togglePlay);
  document.getElementById('stopBtn').addEventListener('click', () => {
    stopAudio();
    state.currentTime = 0;
    updateTimeDisplay();
    renderTimeline();
  });
  
  // 快捷键
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      state.currentTime = Math.max(0, state.currentTime - 100);
      updateTimeDisplay();
      renderTimeline();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      state.currentTime = Math.min(state.duration || Infinity, state.currentTime + 100);
      updateTimeDisplay();
      renderTimeline();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (state.selectedId) {
        deleteSubtitle(state.selectedId);
      }
    } else if (e.key === 'Enter') {
      if (state.selectedId) {
        openEditModal();
      }
    }
  });
  
  // 时间轴交互
  const timelineSubtitles = document.getElementById('timelineSubtitles');
  let isDragging = false;
  let isMovingSubtitle = false;
  let isResizingSubtitle = false;
  let resizeEdge = null; // 'left' or 'right'
  let dragStartX = 0;
  let dragStartOffset = 0;
  let dragSubtitle = null;
  let dragSubtitleOriginalStart = 0;
  let dragSubtitleOriginalEnd = 0;
  let dragSubtitleIdx = -1;
  const HANDLE_WIDTH = 6; // 调整手柄宽度

  function getSubtitleAtPosition(x) {
    const zoom = state.zoom || 1;
    const pxPerSecond = 50 * zoom;
    for (const sub of state.subtitles) {
      const sx1 = (sub.start / 1000 * pxPerSecond) - state.scrollOffset;
      const sx2 = (sub.end / 1000 * pxPerSecond) - state.scrollOffset;
      if (x >= sx1 && x <= sx2) {
        // 检查是否在手柄区域
        const distToLeft = Math.abs(x - sx1);
        const distToRight = Math.abs(x - sx2);
        if (distToLeft <= HANDLE_WIDTH) {
          return { sub, edge: 'left' };
        } else if (distToRight <= HANDLE_WIDTH) {
          return { sub, edge: 'right' };
        }
        return { sub, edge: null };
      }
    }
    return null;
  }

  timelineSubtitles.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    const rect = timelineSubtitles.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zoom = state.zoom || 1;
    const pxPerSecond = 50 * zoom;
    const time = (x + state.scrollOffset) / pxPerSecond * 1000;

    const hit = getSubtitleAtPosition(x);

    if (hit) {
      state.selectedId = hit.sub.id;
      dragSubtitle = hit.sub;
      dragSubtitleIdx = state.subtitles.findIndex(s => s.id === hit.sub.id);
      dragSubtitleOriginalStart = hit.sub.start;
      dragSubtitleOriginalEnd = hit.sub.end;
      isDragging = true;
      dragStartX = e.clientX;

      if (hit.edge === 'left') {
        isResizingSubtitle = true;
        resizeEdge = 'left';
        timelineSubtitles.style.cursor = 'ew-resize';
      } else if (hit.edge === 'right') {
        isResizingSubtitle = true;
        resizeEdge = 'right';
        timelineSubtitles.style.cursor = 'ew-resize';
      } else {
        isMovingSubtitle = true;
        timelineSubtitles.style.cursor = 'move';
      }

      renderSubtitleList();
      renderTimeline();
      e.preventDefault();
    } else {
      // 移动播放头或平移时间轴
      state.currentTime = Math.max(0, Math.min(time, state.duration || Infinity));
      updateTimeDisplay();
      renderTimeline();
      isDragging = true;
      dragStartX = e.clientX;
      dragStartOffset = state.scrollOffset;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) {
      // 仅鼠标移动时更新cursor
      const rect = timelineSubtitles.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const hit = getSubtitleAtPosition(x);
      if (hit) {
        if (hit.edge === 'left' || hit.edge === 'right') {
          timelineSubtitles.style.cursor = 'ew-resize';
        } else {
          timelineSubtitles.style.cursor = 'move';
        }
      } else {
        timelineSubtitles.style.cursor = 'default';
      }
      return;
    }

    const zoom = state.zoom || 1;
    const pxPerSecond = 50 * zoom;

    if (isMovingSubtitle && dragSubtitle) {
      const dx = e.clientX - dragStartX;
      const timeOffset = dx / pxPerSecond * 1000;
      const newStart = Math.max(0, dragSubtitleOriginalStart + timeOffset);
      const duration = dragSubtitleOriginalEnd - dragSubtitleOriginalStart;
      const newEnd = newStart + duration;

      // 检查碰撞
      let collision = false;
      for (let i = 0; i < state.subtitles.length; i++) {
        if (i === dragSubtitleIdx) continue;
        const other = state.subtitles[i];
        if (newStart < other.end && newEnd > other.start) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        dragSubtitle.start = newStart;
        dragSubtitle.end = newEnd;
        renderTimeline();
      }
    } else if (isResizingSubtitle && dragSubtitle) {
      const dx = e.clientX - dragStartX;
      const timeOffset = dx / pxPerSecond * 1000;

      if (resizeEdge === 'left') {
        const newStart = Math.max(0, Math.min(dragSubtitleOriginalEnd - MIN_SUBTITLE_DURATION, dragSubtitleOriginalStart + timeOffset));
        dragSubtitle.start = newStart;
      } else if (resizeEdge === 'right') {
        const newEnd = Math.max(dragSubtitleOriginalStart + MIN_SUBTITLE_DURATION, dragSubtitleOriginalEnd + timeOffset);
        dragSubtitle.end = newEnd;
      }
      renderTimeline();
    } else if (!isMovingSubtitle && !isResizingSubtitle) {
      // 平移时间轴
      const dx = e.clientX - dragStartX;
      state.scrollOffset = Math.max(0, dragStartOffset - dx);
      renderTimeline();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isMovingSubtitle || isResizingSubtitle) {
      // 拖拽结束，保存历史
      if (dragSubtitle) {
        // 排序字幕
        state.subtitles.sort((a, b) => a.start - b.start);
        // 重新分配id
        state.subtitles = state.subtitles.map((s, i) => ({ ...s, id: i + 1 }));
        pushHistory();
        renderSubtitleList();
        renderTimeline();
      }
    }
    isDragging = false;
    isMovingSubtitle = false;
    isResizingSubtitle = false;
    resizeEdge = null;
    dragSubtitle = null;
    dragSubtitleIdx = -1;
    timelineSubtitles.style.cursor = 'default';
  });

  // 滚轮缩放
  timelineSubtitles.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.ctrlKey ? 0.05 : 0.2;
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    const oldZoom = state.zoom || 1;
    state.zoom = Math.max(0.1, Math.min(100, oldZoom + delta));
    renderTimeline();
  }, { passive: false });
  
  // 底部面板按钮
  document.getElementById('autoSpaceToggle').addEventListener('change', (e) => {
    state.settings.autoSpace = e.target.checked;
    saveSettings();
    preprocessAllSubtitles();
  });
  
  document.getElementById('termCorrectionToggle').addEventListener('change', (e) => {
    state.settings.termCorrection = e.target.checked;
    saveSettings();
    preprocessAllSubtitles();
  });
  
  document.getElementById('manageRulesBtn').addEventListener('click', openRulesModal);
  
  document.getElementById('splitBtn').addEventListener('click', () => {
    const maxChars = parseInt(document.getElementById('maxCharsInput').value) || 12;
    state.settings.maxLineChars = maxChars;
    saveSettings();
    if (state.subtitles.length === 0) {
      alert('没有字幕可拆分');
      return;
    }
    const newSubs = splitAllSubtitles(state.subtitles, maxChars);
    setSubtitles(newSubs);
    alert('拆分完成，共 ' + newSubs.length + ' 条字幕');
  });
  
  document.getElementById('undoBtn').addEventListener('click', undo);
  document.getElementById('redoBtn').addEventListener('click', redo);
  
  // Whisper按钮
  document.getElementById('whisperBtn').addEventListener('click', runWhisperAlignment);
  document.getElementById('cancelWhisperBtn').addEventListener('click', () => {
    whisperCancelFlag = true;
    document.getElementById('whisperStatus').textContent = '正在取消...';
  });
  
  // 全局错误处理
  window.onerror = function(msg, url, line, col, err) {
    console.error('Global error:', msg, url, line, col, err);
    return false;
  };
  
  // 关于
  document.getElementById('aboutBtn').addEventListener('click', () => {
    document.getElementById('aboutModal').classList.add('show');
  });
  document.getElementById('closeAboutBtn').addEventListener('click', () => {
    document.getElementById('aboutModal').classList.remove('show');
  });
  
  // Modal关闭
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  });
  
  // 编辑Modal
  document.getElementById('editModalClose').addEventListener('click', () => {
    document.getElementById('editModal').classList.remove('show');
  });
  document.getElementById('saveEditBtn').addEventListener('click', saveEdit);
  document.getElementById('deleteSubtitleBtn').addEventListener('click', () => {
    if (state.selectedId) {
      deleteSubtitle(state.selectedId);
      document.getElementById('editModal').classList.remove('show');
    }
  });
  document.getElementById('splitSubtitleBtn').addEventListener('click', () => {
    if (state.selectedId) {
      const sub = state.subtitles.find(s => s.id === state.selectedId);
      if (sub) {
        const maxChars = parseInt(document.getElementById('maxCharsInput').value) || 12;
        const parts = splitSubtitleSmart(sub, maxChars);
        if (parts.length > 1) {
          const idx = state.subtitles.findIndex(s => s.id === state.selectedId);
          state.subtitles.splice(idx, 1, ...parts);
          state.subtitles = state.subtitles.map((s, i) => ({ ...s, id: i + 1 }));
          pushHistory();
          renderSubtitleList();
          renderTimeline();
          updateSubtitleCount();
          document.getElementById('editModal').classList.remove('show');
        }
      }
    }
  });
  
  // 规则Modal
  document.getElementById('rulesModalClose').addEventListener('click', () => {
    document.getElementById('rulesModal').classList.remove('show');
  });
  document.getElementById('saveRulesBtn').addEventListener('click', () => {
    document.getElementById('rulesModal').classList.remove('show');
  });
  document.getElementById('resetRulesBtn').addEventListener('click', () => {
    if (confirm('确定要重置所有内置规则吗？')) {
      state.settings.customRules = [];
      saveSettings();
      renderRulesTable();
    }
  });
  document.getElementById('addRuleBtn').addEventListener('click', () => {
    const pattern = document.getElementById('newRulePattern').value.trim();
    const replacement = document.getElementById('newRuleReplacement').value.trim();
    if (!pattern) {
      alert('请输入匹配规则');
      return;
    }
    state.settings.customRules.push({ pattern, replacement, enabled: true, builtin: false });
    saveSettings();
    document.getElementById('newRulePattern').value = '';
    document.getElementById('newRuleReplacement').value = '';
    renderRulesTable();
  });
  
  // 上下文菜单
  document.getElementById('ctxEdit').addEventListener('click', () => {
    hideContextMenu();
    openEditModal();
  });
  document.getElementById('ctxSplit').addEventListener('click', () => {
    hideContextMenu();
    if (state.selectedId) {
      const sub = state.subtitles.find(s => s.id === state.selectedId);
      if (sub) {
        const maxChars = parseInt(document.getElementById('maxCharsInput').value) || 12;
        const parts = splitSubtitleSmart(sub, maxChars);
        if (parts.length > 1) {
          const idx = state.subtitles.findIndex(s => s.id === state.selectedId);
          state.subtitles.splice(idx, 1, ...parts);
          state.subtitles = state.subtitles.map((s, i) => ({ ...s, id: i + 1 }));
          pushHistory();
          renderSubtitleList();
          renderTimeline();
          updateSubtitleCount();
        }
      }
    }
  });
  document.getElementById('ctxDelete').addEventListener('click', () => {
    hideContextMenu();
    if (state.selectedId) {
      deleteSubtitle(state.selectedId);
    }
  });
  
  document.addEventListener('click', () => hideContextMenu());
}

// ========== Modal 功能 ==========
function openEditModal() {
  if (!state.selectedId) return;
  const sub = state.subtitles.find(s => s.id === state.selectedId);
  if (!sub) return;
  
  document.getElementById('editStartTime').value = sub.start;
  document.getElementById('editEndTime').value = sub.end;
  document.getElementById('editText').value = sub.text;
  document.getElementById('editModal').classList.add('show');
}

function saveEdit() {
  if (!state.selectedId) return;
  const start = parseInt(document.getElementById('editStartTime').value) || 0;
  const end = parseInt(document.getElementById('editEndTime').value) || 0;
  const text = document.getElementById('editText').value;
  
  if (end <= start) {
    alert('结束时间必须大于开始时间');
    return;
  }
  
  updateSubtitle(state.selectedId, { start, end, text, lines: text.split('\n') });
  document.getElementById('editModal').classList.remove('show');
}

function openRulesModal() {
  renderRulesTable();
  document.getElementById('rulesModal').classList.add('show');
}

function renderRulesTable() {
  const builtinRules = getBuiltinRules();
  const customRules = state.settings.customRules || [];
  
  document.getElementById('builtinCount').textContent = builtinRules.length;
  document.getElementById('customCount').textContent = customRules.length;
  
  const tbody = document.getElementById('rulesTableBody');
  let html = '';
  
  for (const rule of builtinRules) {
    html += '<tr>' +
      '<td><input type="checkbox" ' + (rule.enabled ? 'checked' : '') + ' disabled></td>' +
      '<td>' + escapeHtml(rule.pattern) + '</td>' +
      '<td>' + escapeHtml(rule.replacement) + '</td>' +
      '<td>-</td>' +
      '</tr>';
  }
  
  for (let i = 0; i < customRules.length; i++) {
    const rule = customRules[i];
    html += '<tr>' +
      '<td><input type="checkbox" class="rule-enable" data-index="' + i + '" ' + (rule.enabled ? 'checked' : '') + '></td>' +
      '<td><input type="text" class="rule-pattern" data-index="' + i + '" value="' + escapeHtml(rule.pattern) + '"></td>' +
      '<td><input type="text" class="rule-replacement" data-index="' + i + '" value="' + escapeHtml(rule.replacement) + '"></td>' +
      '<td><button class="btn btn-sm btn-danger delete-rule" data-index="' + i + '">删除</button></td>' +
      '</tr>';
  }
  
  tbody.innerHTML = html;
  
  // 绑定自定义规则事件
  for (const cb of tbody.querySelectorAll('.rule-enable')) {
    cb.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      state.settings.customRules[idx].enabled = e.target.checked;
      saveSettings();
    });
  }
  
  for (const input of tbody.querySelectorAll('.rule-pattern')) {
    input.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      state.settings.customRules[idx].pattern = e.target.value;
      saveSettings();
    });
  }
  
  for (const input of tbody.querySelectorAll('.rule-replacement')) {
    input.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      state.settings.customRules[idx].replacement = e.target.value;
      saveSettings();
    });
  }
  
  for (const btn of tbody.querySelectorAll('.delete-rule')) {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      state.settings.customRules.splice(idx, 1);
      saveSettings();
      renderRulesTable();
    });
  }
}

function showContextMenu(x, y) {
  const menu = document.getElementById('contextMenu');
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.style.display = 'block';
}

function hideContextMenu() {
  document.getElementById('contextMenu').style.display = 'none';
}

// ========== Whisper 引擎 ==========
let whisperCancelFlag = false;
let whisperRunning = false;

// 动态加载 Transformers.js（兼容 file:// 协议）
async function ensureTransformers() {
  if (window.TransformersPipeline) return true;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      try {
        import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
        window.TransformersPipeline = pipeline;
      } catch (e) {
        window.TransformersError = e.message || 'unknown';
      }
    `;
    document.head.appendChild(script);
    
    let attempts = 0;
    const check = () => {
      if (window.TransformersPipeline) {
        resolve(true);
      } else if (window.TransformersError) {
        reject(new Error(window.TransformersError));
      } else if (attempts++ > 200) {
        reject(new Error('Transformers.js 加载超时，请确保网络连接正常。如果从本地文件(file://)打开，请通过本地服务器访问：npx serve 或 python3 -m http.server 8080'));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

async function runWhisperAlignment() {
  if (whisperRunning) return;
  if (!state.audioBuffer) {
    alert('请先导入音频文件');
    return;
  }
  if (state.subtitles.length === 0) {
    alert('请先导入字幕文件');
    return;
  }
  
  const modelName = document.getElementById('modelSelect').value;
  const modelMap = {
    'tiny': 'Xenova/whisper-tiny',
    'base': 'Xenova/whisper-base',
    'small': 'Xenova/whisper-small'
  };
  const modelId = modelMap[modelName] || modelMap['tiny'];
  
  whisperCancelFlag = false;
  whisperRunning = true;
  
  const modal = document.getElementById('whisperModal');
  const statusEl = document.getElementById('whisperStatus');
  const progressEl = document.getElementById('whisperProgress');
  const progressTextEl = document.getElementById('whisperProgressText');
  const modelInfoEl = document.getElementById('whisperModelInfo');
  
  modal.classList.add('show');
  statusEl.textContent = '正在加载模型...';
  progressEl.style.width = '0%';
  progressTextEl.textContent = '0%';
  modelInfoEl.textContent = '模型: ' + modelName + ' | 首次加载需下载模型文件，请耐心等待';
  
  try {
    // 第一步：确保 Transformers.js 已加载
    statusEl.textContent = '正在加载 Transformers.js...';
    await ensureTransformers();
    
    if (whisperCancelFlag) throw new Error('已取消');
    
    statusEl.textContent = '正在初始化模型...';
    progressEl.style.width = '10%';
    progressTextEl.textContent = '10%';
    
    const transcriber = await window.TransformersPipeline('automatic-speech-recognition', modelId, {
      revision: 'main',
      quantized: modelName === 'tiny',
      progress_callback: (data) => {
        if (whisperCancelFlag) return;
        if (data.status === 'progress') {
          const pct = Math.min(50, Math.round((data.loaded / data.total) * 50));
          progressEl.style.width = (10 + pct) + '%';
          progressTextEl.textContent = (10 + pct) + '%';
          statusEl.textContent = '正在下载模型... (' + Math.round(data.loaded / 1024 / 1024) + 'MB / ' + Math.round(data.total / 1024 / 1024) + 'MB)';
        } else if (data.status === 'done') {
          progressEl.style.width = '60%';
          progressTextEl.textContent = '60%';
          statusEl.textContent = '模型加载完成，开始识别...';
        }
      }
    });
    
    if (whisperCancelFlag) throw new Error('已取消');
    
    statusEl.textContent = '正在识别音频...';
    progressEl.style.width = '60%';
    progressTextEl.textContent = '60%';
    
    // 将AudioBuffer转换为Float32Array
    const audioData = state.audioBuffer.getChannelData(0);
    const sampleRate = state.audioBuffer.sampleRate;
    
    // 降采样到16kHz (Whisper要求)
    const targetRate = 16000;
    const ratio = sampleRate / targetRate;
    const downsampledLength = Math.floor(audioData.length / ratio);
    const downsampled = new Float32Array(downsampledLength);
    for (let i = 0; i < downsampledLength; i++) {
      downsampled[i] = audioData[Math.floor(i * ratio)];
    }
    
    if (whisperCancelFlag) throw new Error('已取消');
    
    const result = await transcriber(downsampled, {
      return_timestamps: 'word',
      language: 'zh',
      task: 'transcribe'
    });
    
    if (whisperCancelFlag) throw new Error('已取消');
    
    progressEl.style.width = '90%';
    progressTextEl.textContent = '90%';
    statusEl.textContent = '正在对齐时间码...';
    
    // 对齐字幕时间码
    if (result && result.chunks) {
      alignSubtitlesWithWhisper(result.chunks);
    } else if (result && result.text) {
      statusEl.textContent = '识别完成，但无法获取时间戳，请手动调整';
      progressEl.style.width = '100%';
      progressTextEl.textContent = '100%';
    }
    
    progressEl.style.width = '100%';
    progressTextEl.textContent = '100%';
    statusEl.textContent = '对齐完成！';
    
    setTimeout(() => {
      modal.classList.remove('show');
      whisperRunning = false;
    }, 1000);
    
  } catch (err) {
    console.error('Whisper error:', err);
    if (err.message === '已取消') {
      statusEl.textContent = '已取消';
    } else {
      statusEl.textContent = '出错: ' + (err.message || '未知错误');
    }
    progressEl.style.width = '0%';
    progressTextEl.textContent = '0%';
    setTimeout(() => {
      modal.classList.remove('show');
      whisperRunning = false;
    }, 3000);
  }
}

function alignSubtitlesWithWhisper(chunks) {
  // 基于Whisper识别结果对齐现有字幕
  // chunks: [{text, timestamp: [start, end]}, ...]
  
  const whisperSegments = chunks.filter(c => c.timestamp && c.text.trim()).map(c => ({
    text: c.text.trim().toLowerCase(),
    start: Math.round(c.timestamp[0] * 1000),
    end: Math.round(c.timestamp[1] * 1000)
  }));
  
  if (whisperSegments.length === 0) return;
  
  // 简单对齐策略：根据文本相似度匹配
  for (const sub of state.subtitles) {
    const subText = sub.text.toLowerCase().replace(/[^\u4e00-\u9fffa-z0-9]/g, '');
    if (subText.length < 3) continue;
    
    let bestMatch = null;
    let bestScore = 0;
    
    for (const seg of whisperSegments) {
      const segText = seg.text.toLowerCase().replace(/[^\u4e00-\u9fffa-z0-9]/g, '');
      if (segText.length < 3) continue;
      
      // 简单包含匹配
      if (segText.includes(subText) || subText.includes(segText)) {
        const score = Math.min(subText.length, segText.length);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = seg;
        }
      }
    }
    
    if (bestMatch) {
      sub.start = bestMatch.start;
      sub.end = bestMatch.end;
    }
  }
  
  // 确保时间不重叠且有序
  state.subtitles.sort((a, b) => a.start - b.start);
  for (let i = 0; i < state.subtitles.length - 1; i++) {
    if (state.subtitles[i].end > state.subtitles[i + 1].start) {
      state.subtitles[i].end = state.subtitles[i + 1].start - 1;
    }
  }
  
  // 重新编号
  state.subtitles = state.subtitles.map((s, i) => ({ ...s, id: i + 1 }));
  
  pushHistory();
  renderSubtitleList();
  renderTimeline();
}

// ========== 初始化 ==========
function init() {
  loadSettings();
  
  // 应用设置到UI
  document.getElementById('autoSpaceToggle').checked = state.settings.autoSpace;
  document.getElementById('termCorrectionToggle').checked = state.settings.termCorrection;
  document.getElementById('maxCharsInput').value = state.settings.maxLineChars;
  document.getElementById('modelSelect').value = state.settings.defaultModel;
  
  initCanvases();
  bindEvents();
  renderSubtitleList();
  renderTimeline();
  
  // 初始历史状态
  pushHistory();
  
  console.log('SRT Workbench initialized');
}

// 启动
init();

})();
