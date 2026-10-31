const applicationForm = document.getElementById("applicationForm");
const applicationContainer = document.getElementById("applicationContainer");

// File inputs
const profilePhoto = document.getElementById("profilePhoto");
const resume = document.getElementById("resume");

// File selection buttons
document.getElementById("photoButton").addEventListener("click", () => {
    profilePhoto.click();
});

document.getElementById("resumeButton").addEventListener("click", () => {
    resume.click();
});

// Display selected file names
profilePhoto.addEventListener("change", () => {
    document.getElementById("photoName").textContent =
        profilePhoto.files.length
            ? profilePhoto.files[0].name
            : "No photo selected";
});

resume.addEventListener("change", () => {
    document.getElementById("resumeName").textContent =
        resume.files.length
            ? resume.files[0].name
            : "No resume selected";
});

// Show validation error
function showError(id, message) {
    document.getElementById(id).textContent = message;
}

// Clear all validation errors
function clearErrors() {
    document.querySelectorAll("small").forEach((element) => {
        element.textContent = "";
    });
}

// Get selected gender
function getGender() {
    const selected = document.querySelector(
        'input[name="gender"]:checked'
    );

    return selected ? selected.value : "";
}

// Get selected skills
function getSkills() {
    return Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map((skill) => skill.value);
}

// Validate the form
function validateForm() {
    clearErrors();

    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const interviewTime = document.getElementById("interviewTime").value;
    const gender = getGender();
    const role = document.getElementById("role").value;
    const experience = document.getElementById("experience").value;
    const skills = getSkills();
    const coverLetter = document.getElementById("coverLetter").value.trim();
    const photo = profilePhoto.files[0];
    const resumeFile = resume.files[0];
    const terms = document.getElementById("terms").checked;

    // Full name
    if (name.length < 3) {
        showError("nameError", "Name must contain at least 3 characters.");
        isValid = false;
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showError("emailError", "Please enter a valid email address.");
        isValid = false;
    }

    // Phone number
    if (!/^[6-9]\d{9}$/.test(phone)) {
        showError("phoneError", "Enter a valid 10-digit Indian mobile number.");
        isValid = false;
    }

    // Password
    if (password.length < 8) {
        showError("passwordError", "Password must contain at least 8 characters.");
        isValid = false;
    } else if (!/[A-Z]/.test(password) ||
               !/[a-z]/.test(password) ||
               !/\d/.test(password)) {
        showError(
            "passwordError",
            "Include uppercase, lowercase, and a number."
        );
        isValid = false;
    }

    // Date of birth
    if (!dob) {
        showError("dobError", "Please select your date of birth.");
        isValid = false;
    } else {
        const birthDate = new Date(dob + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birthDate >= today) {
            showError("dobError", "Date of birth must be in the past.");
            isValid = false;
        }
    }

    // Interview time
    if (!interviewTime) {
        showError("timeError", "Please select an interview time.");
        isValid = false;
    }

    // Gender
    if (!gender) {
        showError("genderError", "Please select your gender.");
        isValid = false;
    }

    // Job role
    if (!role) {
        showError("roleError", "Please select a job role.");
        isValid = false;
    }

    // Experience
    if (
        experience === "" ||
        !Number.isFinite(Number(experience)) ||
        Number(experience) < 0 ||
        Number(experience) > 40
    ) {
        showError("experienceError", "Enter experience between 0 and 40 years.");
        isValid = false;
    }

    // Skills
    if (skills.length === 0) {
        showError("skillsError", "Please select at least one skill.");
        isValid = false;
    }

    // Cover letter
    if (coverLetter.length < 20) {
        showError(
            "coverLetterError",
            "Cover letter must contain at least 20 characters."
        );
        isValid = false;
    }

    // Profile photo
    if (!photo) {
        showError("photoError", "Please select a profile photo.");
        isValid = false;
    } else if (!photo.type.startsWith("image/")) {
        showError("photoError", "Please select a valid image.");
        isValid = false;
    } else if (photo.size > 5 * 1024 * 1024) {
        showError("photoError", "Photo size must not exceed 5 MB.");
        isValid = false;
    }

    // Resume
    if (!resumeFile) {
        showError("resumeError", "Please upload your resume.");
        isValid = false;
    } else {
        const allowedExtensions = /\.(pdf|doc|docx)$/i;

        if (!allowedExtensions.test(resumeFile.name)) {
            showError("resumeError", "Upload a PDF, DOC, or DOCX file.");
            isValid = false;
        } else if (resumeFile.size > 5 * 1024 * 1024) {
            showError("resumeError", "Resume size must not exceed 5 MB.");
            isValid = false;
        }
    }

    // Terms and conditions
    if (!terms) {
        showError("termsError", "Please accept the terms and conditions.");
        isValid = false;
    }

    return isValid;
}

// Safely create text elements
function createTextElement(tag, text, parent) {
    const element = document.createElement(tag);
    element.textContent = text;
    parent.appendChild(element);
    return element;
}

// Handle form submission
applicationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const application = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: document.getElementById("dob").value,
        interviewTime: document.getElementById("interviewTime").value,
        gender: getGender(),
        role: document.getElementById("role").value,
        experience: document.getElementById("experience").value,
        skills: getSkills(),
        coverLetter: document.getElementById("coverLetter").value.trim(),
        photo: profilePhoto.files[0],
        resume: resume.files[0]
    };

    displayApplication(application);

    alert("Job application submitted successfully!");

    applicationForm.reset();

    document.getElementById("photoName").textContent = "No photo selected";
    document.getElementById("resumeName").textContent = "No resume selected";
});

// Display application on the page
function displayApplication(application) {
    const card = document.createElement("div");
    card.className = "application-card";

    createTextElement("h3", application.name, card);
    createTextElement("p", "Email: " + application.email, card);
    createTextElement("p", "Phone: " + application.phone, card);
    createTextElement("p", "Date of Birth: " + application.dob, card);
    createTextElement("p", "Interview Time: " + application.interviewTime, card);
    createTextElement("p", "Gender: " + application.gender, card);
    createTextElement("p", "Job Role: " + application.role, card);
    createTextElement("p", "Experience: " + application.experience + " years", card);
    createTextElement("p", "Skills: " + application.skills.join(", "), card);
    createTextElement("p", "Cover Letter: " + application.coverLetter, card);
    createTextElement("p", "Profile Photo: " + application.photo.name, card);
    createTextElement("p", "Resume: " + application.resume.name, card);

    // Profile photo preview
    const image = document.createElement("img");
    image.src = URL.createObjectURL(application.photo);
    image.alt = "Applicant profile photo";
    image.width = 100;
    image.height = 100;
    image.style.objectFit = "cover";
    image.style.borderRadius = "50%";
    card.prepend(image);

    // Delete application button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete Application";
    deleteButton.className = "secondary-button";

    deleteButton.addEventListener("click", () => {
        URL.revokeObjectURL(image.src);
        card.remove();
    });

    card.appendChild(deleteButton);
    applicationContainer.prepend(card);
}