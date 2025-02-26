import React, { useState } from "react";
import UploadBox from "./UploadBox";

const TranslationPanel = () => {
  const [selectedOriginLanguage, setSelectedOriginLanguage] = useState("Origin Language");
  const [availableTargetLanguages, setAvailableTargetLanguages] = useState(["English", "Japanese", "Chinese", "Vietnamese"]);
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState([]);

  const handleOriginLanguageSelect = (language) => {
    setSelectedOriginLanguage(language);
    setAvailableTargetLanguages(["English", "Japanese", "Chinese", "Vietnamese"].filter(lang => lang !== language));
    setSelectedTargetLanguages([]);
  };

  const handleTargetLanguageSelect = (language) => {
    setSelectedTargetLanguages(prev =>
      prev.includes(language) ? prev.filter(lang => lang !== language) : [...prev, language]
    );
  };

  return (
    <>
      <UploadBox
        selectedOriginLanguage={selectedOriginLanguage}
        availableTargetLanguages={availableTargetLanguages}
        selectedTargetLanguages={selectedTargetLanguages}
        onOriginSelect={handleOriginLanguageSelect}
        onTargetSelect={handleTargetLanguageSelect}
      />
    </>
  );
};

export default TranslationPanel;