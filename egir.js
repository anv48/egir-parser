const fetch = require('node-fetch');
const parser = require('node-html-parser');
fs = require('fs');


async function loadPage(url){

    const response = await fetch(url);
    const body = await response.text();

    const root = parser.parse(body);
    const table=root.querySelector(".table-striped");
    const trList=table.childNodes;
    const result={};
    for(let i=0;i<table.childNodes.length;i++){
        const tr=trList[i];
        const key=tr.childNodes[0].text;
        const value=tr.childNodes[1].text;
        result[key]=value;
    }

    const h3List=root.querySelectorAll("h3.largeText");

        for(let i=0;i<h3List.length;i++){
        result[h3List[i].text]=h3List[i].nextElementSibling.text;
    }

    //console.log(JSON.stringify(result));
    return result;

}

async function loadAllPages(){

    const allBirds={};

    for(let i=1;i<=250;i++){
        console.log(`load bird number ${i} `)
        const birdInfo=await loadPage(`https://www.egir.ru/bird/${i}.html`)
        const birdName=birdInfo["Название вида:"];
        allBirds[birdName]=birdInfo;
        }

    return allBirds;

}

async function saveToFile(fileName){
    
    const res=await loadAllPages();
    fs.writeFile(fileName, JSON.stringify(res), function (err) {
        console.log(err);
      });
}

saveToFile("egir.json")



