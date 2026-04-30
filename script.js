document.addEventListener("DOMContentLoaded",function(){

const form = document.getElementById("word-form");
const input= document.querySelector("#word");
const problem = document.querySelector("#message")
const resultContainer = document.querySelector("#result-container");



form.addEventListener("submit",function(event){
    event.preventDefault();
    
resultContainer.innerHTML = "";
    const word = input.value.trim();

    if (!word){
        problem.textContent  = "Please enter a word.";
        return;
    }

    problem.textContent="";
     resultContainer.innerHTML = "";
   

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(function(response){
       if (!response.ok){
        throw new Error("Word not found. Try another word")
       } 
        return response.json()
    })
    .then(function(data){
     const entry=data[0];
     

     const phonetic=entry.phonetic ||entry.phonetics?.find(p=>p.text)?.text||"";
     const audioUrl=entry.phonetics?.find(p=>p.audio && p.audio.trim() !== "")?.audio||"";

     let html=`<h2 id="word-result">${entry.word} <span class="phonetis">${phonetic}</span></h2>`;

     if(audioUrl){
     html += `
        <button class="audio-btn" onclick="document.querySelector('#audio-player').play()">
             🔊 Play pronunciation
          </button>
          <audio id="audio-player" src="${audioUrl}"></audio>`;
        } else{
            html += `<p>🔇 No audio available for this word.</p>`;
        }
    
    entry.meanings.forEach(function (meaning){html += `<div class="meaning-block">`;
          html += `<h3 class="part-of-speech">${meaning.partOfSpeech}</h3>`;

    
          html += `<ol class="definitions">`;
          meaning.definitions.forEach(function (def) {
            html += `<li>
              <p class="definition">${def.definition}</p>
              ${def.example ? `<p class="example">📝 <em>"${def.example}"</em></p>` : ""}
            </li>`;
          });
          html += `</ol>`;

          
          if (meaning.synonyms && meaning.synonyms.length > 0) {
            html += `<p class="synonyms"><strong>Synonyms:</strong> ${meaning.synonyms.join(", ")}</p>`;
          }

           
          if (meaning.antonyms && meaning.antonyms.length > 0) {
            html += `<p class="antonyms"><strong>Antonyms:</strong> ${meaning.antonyms.join(", ")}</p>`;
          }

          html += `</div>`;
        });

        resultContainer.innerHTML = html;

    })
    .catch(function (error){
        problem.textContent=error.message

    });
})
})


