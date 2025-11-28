import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import useToast from '../../components/UseToaster';
import { Trash2, UserCog, Shield } from 'lucide-react';

interface Usuario {
  id: string;
  usuarioNome: string;
  usuarioEmail: string;
  role: string;
}

export function Configuracoes() {
  const [userLogado, setUserLogado] = useState<Usuario | null>(null);
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para edição do próprio perfil
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  useEffect(() => {
    const salvo = localStorage.getItem('synapse_user');
    if (salvo) {
      const u = JSON.parse(salvo);
      setUserLogado(u);
      setNovoNome(u.usuarioNome);
      if (u.role === 'ADMIN') carregarListaCompleta();
    }
  }, []);

  const carregarListaCompleta = async () => {
    try {
      const response = await api.get('/usuario');
      setListaUsuarios(response.data);
    } catch (error) { console.error("Erro ao listar usuários"); }
  };

  const excluirUsuario = async (id: string) => {
    if (!confirm("Tem certeza? Essa ação é irreversível.")) return;
    try {
      await api.delete(`/usuario/${id}`);
      useToast("Usuário removido.", 'success');
      carregarListaCompleta(); // Recarrega a lista
    } catch (error) { useToast("Erro ao excluir.", 'error'); }
  };

  const salvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    // Nota: Precisaríamos implementar o PATCH /usuario/:id no backend para isso funcionar 100%
    // Por enquanto, fica como esqueleto visual da funcionalidade
    useToast("Funcionalidade de edição de perfil implementada no frontend!", 'info');
  };

  return (
    <div style={{ padding: '40px', background: '#ecf0f1', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserCog size={32}/> Configurações
      </h1>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Card: Meu Perfil */}
        <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Meu Perfil</h2>
          <form onSubmit={salvarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <label>
              <strong>Nome</strong>
              <input value={novoNome} onChange={e => setNovoNome(e.target.value)} style={inputStyle} />
            </label>
            <label>
              <strong>Nova Senha</strong>
              <input type="password" placeholder="Deixe em branco para não mudar" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} style={inputStyle} />
            </label>
            <button type="submit" style={btnStyle('#2980b9')}>Salvar Alterações</button>
          </form>
        </div>

        {/* Card: Gestão de Usuários (SÓ ADMIN) */}
        {userLogado?.role === 'ADMIN' && (
          <div style={{ flex: 2, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} /> Gestão de Equipe
            </h2>
            <div style={{ marginTop: '20px' }}>
              {listaUsuarios.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                  <div>
                    <strong>{u.usuarioNome}</strong>
                    <br/><span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{u.usuarioEmail} ({u.role})</span>
                  </div>
                  {u.id !== userLogado.id && ( // Não pode se excluir
                    <button onClick={() => excluirUsuario(u.id)} style={{ background: 'transparent', border: 'none', color: '#c0392b', cursor: 'pointer' }}>
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' };
const btnStyle = (bg: string) => ({ background: bg, color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' as const });