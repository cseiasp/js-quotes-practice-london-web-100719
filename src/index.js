document.addEventListener("DOMContentLoaded", function() {

    renderQuotes()
    createNewQuoteListener()
});

//API
const get = (url) => fetch(url).then(resp => resp.json())
const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  }

API = {get}

//const

const URL = "http://localhost:3000/quotes"
const LIKES_URL = URL + "?_embed=likes"
const LIKES = "http://localhost:3000/likes"
const quoteList = document.getElementById("quote-list")
const form = document.getElementById("new-quote-form")
const newQuoteInput = document.getElementById("new-quote")
const newAuthorInput = document.getElementById("author")
const editMode = false


//functions

function renderQuotes(){
    API.get(LIKES_URL)
    .then(displayQuotes)
}

function displayQuotes(quotes){
    quotes.forEach( quote => addQuotes(quote) )
}

function addQuotes(quote){
    const li = createElementWith("li", "className", "quote-card", "id", quote.id)
    const blockquote = createElementWith("blockquote", "className", "quote-card")
    const p = createElementWith("p", "className", "mb-0", "innerText", quote.quote)
    const footer = createElementWith("footer", "className", "blockquote-footer", "innerText", quote.author)
    const buttonSuccess = createElementWith("button", "className", "btn-success","innerText", "Likes:")
    const buttonDanger = createElementWith("button", "className", "btn-danger", "innerText", "Delete")
    const span = createElementWith("span", "innerText", `${quote.likes.length}`)
    const editButton = createElementWith("button", "innerText", "Edit")
    editButton.addEventListener('click', editQuote)
    buttonSuccess.addEventListener(`click`, () => likeQuote(quote, span))
    buttonDanger.addEventListener(`click`, () => deleteQuote(quote.id))
    buttonSuccess.appendChild(span)
    blockquote.append(p, footer, buttonSuccess, buttonDanger)
    li.append(blockquote, editButton)
    quoteList.appendChild(li)
}

// adding new quote fetch and listener functions
function createNewQuoteListener(){
    form.addEventListener(`submit`, createOrEditNewQuote)
}

function createOrEditNewQuote(event, quote){
    event.preventDefault()
    let method
    let likes
    let url 
    
    if (editMode === false){
        method = "POST"
        likes = []
        url = URL
    } else {
        method = "PATCH"
        likes = quote.likes
        url = `${URL}/${id}`
    }
    
    const configObj = {
        method: method,
        headers: headers,
        body: JSON.stringify({
            quote: newQuoteInput.value,
            author: newAuthorInput.value,
            likes: likes
        })
    }

    fetch(url, configObj).then(resp => resp.json())
    .then(addQuotes)
}

// function to post

function methodWhenPost(){
    return addQuotes()
}
// function to patch

// function editQuote(){
//     debugger
//     editMode = true
//     const header = document.getElementById("quote-form-header")
//     const labelQuote = document.getElementById("quote-label")
//     const labelAuthor = document.getElementById("author-label")
//     const button = document.getElementById("submit")

//     header.innerText = "Edit Quote Information"
//     labelQuote.innerText = "Edit Quote"
//     labelAuthor.innerText = "Edit Author"
//     button.innerText = "Edit"

// }

function methodWhenPatch(){
    editMode = true

}

// delete quote fetch and listener functions

function deleteQuote(id){
    const li = document.getElementById(id)
    const configObj = {
        method: "DELETE",
        }

    fetch(`${URL}/${id}`, configObj)
    .then(() => {
        li.remove()
    })
}

// like quote

function likeQuote(quote, span){

    const configObj = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            quoteId: quote.id,
            createdAt: Date.now()
        })
    } 

    fetch(LIKES, configObj)
    .then(resp => resp.json() )
    .then(() => span.innerText = Number(span.innerText) + 1)

}

//  edit quote

function editQuote(){
    
}

//helper function - custom createElementWith
function createElementWith(element, type, value, type1, value1){
    const newEl = document.createElement(element)
    newEl[type] = value
    newEl[type1] = value1
    return newEl
}

