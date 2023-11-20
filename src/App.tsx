import React, {useEffect, useState} from 'react';
import { Tooltip } from 'react-tooltip'
import './App.css';
import {determineEnglishWords, hasCorrectLength, hasValidCharacters} from "./password-validation-service";

function App() {
  const [password, setPassword] = useState<string>('');

  return (
      <div className="password-validation-page">
        <h1>Password Validator @DPS</h1>
        <div className="password-input-page">
          <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
          />
        </div>
        <div className="result-container">
            <LengthCheckContainer password={password} />
            <LetterCheckContainer password={password} />
            <EnglishWordCheckContainer password={password} />
        </div>
        <p style={{color: "grey", fontSize: "small"}}>
            Ole Vester - ole.vester@tum.de - https://github.com/ole-ve/dps-challenge
        </p>
      </div>
  );
}

const LengthCheckContainer = ({password}: { password: string }) => {
    const isValid = hasCorrectLength(password);
    return <div className="validation-step-container">
        <a className="validation-checkmark">{isValid ? '✅' : '❌'}</a>
        <a>The password length must be between 8 and 16 characters.</a>
    </div>;
}

const LetterCheckContainer = ({password}: { password: string }) => {
    const isValid = hasValidCharacters(password);
    return <div className="validation-step-container">
        <a className="validation-checkmark">{isValid ? '✅' : '❌'}</a>
        <a>The password must only consists of latin letters and digits and contains at least one digit.</a>
    </div>;
};

const EnglishWordCheckContainer = ({password}: { password: string}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [englishWords, setEnglishWords] = useState<string[]>([]);

    useEffect(() => {
        setEnglishWords([]);
        setIsLoading(true);
        determineEnglishWords(password).then(words => {
            setEnglishWords(words);
            setIsLoading(false);
        });
    }, [password]);

    return <div className="validation-step-container">

        <a className="validation-checkmark">
            {isLoading ? '👀' : englishWords.length === 0 ? '✅' : '❌'}
        </a>
        <a>The password must not contain any english words.</a>
        {englishWords.length > 0 && <a data-tooltip-id="english-words-tooltip">ℹ</a>}
        <Tooltip
            id="english-words-tooltip"
            place="bottom"
            content={"The following word(s) are english words: " + englishWords?.join(", ")}
        />
    </div>;
}

export default App;
