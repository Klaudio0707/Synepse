import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Monitor, User, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Função para ler o usuário do localStorage
  const checkUser = () => {
    const savedUser = localStorage.getItem('synapse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser(); // Checa ao carregar

    // Ouve o evento personalizado de Login
    window.addEventListener('loginStateChange', checkUser);
    
    // Ouve o evento de Storage (caso mude em outra aba)
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('loginStateChange', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, [location]);

  const irPara = (rota: string) => {
    navigate(rota);
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000, background: '#2c3e50', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
        >
          <Menu size={24} />
        </button>
      )}

      <div style={{
        position: 'fixed', top: 0, left: isOpen ? 0 : '-300px',
        width: '250px', height: '100vh', background: '#34495e',
        color: 'white', transition: '0.3s', zIndex: 1001,
        boxShadow: isOpen ? '4px 0 15px rgba(0,0,0,0.3)' : 'none',
        display: 'flex', flexDirection: 'column', padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Synapse</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <ItemMenu icon={<Home size={20}/>} text="Totem (Início)" onClick={() => irPara('/')} />
          <ItemMenu icon={<Monitor size={20}/>} text="Painel TV" onClick={() => irPara('/painel')} />
          {!user && <ItemMenu icon={<LogIn size={20}/>} text="Login Médico" onClick={() => irPara('/admin')} />}
        </div>

        {user && (
          <>
            <hr style={{ width: '100%', borderColor: '#7f8c8d', margin: '20px 0' }} />
            <p style={{ fontSize: '0.8rem', color: '#bdc3c7', marginBottom: '10px' }}>ÁREA RESTRITA</p>
            <ItemMenu icon={<User size={20}/>} text="Atendimento" onClick={() => irPara('/admin')} />
            <ItemMenu icon={<LayoutDashboard size={20}/>} text="Dashboard" onClick={() => irPara('/dashboard')} />
            <ItemMenu icon={<UserPlus size={20}/>} text="Cadastrar Usuário" onClick={() => irPara('/cadastro')} />
            <div style={{ marginTop: 'auto' }}>
               <p style={{ fontSize: '0.9rem' }}>Logado como: <br/><strong>{(user as any).usuarioNome}</strong></p>
            </div>
          </>
        )}
      </div>

      {isOpen && <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />}
    </>
  );
}

const ItemMenu = ({ icon, text, onClick }: any) => (
  <button onClick={onClick} style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1rem', cursor: 'pointer', padding: '10px', textAlign: 'left', borderRadius: '5px', transition: '0.2s', width: '100%' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
    {icon} {text}
  </button>
);