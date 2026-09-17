import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// ==================== FULL TRANSLATIONS ====================
export const translations = {
  bn: {
    // Header
    home: 'হোম',
    courses: 'কোর্স',
    about: 'অ্যাবাউট',
    myCourses: 'আমার কোর্স',
    discussion: '💬 Discussion',
    support: '🆘 Support',
    login: 'লগইন',
    logout: 'লগআউট',
    adminPanel: '👑 Admin Panel',
    orderHistory: 'অর্ডার হিস্ট্রি',
    notifications: 'নোটিফিকেশন',
    
    // Home Page
    welcome: 'স্বাগতম স্টাডি রুমে',
    heroTitle1: 'আপনার স্বপ্ন পূরণের',
    heroTitle2: 'যাত্রা শুরু হোক আজই',
    heroDesc: 'আমাদের কোর্সের মাধ্যমে সহজে শিখুন, দক্ষ হোন, সফল হোন। ACS 27, ACS 28, এডমিশন সহ আরো অনেক কোর্স।',
    browseCourses: '🔍 ব্রাউজ কোর্স',
    popularCourses: '🔥 জনপ্রিয় কোর্স',
    popularDesc: 'শিক্ষার্থীদের সবচেয়ে পছন্দের কোর্সগুলো',
    seeAllCourses: 'সব কোর্স দেখুন',
    loading: 'লোড হচ্ছে...',
    noCourses: 'এখনো কোনো কোর্স যোগ করা হয়নি',
    
    // Courses Page
    filter: 'ফিল্টার',
    type: 'টাইপ',
    all: 'সব',
    paid: '💳 পেইড',
    free: '🎁 ফ্রি',
    category: 'ক্যাটাগরি',
    subCategory: 'সাবজেক্ট',
    filterReset: '✕ ফিল্টার রিসেট',
    coursesFound: 'টি কোর্স পাওয়া গেছে',
    noCoursesFound: 'কোনো কোর্স পাওয়া যায়নি',
    tryOtherFilters: 'অন্য ফিল্টার দিয়ে চেষ্টা করুন',
    
    // Course Card
    details: '📖 বিস্তারিত',
    buyNow: '🛒 কিনুন',
    joinNow: '📢 জয়েন',
    
    // Course Details
    fullDesc: '📄 বিস্তারিত বর্ণনা',
    buyNowBtn: '🛒 এখনই কিনুন',
    joinFreeBtn: '📢 জয়েন করুন (ফ্রি)',
    courseIncludes: '📋 কোর্সে যা যা পাবেন',
    liveClass: 'YouTube + Telegram Live Class',
    slides: 'Lecture Slides (PDF)',
    practice: 'Practice Sheets + Solutions',
    support24: '24/7 Support',
    lifetime: 'Lifetime Access',
    archive: 'Archive Classes',
    backToCourses: '← সব কোর্স দেখুন',
    courseNotFound: 'কোর্সটি খুঁজে পাওয়া যায়নি',
    
    // Payment
    payment: '💳 পেমেন্ট করুন',
    fillInfo: 'নিচের তথ্য পূরণ করুন',
    sendMoney: '📞 পেমেন্ট করতে এই নম্বরে সেন্ড মানি করুন',
    bKashNagad: '⚠️ বিকাশ / নগদ - সেন্ড মানি',
    paymentMethod: 'পেমেন্ট মেথড',
    haveCoupon: '🎟️ কুপন কোড আছে?',
    apply: 'প্রয়োগ',
    telegramUsername: '📱 টেলিগ্রাম ইউজারনেম',
    usernameHelp: 'অ্যাডমিন আপনাকে এই ইউজারনেমে যোগাযোগ করবেন',
    senderNumber: '📱 সেন্ডার নম্বর',
    senderHelp: 'যে নম্বর থেকে টাকা পাঠিয়েছেন',
    trxId: '🧾 ট্রানজেকশন আইডি',
    trxHelp: 'বিকাশ/নগদ থেকে পাওয়া TRX ID',
    sendRequest: '📨 রিকোয়েস্ট সেন্ড করুন',
    sending: '⏳ পাঠানো হচ্ছে...',
    originalPrice: 'আসল দাম',
    discount: 'ছাড়',
    totalPrice: 'সর্বমোট',
    success: '✅ অনুরোধ সফল!',
    successMsg: 'আপনার অনুরোধ অ্যাডমিনের কাছে পাঠানো হয়েছে।',
    myCoursesBtn: '📚 আমার কোর্স দেখুন',
    backToCoursesBtn: '← কোর্স পেজে ফিরুন',
    
    // My Courses
    myCoursesTitle: '📚 আমার কোর্সসমূহ',
    myCoursesDesc: 'আপনার সব কোর্স এবং অর্ডারের তালিকা',
    pending: '⏳ পেন্ডিং',
    approved: '✅ Approved',
    rejected: '❌ Rejected',
    noCoursesYet: 'এখনো কোনো কোর্স কেনা হয়নি',
    browseCoursesBtn: '📚 কোর্স ব্রাউজ করুন',
    orderId: '🧾 Order',
    price: '💰 দাম',
    coupon: '🎟️ কুপন',
    date: '📅 তারিখ',
    approvedMsg: '✅ Approved হয়েছে!',
    rejectedMsg: '❌ Rejected',
    pendingMsg: '⏳ অপেক্ষা করুন',
    classBtn: '🎓 ক্লাস করুন',
    telegramJoin: '📢 টেলিগ্রামে জয়েন করুন',
    viewDetails: '📖 বিস্তারিত দেখুন',
    
    // Class Page
    classTitle: 'ক্লাস',
    chapterList: 'কোর্স কনটেন্ট',
    nowPlaying: 'এখন চলছে',
    complete: 'সম্পূর্ণ',
    completed: 'Complete',
    prev: '← Previous',
    next: 'Next →',
    progress: 'Progress',
    chapters: 'Chapter',
    classes: 'Class',
    noClassesYet: 'এখনো কোনো Class যোগ করা হয়নি',
    
    // Discussion
    discussionTitle: '💬 Discussion',
    discussionDesc: 'সবাই একসাথে কথা বলুন, প্রশ্ন করুন',
    newPost: '➕ নতুন Post',
    searchPosts: '🔍 Post খুঁজুন...',
    noPostYet: 'কোনো Post নেই',
    firstPost: 'প্রথম Post করুন!',
    writeComment: 'কমেন্ট লিখুন...',
    reply: 'Reply',
    post: 'Post করুন',
    title: 'শিরোনাম',
    content: 'বিস্তারিত',
    categoryLabel: 'ক্যাটাগরি',
    general: 'সাধারণ',
    help: 'সাহায্য',
    exam: 'পরীক্ষা',
    tips: 'টিপস',
    
    // Support
    supportTitle: '🆘 Support',
    supportDesc: 'Admin এর সাথে চ্যাট',
    welcomeSupport: 'স্বাগতম!',
    supportHelpMsg: 'আপনার প্রশ্ন বা সমস্যা লিখুন',
    typeMessage: 'Message লিখুন...',
    refresh: 'রিফ্রেশ',
    
    // Order History
    orderHistoryTitle: '📦 Order History',
    orderHistoryDesc: 'আপনার সব Order এক জায়গায়',
    noOrdersYet: 'কোনো Order নেই',
    buyCoursePrompt: 'Course কিনলে এখানে দেখা যাবে',
    seeCourses: '📚 Course দেখুন',
    
    // Admin Panel
    dashboard: 'ড্যাশবোর্ড',
    orders: 'অর্ডারসমূহ',
    users: 'ইউজারসমূহ',
    adminCourses: 'কোর্সসমূহ',
    adminClasses: 'ক্লাসসমূহ',
    adminSupport: 'Support',
    backToSite: '← সাইটে ফিরুন',
    
    // Notifications
    notificationsTitle: '🔔 Notifications',
    markAllRead: 'সব Read করুন',
    noNotifications: 'কোনো Notification নেই',
    markRead: 'Read',
    delete: 'Delete',
    view: 'দেখুন →',
    
    // Common
    save: 'সেভ',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত',
    edit: 'এডিট',
    add: 'যোগ করুন',
    deleteBtn: '🗑️ Delete',
    close: 'বন্ধ করুন',
    search: 'খুঁজুন',
    loadingMsg: 'লোড হচ্ছে...',
    noData: 'তথ্য নেই',
  },
  
  en: {
    // Header
    home: 'Home',
    courses: 'Courses',
    about: 'About',
    myCourses: 'My Courses',
    discussion: '💬 Discussion',
    support: '🆘 Support',
    login: 'Login',
    logout: 'Logout',
    adminPanel: '👑 Admin Panel',
    orderHistory: 'Order History',
    notifications: 'Notifications',
    
    // Home Page
    welcome: 'Welcome to Study Room',
    heroTitle1: 'Start Your Journey',
    heroTitle2: 'to Fulfill Your Dreams',
    heroDesc: 'Learn easily, become skilled, and succeed through our courses. ACS 27, ACS 28, Admission, and many more.',
    browseCourses: '🔍 Browse Courses',
    popularCourses: '🔥 Popular Courses',
    popularDesc: 'Most favorite courses of students',
    seeAllCourses: 'See All Courses',
    loading: 'Loading...',
    noCourses: 'No courses added yet',
    
    // Courses Page
    filter: 'Filter',
    type: 'Type',
    all: 'All',
    paid: '💳 Paid',
    free: '🎁 Free',
    category: 'Category',
    subCategory: 'Subject',
    filterReset: '✕ Reset Filter',
    coursesFound: 'courses found',
    noCoursesFound: 'No courses found',
    tryOtherFilters: 'Try other filters',
    
    // Course Card
    details: '📖 Details',
    buyNow: '🛒 Buy Now',
    joinNow: '📢 Join',
    
    // Course Details
    fullDesc: '📄 Full Description',
    buyNowBtn: '🛒 Buy Now',
    joinFreeBtn: '📢 Join Now (Free)',
    courseIncludes: '📋 Course Includes',
    liveClass: 'YouTube + Telegram Live Class',
    slides: 'Lecture Slides (PDF)',
    practice: 'Practice Sheets + Solutions',
    support24: '24/7 Support',
    lifetime: 'Lifetime Access',
    archive: 'Archive Classes',
    backToCourses: '← See All Courses',
    courseNotFound: 'Course not found',
    
    // Payment
    payment: '💳 Payment',
    fillInfo: 'Fill in the information below',
    sendMoney: '📞 Send Money to this number for payment',
    bKashNagad: '⚠️ bKash / Nagad - Send Money',
    paymentMethod: 'Payment Method',
    haveCoupon: '🎟️ Have a coupon code?',
    apply: 'Apply',
    telegramUsername: '📱 Telegram Username',
    usernameHelp: 'Admin will contact you at this username',
    senderNumber: '📱 Sender Number',
    senderHelp: 'The number you sent money from',
    trxId: '🧾 Transaction ID',
    trxHelp: 'TRX ID from bKash/Nagad',
    sendRequest: '📨 Send Request',
    sending: '⏳ Sending...',
    originalPrice: 'Original Price',
    discount: 'Discount',
    totalPrice: 'Total Price',
    success: '✅ Request Successful!',
    successMsg: 'Your request has been sent to admin.',
    myCoursesBtn: '📚 View My Courses',
    backToCoursesBtn: '← Back to Courses',
    
    // My Courses
    myCoursesTitle: '📚 My Courses',
    myCoursesDesc: 'List of all your courses and orders',
    pending: '⏳ Pending',
    approved: '✅ Approved',
    rejected: '❌ Rejected',
    noCoursesYet: 'No courses purchased yet',
    browseCoursesBtn: '📚 Browse Courses',
    orderId: '🧾 Order',
    price: '💰 Price',
    coupon: '🎟️ Coupon',
    date: '📅 Date',
    approvedMsg: '✅ Approved!',
    rejectedMsg: '❌ Rejected',
    pendingMsg: '⏳ Please wait',
    classBtn: '🎓 Start Class',
    telegramJoin: '📢 Join Telegram',
    viewDetails: '📖 View Details',
    
    // Class Page
    classTitle: 'Class',
    chapterList: 'Course Content',
    nowPlaying: 'Now Playing',
    complete: 'Complete',
    completed: 'Completed',
    prev: '← Previous',
    next: 'Next →',
    progress: 'Progress',
    chapters: 'Chapter',
    classes: 'Class',
    noClassesYet: 'No classes added yet',
    
    // Discussion
    discussionTitle: '💬 Discussion',
    discussionDesc: 'Talk together, ask questions',
    newPost: '➕ New Post',
    searchPosts: '🔍 Search posts...',
    noPostYet: 'No posts yet',
    firstPost: 'Be the first to post!',
    writeComment: 'Write a comment...',
    reply: 'Reply',
    post: 'Post',
    title: 'Title',
    content: 'Content',
    categoryLabel: 'Category',
    general: 'General',
    help: 'Help',
    exam: 'Exam',
    tips: 'Tips',
    
    // Support
    supportTitle: '🆘 Support',
    supportDesc: 'Chat with Admin',
    welcomeSupport: 'Welcome!',
    supportHelpMsg: 'Write your question or problem',
    typeMessage: 'Type a message...',
    refresh: 'Refresh',
    
    // Order History
    orderHistoryTitle: '📦 Order History',
    orderHistoryDesc: 'All your orders in one place',
    noOrdersYet: 'No orders yet',
    buyCoursePrompt: 'Purchased courses will appear here',
    seeCourses: '📚 See Courses',
    
    // Admin Panel
    dashboard: 'Dashboard',
    orders: 'Orders',
    users: 'Users',
    adminCourses: 'Courses',
    adminClasses: 'Classes',
    adminSupport: 'Support',
    backToSite: '← Back to Site',
    
    // Notifications
    notificationsTitle: '🔔 Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications',
    markRead: 'Read',
    delete: 'Delete',
    view: 'View →',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    edit: 'Edit',
    add: 'Add',
    deleteBtn: '🗑️ Delete',
    close: 'Close',
    search: 'Search',
    loadingMsg: 'Loading...',
    noData: 'No data',
  },
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#0F0F1E';
      document.body.style.color = '#F3F4F6';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.background = '#F8F9FE';
      document.body.style.color = '#2D2D3F';
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === 'bn' ? 'en' : 'bn');
  const t = (key) => translations[language][key] || key;

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
