const dictAPI ="https://api.dictionaryapi.dev/api/v2/entries/en/";

const resultDiv = document.getElementsByClassName("result")[0];
const btn = document.getElementById("search-btn");
const historyList = document.getElementById("history-list");
const clearBtn = document.getElementById("clear-history");

//storing the word history
let historyOfWords = JSON.parse(localStorage.getItem("history")) || [];

//rendering the word history list when page loaded
renderHistory();

btn.addEventListener("click",()=>{
    let inputWord = document.getElementById("inp-word").value.trim();

    if(!inputWord) return;

    //fetch operation 
    fetch(`${dictAPI}${inputWord}`)
    .then((response)=>response.json())
    .then((data)=>{
        resultDiv.innerHTML=`
        <div class="word">
                    <h3>${inputWord}</h3>
                    <button onclick="playSound('${data[0].phonetics[0]?.audio}')">
                        <i class="fa-solid fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                    <p>${data[0].phonetics[0]?.text || ""}</p>
                </div>
                <p class="word-meaning">
                    ${data[0].meanings[0].definitions[0].definition}
                </p>
                <p class="word-example">
                    ${data[0].meanings[0].definitions[0].example || ""}
                </p>
                <p class="word-synonyms">
                    <strong>Synonyms:</strong> ${data[0].meanings[0].synonyms.join(", ")}
                </p>
                <p class="word-antonyms">
                    <strong>Antonyms:</strong> ${data[0].meanings[0].antonyms.join(", ")}
                </p>
        `;


        //save the word to history
        if(!historyOfWords.includes(inputWord))
        {
            historyOfWords.push(inputWord);
            localStorage.setItem("history",JSON.stringify(historyOfWords));
            renderHistory();
        }
    })
    .catch(()=>{
        resultDiv.innerHTML = `<h3 class='error'>Couldn't find the word</h3>`;
    });
});


function playSound(audioUrl) {
    let sound = new Audio(audioUrl);
    sound.play();
}

function renderHistory()
{
    historyList.innerHTML="";
    historyOfWords.map((word,index)=>{
        let li = document.createElement("li");
        li.textContent = word;
        li.addEventListener("click", () => {
            document.getElementById("inp-word").value = word;
            btn.click();
        });
        historyList.appendChild(li);
    })
}

// Clear history
clearBtn.addEventListener("click", () => {
    historyOfWords = [];
    localStorage.removeItem("history");
    renderHistory();
});