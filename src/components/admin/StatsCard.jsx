const StatsCard = ({ icon, label, value, color, bg, trend }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
      transition: 'all 0.3s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 20px 50px rgba(108, 99, 255, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 40px rgba(108, 99, 255, 0.08)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: trend.positive ? '#22c55e' : '#ef4444',
            background: trend.positive ? '#DCFCE7' : '#FEE2E2',
            padding: '4px 10px',
            borderRadius: '50px',
          }}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      <p style={{
        fontSize: '13px',
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: '6px',
      }}>
        {label}
      </p>
      <h3 style={{
        fontSize: '28px',
        fontWeight: '800',
        color: '#2D2D3F',
        lineHeight: '1.2',
      }}>
        {value}
      </h3>
    </div>
  );
};

export default StatsCard;
