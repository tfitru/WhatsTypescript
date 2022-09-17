// Import stylesheets
// import './style.css';
import fetch from 'node-fetch';
import { workerData } from 'worker_threads';

const URL : string = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const form: HTMLFormElement = document.querySelector('#defineform');
const deString = document.getElementById('definitions');
const Head = document.getElementById('header');



form.onsubmit = () => {
  const formData = new FormData(form);

  const text = formData.get('defineword') as string;
  const kyle = GetWords(text);
  console.log(kyle);

  Head!.innerHTML = text;

  let counter = 1;

  deString!.innerHTML = '';
    GetWords(text)
        .then(defintions => {
            defintions.forEach(d => {
              deString!.innerHTML += `<p>${counter}. ${d}</p>`;
              counter++;
            });
        })
        .catch(_ => {
          deString!.innerHTML += `<p class="lead">${text} isn't a word dumdum.</p>`;
        });


  return false; // prevent reload
};


type Word = {
  word: string;};

type GetWords = {
  data : Word[];};

async function GetWords(text: string){
  try {
    const response = await fetch(URL + text, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if(!response.ok){
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = (await response.json());

    console.log('result is: ', JSON.stringify(result, null, 4));

    return result[0].meanings.flatMap(m => m.definitions).flatMap(d => d.definition);

  } catch (error) {
    if(error instanceof Error){
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}




