import React, { useEffect, useState } from "react";
import quizQuestions from "../assets/quizData";
import resultsData from "../assets/resultData";
import { fetchPassion, addPassion } from "../api/passion";
import Loader from "../components/Loader";

const FindYourPassion = ({ active, setactive }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const totalQuestions = quizQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    setactive("find your passion");

    // fetch user's saved passion
    const fetchUserPassion = async () => {
      const res = await fetchPassion();

      if (res) {
        setResult(resultsData[res]);
        setQuizComplete(true);
      }
      setIsLoading(false);
    };

    fetchUserPassion();
  }, []);

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = async (finalAnswers) => {
    const categoryCounts = {};

    finalAnswers.forEach((optionText) => {
      const category = quizQuestions
        .flatMap((q) => q.options)
        .find((opt) => opt.text === optionText)?.category;

      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    const topCategory = Object.keys(categoryCounts).reduce((a, b) =>
      categoryCounts[a] > categoryCounts[b] ? a : b
    );

    setResult(resultsData[topCategory]);
    setQuizComplete(true);

    try {
      const res = await addPassion(topCategory);
      console.log(res);
      console.log("Passion added successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setResult(null);
    setQuizComplete(false);
  };

  return (
    <div className="bg-gray-100 pt-4 pb-10">
      {isLoading ? (<Loader text="Loading quiz..."/>) : (
      <>
      <h1 className="flex justify-center  items-center w-full text-2xl mx-auto text-center md:text-4xl mt-10 mb-10 font-bold ">
        Discover Your Passion: Take the Quiz!
      </h1>
      {/* Quiz Container */}
      <div className=" mx-auto w-full md:w-[50rem] h-auto p-6 bg-white border border-gray-300 shadow-lg  rounded-lg mt-4">
        {/* Progress Bar */}
        {!quizComplete && (
          <div className="max-w-lg mx-auto mt-4 transition-all duration-300">
            <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
        )}

        {quizComplete ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 mt-10">Quiz Complete!</h2>
            <div className="text-gray-600 mb-10">
              Based on your answers, we think you might be passionate about:
            </div>
          </div>
        ) : (
          <div className="px-10">
            <h2 className="text-xl font-semibold mb-4 mt-10">
              {quizQuestions[currentQuestionIndex].question}
            </h2>
            <div className="space-y-3">
              {quizQuestions[currentQuestionIndex].options.map(
                (option, index) => {
                  const isSelected = selectedOption === option.text;
                  return (
                    <label
                      key={index}
                      htmlFor={`option-${index}`}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-300
          ${
            isSelected
              ? "bg-emerald-100 border-emerald-500"
              : "bg-white border-gray-300"
          }`}
                    >
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="answer"
                        value={option.text}
                        checked={isSelected}
                        onChange={() => setSelectedOption(option.text)}
                        className="accent-emerald-500 w-5 h-5 mr-3 cursor-pointer"
                      />
                      <span className="text-gray-800 font-medium">
                        {option.text}
                      </span>
                    </label>
                  );
                }
              )}
            </div>

            <div className="flex justify-center items-center">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`mt-4 px-6 py-2 transition-all duration-300 text-white text-lg w-40 ${
                  selectedOption === null
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-black"
                }`}
              >
                {currentQuestionIndex < totalQuestions - 1 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {/* Result Display  */}
        {quizComplete && result && (
          <div className="w-full mx-auto mt-6 p-6">
            <h3 className="text-2xl font-bold mb-3">{result.title}</h3>
            <p className="mt-2 text-gray-700 text-lg">{result.description}</p>
            <h4 className="mt-8 font-bold text-xl mb-3">
              How to Get Involved:
            </h4>
            <p className="text-gray-600">{result.howToGetInvolved}</p>
            <div className="flex justify-center items-center mt-10">
              <button
                onClick={restartQuiz}
                className="px-6 py-2 bg-emerald-500 rounded-md hover:bg-black trasition-all duration-300 text-white"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default FindYourPassion;
