let request = new XMLHttpRequest();

function addNewParam() {
    let newParam = prompt("Enter new param:", "");
    if(newParam.indexOf(".") !== -1){
        alert("You can't add property with \".\" symbol");
    }
    if (newParam !== null && newParam !== "" && newParam.trim() !== ""  && newParam.indexOf(".") === -1) {
        let newElement = document.createElement("input");
        newElement.type = "text";
        newElement.id = newParam;
        newElement.className =  "add-Contact-Form-Elements";

        let newLabel = document.createElement("label");
        newLabel.className = "add-Contact-Form-Labels";
        newLabel.textContent = newParam + ":";

        document.getElementById("AddNewParam-bttn").insertAdjacentElement("beforebegin", newLabel);
        document.getElementById("AddNewParam-bttn").insertAdjacentElement("beforebegin", newElement);
    }
}

function sendContact() {

    let contactForm = document.forms["contactForm"];
    let contactObj = {};

    for (let i = 0; i < contactForm.elements.length - 1; i++) { // добавили свойства в отсылаемый объект
        if(contactForm.elements[i].value !== "" && contactForm.elements[i].value !== null && contactForm.elements[i].value.trim() !== ""){
            contactObj[contactForm.elements[i].id] = contactForm.elements[i].value;
        }
    }
    request.onreadystatechange = setContactResult;
    request.open("POST", "/setContact", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(contactObj));
}

function setContactResult() {
    if (request.readyState === 4 && request.status === 200) {
        let contactForm = document.forms["contactForm"];

        for (let i = 0; i < contactForm.elements.length - 2; i++) { // очистили поля формы
            contactForm.elements[i].value = "";
        }
        alert("Contact has been added!");
    }
}