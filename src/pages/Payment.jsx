import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Send, ArrowLeft, Copy, X, Gift, Clock, User,
  Phone, FileText, CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { validateCoupon } from '../utils/couponUtils';
import { createOrder, sendTelegramNotification } from '../api/orderApi';

const PAYMENT_NUMBER = '01703238035';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { getCourseById } = useCourses();

  const courseId = parseInt(searchParams.get('id'));
  const course = getCourseById(courseId);

  const [method, setMethod] = useState('bKash');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (userData?.phone) setSenderNumber(userData.phone);
  }, [userData]);

  if (!course) {
    return (
      <section style={{ padding: '120px 20px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>😕</div>
        <h2 style={{ fontSize: '22px', color: '#2D2D3F', marginBottom: '20px' }}>
          কোর্স খুঁজে পাওয়া যায়নি
        </h2>
        <Link to="/courses" style={{
          padding: '14px 40px',
          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          color: 'white',
          borderRadius: '50px',
          fontSize: '15px',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          ← সব কোর্সে ফিরুন
        </Link>
      </section>
    );
  }

  const isFree = course.type === 'free';
  const finalPrice = Math.max(0, course.price - discount);

  const copyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    toast.success('নম্বর কপি হয়েছে!');
  };

  // Synchronous coupon validation (GitHub ছাড়া)
  const handleApplyCoupon = () => {
    const result = validateCoupon(couponInput, course.id, course.price);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      setDiscount(result.discount);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponInput('');
    toast.success('কুপন সরানো হয়েছে');
  };

  const validateForm = () => {
    if (!telegramUsername.trim()) {
      toast.error('টেলিগ্রাম ইউজারনেম দিন');
      return false;
    }
    if (!senderNumber.trim() || senderNumber.length !== 11) {
      toast.error('১১ ডিজিটের নম্বর দিন');
      return false;
    }
    if (!trxId.trim() || trxId.length < 6) {
      toast.error('Transaction ID কমপক্ষে ৬ অক্ষর');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const cleanUsername = telegramUsername.startsWith('@')
      ? telegramUsername
      : '@' + telegramUsername;

    const orderPayload = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL,
      courseId: course.id,
      courseName: course.name,
      coursePrice: course.price,
      couponCode: appliedCoupon?.code || null,
      discount: discount,
      finalPrice: isFree ? 0 : finalPrice,
      paymentMethod: method,
      senderNumber,
      trxId: trxId.toUpperCase(),
      telegramUsername: cleanUsername,
    };

    const result = await createOrder(orderPayload);

    if (result.success) {
      await sendTelegramNotification({ ...orderPayload, orderId: result.orderId });
      setSuccess({ orderId: result.orderId, courseName: course.name });
      toast.success('অনুরোধ সফলভাবে পাঠানো হয়েছে! 🎉');
    } else {
      toast.error('অনুরোধ পাঠাতে সমস্যা হয়েছে');
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <section style={{
        padding: '120px 20px 80px',
        minHeight: '100vh',
        background: '#F8F9FE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '50px 40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(108, 99, 255, 0.12)',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <CheckCircle2 size={80} color="#22c55e" />
          </div>
          <h3 style={{ fontSize: '26px', fontWeight: '700', color: '#22c55e', marginBottom: '12px' }}>
            অনুরোধ সফল!
          </h3>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.7', marginBottom: '8px' }}>
            আপনার অনুরোধ অ্যাডমিনের কাছে পাঠানো হয়েছে।
          </p>
          <p style={{
            fontSize: '13px', color: '#6C63FF', fontWeight: '600',
            marginBottom: '30px', padding: '10px',
            background: '#EEF2FF', borderRadius: '10px',
          }}>
            Order ID: {success.orderId}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/my-courses" style={{
              padding: '14px 30px',
              background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white', borderRadius: '50px',
              fontSize: '15px', fontWeight: '600',
              textDecoration: 'none',
            }}>
              📚 আমার কোর্স দেখুন
            </Link>
            <Link to="/courses" style={{
              padding: '12px 30px', background: 'transparent',
              color: '#6C63FF', border: '2px solid #6C63FF',
              borderRadius: '50px', fontSize: '15px', fontWeight: '600',
              textDecoration: 'none',
            }}>
              ← কোর্স পেজে ফিরুন
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{
      padding: '100px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <Link to={`/course/${course.id}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#6C63FF', fontSize: '14px', fontWeight: '500',
          marginBottom: '20px', textDecoration: 'none',
        }}>
          <ArrowLeft size={16} /> কোর্সে ফিরুন
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px', maxWidth: '1000px', margin: '0 auto',
        }}>
          {/* LEFT */}
          <div style={{
            background: 'white', borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(108, 99, 255, 0.12)', height: 'fit-content',
          }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img
                src={course.image}
                alt={course.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x300/6C63FF/FFFFFF?text=Study+Room';
                }}
              />
            </div>
            <div style={{ padding: '24px' }}>
              <span style={{
                display: 'inline-block', padding: '4px 12px', background: '#EEF2FF',
                color: '#6C63FF', borderRadius: '50px', fontSize: '11px',
                fontWeight: '700', marginBottom: '10px',
              }}>
                {CATEGORIES[course.category] || course.category}
              </span>
              <h2 style={{
                fontSize: '20px', fontWeight: '700', color: '#2D2D3F',
                marginBottom: '14px', lineHeight: '1.3',
              }}>
                {course.name}
              </h2>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', background: '#F8F9FE',
                  borderRadius: '50px', fontSize: '12px', color: '#6B7280',
                }}>
                  <Clock size={12} /> {course.duration}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', background: '#F8F9FE',
                  borderRadius: '50px', fontSize: '12px', color: '#6B7280',
                }}>
                  <User size={12} /> {course.instructor}
                </span>
              </div>

              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#6B7280' }}>আসল দাম:</span>
                  <span style={{ color: '#2D2D3F', fontWeight: '600' }}>৳{course.price}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#6B7280' }}>ছাড়:</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>-৳{discount}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  paddingTop: '10px', borderTop: '1px dashed #6C63FF',
                  fontSize: '18px', fontWeight: '800',
                }}>
                  <span style={{ color: '#2D2D3F' }}>সর্বমোট:</span>
                  <span style={{ color: '#6C63FF' }}>৳{finalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '28px',
            boxShadow: '0 10px 40px rgba(108, 99, 255, 0.12)',
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#2D2D3F', marginBottom: '6px' }}>
              💳 পেমেন্ট করুন
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>
              নিচের তথ্য পূরণ করুন
            </p>

            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              border: '2px dashed #6C63FF', borderRadius: '12px',
              textAlign: 'center', marginBottom: '20px',
            }}>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                📞 পেমেন্ট করতে এই নম্বরে সেন্ড মানি করুন
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                padding: '8px 20px', background: 'white', borderRadius: '50px',
                boxShadow: '0 4px 12px rgba(108, 99, 255, 0.15)',
              }}>
                <span style={{
                  fontSize: '22px', fontWeight: '800',
                  color: '#6C63FF', letterSpacing: '1.5px',
                }}>
                  {PAYMENT_NUMBER}
                </span>
                <button
                  type="button"
                  onClick={copyNumber}
                  style={{
                    background: '#6C63FF', color: 'white', border: 'none',
                    borderRadius: '50%', width: '32px', height: '32px',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <label style={{
              display: 'block', fontSize: '13px', fontWeight: '600',
              color: '#2D2D3F', marginBottom: '8px',
            }}>
              পেমেন্ট মেথড
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {['bKash', 'Nagad'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  style={{
                    flex: 1, padding: '12px 20px',
                    background: method === m ? '#6C63FF' : 'white',
                    color: method === m ? 'white' : '#6B7280',
                    border: `2px solid ${method === m ? '#6C63FF' : '#E5E7EB'}`,
                    borderRadius: '50px', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📱 {m}
                </button>
              ))}
            </div>

            <div style={{
              padding: '16px',
              background: appliedCoupon ? '#DCFCE7' : '#FFF9E6',
              border: `2px dashed ${appliedCoupon ? '#22c55e' : '#FFC857'}`,
              borderRadius: '12px', marginBottom: '20px',
            }}>
              {appliedCoupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Gift size={20} color="#22c55e" />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#166534' }}>
                        {appliedCoupon.code}
                      </div>
                      <div style={{ fontSize: '12px', color: '#166534' }}>
                        ৳{discount} সাশ্রয়
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: '#ef4444', color: 'white', border: 'none',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '10px', fontSize: '14px',
                    fontWeight: '600', color: '#92400e',
                  }}>
                    <Gift size={16} /> কুপন কোড আছে?
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="STUDY20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{
                        flex: 1, padding: '10px 14px',
                        border: '1px solid #E5E7EB', borderRadius: '10px',
                        fontSize: '13px', textTransform: 'uppercase',
                        outline: 'none', fontWeight: '600',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      style={{
                        padding: '10px 20px', background: '#FFC857',
                        color: '#2D2D3F', border: 'none',
                        borderRadius: '10px', fontSize: '13px',
                        fontWeight: '700', cursor: 'pointer',
                      }}
                    >
                      প্রয়োগ
                    </button>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', fontWeight: '600',
                  color: '#2D2D3F', marginBottom: '6px',
                }}>
                  <Send size={14} color="#6C63FF" /> টেলিগ্রাম ইউজারনেম *
                </label>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val && !val.startsWith('@')) val = '@' + val.replace(/@/g, '');
                    setTelegramUsername(val);
                  }}
                  placeholder="@your_username"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '2px solid #E5E7EB', borderRadius: '10px',
                    fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', fontWeight: '600',
                  color: '#2D2D3F', marginBottom: '6px',
                }}>
                  <Phone size={14} color="#6C63FF" /> সেন্ডার নম্বর *
                </label>
                <input
                  type="tel"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="017XXXXXXXX"
                  maxLength={11}
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '2px solid #E5E7EB', borderRadius: '10px',
                    fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', fontWeight: '600',
                  color: '#2D2D3F', marginBottom: '6px',
                }}>
                  <FileText size={14} color="#6C63FF" /> ট্রানজেকশন আইডি *
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder="TRX123456"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '2px solid #E5E7EB', borderRadius: '10px',
                    fontSize: '14px', outline: 'none',
                    textTransform: 'uppercase', fontWeight: '600',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', padding: '16px',
                  background: submitting ? '#9CA3AF' : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                  color: 'white', border: 'none', borderRadius: '50px',
                  fontSize: '16px', fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {submitting ? '⏳ পাঠানো হচ্ছে...' : '📨 রিকোয়েস্ট সেন্ড করুন'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
