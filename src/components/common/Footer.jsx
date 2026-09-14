import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#2D2D3F',
      color: 'rgba(255,255,255,0.7)',
      padding: '60px 0 20px',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>
              📚 স্টাডি রুম
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.8' }}>
              আপনার স্বপ্ন পূরণের যাত্রা শুরু হোক আজই। আমাদের কোর্সের মাধ্যমে সহজে শিখুন, দক্ষ হোন।
            </p>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px',
              position: 'relative',
              paddingBottom: '10px',
            }}>
              কুইক লিংক
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '40px',
                height: '3px',
                background: '#6C63FF',
              }} />
            </h4>
            <Link to="/" style={{ display: 'block', padding: '6px 0', fontSize: '14px' }}>হোম</Link>
            <Link to="/courses" style={{ display: 'block', padding: '6px 0', fontSize: '14px' }}>কোর্স</Link>
            <Link to="/about" style={{ display: 'block', padding: '6px 0', fontSize: '14px' }}>অ্যাবাউট</Link>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px',
              position: 'relative',
              paddingBottom: '10px',
            }}>
              ক্যাটাগরি
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '40px',
                height: '3px',
                background: '#6C63FF',
              }} />
            </h4>
            <Link to="/courses" style={{ display: 'block', padding: '6px 0', fontSize: '14px' }}>ACS 27</Link>
            <Link to="/courses" style={{ display: 'block', padding: '6px 0', fontSize: '14px' }}>ACS 28</Link>
            <Link to="/courses" style={{ display: 'block', padding: '6px 0', fontSize: '14px' }}>এডমিশন</Link>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px',
              position: 'relative',
              paddingBottom: '10px',
            }}>
              যোগাযোগ
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '40px',
                height: '3px',
                background: '#6C63FF',
              }} />
            </h4>
            <p style={{ padding: '6px 0', fontSize: '14px' }}>📧 support@studyroom.com</p>
            <p style={{ padding: '6px 0', fontSize: '14px' }}>📱 +880 1703 238035</p>
            <p style={{ padding: '6px 0', fontSize: '14px' }}>📍 ঢাকা, বাংলাদেশ</p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '14px',
        }}>
          © ২০২৬ স্টাডি রুম। সব অধিকার সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};

export default Footer;
