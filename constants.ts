
import { Feedback, FeedbackStatus, Project, ProjectStatus, ProjectType, Stakeholder, ChildInfo, Shareholder, InvestorProfile, BusinessType } from './types';

// --- Data Generators ---

const DOMESTIC_LOCATIONS = [
  '广东省广州市', '广东省深圳市', '广东省珠海市', '广东省佛山市', '广东省惠州市', '广东省东莞市', '广东省中山市', '广东省江门市', '广东省湛江市', '广东省茂名市', '广东省阳江市', '广东省清远市',
  '广西壮族自治区南宁市', '广西壮族自治区钦州市', '广西壮族自治区防城港市',
  '云南省昆明市', '云南省大理白族自治州',
  '贵州省贵阳市', '海南省海口市', '海南省三亚市'
];

const INTERNATIONAL_LOCATIONS = [
  '乌兹别克斯坦·锡尔河州', '乌兹别克斯坦·塔什干', '乌兹别克斯坦·撒马尔罕',
  '越南·海阳省', '越南·平顺省',
  '印度尼西亚·爪哇岛', '印度尼西亚·雅加达',
  '菲律宾·马尼拉', '菲律宾·吕宋岛',
  '老挝·万象', '老挝·琅勃拉邦',
  '孟加拉国·吉大港', '马来西亚·沙巴州'
];

const RESIDENTIAL_AREAS = ['幸福花园', '阳光小区', '碧桂园', '万科城', '滨江一号', '中央公馆', '山水华府'];
const ROAD_NAMES = ['建设路', '人民路', '中山路', '解放路', '和平路', '迎宾大道'];

// Realistic Project Names Mapping
const REAL_PROJECT_NAMES: Record<ProjectType, string[]> = {
  [ProjectType.GENERATION]: [
    '东莞宁洲3×700MW燃气-蒸汽联合循环热电冷联产工程',
    '佛山三水燃气热电联产扩建项目',
    '广州珠江电厂2×1000MW燃煤机组灵活性改造项目',
    '茂名博贺电厂2×1000MW上大压小工程',
    '湛江京信2×600MW“上大压小”热电联产燃煤机组工程',
    '清远石角天然气分布式能源站项目',
    '深圳能源光明电源基地项目',
    '肇庆鼎湖天然气热电联产项目'
  ],
  [ProjectType.GRID]: [
    '大湾区中通道直流背靠背工程(东莞侧)',
    '500kV 穗东输变电工程配套线路项目',
    '深圳中西部电网网架优化工程',
    '500kV 蝴蝶岭变电站扩建主变工程',
    '粤港澳大湾区外环西段输电线路工程',
    '海南联网二回500kV海缆陆地段工程'
  ],
  [ProjectType.NEW_ENERGY]: [
    '广东阳江沙扒300MW海上风电场项目',
    '中广核惠州港口二PA海上风电项目',
    '湛江徐闻600MW海上风电场工程',
    '广西钦州恒科30MW分布式光伏发电项目',
    '云南楚雄100MW农光互补光伏电站',
    '海南东方CZ8场址500MW海上风电项目',
    '广东粤电阳江青洲一海上风电场项目'
  ],
  [ProjectType.INTERNATIONAL]: [
    '乌兹别克斯坦锡尔河1500MW燃气联合循环独立发电项目',
    '乌兹别克斯坦安集延200MW光伏+储能项目',
    '越南海阳2×600MW燃煤电厂工程',
    '菲律宾瓦瓦500MW抽水蓄能电站项目',
    '印度尼西亚爪哇7号2×1050MW燃煤发电工程',
    '老挝南恩2号水电站项目',
    '孟加拉国帕亚拉2×660MW超超临界燃煤电站',
    '马来西亚沙巴州大型太阳能光伏电站项目'
  ],
  [ProjectType.MUNICIPAL]: [
    '广州南沙新区综合管廊工程',
    '深圳市东部垃圾焚烧处理厂配套市政工程',
    '东莞市中心城区供水管网升级改造工程',
    '珠海横琴新区能源站市政配套管网项目'
  ],
  [ProjectType.ENVIRONMENT]: [
    '广州市第三资源热力电厂二期工程',
    '湛江市全地埋式污水处理厂项目',
    '茂名市工业园区工业废水零排放改造工程'
  ],
  [ProjectType.SURVEY]: [
    '粤东海上风电基地海底地形地貌勘察项目',
    '广西防城港核电三期工程岩土工程勘察',
    '深中通道海底隧道段专项地质勘察'
  ],
  [ProjectType.DIGITAL]: [
    '南方电网数字孪生变电站试点项目',
    '广东能源集团智慧电厂管理平台建设项目',
    '海上风电场全生命周期数字化管理系统'
  ],
  [ProjectType.GREEN_CHEM]: [
    '湛江巴斯夫一体化基地可再生能源供电项目',
    '茂名石化炼化转型升级绿色供能配套工程',
    '惠州大亚湾石化区绿氢制备示范项目'
  ]
};

// Domestic Names (Chinese)
const CN_LAST_NAMES = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗'];
const CN_FIRST_NAMES = ['伟', '强', '磊', '洋', '勇', '军', '杰', '涛', '明', '超', '秀英', '娜', '静', '丽', '敏', '燕', '鹏', '华', '波', '刚'];

// International Names (Mix of English, Russian/Uzbek style, SE Asian)
const INT_FIRST_NAMES = ['David', 'Michael', 'James', 'Robert', 'John', 'Dmitry', 'Igor', 'Sergey', 'Nguyen', 'Tran', 'Le', 'Siti', 'Budi', 'Antonio', 'Jose'];
const INT_LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Ivanov', 'Petrov', 'Smirnov', 'Van', 'Pham', 'Santoso', 'Wijaya', 'Cruz', 'Reyes', 'Singh'];

const ROLES = ['总经理', '副总经理', '总工程师', '项目总监', '工程部主任', '前期部经理', '基建部主任', '安监部部长', '技术总监', '董事长'];
const INT_ROLES = ['Project Director', 'Chief Engineer', 'General Manager', 'Site Manager', 'Technical Director', 'Operations Manager'];

const CHILD_SCHOOLS_LOW = ['市实验小学', '外国语学校小学部', '市机关一幼', '省委机关幼儿园'];
const CHILD_SCHOOLS_MID = ['市第一中学', '省实验中学', '华师附中', '雅礼中学', '执信中学', '深圳中学'];
const CHILD_SCHOOLS_HIGH = ['北京大学', '清华大学', '中山大学', '浙江大学', '复旦大学', '美国加州大学(UCSD)', '英国曼彻斯特大学', '香港大学'];
const CHILD_JOBS = ['市税务局', '电网公司', '建设银行', '市设计院', '市人民医院', '高校任教'];

const SPOUSE_JOBS = ['市中心医院 主任医师', '市财政局 科长', '某高校 教授', '建设银行 支行行长', '市教育局 干部', '某国企 财务总监', '市文旅局 副局长'];

// Shareholders Pool
const DOMESTIC_MAJOR_SHAREHOLDERS = ['广东省能源集团', '中国华能集团', '中国大唐集团', '国家能源投资集团', '国家电力投资集团', '华润电力控股有限公司', '南方电网综合能源股份有限公司'];
const DOMESTIC_MINOR_SHAREHOLDERS = ['广州产业投资控股集团', '深圳市投资控股有限公司', '广东省电力开发公司', 'XX市城市建设投资集团', 'XX省交通投资集团', '中国能建集团投资公司'];

const INT_MAJOR_SHAREHOLDERS = ['ACWA Power', 'Masdar (Abu Dhabi Future Energy Company)', 'Korea Electric Power Corp (KEPCO)', 'EDF International', 'PowerChina International'];
const INT_MINOR_SHAREHOLDERS = ['Silk Road Fund (丝路基金)', 'Asian Infrastructure Investment Bank (AIIB)', 'Local Ministry of Energy', 'Local Sovereign Wealth Fund', 'International Finance Corporation (IFC)'];

const HOBBIES_POOL = [
  '高尔夫', '海钓', '普洱茶', '书法', '马拉松', '摄影', '游泳', '网球', '羽毛球', '古典音乐', '登山', '自驾游', '红酒收藏', '围棋', '太极拳'
];
const INT_HOBBIES_POOL = [
  'Golf', 'Sailing', 'Fishing', 'Tennis', 'Marathon', 'Photography', 'Swimming', 'Hiking', 'Classical Music', 'Wine Tasting', 'Chess', 'Scuba Diving'
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomSubarray = <T>(arr: T[], size: number): T[] => {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp: T;
    let index: number;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
};


const generateName = (isInternational: boolean, location: string) => {
  if (!isInternational) {
    return getRandomItem(CN_LAST_NAMES) + getRandomItem(CN_FIRST_NAMES);
  }
  
  if (location.includes('乌兹别克斯坦')) {
     return getRandomItem(['Dmitry', 'Aleksandr', 'Rustam', 'Aziz', 'Islam']) + ' ' + getRandomItem(['Karimov', 'Ivanov', 'Petrov', 'Yuldashev']);
  } else if (location.includes('越南')) {
     return getRandomItem(['Nguyen', 'Tran', 'Le', 'Pham']) + ' ' + getRandomItem(['Van A', 'Thi B', 'Minh', 'Quoc']);
  } else if (location.includes('菲律宾') || location.includes('印尼')) {
     return getRandomItem(['Jose', 'Maria', 'Budi', 'Agus']) + ' ' + getRandomItem(['Santos', 'Reyes', 'Wijaya', 'Susanto']);
  } else {
     return getRandomItem(INT_FIRST_NAMES) + ' ' + getRandomItem(INT_LAST_NAMES);
  }
};

const generatePhone = () => `13${getRandomInt(0, 9)}${getRandomInt(10000000, 99999999)}`;
const generateIntPhone = () => `+${getRandomInt(1, 99)} ${getRandomInt(100, 999)} ${getRandomInt(1000, 9999)}`;

const generateAvatarUrl = (isInternational: boolean, gender: 'men' | 'women' = 'men') => {
    const id = getRandomInt(1, 99);
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

const generateAddress = (isInternational: boolean, location: string) => {
    if (isInternational) {
        return `10${getRandomInt(1, 9)} Park Avenue, ${location.split('·')[1] || location}`;
    }
    const city = location.includes('市') ? location : getRandomItem(DOMESTIC_LOCATIONS);
    const road = getRandomItem(ROAD_NAMES);
    const area = getRandomItem(RESIDENTIAL_AREAS);
    return `${city}${road}${getRandomInt(1, 999)}号${area}${getRandomInt(1, 15)}栋${getRandomInt(101, 3002)}室`;
};

const generateEmail = (name: string, isInternational: boolean) => {
    // Simple simulation of email
    const prefix = isInternational ? name.toLowerCase().replace(' ', '.') : `user.${getRandomInt(1000,9999)}`;
    const domains = ['163.com', 'qq.com', 'gmail.com', 'energy-group.com', 'project-corp.net'];
    return `${prefix}@${getRandomItem(domains)}`;
};

const generateChildren = (parentAge: number): ChildInfo[] => {
    const childrenCount = getRandomInt(1, 2);
    const children: ChildInfo[] = [];
    const baseChildAge = parentAge - getRandomInt(24, 30);
    
    if (baseChildAge < 0) return []; 

    for (let i = 0; i < childrenCount; i++) {
        let age = baseChildAge - (i * getRandomInt(2, 5));
        if (age < 0) age = 1;

        let status = '';
        if (age < 6) status = getRandomItem(['市机关幼儿园', '国际幼儿园']);
        else if (age < 12) status = getRandomItem(CHILD_SCHOOLS_LOW);
        else if (age < 18) status = getRandomItem(CHILD_SCHOOLS_MID);
        else if (age < 23) status = getRandomItem(CHILD_SCHOOLS_HIGH);
        else status = getRandomItem(CHILD_JOBS);

        children.push({
            gender: Math.random() > 0.5 ? '男' : '女',
            age: age,
            status: status
        });
    }
    return children;
};

const generateStakeholder = (idPrefix: string, index: number, isInternational: boolean, projectLoc: string): Stakeholder => {
  const name = generateName(isInternational, projectLoc);
  const role = isInternational ? getRandomItem(INT_ROLES) : getRandomItem(ROLES);
  const age = getRandomInt(38, 58);
  const id = `${idPrefix}_s_${index}`;
  
  let spouse = undefined;
  let children = undefined;

  if (!isInternational) {
      spouse = {
          name: generateName(false, projectLoc),
          info: getRandomItem(SPOUSE_JOBS)
      };
      children = generateChildren(age);
  } else {
       if(Math.random() > 0.7) {
           spouse = { name: 'Partner', info: 'Housewife / Professional' };
       }
  }

  // Generate Address & Email & WeChat
  const address = generateAddress(isInternational, projectLoc);
  const email = generateEmail(name, isInternational);
  // Using a placeholder QR code API service with a random ID
  const wechatQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=wxid_${id}_nepdi`;

  // Generate Hobbies
  const hobbies = getRandomSubarray(isInternational ? INT_HOBBIES_POOL : HOBBIES_POOL, getRandomInt(2, 4));

  return {
    id: id,
    name: name,
    role: role,
    avatarUrl: generateAvatarUrl(isInternational),
    phone: isInternational ? generateIntPhone() : generatePhone(),
    influence: Math.random() > 0.7 ? 'High' : 'Medium',
    
    // New Fields
    email: email,
    address: address,
    wechatQrUrl: wechatQrUrl,
    hobbies: hobbies, // Add hobbies

    age: age,
    birthplace: isInternational ? projectLoc.split('·')[0] : getRandomItem(DOMESTIC_LOCATIONS), 
    spouse: spouse,
    children: children,
    education: [
        { 
            school: isInternational ? getRandomItem(['MIT', 'NUS', 'Moscow State Univ', 'University of Melbourne']) : getRandomItem(['清华大学', '华南理工大学', '武汉大学', '浙江大学', '西安交通大学', '华北电力大学']), 
            degree: isInternational ? 'Master' : '本科', 
            gradYear: String(getRandomInt(1990, 2010)),
            major: getRandomItem(['电气工程', '热能工程', '土木工程', '工程管理'])
        }
    ],
    career: [
        {
            start: '2015',
            end: 'Present',
            company: isInternational ? 'International Energy Corp' : '项目建设单位',
            role: role,
            description: isInternational ? 'Leading the project execution.' : '负责项目全过程管理。'
        },
        {
            start: '2005',
            end: '2015',
            company: isInternational ? 'Global Infrastructure Ltd' : '某大型国企',
            role: 'Manager',
            description: 'Accumulated extensive experience.'
        }
    ]
  };
};

const generateShareholderStructure = (isInternational: boolean, location: string): InvestorProfile => {
    const shareholders: Shareholder[] = [];
    const count = getRandomInt(2, 4);
    
    // 1. Holding Company (51% - 75%)
    const holdingPct = getRandomInt(51, 75);
    const majorPool = isInternational ? INT_MAJOR_SHAREHOLDERS : DOMESTIC_MAJOR_SHAREHOLDERS;
    const majorName = getRandomItem(majorPool);
    
    shareholders.push({
        name: majorName,
        type: '控股',
        percentage: `${holdingPct}%`
    });

    // 2. Minor Shareholders
    let remainingPct = 100 - holdingPct;
    const minorPool = isInternational ? INT_MINOR_SHAREHOLDERS : DOMESTIC_MINOR_SHAREHOLDERS;
    
    for (let i = 1; i < count; i++) {
        // Last one takes all remainder
        if (i === count - 1) {
            shareholders.push({
                name: isInternational ? 'Local Gov Investment' : `${location.slice(0, 3)}城市建设投资集团`,
                type: '参股',
                percentage: `${remainingPct}%`
            });
        } else {
            const share = getRandomInt(5, remainingPct - 5);
            remainingPct -= share;
            shareholders.push({
                name: getRandomItem(minorPool.filter(n => n !== majorName)), // Avoid dupe simply
                type: '参股',
                percentage: `${share}%`
            });
        }
    }

    // Determine Project Company Name based on Major Shareholder or Location
    const suffix = isInternational ? 'Power Company Ltd.' : '发电有限公司';
    const companyName = `${majorName.slice(0, 4)}${location.slice(0,2)}${suffix}`;

    return {
        name: companyName,
        shareholders: shareholders
    };
};

// Helper to extract capacity from name
const extractCapacityFromName = (name: string): string | null => {
  // Matches patterns like: 2x1000MW, 3×700MW, 300MW, 1.5GW
  // Regex: 
  // \d+ : Start with number
  // (?:(?:\.\d+)? : Optional decimal
  // \s*[xX×*]\s* : Optional multiplier separator (x, X, ×, *)
  // \d+(?:\.\d+)? : Optional second number if multiplier exists
  // )? : End multiplier group
  // \s*(?:MW|GW) : Must end with unit
  const regex = /(\d+(?:(?:\.\d+)?\s*[xX×*]\s*\d+(?:\.\d+)?)?\s*(?:MW|GW))/i;
  const match = name.match(regex);
  return match ? match[1].replace('x', '×').replace('X', '×') : null; // Normalize 'x' to '×' for consistency
};

const generateProjectsForType = (type: ProjectType, count: number): Project[] => {
  const projects: Project[] = [];
  const isInternational = type === ProjectType.INTERNATIONAL;
  
  const statusList = Object.values(ProjectStatus);
  const realNames = REAL_PROJECT_NAMES[type] || [];

  for (let i = 0; i < count; i++) {
    // 1. Determine Status randomly
    const status = getRandomItem(statusList);
    
    // 2. Determine Progress based on Status
    let progress = 0;
    switch(status) {
        case ProjectStatus.PROPOSAL: progress = getRandomInt(0, 10); break;
        case ProjectStatus.FEASIBILITY: progress = getRandomInt(10, 30); break;
        case ProjectStatus.PRELIM_DESIGN: progress = getRandomInt(30, 50); break;
        case ProjectStatus.DRAWING: progress = getRandomInt(50, 70); break;
        case ProjectStatus.CONSTRUCTION: progress = getRandomInt(20, 95); break; // Can be wide range
        case ProjectStatus.COMPLETED: progress = 100; break;
    }
    
    // Simplify ID generation using random string part to avoid long names
    const pid = `proj_${getRandomInt(1000,9999)}_${i}`;

    let location = '';
    let name = '';

    if (i < realNames.length) {
        name = realNames[i];
        if (isInternational) {
             if (name.includes('乌兹别克斯坦')) location = '乌兹别克斯坦·锡尔河州';
             else if (name.includes('越南')) location = '越南·海阳省';
             else if (name.includes('菲律宾')) location = '菲律宾·马尼拉';
             else if (name.includes('老挝')) location = '老挝·万象';
             else if (name.includes('印尼') || name.includes('印度尼西亚')) location = '印度尼西亚·雅加达';
             else location = getRandomItem(INTERNATIONAL_LOCATIONS);
        } else {
            location = getRandomItem(DOMESTIC_LOCATIONS);
            DOMESTIC_LOCATIONS.forEach(loc => {
                if(name.includes(loc.slice(0,2))) location = loc;
            });
        }
    } else {
        location = isInternational ? getRandomItem(INTERNATIONAL_LOCATIONS) : getRandomItem(DOMESTIC_LOCATIONS);
        const suffixes = isInternational ? [' Phase I', ' Expansion', ' Power Plant'] : ['扩建工程', '新建项目', '改造工程', '示范项目', '配套工程'];
        // Generic name generation
        name = `${location.split('·')[1] || location.split('市')[0]}项目${getRandomItem(suffixes)}`;
    }

    // Capacity Logic: Unified with Name
    let capacity = extractCapacityFromName(name);

    if (!capacity) {
        // Fallback if not found in name or regex didn't match (e.g. generic name)
        const val = getRandomInt(100, 1000);
        // For Grid, we use MVA which doesn't conflict with kV in name (voltage vs capacity)
        const unit = type === ProjectType.GRID ? 'MVA' : 'MW';
        capacity = `${val}${unit}`;
    }

    const stakeholderCount = getRandomInt(1, 3);
    const stakeholders: Stakeholder[] = [];
    for(let j=0; j<stakeholderCount; j++) {
        stakeholders.push(generateStakeholder(pid, j, isInternational, location));
    }
    
    // Generate complex investor structure
    const investorProfile = generateShareholderStructure(isInternational, location);
    
    // 3. Determine Business Type (Design vs EPC)
    // International & New Energy have higher chance of EPC
    const isEpcLikely = type === ProjectType.INTERNATIONAL || type === ProjectType.NEW_ENERGY || type === ProjectType.MUNICIPAL;
    const businessType: BusinessType = (Math.random() > (isEpcLikely ? 0.4 : 0.7)) ? '总包' : '设计';

    // 4. Generate Financial Data (Contract Value & Payment)
    // Value in Ten Thousand RMB
    let contractValue = 0;
    if (businessType === '总包') {
        contractValue = getRandomInt(20000, 500000); // 200M - 5B RMB
    } else {
        contractValue = getRandomInt(500, 8000); // 5M - 80M RMB
    }
    
    // Payment ratio roughly correlates with progress, but varies
    const paymentRatio = Math.min(1, Math.max(0, (progress / 100) - (Math.random() * 0.2))); 
    const paymentReceived = Math.floor(contractValue * paymentRatio);

    projects.push({
      id: pid,
      name: name,
      type: type,
      businessType: businessType,
      status: status,
      location: location,
      investor: investorProfile,
      capacity: capacity, // Use unified capacity
      manager: generateName(false, location),
      stakeholders: stakeholders,
      progress: progress,
      contractValue: contractValue,
      paymentReceived: paymentReceived
    });
  }
  return projects;
};

// --- Main Data Construction ---

// 1. Existing High Quality Mock Data (Preserved & Enhanced)
const EXISTING_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: '广东惠州燃气热电联产项目',
    type: ProjectType.GENERATION,
    businessType: '总包',
    status: ProjectStatus.CONSTRUCTION,
    location: '广东省惠州市',
    investor: {
      name: '惠州深能源丰达电力有限公司',
      shareholders: [
        { name: '深圳能源集团股份有限公司', type: '控股', percentage: '65%' },
        { name: '惠州市电力集团有限公司', type: '参股', percentage: '25%' },
        { name: '广东省电力开发有限公司', type: '参股', percentage: '10%' }
      ]
    },
    capacity: '2x460MW',
    manager: '张伟',
    progress: 15,
    contractValue: 285000, // 28.5亿
    paymentReceived: 56000, // 5.6亿
    stakeholders: [
      { 
        id: 's1', 
        name: '李建华', 
        role: '董事长',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        phone: '13800138000',
        email: 'li.jianhua@energy-group.com',
        address: '广东省惠州市惠城区江北街道云山路18号帝景湾3栋802',
        wechatQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=wxid_lijianhua_nepdi',
        influence: 'High',
        age: 54,
        birthplace: '湖南长沙',
        hobbies: ['高尔夫', '普洱茶', '书法'], // Added Hobbies
        spouse: { name: '刘女士', info: '惠州市中心医院 心内科主任' },
        children: [
            { gender: '女', age: 24, status: '美国哥伦比亚大学 硕士在读' }
        ],
        education: [
          { school: '清华大学', major: '热能工程', degree: '硕士', gradYear: '1995' }
        ],
        career: [
          { start: '2018', end: '至今', company: '惠州燃气热电项目公司', role: '董事长', description: '全面负责项目建设及运营管理。' }
        ]
      },
      { 
        id: 's2', 
        name: '王强', 
        role: '工程部主任', 
        avatarUrl: 'https://randomuser.me/api/portraits/men/85.jpg',
        phone: '13900139000', 
        email: 'wang.qiang@hz-power.com',
        address: '广东省惠州市麦地南路麦地花园5栋301',
        wechatQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=wxid_wangqiang_nepdi',
        influence: 'Medium',
        age: 42,
        birthplace: '广东梅州',
        hobbies: ['海钓', '马拉松'], // Added Hobbies
        spouse: { name: '张护士', info: '惠州市第一人民医院 急诊科护士长' },
        children: [
            { gender: '男', age: 12, status: '惠州市第一小学 六年级' },
            { gender: '女', age: 6, status: '机关幼儿园 大班' }
        ],
        education: [{ school: '华南理工大学', major: '电力系统自动化', degree: '本科', gradYear: '2004' }],
        career: [{ start: '2019', end: '至今', company: '惠州燃气热电项目公司', role: '工程部主任', description: '负责现场施工进度协调。' }]
      }
    ]
  },
  {
    id: 'p1_2',
    name: '珠海洪湾燃机热电联产扩建工程',
    type: ProjectType.GENERATION,
    businessType: '设计',
    status: ProjectStatus.FEASIBILITY,
    location: '广东省珠海市',
    investor: {
      name: '珠海洪湾电力有限公司',
      shareholders: [
          { name: '珠海港控股集团有限公司', type: '控股', percentage: '51%' }, 
          { name: '中国南方电网有限责任公司', type: '参股', percentage: '29%' },
          { name: '广东省能源集团有限公司', type: '参股', percentage: '20%' }
      ]
    },
    capacity: '2x9F级',
    manager: '林峰',
    progress: 10,
    contractValue: 4800,
    paymentReceived: 500,
    stakeholders: [
      {
        id: 's_gen_1',
        name: '刘志远',
        role: '总经理',
        avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
        phone: '13900001111',
        email: 'liu.zhiyuan@zhuhai-port.com',
        address: '广东省珠海市香洲区情侣中路88号海滨花园1栋1201',
        wechatQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=wxid_liuzhiyuan_nepdi',
        influence: 'High',
        age: 52,
        birthplace: '广东珠海',
        hobbies: ['摄影', '网球', '红酒收藏'], // Added Hobbies
        spouse: { name: '陈女士', info: '珠海市税务局 税政科科长' },
        children: [
             { gender: '男', age: 22, status: '中山大学 本科在读' }
        ],
        education: [{ school: '武汉大学', degree: '本科', gradYear: '1994', major: '电厂化学' }],
        career: [{ start: '2015', end: '至今', company: '洪湾电力', role: '总经理', description: '负责扩建工程前期筹备。' }]
      }
    ]
  }
];

// 2. Generate Random Projects for ALL types
let GENERATED_PROJECTS: Project[] = [];

Object.values(ProjectType).forEach(type => {
  const count = getRandomInt(6, 14); 
  const newProjects = generateProjectsForType(type, count);
  GENERATED_PROJECTS = [...GENERATED_PROJECTS, ...newProjects];
});

export const MOCK_PROJECTS: Project[] = [...EXISTING_PROJECTS, ...GENERATED_PROJECTS];

// Helper to find a project ID by name for feedback linking
const findProjId = (namePart: string) => MOCK_PROJECTS.find(p => p.name.includes(namePart))?.id || MOCK_PROJECTS[0].id;
const findStakeholderId = (pid: string) => MOCK_PROJECTS.find(p => p.id === pid)?.stakeholders[0]?.id || 'unknown';

const pUzbek = findProjId('乌兹别克斯坦');
const pVietnam = findProjId('越南');
const pWind = findProjId('阳江沙扒');
const pDigital = findProjId('智慧电厂');
const pPhil = findProjId('菲律宾');
const pIndo = findProjId('印尼');

export const MOCK_FEEDBACKS: Feedback[] = [
  {
    id: 'f1',
    projectId: 'p1',
    stakeholderId: 's1',
    content: '关于2号机组的主变压器选型，希望能再对比一下国产和进口品牌的运维成本，下周三前给反馈。',
    receivedDate: '2023-10-25',
    status: FeedbackStatus.PENDING,
    assignedTo: '张伟',
    isUrgent: true
  },
  {
    id: 'f2',
    projectId: 'p1_2',
    stakeholderId: 's_gen_1',
    content: '需补充海洋环评对周边渔业影响的详细数据报告，环保局那边催得紧。',
    receivedDate: '2023-10-24',
    status: FeedbackStatus.IN_PROGRESS,
    assignedTo: '刘洋'
  },
  {
    id: 'f3',
    projectId: pUzbek,
    stakeholderId: findStakeholderId(pUzbek),
    content: 'Project financing approval from the local ministry is delayed. We need NEPDI to provide the updated feasibility study report in Russian by Friday.',
    receivedDate: '2023-10-26',
    status: FeedbackStatus.PENDING,
    assignedTo: 'Wang (Intl Dept)'
  },
  {
    id: 'f4',
    projectId: pWind,
    stakeholderId: findStakeholderId(pWind),
    content: '海上风机基础施工遇到海底孤石，原打桩方案不可行，请求设计院派驻现场代表协助制定处理方案。',
    receivedDate: '2023-10-26',
    status: FeedbackStatus.PENDING,
    assignedTo: '陈工',
    isUrgent: true
  },
  {
    id: 'f5',
    projectId: pVietnam,
    stakeholderId: findStakeholderId(pVietnam),
    content: 'The local grid operator requires a revision on the connection voltage level parameters. Please check the attachment.',
    receivedDate: '2023-10-23',
    status: FeedbackStatus.ASSIGNED,
    assignedTo: 'Li (Design)'
  },
  {
    id: 'f6',
    projectId: pDigital,
    stakeholderId: findStakeholderId(pDigital),
    content: '智慧工地系统的视频监控模块与现有安防系统接口不兼容，请数字化公司技术人员下周到现场调试。',
    receivedDate: '2023-10-22',
    status: FeedbackStatus.PENDING,
    assignedTo: '周经理'
  },
  {
    id: 'f7',
    projectId: 'p1',
    stakeholderId: 's2',
    content: '施工单位反馈侧煤仓钢结构图纸与现场土建基础有3处偏差，急需变更通知单。',
    receivedDate: '2023-10-27',
    status: FeedbackStatus.PENDING,
    assignedTo: '赵工'
  },
  {
    id: 'f8',
    projectId: pPhil,
    stakeholderId: findStakeholderId(pPhil),
    content: 'Site access road is blocked by local community protest regarding dust issues. Need urgent mitigation plan review.',
    receivedDate: '2023-10-21',
    status: FeedbackStatus.RESOLVED,
    assignedTo: 'Manager Zhang'
  },
  {
    id: 'f9',
    projectId: pIndo,
    stakeholderId: findStakeholderId(pIndo),
    content: 'Coal supply agreement draft needs technical specification review for the boiler compatibility.',
    receivedDate: '2023-10-20',
    status: FeedbackStatus.IN_PROGRESS,
    assignedTo: 'Tech Lead Wu'
  }
];
