

/* function loadDatabase() {

  loadJSON(function getJsonFromServer(json) {

    actions(json);

  })
}
 */

window.onload = function () {

  loadJSON(function getJsonFromServer(json) {

    actions(json);

  })


}

/////////////////////////////////////////////////////////////////////////////


function populateTable(obj) {
  function btnHeader(el) {

    let opNames = []
    for (const [key, value] of Object.entries(el["ops"])) {
      opNames.push(`
      <tr>
      <td>${key}</td>
      <td>${value["time"]}</td>
      <td data-content="${value["mix"]}">${value["mix"]}</td>
      <td data-content="${value["inserts"]}" >${value["inserts"]}</td>
      <td data-content="${value["revisionNotes"]}">${value["revisionNotes"]}</td>
    </tr>     
      `)
    }

    let dateClosed
    if (el["dateClosed"] != "") { dateClosed = new Date(el["dateClosed"]).toLocaleDateString() } else { dateClosed = "" }

    /* let jobState
    if (el["dateClosed"] != "") { jobState = "Closed" } else { jobState = "Open" } */



    return `
<button type="button" class="collapsible" id="${el["id"]}" >   
<p>${el["year"]}</p>
<p>${el["client"]}</p>
<p>${el["programName"].toString()}</p>
<p>${el["episodeName"]}</p>
<p>${new Date(el["dateCreated"]).toLocaleDateString()}</p>
<p>${dateClosed}</p>
<p>${el["jobState"]}</p>
<p>${el["id"]}</p>
</button>
<div class="content">
<table class="jobInfoTable">
<thead>
  <tr>
    <td>Op. Name</td>
    <td>Duration min.</td>
    <td>Mix</td>
    <td>Inserts</td>
    <td>Inserts Notes</td>
  </tr>
</thead>
<tbody>
 ${opNames.join("")}
</tbody>
</table>
<button onclick="deleteJsonEntry(${el["id"]})" type="button" class="collapsibleEditBtn deleteBtn">Delete</button>
<button onclick="goToPage('Edit',${el["id"]})" type="button" class="collapsibleEditBtn">Edit</button>
<button onclick="goToPage('New-From-Edit',${el["id"]})" type="button" class="collapsibleEditBtn">New Job</button>
</div>`

  }

  /* <button onclick="location.href='index-3.html'" type="button" class="collapsibleEditBtn" >Edit</button> */

  function createBtnList(obj) {
    const btnDiv = document.getElementById("btnDiv");
    for (var i = 0; i < obj.length; i++) {
      const butt = document.createElement("button");
      butt.classList.add("btnChild")
      butt.innerHTML = btnHeader(obj[i]);
      btnDiv.appendChild(butt);

    }

  }
  document.getElementById("btnDiv").innerHTML = ""
  createBtnList(obj)


}



///   Navigate to edit or new pages version
function goToPage(btnName, idNumber) {
  localStorage.setItem('jobPage', btnName);
  localStorage.setItem("idNumber", idNumber)
  window.location.href = 'index-2.html';
}






function actions(json) {

  populateTable(json);
  localStorage.setItem("currentList", JSON.stringify(json))
  addOnCliCkEvent()

  const yearSel = document.getElementById("yearBtn");
  const clientSel = document.getElementById("clientBtn");
  const programNameSel = document.getElementById("programNameBtn");
  const episodeNameSel = document.getElementById("episodeNameBtn");




  ///  Get Year
  const getElJson = json.map((x) => x["year"]);
  const availableData = [...new Set(getElJson)].sort((a, b) => b - a);
  for (let i = 0; i < availableData.length; i++) {
    yearSel.options[yearSel.options.length] = new Option(availableData[i], availableData[i]);
  }

  let yearObj
  yearSel.onchange = function () {
    ///  Get Client
    yearObj = genSearchResult(json, "year", yearSel.value);

    populateTable(yearObj);

    localStorage.setItem("currentList", JSON.stringify(yearObj))
    addOnCliCkEvent()
    const getClientObj = yearObj.map((x) => x["client"]);
    const availableData = [...new Set(getClientObj)].sort((a, b) => b - a);
    for (let i = 0; i < availableData.length; i++) {
      clientSel.options[clientSel.options.length] = new Option(availableData[i], availableData[i]
      );
    }
  };

  let clientObj
  clientSel.onchange = function () {
    ///  Get Program Name
    clientObj = genSearchResult(yearObj, "client", clientSel.value);

    const getProgramNameObj = clientObj.map((x) => x["programName"]);
    const availableData = [...new Set(getProgramNameObj)].sort((a, b) => b - a);
    for (let i = 0; i < availableData.length; i++) {
      programNameSel.options[programNameSel.options.length] = new Option(availableData[i], availableData[i]
      );
    }

    populateTable(clientObj);
    localStorage.setItem("currentList", JSON.stringify(clientObj))
    addOnCliCkEvent()
  };

  let programNameObj
  programNameSel.onchange = function () {
    ///  Get Program titles
    programNameObj = genSearchResult(clientObj, "programName", programNameSel.value);

    const getEpisodeNameOBJ = programNameObj.map((x) => x["episodeName"]);
    const availableData = [...new Set(getEpisodeNameOBJ)].sort((a, b) => b - a);
    for (let i = 0; i < availableData.length; i++) {

      episodeNameSel.options[episodeNameSel.options.length] = new Option(availableData[i], availableData[i]
      );
    }

    populateTable(programNameObj);
    localStorage.setItem("currentList", JSON.stringify(programNameObj))
    addOnCliCkEvent()
  };

  let episodeNameObj
  episodeNameSel.onchange = function () {
    ///  Get Program titles
    episodeNameObj = genSearchResult(programNameObj, "episodeName", episodeNameSel.value);

    populateTable(episodeNameObj);
    localStorage.setItem("currentList", JSON.stringify(episodeNameObj))
    addOnCliCkEvent()
  };

  ///////    DATE SEARCH   //////
  const dateStart = document.getElementById("dateStart");
  const dateEnd = document.getElementById("dateEnd");
  const dateCreatedCbx = document.getElementById("checkBox");
  const dateCreatedLable = document.getElementById("dateCreatedLable");

  dateCreatedCbx.onchange = function () {
    if (dateCreatedLable.innerHTML === "Searching by Date Created") {
      dateCreatedLable.innerHTML = "Searching by Date Opened";
    } else {
      dateCreatedLable.innerHTML = "Searching by Date Created";
    }
  };


  dateEnd.onchange = function () {
    let dateCreatedClosed;

    dateCreatedCbx.checked ? dateCreatedClosed = "dateCreated" : dateCreatedClosed = "dateClosed";

    const dateSearch = dateSearchResult(json, dateCreatedClosed, dateStart.value, dateEnd.value);

    populateTable(dateSearch);
    localStorage.setItem("currentList", JSON.stringify(dateSearch))
    addOnCliCkEvent()
  };

  ///////////////////////////////////////////////////////////////////////

  //  Open/close job bottun
  function addOnCliCkEvent() {
    let coll = document.getElementsByClassName("collapsible");

    let i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }





  /////////            SORTING SYSTEM          ///////////////////          /////////////////
  function sortTdNumbers(keyName) {
    const r = localStorage.getItem("r")
    let currentList = localStorage.getItem("currentList")
    let list = JSON.parse(currentList)

    let sortedList
    if (r == 1) {
      sortedList = list.filter(Boolean).sort((a, b) => +b[keyName] - +a[keyName])
      localStorage.setItem("r", 0)
    } else {
      sortedList = list.filter(Boolean).sort((a, b) => +a[keyName] - +b[keyName])
      localStorage.setItem("r", 1)
    }
    return sortedList
  }

  function sortTdDate(keyName) {
    const r = localStorage.getItem("r")
    let currentList = localStorage.getItem("currentList")
    let list = JSON.parse(currentList)

    let sortedList
    if (r == 1) {
      sortedList = list.filter(Boolean).sort((a, b) => new Date(a[keyName]).getTime() - new Date(b[keyName]).getTime())
      localStorage.setItem("r", 0)
    } else {
      sortedList = list.filter(Boolean).sort((a, b) => new Date(b[keyName]).getTime() - new Date(a[keyName]).getTime())
      localStorage.setItem("r", 1)
    }
    return sortedList
  }

  function sortTdLeters(keyName) {
    const r = localStorage.getItem("r")
    let currentList = localStorage.getItem("currentList")
    let list = JSON.parse(currentList)

    let sortedList
    if (r == 1) {
      sortedList = list.sort((a, b) => b[keyName].toLowerCase().localeCompare(a[keyName].toLowerCase()))
      localStorage.setItem("r", 0)
    } else {
      sortedList = list.sort((a, b) => a[keyName].toLowerCase().localeCompare(b[keyName].toLowerCase()))
      localStorage.setItem("r", 1)
    }
    return sortedList
  }



  let yearTd = document.getElementById("yearTd")
  yearTd.addEventListener("click", function () {
    populateTable(sortTdNumbers("year"))
    addOnCliCkEvent()
  })

  let clientTd = document.getElementById("clientTd")
  clientTd.addEventListener("click", function () {
    populateTable(sortTdLeters("client"))
    addOnCliCkEvent()
  })

  let programNameTd = document.getElementById("programNameTd")
  programNameTd.addEventListener("click", function () {
    populateTable(sortTdLeters("programName"))
    addOnCliCkEvent()
  })

  let episodeNameTd = document.getElementById("episodeNameTd")
  episodeNameTd.addEventListener("click", function () {
    populateTable(sortTdLeters("episodeName"))
    addOnCliCkEvent()
  })

  let dateCreatedTd = document.getElementById("dateCreatedTd")
  dateCreatedTd.addEventListener("click", function () {
    populateTable(sortTdDate("dateCreated"))
    addOnCliCkEvent()
  })

  let dateClosedTd = document.getElementById("dateClosedTd")
  dateClosedTd.addEventListener("click", function () {
    populateTable(sortTdDate("dateClosed"))
    addOnCliCkEvent()
  })

  let jobStateTd = document.getElementById("jobStateTd")
  jobStateTd.addEventListener("click", function () {
    populateTable(sortTdLeters("jobState"))
    addOnCliCkEvent()
  })

  let idTd = document.getElementById("idTd")
  idTd.addEventListener("click", function () {
    populateTable(sortTdNumbers("id"))
    addOnCliCkEvent()
  })
  /////////     END OF       SORTING SYSTEM          ///////////////////          /////////////////






}//  --------  END OF ACTIONS FUNCTION --------  ///










////    ADVANCE SEARCH FUNCTIONS   /////

///////////////  SEARCH year / client / programName / programTitle
/**
 * @param {Object} object
 * @param {string} objKey
 * @param {string} search
 */
function genSearchResult(object, objKey, search) {
  let filter;
  if (object.some((x) => x.hasOwnProperty(objKey))) {
    filter = object.filter(x => x[objKey].includes(search));
  }
  return filter;
}

//////////////////// Data search  / dateCreated / dateClosed

// Data search  / dateCreated / dateClosed
//log(dateSearchResult(recallppaDataBase, 'dateClosed', "2021-01-08", "2021-03-08")

/**
 * @param {Object} object
 * @param {string} objKey
 * @param {string} startDate
 * @param {string} endDate
 */
function dateSearchResult(object, objKey, startDate, endDate) {
  let filter;
  if (object.some((item) => item.hasOwnProperty(objKey))) {
    filter = object.filter(
      (item) =>
        item[objKey] >= new Date(startDate).toISOString() &&
        item[objKey] <= new Date(endDate).toISOString()

      /*   new Date( item[objKey]).getDate() >= new Date(startDate).getDate() &&
        new Date(  item[objKey]).getDate() <= new Date(endDate).getDate() */

    );
  }

  return filter;
}
