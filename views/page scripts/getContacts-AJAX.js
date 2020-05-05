let request = new XMLHttpRequest();

function getContacts() {
    request.onreadystatechange = getContactsResult;
    request.onerror = (err => {
        console.log(err);
    });
    request.open("GET", "/getContacts", true);
    request.send(null);
}

function getContactsResult() {
    if (request.readyState === 4 && request.status === 200) {
        let contactsArr = JSON.parse(request.response);
        showContacts(contactsArr);
    }
}

//functions for "delete" request
function deleteContact(contact) {
    request.onreadystatechange = deleteContactResult;
    request.onerror = (err => {
        console.log(err);
    });
    request.open("POST", "/deleteContact", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(contact);
}
function deleteContactResult() {
    if (request.readyState === 4 && request.status === 200) {
        alert("contact has been deleted!");
    }
}

//functions for "edit" request
function editContact(contact) {
    request.onreadystatechange = editContactResult;
    request.onerror = (err => {
        console.log(err);
    });
    request.open("POST", "/editContact", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(contact);
}
function editContactResult() {
    if (request.readyState === 4 && request.status === 200) {
        alert("contact has been edited!");
    }
}




function showContacts(contactsArr){
    document.getElementById("contacts-container").innerHTML = '';

    // let header1 = document.createElement("span");
    // header1.id = "header1";
    // header1.textContent = "User contacts: ";
    // // document.getElementById("header1").innerHTML = '';
    // document.getElementById("contacts-container").insertAdjacentElement("beforebegin", header1);
    

    contactsArr.forEach(contact => {
        let contactDiv = document.createElement("div");
        contactDiv.id = contact._id;
        contactDiv.className = "contact-div";

        let edit_bttn = document.createElement("button");
        edit_bttn.textContent = "Edit contact";
        edit_bttn.className = "contact-bttns";
        edit_bttn.onclick = function edit() {
            let i = 0;
            for (let key in contact) {
                if (key !== "_id") {
                    // replace contact content by inputs for editing and button for delete the property
                    let edit_div = document.createElement("div");

                    let deletePropBttn = document.createElement("button");
                    deletePropBttn.id = "delete" + i;
                    deletePropBttn.textContent = "Delete";
                    deletePropBttn.onclick = function () {
                        for (let k = 0; k < document.getElementById(contact._id).children.length - 1; k++) {
                            if (this.id === "delete" + k) {
                                document.getElementById("editing" + k).value = ''; //clear input from data
                                document.getElementById(contact._id).children.item(k).style = "display: none"; //remove property
                            }
                        }
                    }

                    let input = document.createElement("input");
                    input.id = "editing" + i;
                    input.style = "width: 80%";
                    input.value = contact[key];
                    edit_div.insertAdjacentElement("afterbegin", deletePropBttn);
                    edit_div.insertAdjacentElement("afterbegin", input);

                    document.getElementById(contact._id).children.item(i).replaceChild(edit_div, document.getElementById(contact._id).children.item(i).children.item(1));
                    i++;
                }
            }
            //choose "Edit contact" button in element
            let editButton = document.getElementById(contact._id).children.item(document.getElementById(contact._id).children.length - 1).children.item(1);
            editButton.textContent = "OK";
            editButton.onclick = function () {
                let editedContact = {};

                for (let k = 0; k < document.getElementById(contact._id).children.length - 1; k++) {
                    let edited_input = document.getElementById("editing" + k);
                    editedContact["_id"] = contact._id;

                    let contact_key = document.getElementById(contact._id).children.item(k).children.item(0).textContent; //"key: "
                    contact_key = contact_key.slice(0, contact_key.length - 2)
                    editedContact[contact_key] = edited_input.value;
                }
                editContact(JSON.stringify(editedContact));
                window.location.reload();
            }
            //change start "delete" bttn to "Add new param" bttn 
            let deleteButton = document.getElementById(contact._id).children.item(document.getElementById(contact._id).children.length - 1).children.item(0);
            deleteButton.textContent = "Add new param";
            deleteButton.onclick = function () {
                let newParam = prompt("Enter new param:", "");

                if(newParam.indexOf(".") !== -1){
                    alert("You can't add property with \".\" symbol");
                }

                if (newParam !== null && newParam !== "" && newParam.trim() !== "" && newParam.indexOf(".") === -1) {
                    let paramsAmount = document.getElementById(contact._id).children.length - 1;
                    let paramDiv = document.createElement("div");// div for new param

                    let paramContent = document.createElement("input");//input for new param
                    paramContent.type = "text";
                    paramContent.id = "editing" + paramsAmount;// new element id

                    let paramHeader = document.createElement("span");
                    paramHeader.textContent = newParam + ": ";

                    //<div><span>paramHeader:</span><input></div>
                    paramDiv.insertAdjacentElement("afterbegin", paramContent);
                    paramDiv.insertAdjacentElement("afterbegin", paramHeader);
                    //insert new param before buttons
                    document.getElementById(contact._id).children.item(document.getElementById(contact._id).children.length - 1).insertAdjacentElement("beforebegin", paramDiv);
                }
            }
        };
        //start "delete" bttn
        let delete_bttn = document.createElement("button");
        delete_bttn.textContent = "Delete contact";
        delete_bttn.className = "contact-bttns";
        delete_bttn.onclick = function () {
            deleteContact(JSON.stringify(contact));
            window.location.reload();
        };

        //starting content of div
        let contact_bttns_div = document.createElement("div");
        contact_bttns_div.className = "contact_bttns_div";

        for (let key in contact) {
            if (key !== "_id") {
                let contact_information = document.createElement("div");
                let contact_prop = document.createElement("span");
                contact_prop.textContent = key + ": ";
                contact_prop.style = "font-size: 15px; font-weight: bold; margin-left: 5px; margin-right: 5px;";

                let contact_prop_content = document.createElement("span");
                contact_prop_content.id = key;
                contact_prop_content.textContent = contact[key];

                contact_information.insertAdjacentElement("afterbegin", contact_prop_content);
                contact_information.insertAdjacentElement("afterbegin", contact_prop);

                contactDiv.insertAdjacentElement("beforeend", contact_information);
            }
        }
        contact_bttns_div.insertAdjacentElement("afterbegin", edit_bttn);
        contact_bttns_div.insertAdjacentElement("afterbegin", delete_bttn);

        contactDiv.insertAdjacentElement("beforeend", contact_bttns_div);

        document.getElementById("contacts-container").insertAdjacentElement("afterbegin", contactDiv);
    });
}


//function for filtering contacts
function getFilteredContacts(){

    request.onreadystatechange = getFilteredContactsResult;
    request.onerror = (err => {
        console.log(err);
    }); 
    request.open("GET", "/getFilteredContacts", true);
    request.send(null);
}


function getFilteredContactsResult(){
    if(request.status === 200 && request.readyState === 4){
        let filter_name = document.getElementById("filter_name").value;
        let filter_prop = document.getElementById("filter_content").value;
        
        let contactsArr = JSON.parse(request.response);
        let sortedContacts = [];
        for(let i = 0; i < contactsArr.length; i++){
            if(contactsArr[i].hasOwnProperty(filter_name)){
                if(contactsArr[i][filter_name] === filter_prop){
                    sortedContacts.push(contactsArr[i]);
                }
            }
        }
        showContacts(sortedContacts);
    }
}
