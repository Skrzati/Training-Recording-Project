import React from 'react';
import LoginForm from './components/LoginForm'; 
import RegistrationForm from './components/RegistrationForm'; 
import './components/AuthForms.css'; // Globalny import stylów

const App = () => {
    const [isLogin, setIsLogin] = React.useState(true); 

    return (
        // Ta klasa odpowiada za centrowanie dzięki flexboxowi zdefiniowanemu w CSS
        <div className="app-background">
            <div>
                {isLogin ? (
                    <LoginForm />
                ) : (
                    <RegistrationForm />
                )}
                
                {/* Użycie nowej klasy CSS do stylizacji przełącznika */}
                <p className="switch-text">
                    {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}
                    <span 
                        onClick={() => setIsLogin(!isLogin)} 
                    >
                        {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default App;