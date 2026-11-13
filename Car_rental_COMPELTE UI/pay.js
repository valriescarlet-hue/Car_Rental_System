
const paymentOptions = document.querySelectorAll(
    'input[name="payment"]'
);

const cardDetails = document.getElementById("cardDetails");

const cardInputs = [
    document.getElementById("cardName"),
    document.getElementById("cardNumber"),
    document.getElementById("expiry"),
    document.getElementById("cvv")
];

// SHOW OR HIDE CARD INPUTS
paymentOptions.forEach(option => {

    option.addEventListener("change", function() {

        if (this.value === "Credit/Debit Card") {

            cardDetails.classList.remove("hidden");

            cardInputs.forEach(input => {
                input.required = true;
            });

        } else {

            cardDetails.classList.add("hidden");

            cardInputs.forEach(input => {
                input.required = false;
                input.value = "";
            });

        }

    });

});


// CARD NUMBER FORMATTING
document.getElementById("cardNumber").addEventListener(
    "input",
    function() {

        let value = this.value.replace(/\D/g, "").slice(0, 16);

        this.value = value.match(/.{1,4}/g)?.join(" ") || "";

    }
);


// EXPIRY FORMATTING
document.getElementById("expiry").addEventListener(
    "input",
    function() {

        let value = this.value.replace(/\D/g, "").slice(0, 4);

        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }

        this.value = value;

    }
);


// CVV NUMBERS ONLY
document.getElementById("cvv").addEventListener(
    "input",
    function() {

        this.value = this.value.replace(/\D/g, "").slice(0, 4);

    }
);


// SUBMIT PAYMENT
document.getElementById("paymentForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        const payment = document.querySelector(
            'input[name="payment"]:checked'
        ).value;

        const message = document.getElementById("message");

        // CARD VALIDATION
        if (payment === "Credit/Debit Card") {

            const cardName = document.getElementById("cardName").value.trim();

            const cardNumber = document.getElementById("cardNumber")
                .value.replace(/\s/g, "");

            const expiry = document.getElementById("expiry").value;

            const cvv = document.getElementById("cvv").value;

            if (
                !cardName ||
                !/^\d{16}$/.test(cardNumber) ||
                !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ||
                !/^\d{3,4}$/.test(cvv)
            ) {

                message.style.color = "#ef4444";
                message.textContent = "Please check your card information.";

                return;
            }

        }

        // BOOKING INFORMATION
        const receipt = {

            name: name,
            email: email,
            phone: phone,

            payment: payment,

            car: "Toyota Sports Car",
            transmission: "Automatic Transmission",

            pickup: "Nov 15, 2026",
            returnDate: "Nov 18, 2026",
            duration: "3 Days",

            rentalFee: 3000,
            serviceFee: 300,
            tax: 200,
            total: 3500,

            date: new Date().toLocaleDateString()

        };

        // STORE RECEIPT DATA ONLY
        // Never store card number, expiry, or CVV.
        sessionStorage.setItem(
            "paymentReceipt",
            JSON.stringify(receipt)
        );

        // REDIRECT TO RECEIPT PAGE
        window.location.href = "reciept.html";

    }
);
