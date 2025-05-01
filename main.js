import { generateReturnsArray } from "./src/investmentGoals.js"

const form = document.getElementById("investment-form")
/* const calculateButton = document.getElementById("calculate-results") */
const clearFormButton = document.getElementById("clear-form")

function renderProgression(event){
    event.preventDefault()

    if(document.querySelector('.error')){
        return
    }

    /* const startingAmount = Number(form['starting-amount'].value) */

    const startingAmount = Number(document.getElementById("starting-amount").value.replace(',','.'))
    const additionalContribution = Number(document.getElementById("additional-contribution").value.replace(',','.'))
    const timeAmount = Number(document.getElementById("time-amount").value)
    const timeAmountPeriod = document.getElementById("time-amount-period").value
    const returnRate = Number(document.getElementById("return-rate").value.replace(',','.'))
    const returnRatePeriod = document.getElementById("evaluation-period").value
    const taxRate = Number(document.getElementById("tax-rate").value.replace(',','.'))

    const returnsArray = generateReturnsArray(startingAmount, timeAmount, timeAmountPeriod, additionalContribution, returnRate, returnRatePeriod)

    console.log(returnsArray)
}

function clearForm(){
    for(const formElement of form){
        if(formElement.tagName === 'INPUT' && formElement.hasAttribute('name')){
            formElement.value = ''
            if(formElement.parentElement.classList.contains('error')){
                formElement.parentElement.classList.remove('error')
                formElement.parentElement.parentElement.querySelector('p').remove()
            }
        }
    }
}

function validateInput(event){

    const {parentElement} = event.target
    const grandParentElement = parentElement.parentElement
    const inputValue = event.target.value.replace(",",".")

    if(inputValue && !parentElement.classList.contains('error') && (isNaN(inputValue) || Number(inputValue) <= 0) ){
        const errorTextElement = document.createElement('p')
        errorTextElement.classList.add('text-red-500')
        errorTextElement.innerText = "Insira um valor numérico maior que zero!"
        grandParentElement.appendChild(errorTextElement)
        parentElement.classList.add('error')
    } else if(inputValue && parentElement.classList.contains('error') && !isNaN(inputValue) && Number(inputValue) > 0){
        parentElement.classList.remove('error')
        grandParentElement.querySelector('p').remove()
    }
}

for(const formElement of form){
    if(formElement.tagName === 'INPUT' && formElement.hasAttribute('name')){
        formElement.addEventListener("blur", validateInput)
    }
}

form.addEventListener("submit", renderProgression)
/* calculateButton.addEventListener("click", renderProgression) */
clearFormButton.addEventListener("click", clearForm)