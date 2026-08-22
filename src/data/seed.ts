import type { DatabaseShape } from "@/types";

/* Verified Unsplash photo IDs (checked HTTP 200 at build time) */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const IMG = {
  hero: u("1529156069898-49953e39b3ac", 2000),
  whoWeAre: u("1488521787991-ed7bbaae773c"),
  health: u("1576091160399-112ba8d25d1d"),
  stethoscope: u("1584515933487-779824d29309"),
  classroomKids: u("1509062522246-3755977927d7"),
  studentsWriting: u("1529390079861-591de354faf5"),
  library: u("1481627834876-b7833e8f5570"),
  pencils: u("1503676260728-1c00da094a0b"),
  foodDistribution: u("1593113598332-cd288d649433"),
  vegetables: u("1488459716781-31db52582fe9"),
  fieldCrops: u("1464226184884-fa280b87c399"),
  fieldRows: u("1466692476868-aef1dfb1e735"),
  tomatoes: u("1592924357228-91a4daadcfea"),
  youthLaptop: u("1523240795612-9a054b0db644"),
  gradJump: u("1523580494863-6f3031224c94"),
  gradStudents: u("1571260899304-425eee4c7efc"),
  trainingWorkshop: u("1517245386807-bb43f82c33c4"),
  communityPlanning: u("1552664730-d307ca884978"),
  teamHandsDesk: u("1521737604893-d14cc237f11d"),
  boardroom: u("1517048676732-d65bc937f952"),
  emergencyBox: u("1584464491033-06628f3a6b7b"),
  footballSunset: u("1523805009345-7448845a9e53", 1800),
  kidsRunning: u("1502086223501-7ea6ecd79368"),
  kidsPlaying: u("1503454537195-1dcabb73ffb9"),
  womanSmiling: u("1531384441138-2736e62e0919"),
  handsPlant: u("1542601906990-b4d3fb778b09"),
  teacherKids: u("1427504494785-3a9ca7044f45"),
  volunteerWomen: u("1522202176988-66273c2fd55f"),
  handshake: u("1521791136064-7986c2920216"),
  stackedHands: u("1461532257246-777de18cd58b"),
  studentsTable: u("1543269865-cbf427effbad"),
  portraitMan1: u("1507003211169-0a1dd7228f2d", 800),
  portraitWoman1: u("1531123897727-8f129e1688ce", 800),
  portraitMan2: u("1568602471122-7832951cc4c5", 800),
  portraitWomanPro: u("1573496359142-b8d87734a5a2", 800),
  shopTee: "/products/t-shirt.jpg",
  shopHoodie: "/products/hoodie.jpg",
  shopTote: "/products/totebag.jpg",
  shopBottle: "/products/waterbottle.jpg",
  shopTeesStack: "/products/supporter-pack.jpg",
  shopCap: "/products/cap.jpg",
};

const now = () => new Date().toISOString();

export function buildSeed(): DatabaseShape {
  return {
    settings: {
      orgName: "Hands of Hope Foundation",
      tagline: "Extending Hands. Inspiring Hope.",
      missionShort:
        "A Kenyan community foundation improving lives through compassion, empowerment, education, health support and food security.",
      emailGeneral: "info@handsofhope.org",
      emailPartnerships: "partnerships@handsofhope.org",
      emailPrograms: "programs@handsofhope.org",
      phone: "+254 715 135 141",
      location: "Rhapta Road, Westlands, Nairobi, Kenya",
      deliveryFeeKes: 350,
      deliveryFeeUsd: 10,
      registrationNote:
        "Hands of Hope Foundation is a community foundation working across Kenya. Registration details and governance documents are published on our Transparency page.",
      socials: [
        { label: "Facebook", url: "https://facebook.com/handsofhopekenya" },
        { label: "Instagram", url: "https://instagram.com/handsofhopekenya" },
        { label: "X", url: "https://x.com/handsofhopekenya" },
        { label: "LinkedIn", url: "https://linkedin.com/company/handsofhopekenya" },
      ],
    },

    homepage: {
      heroKicker: "Hands of Hope Foundation • Kenya",
      heroTitleTop: "Extending Hands.",
      heroTitleAccent: "Inspiring Hope.",
      heroSubtitle:
        "Together, we can create healthier communities, empower young people, support vulnerable families and build brighter futures across Kenya.",
      heroImage: IMG.hero,
      heroTaglineItems: [
        "Serving communities",
        "Empowering people",
        "Creating lasting change",
      ],
      whoWeAreHeading: "Hope Begins With Us",
      whoWeAreBody:
        "Hands of Hope Foundation exists to bring practical support and sustainable opportunities to communities across Kenya — while empowering people to become agents of positive change in their own lives.\n\nWe work shoulder-to-shoulder with local leaders, schools, health facilities and families. Every initiative starts by listening, and every program is built to outlast our presence: skills stay, knowledge stays, and hope becomes self-sustaining.",
      whoWeAreImage: IMG.whoWeAre,
      featuredProjectSlug: "project-hope",
      sustainabilityHeading: "Creating Sustainable Impact",
      sustainabilityBody:
        "Hands of Hope is building a modern nonprofit model — one that develops partnerships, training programs, community enterprises, merchandise and events so that our impact does not depend on donations alone.\n\nRevenue generated through these initiatives is reinvested into community programs, strengthening our long-term ability to serve.",
      sustainabilityImage: IMG.handsPlant,
      volunteerCtaHeading: "Your Skills Can Change a Life",
      volunteerCtaBody:
        "Whether you have professional expertise, practical skills, time or simply a desire to serve, there is a place for you at Hands of Hope.",
      volunteerCtaImage: IMG.volunteerWomen,
      newsletterHeading: "Stay Connected to the Hope",
      newsletterBody:
        "Receive updates about our projects, community stories, events and opportunities to get involved. We send occasional updates — never spam, and you can unsubscribe anytime.",
    },

    stats: [
      { id: "st-lives", value: 1000, suffix: "+", label: "Lives Reached", order: 1 },
      { id: "st-initiatives", value: 25, suffix: "+", label: "Community Initiatives", order: 2 },
      { id: "st-volunteers", value: 100, suffix: "+", label: "Volunteers", order: 3 },
      { id: "st-communities", value: 10, suffix: "+", label: "Communities Served", order: 4 },
    ],

    programs: [
      {
        id: "pg-health",
        slug: "health-and-wellbeing",
        name: "Health & Wellbeing",
        icon: "heart-pulse",
        summary:
          "Community health initiatives, health education, medical outreach and support for vulnerable people.",
        image: IMG.health,
        objectives: [
          "Improve access to basic health services in underserved communities",
          "Raise awareness on preventive health, nutrition and hygiene",
          "Support vulnerable individuals to reach and afford care",
          "Partner with local health facilities to extend their reach",
        ],
        activities: [
          "Mobile medical outreach camps with volunteer professionals",
          "Community health education walks and forums",
          "Maternal and child health support programs",
          "Donation drives for medical supplies and assistive devices",
        ],
        impactSummary:
          "Our outreach camps bring screening, health education and referrals directly to villages that are far from facilities — catching treatable conditions early and connecting families to care.",
        currentProjects: [
          "Mobile clinic days in partnership with area dispensaries",
          "Community health promoter training",
        ],
        gallery: [IMG.stethoscope, IMG.health, IMG.womanSmiling],
        published: true,
        order: 1,
      },
      {
        id: "pg-education",
        slug: "education",
        name: "Education",
        icon: "book-open",
        summary:
          "Supporting access to education, learning resources, mentorship and skills development.",
        image: IMG.classroomKids,
        objectives: [
          "Keep children in school by removing cost-related barriers",
          "Improve learning outcomes through resources and mentorship",
          "Equip young people with practical skills for life after school",
          "Support teachers and learning environments",
        ],
        activities: [
          "School fees and supplies support for vulnerable learners",
          "Mentorship and career guidance sessions",
          "Book and learning-material donations to schools",
          "Holiday tutoring and digital literacy intro classes",
        ],
        impactSummary:
          "From uniform drives to mentorship circles, we walk with learners through their whole school journey — because a child supported today becomes a community leader tomorrow.",
        currentProjects: [
          "Back-to-school supply drive",
          "School mentorship partnership program",
        ],
        gallery: [IMG.studentsWriting, IMG.library, IMG.pencils],
        published: true,
        order: 2,
      },
      {
        id: "pg-food",
        slug: "food-security",
        name: "Food Security",
        icon: "wheat",
        summary:
          "Food support, agricultural initiatives and sustainable community food programs.",
        image: IMG.foodDistribution,
        objectives: [
          "Meet immediate food needs of vulnerable families with dignity",
          "Promote kitchen gardening and climate-smart agriculture",
          "Build community-level food resilience against drought and shocks",
          "Reduce post-harvest losses through training and shared equipment",
        ],
        activities: [
          "Food basket distributions for identified households",
          "Community garden and greenhouse projects",
          "Farm inputs and conservation-agriculture training",
          "School feeding support in partner schools",
        ],
        impactSummary:
          "We pair short-term food relief with long-term agricultural capacity, so that a household supported today can feed itself tomorrow — and share with its neighbours.",
        currentProjects: [
          "Community seedling nursery",
          "Household kitchen garden rollout",
        ],
        gallery: [IMG.fieldCrops, IMG.vegetables, IMG.tomatoes],
        published: true,
        order: 3,
      },
      {
        id: "pg-youth",
        slug: "youth-empowerment",
        name: "Youth Empowerment",
        icon: "spark",
        summary:
          "Skills development, entrepreneurship, mentorship and opportunities for young people.",
        image: IMG.youthLaptop,
        objectives: [
          "Equip youth with market-relevant vocational and digital skills",
          "Nurture entrepreneurship and savings culture",
          "Connect young people to mentorship, internships and opportunity",
          "Create safe spaces for leadership and talent growth",
        ],
        activities: [
          "Vocational and digital skills bootcamps",
          "Business idea clinics and small-starter support",
          "Sports, arts and talent development meetups",
          "Peer mentorship and life-skills forums",
        ],
        impactSummary:
          "Young people are not future leaders — they are leaders now. Our youth programs turn energy into enterprise, talent into trade, and ideas into income.",
        currentProjects: ["Digital skills bootcamp cohort", "Youth boda & trades toolkit fund"],
        gallery: [IMG.gradStudents, IMG.gradJump, IMG.trainingWorkshop],
        published: true,
        order: 4,
      },
      {
        id: "pg-community",
        slug: "community-development",
        name: "Community Development",
        icon: "home-heart",
        summary:
          "Projects that improve communities and create sustainable opportunities.",
        image: IMG.communityPlanning,
        objectives: [
          "Co-create infrastructure and services communities actually need",
          "Strengthen local groups' ability to plan and lead development",
          "Improve access to clean water and sanitation where gaps exist",
          "Link communities to government and partner resources",
        ],
        activities: [
          "Water point rehabilitation and rainwater harvesting",
          "Community centre upgrades and safe spaces",
          "Leadership and governance training for local groups",
          "Participatory community needs assessments",
        ],
        impactSummary:
          "Every project begins with a community conversation and ends in community ownership. We facilitate; the community leads — that is how development sticks.",
        currentProjects: ["Safe space community hall upgrade", "Borehole rehabilitation partnership"],
        gallery: [IMG.teamHandsDesk, IMG.boardroom, IMG.stackedHands],
        published: true,
        order: 5,
      },
      {
        id: "pg-emergency",
        slug: "emergency-support",
        name: "Emergency Support",
        icon: "life-buoy",
        summary:
          "Rapid assistance for families and individuals facing urgent humanitarian challenges.",
        image: IMG.emergencyBox,
        objectives: [
          "Respond fast when crisis strikes a family or community",
          "Provide essentials with dignity — never as charity theatre",
          "Stabilise households after fire, flood, loss or displacement",
          "Rebuild toward resilience, not dependence",
        ],
        activities: [
          "Rapid assessment and response teams",
          "Essential hampers, shelter kits and clothing drives",
          "Referral pathways to specialised services",
          "Post-crisis follow-up and recovery support",
        ],
        impactSummary:
          "When a home burns or floods wash away a harvest, speed matters. Our community networks let us verify needs within hours and act within days.",
        currentProjects: ["Rapid response standby fund", "Fire recovery family resettlement support"],
        gallery: [IMG.emergencyBox, IMG.foodDistribution, IMG.handsPlant],
        published: true,
        order: 6,
      },
    ],

    projects: [
      {
        id: "prj-hope",
        slug: "project-hope",
        name: "Project Hope",
        programId: "pg-community",
        summary: "Building stronger communities, one family at a time.",
        description:
          "Project Hope is our flagship integrated community initiative. Working with four villages, we combine household economic strengthening, school support, community health outreach and water-point rehabilitation under one coordinated plan designed together with each community.\n\nRather than scattered one-off interventions, Project Hope builds a web of support around families: a child stays in school, a parent gains an income skill, a clinic day catches illness early, and clean water flows closer to home. Progress is tracked openly and shared with supporters.",
        location: "Kisumu County, Kenya",
        image: IMG.womanSmiling,
        gallery: [IMG.footballSunset, IMG.kidsRunning, IMG.kidsPlaying, IMG.teacherKids],
        peopleReached: 1240,
        progressPercent: 68,
        status: "active",
        featured: true,
        startDate: "2025-03",
        published: true,
      },
      {
        id: "prj-green-shamba",
        slug: "green-shamba",
        name: "Green Shamba Gardens",
        programId: "pg-food",
        summary: "Community gardens turning school compounds into food resilience hubs.",
        description:
          "Green Shamba establishes productive vegetable gardens on school and church land, run by trained community teams. Produce feeds school feeding programs first; surplus is sold locally with proceeds reinvested into seeds and tools.\n\nThe project doubles as an outdoor classroom where farmers learn water-wise agriculture techniques they replicate at home.",
        location: "Nakuru County, Kenya",
        image: IMG.fieldRows,
        gallery: [IMG.fieldCrops, IMG.tomatoes, IMG.vegetables],
        peopleReached: 320,
        progressPercent: 42,
        status: "active",
        featured: false,
        startDate: "2025-08",
        published: true,
      },
      {
        id: "prj-back-to-school",
        slug: "back-to-school-drive",
        name: "Back-to-School Drive",
        programId: "pg-education",
        summary: "Uniforms, books and fees support keeping 200+ learners in class.",
        description:
          "An annual drive that identifies learners at risk of dropping out and covers the gap — uniforms, shoes, books and levies — verified jointly with head teachers and local chiefs.\n\nThe completed pilot phase kept every supported learner in school through the year, with attendance tracking shared with partners.",
        location: "Machakos County, Kenya",
        image: IMG.studentsTable,
        gallery: [IMG.studentsWriting, IMG.pencils, IMG.library],
        peopleReached: 214,
        progressPercent: 100,
        status: "completed",
        featured: false,
        startDate: "2025-01",
        published: true,
      },
    ],

    stories: [
      {
        id: "sto-classroom",
        slug: "a-classroom-comes-back-to-life",
        title: "A Classroom Comes Back to Life",
        excerpt:
          "When three teachers left a rural primary school, enrolment collapsed. Two years later, the classrooms are full again — here is what changed.",
        body: [
          "By 2023, the upper primary classrooms at a partner school in Kakamega had emptied. Families had lost confidence, three teachers had been transferred, and several children had quietly dropped off the register.",
          "Working with the head teacher and parents' association, Hands of Hope supported a simple plan: restore learning materials, restart the school feeding porridge, and bring mentors in twice a month.",
          "Attendance climbed term by term. Teachers reported children staying late to read. When exam results improved, the community's belief returned with them.",
          "This account is an illustrative example prepared for demonstration. Verified, consented stories from the communities we serve will replace it as documentation is completed.",
        ],
        image: IMG.classroomKids,
        location: "Kakamega County",
        personName: undefined,
        impactAchieved: "Enrolment recovered; retention supported across two school years",
        category: "Education",
        sample: true,
        publishedAt: "2025-06-12",
        published: true,
      },
      {
        id: "sto-mobile-clinic",
        slug: "the-mobile-clinic-that-climbed-the-hill",
        title: "The Mobile Clinic That Climbed the Hill",
        excerpt:
          "For villagers on the far side of the ridge, the nearest dispensary meant a two-hour walk. A single outreach day changed what was possible.",
        body: [
          "On the far ridge of a partner village in Kitui, health care arrived once a year — if the roads allowed. Screening days elsewhere simply never reached here.",
          "In partnership with a local dispensary, our outreach team carried supplies up the hill and set up under a acacia tree: blood pressure checks, diabetes screening, deworming for children, and referrals for those who needed further care.",
          "Forty-three neighbours were seen in one day. Several silent conditions were caught early enough to treat. The community asked when we would return; the answer became a quarterly schedule.",
          "This account is an illustrative example prepared for demonstration. Verified, consented stories will replace it as documentation is completed.",
        ],
        image: IMG.stethoscope,
        location: "Kitui County",
        personName: undefined,
        impactAchieved: "43 neighbours screened in one day; quarterly outreach established",
        category: "Health & Wellbeing",
        sample: true,
        publishedAt: "2025-04-28",
        published: true,
      },
      {
        id: "sto-seedling-stall",
        slug: "from-seedling-to-stall",
        title: "From Seedling to Stall",
        excerpt:
          "A youth group borrowed a shovel and a seedling tray. Eighteen months later, their produce stall supplies half the trading centre.",
        body: [
          "It started with frustration — educated but idle young people watching lorries import vegetables their own county could grow.",
          "With training from our food security team and a starter kit of trays and tools, a group of nine began seedlings behind the church. The first season fed the church's children's program. The second filled a roadside stall.",
          "Today the group employs two casual workers during peak season and mentors a second group starting out. Their request to us now is not food aid — it is a grading scale and a market link.",
          "This account is an illustrative example prepared for demonstration. Verified, consented stories will replace it as documentation is completed.",
        ],
        image: IMG.fieldCrops,
        location: "Nakuru County",
        personName: undefined,
        impactAchieved: "Youth-run enterprise supplying local traders; second cohort mentored",
        category: "Food Security",
        sample: true,
        publishedAt: "2025-02-15",
        published: true,
      },
    ],

    team: [], // intentionally empty — profiles are added by administrators (never fabricated)

    partners: [], // intentionally empty — no fake logos are ever displayed

    events: [],

    products: [
      {
        id: "prd-tee",
        slug: "hope-tshirt",
        name: "Hope Signature Tee",
        description:
          "Soft, breathable cotton tee with the Hands of Hope mark stitched on the chest. Pre-shrunk and cut for everyday comfort — wear it on campus, at work or on outreach days. Every tee sparks conversations about the mission.",
        priceKes: 2500,
        priceUsd: 19,
        image: IMG.shopTee,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy", "White", "Black"],
        inStock: true,
        featured: true,
      },
      {
        id: "prd-hoodie",
        slug: "hope-hoodie",
        name: "Warmth Hoodie",
        description:
          "Heavyweight brushed-fleece hoodie with a lined hood, ribbed cuffs and a roomy kangaroo pocket. The embroidered rising-sun emblem sits over the heart. Warmth you wear — and warmth you give.",
        priceKes: 4500,
        priceUsd: 34,
        image: IMG.shopHoodie,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Charcoal"],
        inStock: true,
        featured: true,
      },
      {
        id: "prd-cap",
        slug: "hope-cap",
        name: "Rise Cap",
        description:
          "A classic six-panel cap with an adjustable strap and the Hands of Hope sun emblem up front. Shades your eyes during outreach days and carries the story everywhere you go.",
        priceKes: 1500,
        priceUsd: 12,
        image: IMG.shopCap,
        sizes: [],
        colors: ["Navy", "Black"],
        inStock: true,
        featured: false,
      },
      {
        id: "prd-tote",
        slug: "hope-tote",
        name: "Carry Hope Tote",
        description:
          "Sturdy natural canvas tote with reinforced stitching and comfortable carry handles. Strong enough for market runs, books and weekly shopping — and it says something hopeful while it works.",
        priceKes: 1200,
        priceUsd: 9,
        image: IMG.shopTote,
        sizes: [],
        colors: ["Natural"],
        inStock: true,
        featured: false,
      },
      {
        id: "prd-bottle",
        slug: "hope-bottle",
        name: "Flow Water Bottle",
        description:
          "500ml double-walled steel bottle that keeps water cold for hours. A practical daily companion that celebrates our clean-water initiatives — and helps cut down single-use plastic.",
        priceKes: 1000,
        priceUsd: 8,
        image: IMG.shopBottle,
        sizes: [],
        colors: ["Steel"],
        inStock: true,
        featured: false,
      },
      {
        id: "prd-pack",
        slug: "supporter-pack",
        name: "Supporter Pack",
        description:
          "Our best-value bundle: one Signature Tee, one Rise Cap and one Carry Hope Tote together. Everything you need to represent the mission — with maximum impact for our programs.",
        priceKes: 4800,
        priceUsd: 36,
        image: IMG.shopTeesStack,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Mixed"],
        inStock: true,
        featured: true,
      },
    ],

    reports: [
      {
        id: "rep-annual-2025",
        title: "Annual Report",
        category: "Annual Report",
        year: "2025",
        description:
          "A full narrative of the year's programs, partnerships and audited activity summaries.",
        availableOnRequest: true,
      },
      {
        id: "rep-financial-2025",
        title: "Financial Summary",
        category: "Financial Report",
        year: "2025",
        description:
          "Income and expenditure overview, prepared for accountability to donors and regulators.",
        availableOnRequest: true,
      },
      {
        id: "rep-governance-charter",
        title: "Governance Charter",
        category: "Governance",
        description:
          "Board composition, roles, meeting cadence and conflict-of-interest provisions.",
        availableOnRequest: true,
      },
      {
        id: "rep-registration",
        title: "Registration Information",
        category: "Registration",
        description:
          "Official registration details as issued by the relevant Kenyan authorities.",
        availableOnRequest: true,
      },
      {
        id: "rep-safeguarding",
        title: "Safeguarding Policy",
        category: "Policy",
        description:
          "Our commitment and procedures for protecting children and vulnerable adults in every activity.",
        availableOnRequest: true,
      },
      {
        id: "rep-privacy",
        title: "Privacy Policy",
        category: "Policy",
        description: "How we collect, use and protect personal information, including data protection compliance.",
        availableOnRequest: true,
      },
    ],

    enquiries: [],
    subscribers: [],
    volunteers: [],
    donations: [],
    orders: [],
    chats: [],
  };
}

export const seedMeta = { createdAt: now() };
