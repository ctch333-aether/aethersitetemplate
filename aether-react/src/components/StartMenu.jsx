/**
 * AETHER React - Start Menu Component
 * Windows 95 style start menu with navigation items
 */

function StartMenu({ isOpen, onItemClick, onClose }) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'ethos', icon: 'E', label: 'ETHOS - Vision & Authority' },
    { id: 'pathos', icon: 'P', label: 'PATHOS - Emotional Impact' },
    { id: 'logos', icon: 'L', label: 'LOGOS - Technical Systems' },
    { id: 'divider', divider: true },
    { id: 'about', icon: 'i', label: 'About AETHER' },
    { id: 'portfolio', icon: 'W', label: 'Portfolio' },
    { id: 'contact', icon: '@', label: 'Contact Us' },
  ];

  return (
    <>
      {/* Backdrop to close menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1999,
        }}
        onClick={onClose}
      />

      <div className="start-menu show">
        {/* Left sidebar with AETHER branding */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '24px',
            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '8px',
          }}
        >
          <span
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            AETHER
          </span>
        </div>

        <div className="menu-items" style={{ marginLeft: '24px' }}>
          {menuItems.map((item) => {
            if (item.divider) {
              return (
                <div
                  key={item.id}
                  style={{
                    height: '1px',
                    background: '#808080',
                    margin: '4px 8px',
                    borderBottom: '1px solid #ffffff',
                  }}
                />
              );
            }

            return (
              <div
                key={item.id}
                className="menu-item"
                onClick={() => onItemClick(item.id)}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#667eea',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default StartMenu;
