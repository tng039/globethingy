import { useEffect, useState } from 'react';

// A custom hook for the text scrambling effect
function useScrambleText(originalText: string) {
  const [scrambledText, setScrambledText] = useState('');

  useEffect(() => {
    // Initialize with random characters
    let text = Array.from({ length: originalText.length })
                    .map(() => randomCharacter())
                    .join('');
    setScrambledText(text);

    // Calculate the interval time to finish in 1 second
    const totalTime = 1000; // Total time for unscramble effect (in milliseconds)
    const updatesNeeded = Math.ceil(originalText.length / 2); // since we are updating from both ends
    let intervalTime = totalTime / updatesNeeded; // Time per update to meet the 1 second mark

    // Set a minimum interval time to make sure the effect is visible
    const minIntervalTime = 15;
    intervalTime = Math.max(intervalTime, minIntervalTime);

    let forwardCounter = 0;
    let backwardCounter = originalText.length - 1;

    // Function to get a random character from our scramble characters
    function randomCharacter() {
      const characters = '!<>-_\\/[]{}*^?#()';
      return characters[Math.floor(Math.random() * characters.length)];
    }

    const updateText = () => {
      // Replace with actual text character
      text = replaceAt(text, forwardCounter, originalText[forwardCounter]);
      if (backwardCounter !== forwardCounter) { // Avoid replacing the same character twice when the counters meet
        text = replaceAt(text, backwardCounter, originalText[backwardCounter]);
      }

      setScrambledText(text);

      forwardCounter++;
      backwardCounter--;

      if (forwardCounter > backwardCounter) {
        clearInterval(interval);
        setScrambledText(originalText); // Set the final text
      }
    };

    // Helper function to replace character at specific index
    function replaceAt(text: string, index: number, replacement: string) {
      return text.substr(0, index) + replacement + text.substr(index + replacement.length);
    }

    const interval = setInterval(updateText, intervalTime);

    return () => clearInterval(interval);
  }, [originalText]);

  return scrambledText;
}

export default useScrambleText;
