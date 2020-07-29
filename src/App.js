import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import quizQuestions from "../src/data/questions.json";
import QuestionWrapped from "../src/components/QuestionWrapped/QuestionWrapped";
import QuestionContainer from "../src/components/QuestionContainer/QuestionContainer";
import Result from "../src/components/Result/Result";
import Chart from "../src/components/Chart";
import { seriesLabels, groupOneColors } from "./constants";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export const Context = React.createContext('this is context!');
export const Provider = Context.Provider;

const App = ({ children }) => {
  const [data, setData] = useState([]);
  const [averageAnswers, setAverageAnswers] = useState([]);
  const [lengthOfBar, setLengthOfBar] = useState([]);
  const [series, setSeries] = useState(seriesLabels);
  const [colors, setColors] = useState(groupOneColors);
  const [barHeight, setBarHeight] = useState(200);
  const [counter, setCounter] = useState(0);
  const [questionID, setQuestionID] = useState(1);
  const [selectedAnwsers, setSelectedAnswers] = useState([]);
  const [question, setQuestion] = useState();
  const [anwserOptions, setAnwerOptions] = useState(quizQuestions[0].answers);
  const [allQuestion, setAllQuestion] = useState(quizQuestions);
  const [totalQuestion, setTotalQuestion] = useState(allQuestion.length);
  const [result, setResult] = useState(false);
  const [lang, setLang] = useState("english");

  useEffect(() => {
    populateArray();
    setLangage();
  }, [averageAnswers, selectedAnwsers])
  // If you want the chart's bar to render only in the end of user input, 
  // change dependency from "averageAnswers" to "data"

  const populateArray = () => {
    setData(lengthOfBar);
  };

  const setLangage = () => {
    if (lang === "english") {
      setQuestion(quizQuestions[counter].questionEngLish);
    } else if (lang === "french") {
      setQuestion(quizQuestions[counter].questionFrench)
    }
  }

  const switchToFrench = () => {
    setLang("french");
    setQuestion(quizQuestions[counter].questionFrench);
  };

  const switchToEnglish = () => {
    setLang("english");
    setQuestion(quizQuestions[counter].questionEngLish);
  };

  //handle get value selected for question
  const handleAnswerSelected = (e) => {
    let target = e.target;
    let objSelected = selectedAnwsers;
    let index = parseInt(target.value, 10);
    let quantityIndex = counter;

    //object container & save anwsers after selected answer
    objSelected[quantityIndex] = index;
    setSelectedAnswers(objSelected);
    console.log("The array of User input: " + selectedAnwsers);
    console.log("Length of SelectedAnswers: " + selectedAnwsers.length);
  };

  //handle next questions & answer
  const handleNextQuestion = (e) => {
    if (selectedAnwsers.length === counter || selectedAnwsers.length === 0) {
      alert("Please input a number:)");
    } else if (selectedAnwsers.length === 9) {
      const count = counter + 1;
      const questionIDPlus = questionID + 1;
      setCounter(count);
      setQuestionID(questionIDPlus);
      setAnwerOptions(quizQuestions[9].answers);
      if (lang === "english") {
        setQuestion(quizQuestions[count].questionEngLish)
      } else if (lang === "french") {
        setQuestion(quizQuestions[count].questionFrench)
      }
    } else if (selectedAnwsers.length === 10 && selectedAnwsers[9] === 1 && lang === "english") {
      setQuestion("For single people: Do you feel at peace, whole, and complete without a life partner?");
      setAnwerOptions(quizQuestions[0].answers);
    } else if (selectedAnwsers.length === 10 && selectedAnwsers[9] === 1 && lang === "french") {
      setQuestion("Pour personnes seules: Vous sentez-vous en paix, entier et complet sans partenaire de vie?");
      setAnwerOptions(quizQuestions[0].answers);
    } else if (selectedAnwsers.length === 10 && selectedAnwsers[9] === 0 && lang === "english") {
      setQuestion("With your spouse: Do you feel at peace, whole and complete without the presence of your life partner?");
      setAnwerOptions(quizQuestions[0].answers);
    } else if (selectedAnwsers.length === 10 && selectedAnwsers[9] === 0 && lang === "french") {
      setQuestion("En couple: Vous sentez-vous en paix, entier et complet sans la présence de votre partenaire de vie?");
      setAnwerOptions(quizQuestions[0].answers);
    } else {
      pushArray();
      const count = counter + 1;
      const questionIDPlus = questionID + 1;
      setCounter(count);
      setQuestionID(questionIDPlus);
      if (lang === "english") {
        setQuestion(quizQuestions[count].questionEngLish)
      } else if (lang === "french") {
        setQuestion(quizQuestions[count].questionFrench)
      }
    }
  };

  const pushArray = () => {
    if (selectedAnwsers.length % 2 === 0) {
      var lastTwoNum = selectedAnwsers.slice(-2);
      let averageCal =
        lastTwoNum.reduce((pre, curr) => {
          return pre + curr;
        }, 0) / lastTwoNum.length;

      // This is an array of the length to draw bars
      let LengthArray = [];
      // This is an array of averages
      let AverageArray = [];

      let average = Math.round(averageCal);
      AverageArray.push(average);
      LengthArray.push(convertAverageToLength(average));
      let joinedAverage = averageAnswers.concat(AverageArray);
      let joinedLength = lengthOfBar.concat(LengthArray);
      setAverageAnswers(joinedAverage);
      setLengthOfBar(joinedLength);
    }
  }

  const convertAverageToLength = (average) => {
    if (average === 0) {
      return 10;
    } else if (average === 1) {
      return 9;
    } else if (average === 2) {
      return 8;
    } else if (average === 3) {
      return 7;
    } else if (average === 4) {
      return 6;
    } else if (average === 5) {
      return 5;
    } else if (average === 6) {
      return 4;
    } else if (average === 7) {
      return 3;
    } else if (average === 8) {
      return 2;
    } else if (average === 9) {
      return 1;
    } else if (average === 10) {
      return 0;
    }
  }

  const handleSubmitAnswers = () => {
    const answerArray = selectedAnwsers.length;
    if (answerArray.length === counter || answerArray === 0) {
      alert("Please input a number:)");
    } else {
      pushArray();
      setData(lengthOfBar);
      setResult(true);
    }
  };

  const showResult = () => {
    return <Result />;
  };

  const renderQuiz = () => {
    return (
      <QuestionContainer />
    );
  }

  return (
    <Provider
      value={{
        data, setData,
        series, setSeries,
        colors, setColors,
        barHeight, setBarHeight,
        averageAnswers, setAverageAnswers,
        question, setQuestion,
        anwserOptions, setAnwerOptions,
        allQuestion, setAllQuestion,
        counter, setCounter,
        questionID, setQuestionID,
        selectedAnwsers, setSelectedAnswers,
        result, setResult,
        totalQuestion, setTotalQuestion,
        lang, setLang,

        handleAnswerSelected,
        handleNextQuestion,
        handleSubmitAnswers,
        showResult,
        renderQuiz,
        convertAverageToLength,
        switchToFrench,
        switchToEnglish,
      }}
    >
      {children}
      <Chart />
      <QuestionWrapped />
    </Provider>
  );
}

const mapStateToProps = (state) => {
  console.log('mapping.... ', state.sectionScores);
  console.log('mapping Average Scores.... ', state.averageScores);
  return {
    sectionScores: state,
    averageScores: state
  };
};

export default connect(mapStateToProps)(App);