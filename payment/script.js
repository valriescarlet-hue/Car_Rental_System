
function confirmPayment() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    let payment = document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    let message = document.getElementById("message");

    if (name === "" || email === "" || phone === "") {
        message.style.color = "red";
        message.innerHTML = "Please complete all information!";
        return;
    }

    message.style.color = "green";

    message.innerHTML =
        "Thank you, " + name +
        "! Your booking request using " +
        payment + " has been submitted.";
}
