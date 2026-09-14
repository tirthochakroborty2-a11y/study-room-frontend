import { SAMPLE_COUPONS } from './constants';

// কুপন ভ্যালিডেট
export const validateCoupon = (code, courseId, currentPrice) => {
  if (!code) {
    return { valid: false, message: 'কুপন কোড দিন' };
  }

  const coupon = SAMPLE_COUPONS.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );

  if (!coupon) {
    return { valid: false, message: '❌ কুপন কোডটি সঠিক নয়' };
  }

  if (!coupon.active) {
    return { valid: false, message: '❌ কুপনটি বন্ধ করা হয়েছে' };
  }

  const today = new Date();
  const expiry = new Date(coupon.expiryDate);
  if (expiry < today) {
    return { valid: false, message: '❌ কুপনের মেয়াদ শেষ' };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return { valid: false, message: '❌ কুপনের লিমিট শেষ' };
  }

  if (coupon.courseIds.length > 0 && !coupon.courseIds.includes(courseId)) {
    return {
      valid: false,
      message: '❌ এই কোর্সে কুপনটি প্রযোজ্য নয়',
    };
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.round((currentPrice * coupon.discount) / 100);
  } else {
    discount = coupon.discount;
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `✅ ${coupon.discount}${coupon.type === 'percentage' ? '%' : '৳'} ছাড় পেয়েছেন!`,
  };
};

// Order ID generate
export const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SR-${timestamp}${random}`;
};
