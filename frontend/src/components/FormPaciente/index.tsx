import { Edit2, User } from 'lucide-react';
import styles from './FormPaciente.module.css'

type PacienteFormProps = {
    nome: string;
    cpf: string;
    telefone: string;
    cep: string;
    editando: boolean;
    onChangeNome: (v: string) => void;
    onChangeCpf: (v: string) => void;
    onChangeTelefone: (v: string) => void;
    onChangeCep: (v: string) => void;
    onSalvar: () => void;
    onEditar: () => void;
    onCancelar: () => void;
  };

  const FormPaciente = ({
    nome,
    cpf,
    telefone,
    cep,
    editando,
    onChangeNome,
    onChangeCpf,
    onChangeTelefone,
    onChangeCep,
    onSalvar,
    onEditar,
    onCancelar,
  }: PacienteFormProps) => {
  return (
         <div className={styles.formArea}>
              <div className={styles.formHeader}>
                <h3><User size={20} /> Dados do Paciente</h3>
                {!editando && (
                  <button onClick={onEditar} className={styles.btnIcon} title="Editar">
                    <Edit2 size={18} color="#f39c12" />
                  </button>
                )}
              </div>

              {editando ? (
                <div className={styles.formGroup}>
                  <input placeholder="Nome Completo" value={nome} onChange={e => onChangeNome(e.target.value)} className={styles.input} />
                  <div className={styles.row}>
                    <input placeholder="CPF" value={cpf} onChange={e => onChangeCpf(e.target.value)} className={styles.input} />
                    <input placeholder="Telefone" value={telefone} onChange={e => onChangeTelefone(e.target.value)} className={styles.input} />
                  </div>
                  <input placeholder="CEP" value={cep} onChange={e => onChangeCep(e.target.value)} className={styles.input} />

                  <div className={styles.btnGroup}>
                    <button onClick={onSalvar} className={`${styles.btn} ${styles.btnSuccess}`}>Salvar</button>
                    <button onClick={onCancelar} className={`${styles.btn} ${styles.btnSecondary}`}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong>Nome:</strong> {nome}</p>
                  <p><strong>CPF:</strong> {cpf || 'CPF'}</p>
                  <p><strong>Tel:</strong> {telefone || 'Telefone'}</p>
                </div>
                 )}
            </div>
        );
    };

export default FormPaciente
