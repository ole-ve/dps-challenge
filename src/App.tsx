import PasswordPage from './password/PasswordPage';
import ImageRow from './background/ImageRow';

function App() {
    return (
        <>
            <div className="password-page-container">
                <PasswordPage />
            </div>
            <div className="image-row-container">
                <ImageRow/>
            </div>
        </>
    );
}

export default App;
