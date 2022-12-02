class Question {
  questionTitle;
  alternatives = []
}

class Alternative {
  alternativeTitle;
  isCorrect
}

let indexQuestion = 0;

let question;

const doQuizContainer = document.getElementById('doQuizContainer')

const listQuestionsSection = document.querySelector('.listQuestionsSection')

const listQuestions = document.querySelector('#listQuestions')

const listQuestionsContainer = document.querySelector("#listQuestionsContainer")

const saveButton = document.querySelector(' .saveButton')

const registerInput = document.querySelectorAll('.registerInput')

const editInput = document.querySelectorAll('.editInput')

const registerQuestion = document.querySelector('#registerQuestion')

const registerQuests = document.querySelector('.registerQuests')

const doQuestion = document.querySelector('#doQuestion')

const doQuiz = document.querySelector('.doQuiz')

const editQuestions = document.querySelector('.editQuestions')


let questions = []

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
  question = new Question ()

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

const editQuestionDetails = (inputs) => {

  let editAlternative;

  inputs.forEach((input, index) => {

    if (index === 0) {
      question.questionTitle = input.value
    } else if (index % 2 !== 0) {
      editAlternative = new Alternative()
      editAlternative.alternativeTitle = input.value
    } else {
      editAlternative.isCorrect = input.checked
    }

    if (index % 2 === 0 && index > 0) {
      question.alternatives.push(alternative)
    }
  })
}

const addSubscription = (menuOption) => {
  menuOption.style.textDecoration = "underline"
}

const removeSubscription = (menuOption) => {
  document.querySelectorAll('.menuItem').forEach((item) => {
    if (item.id !== menuOption) {
      item.style.textDecoration = "none"
    }
  })
}

const openModal = (currentSection) => {
  currentSection.style.display = "block"
}

const closeModal = (currentSection) => {
  document.querySelectorAll('section').forEach((section) => {
    if (section.className !== currentSection) {
      section.style.display = "none"
    }
  })
}

const addQuizQuestion = () => {
  doQuizContainer.innerHTML = `<div class="row questionTitle">${indexQuestion + 1}.${questions[indexQuestion].questionTitle}<div>`

  questions[indexQuestion].alternatives.forEach((alternative, index) => {
    doQuizContainer.innerHTML +=
      `
    <div class ="row">
      <div class="col-1">
        <input 
          id="${index + 1}" 
          type="radio" 
          name="answer">
      </div>
      <div class="col-11">
        ${alternative.alternativeTitle}
      <div>
    </div>
    `
  })
  doQuizContainer.innerHTML += `
      <div class="row">
        <div class="col-4" id="previousButton">
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
  nextButton.addEventListener('click', () => {
    nextQuestion()
    addQuizQuestion()
  })

  previousButton.addEventListener('click', () => {
    previousQuestion()
    addQuizQuestion()
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
  
  console.log(questions)
  
  const delButton = document.querySelectorAll('.delButton')
  delButton.forEach((button, index) => {
    console.log(questions[index])
    button.addEventListener('click', () => {
      deleteQuestion(questions[index].id)
    })
  })
  
  const openEditButton = document.querySelectorAll('.openEditButton')
  openEditButton.forEach((button, index) => {
    button.addEventListener('click', () => {
      closeModal(editQuestions)
      openModal(editQuestions)
      
    })
  })
}

registerQuestion.addEventListener('click', (event) => {
  removeSubscription(registerQuestion)
  addSubscription(registerQuestion)
  closeModal(registerQuests)
  openModal(registerQuests)
  listQuestionsContainer.innerHTML = ''
})

saveButton.addEventListener('click', async (event) => {
  getQuestionDetails(registerInput)
  await addQuestion()
  restartInputs(registerInput)
  question = new Question()
})

doQuestion.addEventListener('click', async (event) => {
  questions = []
  listQuestionsContainer.innerHTML = ''
  removeSubscription(doQuestion)
  addSubscription(doQuestion)
  closeModal(doQuiz)
  openModal(doQuiz)
  await getQuestions()
  addQuizQuestion()
})

listQuestions.addEventListener('click', async (event) => {
  listQuestionsContainer.innerHTML = ''
  questions = []
  removeSubscription(listQuestions)
  addSubscription(listQuestions)
  closeModal(listQuestionsSection)
  openModal(listQuestionsSection)
  await getQuestions()
  await listQuestionOnPage()
})
