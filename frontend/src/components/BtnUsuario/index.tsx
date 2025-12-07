import styles from './BtnUsuario.module.css'

type Usuario = {
    usuarioNome: string;
    onLogout: () => void;
}

const BtnUsuario = ({
    usuarioNome,
    onLogout,
}: Usuario) => {
    return (
        <div>
            <div className={styles.userInfo}>
                <span>Olá, {usuarioNome}</span>
                <button onClick={onLogout} className={`${styles.btn} ${styles.btnSecondary}`} style={{ padding: '5px 15px', fontSize: '0.9rem' }}>
                    Sair
                </button>
            </div>
        </div>
    )
}

export default BtnUsuario
