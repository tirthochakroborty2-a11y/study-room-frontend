import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, BookOpen, ArrowLeft } from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { to: '/admin', label: 'ড্যাশবোর্ড', icon: <LayoutDashboard size={20} />, end: true },
    { to: '/admin/orders', label: 'অর্ডারসমূহ', icon: <ShoppingBag size={20} /> },
    { to: '/admin/users', label: 'ইউজারসমূহ', icon: <Users size={20} /> },
    { to: '/admin/courses', label: 'কোর্সসমূহ', icon: <BookOpen size={20} /> },
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 10px 40px rgba(108, 99, 255, 0.10)',
      height: 'fit-content',
      position: 'sticky',
      top: '90px',
    }} className="admin-sidebar">
      <div style={{
        paddingBottom: '16px',
        marginBottom: '16px',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <h3 style={{
          fontSize: '13px',
          color: '#6B7280',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          👑 Admin Panel
        </h3>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              color: isActive ? 'white' : '#2D2D3F',
              background: isActive
                ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.3s',
              boxShadow: isActive
                ? '0 8px 20px rgba(108, 99, 255, 0.25)'
                : 'none',
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #E5E7EB',
      }}>
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#6B7280',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> সাইটে ফিরুন
        </NavLink>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .admin-sidebar {
            width: 100% !important;
            position: static !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
