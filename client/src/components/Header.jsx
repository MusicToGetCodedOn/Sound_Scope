import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="logo">SoundScope</h1>
                <nav className="navigation">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/profile">Profil</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;