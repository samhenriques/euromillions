

///   Load Defaults  ///////////   Load Defaults  ///////////   Load Defaults  ///////////   Load Defaults  ////////
window.onload = function () {


    const btnName = localStorage.getItem("jobPage")
    const idNumber = localStorage.getItem("idNumber")




    if (btnName == "Create New Job") {
        loadJSON(function getJsonFromServer(json) {
            formPageActions(json);
        })
        setDefaultYear("yearForm")
        setDefaultToday("dateCreatedForm")
        setDefaultJobState()
        document.getElementById("formPageHeader").innerHTML = "Create Ppa Job"
        document.getElementById("editJobBtn").remove();
        document.getElementById("clearAllOps").remove()
    }

    if (btnName == "Edit") {

      
        loadJSON(function getJsonFromServer(json) {
            editJob(json, idNumber);
        })


        document.getElementById("formPageHeader").innerHTML = "Edit Ppa Job";
        document.getElementsByTagName("body")[0].className = "editJob"
        pageFunctionality()

    }

    if (btnName == "New-From-Edit") {

       
        loadJSON(function getJsonFromServer(json) {
            editJob(json, idNumber);
            checkForDuplicateJob(json)

        })

        document.getElementById("formPageHeader").innerHTML = "Create Ppa Job";
        document.getElementsByTagName("body")[0].className = "new-from-edit"
        document.getElementById("editJobBtn").remove();
        pageFunctionality()

    }
}


///   Create Operators
function createNewOp() {

    const aNumber = 'a' + Number(new Date()).toString().slice(-6)
    const newElement = `
<tr>
    <td>
        <input list="list" onclick="resetList(this.id)" name="" placeholder="" id="${aNumber}" class="opName">
        <datalist id="list">
            <select type="text">
                <option value="" selected="selected"></option>
            </select>
            </datalist>
            </td>
            <td>
                <input type="number" name="" id="" placeholder="Min." class="opTime">
            </td>
            <td class="checkBoxForm">
            <input type="checkbox" class="opMix checkBoxForm">
            <span class="checkmark"></span>
        </td>
        <td class="checkBoxForm">
            <input type="checkbox" class="opInserts checkBoxForm">
            <span class="checkmark"></span>
        </td>
        <td class="checkBoxForm" style="padding-left: 42px">
            <input type="checkbox" class="opRevision checkBoxForm">
            <span class="checkmark"></span>
        </td>
</tr>
`
    function createBtnList() {
        const btnDiv = document.getElementById("operatorTable").getElementsByTagName('tbody')[0];
        const butt = document.createElement("tr");
        butt.innerHTML = newElement;
        btnDiv.appendChild(butt);

    }
    const NumberOfRows = document.getElementById("operatorTable").rows;

    if (NumberOfRows.length <= 7) {
        createBtnList()
    } else {
        alert("Contact Admin for more operator space.")
    }
}

function deleteOpRow() {

    const element = document.getElementById("operatorTable")
    const indexOfLastRow = element.rows.length - 1

    if (indexOfLastRow >= 2) {
        element.deleteRow(indexOfLastRow);

    }
}


function clearAllOps() {
    const element = document.getElementById("operatorTable")
    const lastRow = element.rows.length - 1

    for (i = lastRow; i > 1; i--) {
        element.deleteRow(i);
    }

    document.getElementsByClassName("opName")[0].value = ""

    document.getElementsByClassName("opTime")[0].value = ""

    document.getElementsByClassName("opMix")[0].checked = false
    document.getElementsByClassName("opInserts")[0].checked = false
    document.getElementsByClassName("opRevision")[0].checked = false
}





/// Page Functions
function formPageActions(json) {

    pageFunctionality()
    ///  Get operator names to Operator chooser dropdown
    getAvailableOperators(json, "operatorSelect1")




}


////    Page Functionality  //////////
function pageFunctionality() {
    ///   Job State Btn action
    const jobStateOption = document.getElementById("jobStateForm");
    jobStateOption.onchange = function () {

        if (jobStateOption.value === "Closed") {
            setDefaultToday("dateClosedForm")
        }
        if (jobStateOption.value === "Open") {

            document.getElementById("dateClosedForm").value = '';
        }
    }



    //  Date input behaviour
    const closedInput = document.getElementById("dateClosedForm")
    closedInput.onchange = () => {
        if (document.getElementById("dateClosedForm").value != "") {
            const selectElement = document.getElementById("jobStateForm")
            /*    selectElement.options[selectElement.selectedIndex].textContent == "Close"; */
            selectElement.selectedIndex = 2
        }

    }

}













/**
 * @param {string} frase
 */
function autoAcronym(frase) {

    const nameElement = document.getElementById("programNameForm")
    let abvElement = document.getElementById("programNameAbvForm")

    const year = new Date().getFullYear()
    const split = frase.split(" ").map(x => x.slice(0, 1)).join('').toUpperCase()

    abvElement.value = cleanUpSpecialChars(split) + "_" + year

    if (nameElement.value === "") {
        abvElement.value = ""
    };
};







function getAvailableOperators(json, elementId) {
    ///  Get Options to operator select
    const opSelelector = document.getElementById(elementId);
    ///  Get Operators
    const getOps = json.map((x) => Object.keys(x["ops"])).reduce((a, b) => a.concat(b)).map(x => x.slice(0, 1).toUpperCase() + x.slice(1))
    const availableOps = [...new Set(getOps)].sort((a, b) => b - a)
    for (let i = 0; i < availableOps.length; i++) {
        opSelelector.options[opSelelector.options.length] = new Option(availableOps[i], availableOps[i]
        );
    }
}

function resetList(elementId) {
    //   Reset name if clicked
    const operatorList = document.getElementById(elementId);
    operatorList.onmousedown = function () {
        operatorList.placeholder = operatorList.value
        operatorList.value = ''
    }
}




///   Global functions
function setDefaultYear(elementId) {
    document.getElementById(elementId).value = new Date().getFullYear()
}

function setDefaultToday(elementId) {
    const today = new Date().toISOString().split('T')[0].toString()
    document.getElementById(elementId).value = today
}

function setDefaultJobState() {
    const closedDate = document.getElementById("dateClosedForm")
    const jobState = document.getElementById("jobStateForm")

    if (closedDate.value == "") {
        jobState.selectedIndex = 1
    }

    if (closedDate.value != "") {
        jobState.selectedIndex = 2
    }

}



/////////////////////CHECK ERRORS IN FORM  /////////
function checkForDuplicateJob(json) {


    //  Get all from form
    const form = document.getElementById("jobForm");

    const {
        yearForm,
        programNameAbvForm,
        episodeNameForm,
    } = form.getElementsByTagName("input")



    const duplicateJob = json.some(x =>

        x["year"] == yearForm.value &&
        x["programNameAbv"] == programNameAbvForm.value &&
        x["episodeName"] == episodeNameForm.value

    )

    const dupYear = document.getElementById("yearForm")
    const dupPgmName = document.getElementById("programNameAbvForm")
    const dupEpName = document.getElementById("episodeNameForm")
    if (duplicateJob) {



        dupYear.classList.add("inputError")

        dupYear.oninput = function () {
            checkForDuplicateJob(json)
        }

        dupPgmName.classList.add("inputError")
        dupPgmName.oninput = function () {
            checkForDuplicateJob(json)
        }

        dupEpName.classList.add("inputError")
        dupEpName.oninput = function () {
            checkForDuplicateJob(json)
        }
    } else {
        dupYear.classList.remove("inputError")
        dupPgmName.classList.remove("inputError")
        dupEpName.classList.remove("inputError")
    }



}


function checkForFormErrors() {


    //  Get all inputs in class
    function checkValue(className) {
        let opValues = document.getElementsByClassName(className)

        let error
        Array.from(opValues).map(x => {

            if (x.value.toString() == "") {
                x.classList.add("inputError")

                x.onchange = function () {
                    if (x.value != "") { x.classList.remove("inputError") }
                }

            } else {
                x.classList.remove("inputError")
            }
        })
    }



    function checkErrorCorrection(elementId) {
        document.getElementById(elementId).oninput = function () {
            if (this.value != "") {
                document.getElementById(elementId).classList.remove("inputError")
            }
        }
    }

    //  Get all from form
    const form = document.getElementById("jobForm");

    const {
        yearForm,
        programNameAbvForm,
        episodeNameForm,
    } = form.getElementsByTagName("input")


    checkValue("opName")
    checkValue("opTime")

    if (yearForm.value == "") {
        document.getElementById("yearForm").classList.add("inputError")
        checkErrorCorrection("yearForm")
    }

    if (programNameAbvForm.value == "") {
        document.getElementById("programNameAbvForm").classList.add("inputError")
        checkErrorCorrection("programNameAbvForm")
    }

    if (episodeNameForm.value == "") {
        document.getElementById("episodeNameForm").classList.add("inputError")
        checkErrorCorrection("episodeNameForm")
    }

    ///   If any emenet with class inputError throw 0
    const errorClass = document.getElementsByClassName('inputError');

    if (errorClass.length >= 1) {
        throw 0
    }

}

////////////////////////////////    CREATE NEW JOB       /////////////////////////

function submitJob(btnName) {


    //  Get all inputs in class
    function getInputValues(className) {
        let opValues = document.getElementsByClassName(className)
        return Array.from(opValues).map(x => x.value.toString())
    }

    //  Get all checkBoxes in class
    function getCheckboxValues(className) {
        let opValues = document.getElementsByClassName(className)
        return Array.from(opValues).map(x => x.checked)
    }

    function deleteEntry(obj, idNumber) {
        obj.filter((x, i) => {
            if (x.id === idNumber) {
                obj.splice(i, 1)
            }
        })
    }


    //  Incremetn id number from main obj
    function incrementId(obj) {
        let n = obj.map(x => x.id).sort((a, b) => +b - +a)[0]
        return ++n
    }


    /// Get Op Info
    function getOpInfoFromForm() {
        //  Get op Names
        const opNames = getInputValues("opName")

        // Get op Times
        const opTimes = getInputValues("opTime")

        // Get op Mix
        const opMix = getCheckboxValues("opMix")

        // Get op Inserts
        const opInserts = getCheckboxValues("opInserts")

        // Get op Revision Notes
        const opRevNotes = getCheckboxValues("opRevision")

        // Create object with ops info
        let opsObject = {}
        for (let i = 0; i < opNames.length; i++) {

            let info = {
                mix: opMix[i],
                inserts: opInserts[i],
                time: opTimes[i],
                revisionNotes: opRevNotes[i]
            }

            opsObject[opNames[i]] = info
        }
        return opsObject
    }

    function getNewObject(id) {
        return {
            id: id,
            year: yearForm.value,
            client: clientNameForm.value,
            programName: programNameForm.value,
            programNameAbv: programNameAbvForm.value,
            episodeName: episodeNameForm.value,
            dateCreated: new Date(dateCreatedForm.value),
            dateEdited: new Date(),
            dateClosed: dateClosed,
            jobState: jobStateForm.value,
            notes: textArea,
            ops: getOpInfoFromForm()
        }
    }

    //  Get all from form
    const form = document.getElementById("jobForm");


    // Get all inputs from form
    const {
        yearForm,
        clientNameForm,
        programNameForm,
        programNameAbvForm,
        episodeNameForm,
        dateCreatedForm,
        dateClosedForm,
    } = form.getElementsByTagName("input")






    // Get all select from form
    const {
        jobStateForm,
    } = form.getElementsByTagName("select")

    // Get text area
    const textArea = form.getElementsByTagName("textarea")[0].value


    // Date Closed
    let dateClosed
    if (dateClosedForm.value != "") {
        dateClosed = new Date(dateClosedForm.value)
    } else {
        dateClosed = ""
    }



    loadJSON(function getJsonFromServer(json) {


        const idNumber = +localStorage.getItem("idNumber")

        if (btnName == "editJob") {

            deleteEntry(json, idNumber)

            json.push(getNewObject(idNumber))

            checkForFormErrors(json)

            if (!confirm('Are you sure you want to change this record?\nThis is not undoable!')) {
                throw 0
            }

            updateDatabase(json, `${idNumber} Edited`)

        } else if (btnName == "newJob") {

            checkForDuplicateJob(json)

            json.push(getNewObject(incrementId(json)))

            checkForFormErrors(json)

            updateDatabase(json, `${incrementId(json)} Created`)

        }
    });
}



/////////////////           EDIT JOB          /////////////////           EDIT JOB          /////////////////



function editJob(json, idNumber) {

    getAvailableOperators(json, "operatorSelect1")


    ///    Json of selected Id
    const infoInJson = json.filter(x => x["id"] == idNumber)[0]


    //  Get all from form
    const form = document.getElementById("jobForm");


    // Get all inputs from form
    const {
        yearForm,
        clientNameForm,
        programNameForm,
        programNameAbvForm,
        episodeNameForm,
        dateCreatedForm,
        dateClosedForm,
    } = form.getElementsByTagName("input")

    // Get all select from form
    const {
        jobStateForm,
    } = form.getElementsByTagName("select")

    // Text area
    const textArea = form.getElementsByTagName("textarea")[0]

    /// Get ops
    const ops = infoInJson["ops"]

    /// Create ops area
    for (let i = 0; i < Object.keys(ops).length - 1; i++) {
        createNewOp()
    }

    const rows = document.getElementById("operatorTable").rows

    for (let i = 1; i < rows.length; i++) {

        //  Inputs
        rows[i].getElementsByClassName("opName")[0].value = Object.keys(ops)[i - 1]
        rows[i].getElementsByClassName("opTime")[0].value = Object.values(ops)[i - 1]["time"]
        // Checkboxes
        rows[i].getElementsByClassName("opMix")[0].checked = Object.values(ops)[i - 1]["mix"]
        rows[i].getElementsByClassName("opInserts")[0].checked = Object.values(ops)[i - 1]["inserts"]
        rows[i].getElementsByClassName("opRevision")[0].checked = Object.values(ops)[i - 1]["revisionNotes"]
    }





    ///  Asign values from json
    yearForm.value = infoInJson["year"]
    clientNameForm.value = infoInJson["client"]
    programNameForm.value = infoInJson["programName"]
    programNameAbvForm.value = infoInJson["programNameAbv"]
    episodeNameForm.value = infoInJson["episodeName"]
    dateCreatedForm.value = infoInJson["dateCreated"].split("T")[0]
    dateClosedForm.value = infoInJson["dateClosed"].split("T")[0]
    jobStateForm.value = infoInJson["jobState"]
    textArea.value = infoInJson["notes"]


    setDefaultJobState()




}


