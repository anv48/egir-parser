const fetch = require('node-fetch');
const parser = require('node-html-parser');
fs = require('fs');


async function loadPage(url){

    const response = await fetch(url);
    const body = await response.text();
    const root = parser.parse(body);

    const result={};
    const name=root.querySelector("h1");
    result["Название вида:"]=name.text;

    const table=root.querySelector(".table-hover");
    const trList=table.childNodes;
    
    for(let i=0;i<table.childNodes.length;i++){
        const tr=trList[i];
        const key=tr.childNodes[0].text;
        const value=tr.childNodes[1].text;
        result[key]=value;
    }

    const pList=root.querySelectorAll("div.post-content >p:not(.caption):not(.figure)");

    for(let i=0;i<pList.length;i++){
        const strong=pList[i].querySelector("strong");
        let key=strong?.text;
        let value=pList[i].text;
        if(!key){
            key="Описание"
        }
        else{
            value=value.split(".").splice(1).join(".").trim();    
            }
        result[key]=value;       
        }
    return result;
}


async function loadAllPages(url,len){

    const allBirds={};

    for(let i=1;i<=len;i++){
        console.log(`load bird number ${i} `)
        const birdInfo=await loadPage(url.replace("$i",i));
        const birdName=birdInfo["Название вида:"];
        allBirds[birdName]=birdInfo;
        }

    return allBirds;

}

async function saveToFile(){
    const res1=await loadAllPages("https://www.ebirds.ru/bird/$i.htm",290);
    fs.writeFile("ebirdsEurope.json", JSON.stringify(res1), function (err) {
        console.log(err);
      });
      const res2=await loadAllPages("https://www.ebirds.ru/vid/$i.htm",429);
    fs.writeFile("ebirdsRussia.json", JSON.stringify(res2), function (err) {
        console.log(err);
      });
}


saveToFile()



