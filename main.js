import { generateReturnsArray } from "./src/investmentGoals.js"
import { createTable } from "./src/table.js"
import { Chart } from "chart.js/auto"

const form = document.getElementById("investment-form")
/* const calculateButton = document.getElementById("calculate-results") */
const clearFormButton = document.getElementById("clear-form")
const finalMoneyChart = document.getElementById("final-money-distribution")
const progressionChart = document.getElementById("progression")
let doughnutChartReference = {}
let progressionChartReference = {}

const columnsArray = [
    {columnLabel: "Mês", accessor: "month"},
    {columnLabel: "Total investido", accessor: "investedAmount", format: (numberInfo) => formatCurrencyToTable(numberInfo)},
    {columnLabel: "Rendimento mensal", accessor: "interestReturns", format: (numberInfo) => formatCurrencyToTable(numberInfo)},
    {columnLabel: "Rendimento total", accessor: "totalInterestReturns", format: (numberInfo) => formatCurrencyToTable(numberInfo)},
    {columnLabel: "Quantia total", accessor: "totalAmount", format: (numberInfo) => formatCurrencyToTable(numberInfo)}
]

function formatCurrencyToTable (value) {
    return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
}

function formatCurrencyToGraph (value) {
    return value.toFixed(2)
}

function renderProgression(event){
    event.preventDefault()

    if(document.querySelector('.error')){
        return
    }

    resetCharts()
    resetTable()

    /* const startingAmount = Number(form['starting-amount'].value) */

    const startingAmount = Number(document.getElementById("starting-amount").value.replace(',','.'))
    const additionalContribution = Number(document.getElementById("additional-contribution").value.replace(',','.'))
    const timeAmount = Number(document.getElementById("time-amount").value)
    const timeAmountPeriod = document.getElementById("time-amount-period").value
    const returnRate = Number(document.getElementById("return-rate").value.replace(',','.'))
    const returnRatePeriod = document.getElementById("evaluation-period").value
    const taxRate = Number(document.getElementById("tax-rate").value.replace(',','.'))

    const returnsArray = generateReturnsArray(startingAmount, timeAmount, timeAmountPeriod, additionalContribution, returnRate, returnRatePeriod)

    const finalInvestmentObject = returnsArray[returnsArray.length - 1]

    doughnutChartReference = new Chart(finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: [
                'Total investido',
                'Rendimento',
                'Imposto'
            ],
            datasets: [{
                data: [formatCurrencyToGraph(finalInvestmentObject.investedAmount), formatCurrencyToGraph(finalInvestmentObject.interestReturns * (1 - taxRate/100)), formatCurrencyToGraph(finalInvestmentObject.interestReturns * taxRate/100)],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
               ],
               hoverOffset: 4
            }]
        }
    })

    progressionChartReference = new Chart(progressionChart, {
        type: 'bar',
        data: {
            labels: returnsArray.map(investmentObject => investmentObject.month),
            datasets: [{
                label: 'Total investido',
                data: returnsArray.map(investmentObject => formatCurrencyToGraph(investmentObject.investedAmount)),
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                label: 'Retorno do investimento',
                data: returnsArray.map(investmentObject => formatCurrencyToGraph(investmentObject.interestReturns)),
                backgroundColor: 'rgb(54, 162, 235)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                },
            }
        },
    })

    createTable(columnsArray, returnsArray, 'results-table')
}

function isObjectEmpty (obj){
    return Object.keys(obj).length === 0
}

function resetCharts (){
    if(!isObjectEmpty(doughnutChartReference) && !isObjectEmpty(progressionChartReference)){
        doughnutChartReference.destroy()
        progressionChartReference.destroy()
    }
}

function resetTable() {
    const tableElement = document.getElementById("results-table");
    const tableBody = tableElement.querySelector("tbody");
    if (tableBody) {
        tableBody.remove();
    }
    const tableHeader = tableElement.querySelector("thead");
    if (tableHeader) {
        tableHeader.remove();
    }
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

    resetCharts()
    resetTable()
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

const mainEl = document.querySelector('main')
const carouselEl = document.querySelector('#carousel')
const nextButton = document.querySelector('#slide-arrow-next')
const previousButton = document.querySelector('#slide-arrow-previous')

nextButton.addEventListener('click', () => {
    carouselEl.scrollLeft += mainEl.clientWidth
})
previousButton.addEventListener('click', () => {
    carouselEl.scrollLeft -= mainEl.clientWidth
})

form.addEventListener("submit", renderProgression)
/* calculateButton.addEventListener("click", renderProgression) */
clearFormButton.addEventListener("click", clearForm)