// ==================== CATEGORIES ====================
export const CATEGORIES = {
  acs27: '📘 ACS 27',
  acs28: '📗 ACS 28',
  bp27: '📘 BP 27',
  bp28: '📗 BP 28',
  ft27: '📙 FT 27',
  admission: '🎯 এডমিশন',
  engineering: '🏛 ইঞ্জিনিয়ারিং',
  medical: '🏥 মেডিকেল',
  varsity: '🏛 ভার্সিটি',
  class10: '📚 ১০ম শ্রেণি',
  free: '🎁 ফ্রি কোর্স',
};

export const SUB_CATEGORIES = {
  physics: '⚛️ ফিজিক্স',
  chemistry: '🧪 কেমিস্ট্রি',
  biology: '🧬 জীববিজ্ঞান',
  math: '📐 গণিত',
  ict: '💻 আইসিটি',
};

// ==================== SAMPLE COURSES ====================
export const SAMPLE_COURSES = [
  {
    id: 1,
    name: 'ACS 27 - ফিজিক্স C1',
    category: 'acs27',
    subCategory: 'physics',
    price: 70,
    originalPrice: 100,
    duration: '৪ মাস',
    instructor: 'অপূর্ব ও মাশরুর',
    cycle: 'C1',
    type: 'paid',
    telegramLink: null,
    shortDesc: 'ACS 27 ফিজিক্স এর সম্পূর্ণ C1 সাইকেল কোর্স। বেসিক থেকে অ্যাডভান্সড।',
    fullDesc: 'এই কোর্সে ACS 27 সিলেবাসের সব ফিজিক্স টপিক কভার করা হয়েছে। লেকচার, প্র্যাকটিস, এবং লাইভ সাপোর্ট সহ।',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
  },
  {
    id: 2,
    name: 'ACS 27 - কেমিস্ট্রি C1',
    category: 'acs27',
    subCategory: 'chemistry',
    price: 70,
    originalPrice: 100,
    duration: '৪ মাস',
    instructor: 'অপূর্ব ও মাশরুর',
    cycle: 'C1',
    type: 'paid',
    telegramLink: null,
    shortDesc: 'ACS 27 কেমিস্ট্রি C1 সাইকেল। রসায়ন এর সব টপিক সহজে বুঝুন।',
    fullDesc: 'রসায়নের সব কঠিন টপিক সহজে বোঝার জন্য এই কোর্স। প্রতিটি অধ্যায়ের বিস্তারিত লেকচার।',
    image: 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=800',
  },
  {
    id: 3,
    name: 'ACS 27 - বায়োলজি C1',
    category: 'acs27',
    subCategory: 'biology',
    price: 70,
    originalPrice: 100,
    duration: '৪ মাস',
    instructor: 'মাশরুর',
    cycle: 'C1',
    type: 'paid',
    telegramLink: null,
    shortDesc: 'ACS 27 বায়োলজি C1। জীববিজ্ঞান এর সব টপিক বিস্তারিত।',
    fullDesc: 'জীববিজ্ঞান এর প্রতিটি টপিক অ্যানিমেশন সহ। বোর্ড ও ভর্তি পরীক্ষার জন্য perfect।',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800',
  },
  {
    id: 4,
    name: 'ACS 28 - হায়ার ম্যাথ C1',
    category: 'acs28',
    subCategory: 'math',
    price: 80,
    originalPrice: 120,
    duration: '৫ মাস',
    instructor: 'অপূর্ব',
    cycle: 'C1',
    type: 'paid',
    telegramLink: null,
    shortDesc: 'ACS 28 হায়ার ম্যাথ C1। ক্যালকুলাস, বীজগণিত সব একসাথে।',
    fullDesc: 'হায়ার ম্যাথের সব টপিক বিস্তারিত। প্রতিটি সমস্যার step-by-step solve।',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
  },
  {
    id: 5,
    name: 'ACS 28 - ফিজিক্স C1',
    category: 'acs28',
    subCategory: 'physics',
    price: 80,
    originalPrice: 120,
    duration: '৫ মাস',
    instructor: 'অপূর্ব',
    cycle: 'C1',
    type: 'paid',
    telegramLink: null,
    shortDesc: 'ACS 28 ফিজিক্স C1। মেকানিক্স থেকে মডার্ন ফিজিক্স পর্যন্ত।',
    fullDesc: 'ACS 28 ফিজিক্স এর সম্পূর্ণ সিলেবাস। লেকচার, নোটস, এবং প্র্যাকটিস শিট সহ।',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
  },
  {
    id: 6,
    name: 'ফ্রি - ফিজিক্স বেসিক',
    category: 'free',
    subCategory: 'physics',
    price: 0,
    originalPrice: 0,
    duration: '১ মাস',
    instructor: 'অপূর্ব',
    cycle: null,
    type: 'free',
    telegramLink: 'https://t.me/studyroom_free',
    shortDesc: 'সম্পূর্ণ ফ্রি ফিজিক্স বেসিক কোর্স। শুরু থেকে শিখুন।',
    fullDesc: 'ফিজিক্স এর বেসিক কনসেপ্ট সম্পূর্ণ ফ্রি। যেকোনো ক্লাসের ছাত্র-ছাত্রীর জন্য।',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
  },
  {
    id: 7,
    name: 'ফ্রি - কেমিস্ট্রি বেসিক',
    category: 'free',
    subCategory: 'chemistry',
    price: 0,
    originalPrice: 0,
    duration: '১ মাস',
    instructor: 'মাশরুর',
    cycle: null,
    type: 'free',
    telegramLink: 'https://t.me/studyroom_free',
    shortDesc: 'কেমিস্ট্রি বেসিক ফ্রি কোর্স। সহজে রসায়ন শিখুন।',
    fullDesc: 'কেমিস্ট্রি এর বেসিক সম্পূর্ণ ফ্রি। যেকোনো ক্লাসের ছাত্র-ছাত্রীর জন্য।',
    image: 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=800',
  },
  {
    id: 8,
    name: 'এডমিশন - ইংরেজি',
    category: 'admission',
    subCategory: null,
    price: 150,
    originalPrice: 200,
    duration: '৩ মাস',
    instructor: 'রাকিব',
    cycle: null,
    type: 'paid',
    telegramLink: null,
    shortDesc: 'ভার্সিটি ও মেডিকেল এডমিশন টেস্টের জন্য ইংরেজি প্রস্তুতি।',
    fullDesc: 'এডমিশন টেস্টে ইংরেজি এর সব টপিক। Grammar থেকে Vocabulary পর্যন্ত।',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
  },
];

// ==================== PRIORITY COURSES (Home এ দেখাবে) ====================
export const PRIORITY_COURSE_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

// ==================== COUPONS ====================
export const SAMPLE_COUPONS = [
  {
    code: 'STUDY20',
    discount: 20,
    type: 'percentage',
    courseIds: [],
    maxUses: 1000,
    usedCount: 0,
    expiryDate: '2026-12-31',
    active: true,
  },
  {
    code: 'PHY20',
    discount: 20,
    type: 'percentage',
    courseIds: [1, 2, 5],
    maxUses: 500,
    usedCount: 0,
    expiryDate: '2026-12-31',
    active: true,
  },
];

// ==================== ADMIN EMAILS ====================
export const ADMIN_EMAILS = ['admin@studyroom.com'];

// ==================== FORMAT HELPERS ====================
export const formatPrice = (price) => {
  return `৳${price}`;
};

export const toBanglaNumber = (num) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => banglaDigits[d]);
};
