import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Confetti from "react-confetti";
import './PasswordPage.css';
import { containsMinimumOneDigit, determineEnglishWords, hasCorrectLength, hasValidCharacters } from "./password-validation-service";

const validColor = '#77df73';

/* Bar Colors. */
const invalidBarColor = '#e04d4b';
const unsetBarColor = '#efeef3';
const intermediateBarColor = '#fae34d';

/* Text Colors. */
const unsetTextColor = '#c5c4c7';
const setTextColor = '#47494f';

/* Button Colors. */
const activeButtonColor = '#2d72f1';
const inactiveButtonColor = '#ccc';

function PasswordPage() {
    const [password, setPassword] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [containedEnglishWords, setContainedEnglishWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [validated, setValidated] = useState<boolean>(false);
  
    useEffect(() => {
      setIsLoading(true);
      determineEnglishWords(password).then(words => {
          setContainedEnglishWords(words);
          setIsLoading(false);
      });
    }, [password]);
  
    const correctLength = hasCorrectLength(password);
    const validCharacters = hasValidCharacters(password);
    const minimumOneDigit = containsMinimumOneDigit(password);
    const hasNoEnglishWords = !isLoading && containedEnglishWords.length === 0;
  
    const firstDisabledIndex = determineFirstDisabledIndex(password, correctLength, validCharacters, minimumOneDigit, hasNoEnglishWords);
    const { barColor, lastColoredBarIndex } = determineBarColorConfiguration(password, correctLength, validCharacters, minimumOneDigit, hasNoEnglishWords);
  
    const requirements = [
        {
            isValid: correctLength,
            description: '8 characters minimum'
        },
        {
            isValid: validCharacters,
            description: 'Only latin letters and digits'
        },
        {
            isValid: minimumOneDigit,
            description: 'At least one digit'
        },
        {
            isValid: hasNoEnglishWords,
            description: 'No english words'
        }
    ]

    const passwordIsValid = requirements.every(({isValid}) => isValid);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setValidated(false);
    }
    
    const toggleVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const onValidateButtonClick = () => {
        if (passwordIsValid) {
            setValidated(true);
        }
    }
      
    return (<>
        <div className="password-validation-page">
            <div className="main-content-container">
                <h1>Great to meet you!</h1>
                <p className="subtitle">Set a secure password for signing into DPS Secret Space</p>

                <div>
                    <div className="password-input-container" style={{marginTop: "30px"}}>
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={onInputChange}
                        maxLength={16}
                        autoComplete="current-password"
                        />
                        <i className="toggle-password-icon" onClick={toggleVisibility}>
                            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                        </i>
                    </div>
                    <div className="horizontal-bar-container">
                        {requirements.map((_, index) => {
                            const currentColor = lastColoredBarIndex >= index ? barColor : unsetBarColor;
                            return <div
                                className="horizontal-bar"
                                key={"horizontal-bar-" + index}
                                style={{ backgroundColor: currentColor }}
                            />
                        })}
                    </div>
                    <div className="requirements-result-container">
                        {requirements.map(({isValid, description}, index) => {
                            return (<ColoredRequirementListItem 
                                key={'requirement-coloring-' + index}
                                isValid={isValid}
                                disabled={firstDisabledIndex <= index}
                                description={description}
                            />);
                        })}
                    </div>
                    <button className="validate-button" style={{ backgroundColor: passwordIsValid ? activeButtonColor : inactiveButtonColor }} onClick={onValidateButtonClick}>Validate</button>
                </div>
                <p className="footer">Ole Vester - ole.vester@tum.de - https://github.com/ole-ve/dps-challenge</p>
            </div>
        </div>
        {validated && <Confetti />}
    </>);
}

/**
 * Requirement status and description list item.
 */
const ColoredRequirementListItem = ({isValid, disabled, description}: {isValid: boolean, disabled: boolean, description: string}) => {
    let markerClassName;
    let textColor;
    if (disabled) {
        markerClassName = unsetTextColor;
        textColor = unsetTextColor;
    } else {
        markerClassName = isValid ? validColor: invalidBarColor;
        textColor = setTextColor;
    }

    return <div className="requirements-item-container" style={{ color: textColor }}>
        <div className="circle"  style={{backgroundColor: markerClassName}}/>
        <a>{description}</a>
    </div>
}

/**
 * Determines the color configuration for the bars.
 */
function determineBarColorConfiguration(password: string, correctLength: boolean, validCharacters: boolean, minimumOneDigit: boolean, hasNoEnglishWords: boolean) {
    let barColor = unsetBarColor;
    let lastColoredBarIndex: number;
    if (correctLength && validCharacters && minimumOneDigit && hasNoEnglishWords) {
      barColor = validColor;
      lastColoredBarIndex = 3;
    } else if (correctLength && validCharacters && minimumOneDigit) {
      barColor = intermediateBarColor;
      lastColoredBarIndex = 2;
    } else if (correctLength && validCharacters) {
      barColor = intermediateBarColor;
      lastColoredBarIndex = 1;
    } else if (password.length > 0) {
      barColor = invalidBarColor;
      lastColoredBarIndex = 0;
    } else {
        lastColoredBarIndex = -1;
    }

    return {
        barColor,
        lastColoredBarIndex,
    }
}

/**
 * Determines the first index of requirements that is colored grey. All elements afterwards will be colored red, all before green.
 */
function determineFirstDisabledIndex(password: string, correctLength: boolean, validCharacters: boolean, minimumOneDigit: boolean, hasNoEnglishWords: boolean) {
    if (correctLength && validCharacters && minimumOneDigit && hasNoEnglishWords) {
        return 5;
    } else if (correctLength && validCharacters && minimumOneDigit) {
        return 4;
    } else if (password.length === 0) {
        return 0;
    } else {
        return 3;
    }
}

export default PasswordPage;
