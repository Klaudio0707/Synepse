import React from 'react'
import styles from './FormLogin.module.css'
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

type FormProps = {
    email: string,
    senha: string,
    onEmailChange: (valor: string) => void;
    onSenhaChange: (valor: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

const FormLogin = ({
    email,
    senha,
    onEmailChange,
    onSenhaChange,
    onSubmit,
}: FormProps) => {
    return (
        <div>
            <div className={styles.loginContainer}>
                <form onSubmit={onSubmit} className={styles.loginForm}>
                <h2 className={styles.loginTitle}>Acesso Restrito</h2>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => onEmailChange(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={e => onSenhaChange(e.target.value)}
                    className={styles.input}
                    required
                />

                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                    <LogIn size={20} /> Entrar
                </button>

                <Link to="/cadastro" className={styles.loginLink}>
                    Não tem conta? Cadastre-se
                </Link>
            </form>
        </div>
    </div >
  )
}

export default FormLogin
