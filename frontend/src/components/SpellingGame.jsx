import { useEffect, useRef, useState } from 'react';
import { Send, Eye } from 'lucide-react';

const SpellingGame = ({
    wordLength,
    currentGuess,
    setCurrentGuess,
    submitSpelling,
    revealAnswer,
    isLoading,
    fetchNextWord
}) => {
    const [guess, setGuess] = useState(() => {
        const initial = Array(wordLength).fill('');
        return currentGuess.length === wordLength
            ? currentGuess.split('')
            : initial;
    });

    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const inputsRef = useRef([]);

    // Sync parent state
    useEffect(() => {
        setCurrentGuess(guess.join(''));
    }, [guess]);

    // Focus first input on load
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const focusInput = (index) => {
        if (inputsRef.current[index]) {
            inputsRef.current[index].focus();
        }
    };

    const handleChange = (e, index) => {
        const val = e.target.value.toUpperCase();
        if (/^[A-Z]$/.test(val)) {
            const newGuess = [...guess];
            newGuess[index] = val;
            setGuess(newGuess);
            if (index < wordLength - 1) {
                focusInput(index + 1);
            }
        } else if (val === '') {
            const newGuess = [...guess];
            newGuess[index] = '';
            setGuess(newGuess);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newGuess = [...guess];
            if (guess[index]) {
                newGuess[index] = '';
                setGuess(newGuess);
            } else if (index > 0) {
                newGuess[index - 1] = '';
                setGuess(newGuess);
                focusInput(index - 1);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < wordLength - 1) {
            focusInput(index + 1);
        } else if (e.key === 'Enter' && !guess.includes('')) {
            handleSubmit();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text').toUpperCase().replace(/[^A-Z]/g, '');
        const chars = pasteData.slice(0, wordLength).split('');
        if (chars.length) {
            const newGuess = [...guess];
            chars.forEach((ch, i) => {
                newGuess[i] = ch;
            });
            setGuess(newGuess);
            const nextIndex = chars.length < wordLength ? chars.length : wordLength - 1;
            focusInput(nextIndex);
        }
    };

    const handleSubmit = async () => {
        const isCorrect = await submitSpelling(guess.join(''));
        if (isCorrect) {
            setScore((prev) => prev + 1);
            setCorrectCount((prev) => prev + 1);

            // Increase level every 3 correct answers
            if ((correctCount + 1) % 3 === 0) {
                setLevel((prev) => prev + 1);
            }

            const cleared = Array(wordLength).fill('');
            setGuess(cleared);
            setCurrentGuess('');
            setTimeout(() => {
                inputsRef.current[0]?.focus();
            }, 0);
            fetchNextWord();
        } else {
            setGameOver(true);
        }
    };

    const restartGame = () => {
        setScore(0);
        setCorrectCount(0);
        setLevel(1);
        setGameOver(false);
        const cleared = Array(wordLength).fill('');
        setGuess(cleared);
        setCurrentGuess('');
        fetchNextWord();
        setTimeout(() => {
            inputsRef.current[0]?.focus();
        }, 0);
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            {gameOver ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
                    <p className="text-lg mb-2">Final Score: {score}</p>
                    <p className="text-lg mb-2">Correct Words: {correctCount}</p>
                    <p className="text-lg mb-6">Level Reached: {level}</p>
                    <button
                        onClick={restartGame}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        Spell the word ({wordLength} letters)
                    </h3>
                    <div className="text-center text-gray-600 mb-2">Score: {score}</div>
                    <div className="text-center text-gray-600 mb-2">Correct Words: {correctCount}</div>
                    <div className="text-center text-gray-600 mb-6">Level: {level}</div>

                    <div className="flex justify-center mb-8">
                        <div className="flex flex-wrap justify-center gap-2">
                            {Array.from({ length: wordLength }).map((_, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    value={guess[index]}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    type="text"
                                    maxLength={1}
                                    disabled={isLoading}
                                    className="w-10 h-10 md:w-14 md:h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-900 bg-white focus:outline-none focus:border-blue-500 text-center uppercase"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || guess.includes('')}
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5 mr-2" />
                            {isLoading ? 'Checking...' : 'Submit'}
                        </button>

                        <button
                            onClick={revealAnswer}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Eye className="h-5 w-5 mr-2" />
                            Give Up
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600 mt-4">
                        <p>Enter all {wordLength} letters and press Submit, or press Enter</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default SpellingGame;
