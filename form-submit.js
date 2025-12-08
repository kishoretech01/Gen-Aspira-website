// ===================== FORM SUBMIT HANDLER =====================
document.getElementById("applyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"></span>
        Submitting...
    `;

    const payload = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        qualification: document.getElementById("qualification").value.trim(),
        message: document.getElementById("message").value.trim(),
        form_type: "apply"
    };

    console.log("Sending payload:", payload);

    try {
        const res = await fetch("http://localhost:8000/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log("Backend Response:", res.status);

        if (res.ok) {
            showSuccessToast();
            document.getElementById("applyForm").reset();

            // FIX MODAL & SCROLL FREEZE
            setTimeout(() => {
                const modalElement = document.getElementById("applyModal");
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.hide();

                // Remove leftover backdrops
                document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());

                // Restore page scroll
                document.body.classList.remove("modal-open");
                document.body.style.overflow = "auto";

            }, 600);

        } else {
            alert("Submission failed.");
        }

    } catch (error) {
        console.error("Request failed:", error);
        alert("Network error. Try again.");
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = "Submit";
});


// ===================== INPUT FILTER LOGIC =====================
function filterNameInput(input) { input.value = input.value.replace(/[^A-Za-z ]/g, ""); }
function filterPhoneInput(input) { input.value = input.value.replace(/[^0-9]/g, ""); }
function filterQualificationInput(input) { input.value = input.value.replace(/[^A-Za-z ]/g, ""); }
function filterEmailInput(input) { input.value = input.value.replace(/[^a-zA-Z0-9@._-]/g, ""); }


// ===================== VALIDATION =====================
function isValidEmail(email) { return /^\S+@\S+\.\S+$/.test(email); }

function validateForm() {
    let valid = true;

    const name      = document.getElementById("name");
    const email     = document.getElementById("email");
    const phone     = document.getElementById("phone");

    const nameError  = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");

    // NAME
    if (!/^[A-Za-z ]{3,}$/.test(name.value.trim())) {
        name.classList.add("error-input");
        nameError.classList.remove("d-none");
        valid = false;
    } else {
        name.classList.remove("error-input");
        nameError.classList.add("d-none");
    }

    // EMAIL
    if (!isValidEmail(email.value.trim())) {
        email.classList.add("error-input");
        emailError.classList.remove("d-none");
        valid = false;
    } else {
        email.classList.remove("error-input");
        emailError.classList.add("d-none");
    }

    // PHONE
    if (!/^[0-9]{10}$/.test(phone.value.trim())) {
        phone.classList.add("error-input");
        phoneError.classList.remove("d-none");
        valid = false;
    } else {
        phone.classList.remove("error-input");
        phoneError.classList.add("d-none");
    }

    return valid;
}


// ===================== SUCCESS TOAST =====================
function showSuccessToast() {
    const toast = document.getElementById("successToast");
    toast.style.display = "block";

    setTimeout(() => { toast.style.display = "none"; }, 2500);
}

function fullyUnlockScroll() {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    // Remove ALL leftover bootstrap locks
    document.body.style.position = "static";
    document.body.style.paddingRight = "0px";
}

setInterval(fullyUnlockScroll, 300);
