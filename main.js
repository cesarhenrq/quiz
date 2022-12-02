class Question {
  questionTitle;
  alternatives = []
}

class Alternative {
  alternativeTitle;
  isCorrect
}

class Answer {
  questionID;
  answers = []
}

let pointsCounter = 0

let indexQuestion = 0

let question

let questionID

let questions = []

let answer

const doQuizContainer = document.getElementById('doQuizContainer')

const listQuestionsSection = document.querySelector('.listQuestionsSection')

const listQuestions = document.querySelector('#listQuestions')

const listQuestionsContainer = document.querySelector("#listQuestionsContainer")

const saveButton = document.querySelector(' .saveButton')

const editInput = document.querySelectorAll('.editInput')

const registerInput = document.querySelectorAll('.registerInput')

const registerQuestion = document.querySelector('#registerQuestion')

const registerQuests = document.querySelector('.registerQuests')

const doQuestion = document.querySelector('#doQuestion')

const doQuiz = document.querySelector('.doQuiz')

const editQuestions = document.querySelector('.editQuestions')

const closeEditModal = document.getElementById('closeEditModal')

const editButton = document.querySelector('.editButton')

const completedQuiz = document.querySelector('.completedQuiz')

const quizResult = document.querySelector('#quizResult')

const addQuestion = async () => {
  await fetch("http://localhost:3000/questions", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "questionTitle": question.questionTitle,
      "alternatives": question.alternatives
    })
  });
}

const getQuestions = async () => {
  const apiResponse = await fetch('http://localhost:3000/questions')
  questions = await apiResponse.json()
}

const deleteQuestion = async (id) => {
  await fetch('http://localhost:3000/questions/' + id, {
    method: 'DELETE',
  })

  await getQuestions()
  listQuestionsContainer.innerHTML = ''
  listQuestionOnPage()
}

const updateQuestion = async (id) => {
  await fetch(`http://localhost:3000/questions/${id}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "questionTitle": question.questionTitle,
      "alternatives": question.alternatives
    })
  });
}

const restartInputs = (inputs) => {
  inputs.forEach((input, index) => {

    if (index % 2 !== 0 || index === 0) {
      input.value = ''
    } else {
      input.checked = false
    }

  })
}

const getQuestionDetails = (inputs) => {

  let alternative;
  question = new Question()
  inputs.forEach((input, index) => {
    if (index === 0) {
      question.questionTitle = input.value
    } else if (index % 2 !== 0) {
      alternative = new Alternative()
      alternative.alternativeTitle = input.value
    } else {
      alternative.isCorrect = input.checked
    }

    if (index % 2 === 0 && index > 0) {
      question.alternatives.push(alternative)
    }
  })
}

const editQuestionDetails = (inputs, id) => {
  let auxiliarIndex1 = 0
  let auxiliarIndex2 = 0
  inputs.forEach((input, index) => {
    if (index === 0) {
      input.value = questions[id].questionTitle
      } else if (index % 2 !== 0) {
        input.value = questions[id].alternatives[auxiliarIndex1].alternativeTitle
        auxiliarIndex1++
      } else {
        input.checked = questions[id].alternatives[auxiliarIndex2].isCorrect
        auxiliarIndex2++
    }
  })
}

const getAnswerDetails = (inputs, id) => {
  answer = new Answer()

  answer.questionID = id
  
  inputs.forEach((input, index) => {
    answer.answers.push(input.checked)
  })
}

const evaluetedResult = () => {
  let auxiliar = true
  let auxiliar2 = 0

  for (let index = 0; index < answer.answers.length; index++) {
    if ((answer.answers[index]) === (questions[indexQuestion].alternatives[index].isCorrect)) {
      auxiliar2++
    }
  }
  
  if (auxiliar2 === 4) {
    pointsCounter++
  }

}

const addSubscription = (menuOption) => {
  menuOption.style.textDecoration = "underline"
}

const removeSubscription = (menuOption) => {
  document.querySelectorAll('.menuItem')
  .forEach((item) => {
    if (item.id !== menuOption) {
      item.style.textDecoration = "none"
    }
  })
}

const openModal = (currentSection) => {
  currentSection.style.display = "block"
}

const closeModal = (currentSection) => {
  document.querySelectorAll('section')
  .forEach((section) => {
    if (section.className !== currentSection) {
      section.style.display = "none"
    }
  })
}

const addQuizQuestion = () => {
  doQuizContainer.innerHTML = `
    <div class="row questionTitle">
      ${indexQuestion + 1}.${questions[indexQuestion].questionTitle}
    <div>`

  questions[indexQuestion].alternatives.forEach((alternative, index) => {
    doQuizContainer.innerHTML +=
      `
    <div class ="row">
      <div class="col-1">
        <input 
          id="${index + 1}" 
          type="radio" 
          name="answer"
          class="answerInput"
          >
      </div>
      <div class="col-11">
        ${alternative.alternativeTitle}
      <div>
    </div>
    `
  })
  doQuizContainer.innerHTML += `
      <div class="row">
        <div class="col-4 previousButton" id="previousButton">
          ANTERIOR
        </div>
        <div class="col-4 information">
          Questão ${indexQuestion + 1}/${questions.length}
        </div>
        <div class="col-4" id="nextButton">
          PROXIMO
        </div>
      </div>
      `
  const nextButton = document.querySelector('#nextButton')
  const previousButton = document.querySelector('#previousButton')
  const answerInput = document.querySelectorAll('.answerInput')

  nextButton.addEventListener('click', () => {
    getAnswerDetails(answerInput, questions[indexQuestion].id)
    evaluetedResult()
    if (indexQuestion < questions.length - 1) {
      nextQuestion()
      addQuizQuestion()
    } else if (indexQuestion = questions.length - 1) {
      closeModal(completedQuiz)
      quizResult.innerHTML = `Você acertou ${((pointsCounter / questions.length) * 100).toFixed(1)}% das questões`
      openModal(completedQuiz)
    }
  })

  previousButton.addEventListener('click', (event) => {
    if (indexQuestion > 0) {
      pointsCounter--
      previousQuestion()
      addQuizQuestion()
    } 
  })
}

const nextQuestion = () => {
  indexQuestion++
}

const previousQuestion = () => {
  indexQuestion--
}

const listQuestionOnPage = () => {
  questions.forEach((question, index) => {
    listQuestionsContainer.innerHTML += `
    <div class="row mb-4 questionListed">
      <div class="col-10 titleQuestionListed">
        ${index + 1}.${question.questionTitle}
      </div>
      <div class="col-1 openEditButton">
        <img src="./edit.svg" />
      </div>
      <div class="col-1 delButton">
        <img src="./del.svg" />
      </div>
    </div>
    `
  })

  const delButton = document.querySelectorAll('.delButton')
  delButton.forEach((button, index) => {
    button.addEventListener('click', () => {
      deleteQuestion(questions[index].id)
    })
  })

  const openEditButton = document.querySelectorAll('.openEditButton')
  openEditButton.forEach((button, index) => {
    button.addEventListener('click', async () => {
      closeModal(editQuestions)
      openModal(editQuestions)
      editQuestionDetails(editInput, index)
      questionID = questions[index].id
    })
  })
}

registerQuestion.addEventListener('click', (event) => {
  removeSubscription(registerQuestion)
  addSubscription(registerQuestion)
  closeModal(registerQuests)
  openModal(registerQuests)
  listQuestionsContainer.innerHTML = ''
  pointsCounter = 0
})

saveButton.addEventListener('click', async (event) => {
  getQuestionDetails(registerInput)
  await addQuestion()
  restartInputs(registerInput)
  question = new Question()
})

doQuestion.addEventListener('click', async (event) => {
  indexQuestion = 0
  questions = []
  listQuestionsContainer.innerHTML = ''
  removeSubscription(doQuestion)
  addSubscription(doQuestion)
  closeModal(doQuiz)
  openModal(doQuiz)
  await getQuestions()
  addQuizQuestion()
  pointsCounter = 0
})

listQuestions.addEventListener('click', async (event) => {
  questions = []
  listQuestionsContainer.innerHTML = ''
  removeSubscription(listQuestions)
  addSubscription(listQuestions)
  closeModal(listQuestionsSection)
  openModal(listQuestionsSection)
  await getQuestions()
  listQuestionOnPage()
  pointsCounter = 0
})

closeEditModal.addEventListener('click', () => {
  closeModal(listQuestionsSection)
  openModal(listQuestionsSection)
})

editButton.addEventListener('click', () => {
  getQuestionDetails(editInput)
  updateQuestion(questionID)
  getQuestions()
})