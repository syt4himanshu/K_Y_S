guardPage(["student", "teacher", "admin"]);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wizardForm');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentStepSpan = document.getElementById('currentStep');
    const stepContents = document.querySelectorAll('.step-content');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const reviewContent = document.getElementById('reviewContent');
    let currentStep = 1;
    const totalSteps = stepContents.length;

    // Initialize form
    updateFormState();

    // Navigation button event listeners
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormState();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep) && currentStep < totalSteps) {
            currentStep++;
            updateFormState();
        } else if (currentStep === totalSteps && validateStep(currentStep)) {
            submitForm();
        }
    });

    // Update form state
    function updateFormState() {
        // Update step visibility
        stepContents.forEach((content, index) => {
            content.classList.toggle('active', index + 1 === currentStep);
        });

        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 === currentStep);
            indicator.classList.toggle('completed', index + 1 < currentStep);
        });

        // Update progress bar
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}%`;

        // Update navigation buttons
        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === totalSteps ? 'Submit' : 'Next →';
        currentStepSpan.textContent = currentStep;

        // Populate review content on final step
        if (currentStep === totalSteps) {
            populateReviewContent();
        }
    }

    // Validate current step
    function validateStep(step) {
        const currentStepContent = document.querySelector(`.step-content[data-step="${step}"]`);
        const requiredFields = currentStepContent.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (!field.value.trim()) {
                field.classList.add('error');
                errorMessage.style.display = 'block';
                isValid = false;
            } else {
                field.classList.remove('error');
                errorMessage.style.display = 'none';
            }

            // Additional validation for specific fields
            if (field.type === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    field.classList.add('error');
                    errorMessage.textContent = 'Please enter a valid email address';
                    errorMessage.style.display = 'block';
                    isValid = false;
                }
            }

            if (field.type === 'tel') {
                const phonePattern = /^\+?[\d\s-]{10,}$/;
                if (!phonePattern.test(field.value)) {
                    field.classList.add('error');
                    errorMessage.textContent = 'Please enter a valid phone number';
                    errorMessage.style.display = 'block';
                    isValid = false;
                }
            }

            if (field.id === 'gpa' && field.value) {
                const gpa = parseFloat(field.value);
                if (gpa < 0 || gpa > 10) {
                    field.classList.add('error');
                    errorMessage.textContent = 'SGPA must be between 0 and 10';
                    errorMessage.style.display = 'block';
                    isValid = false;
                }
            }

            if (field.id === 'semester' && field.value) {
                const semester = parseInt(field.value);
                if (semester < 1 || semester > 8) {
                    field.classList.add('error');
                    errorMessage.textContent = 'Semester must be between 1 and 8';
                    errorMessage.style.display = 'block';
                    isValid = false;
                }
            }

            if (field.id === 'resultSemester' && field.value) {
                const semester = parseInt(field.value);
                if (semester < 1 || semester > 8) {
                    field.classList.add('error');
                    errorMessage.textContent = 'Semester must be between 1 and 8';
                    errorMessage.style.display = 'block';
                    isValid = false;
                }
            }

            if (field.id === 'percentage' && field.value) {
                const percentage = parseFloat(field.value);
                if (percentage < 0 || percentage > 100) {
                    field.classList.add('error');
                    errorMessage.textContent = 'Percentage must be between 0 and 100';
                    errorMessage.style.display = 'block';
                    isValid = false;
                }
            }

            if (field.id === 'semesterPercentage' && field.value) {
                const percentage = parseFloat(field.value);
                if (percentage < 0 || percentage > 100) {
                    field.classList.add('error');
                    errorMessage.textContent = 'Percentage must be between 0 and 100';
                    errorMessage.style.display = 'block';
                    isValid = false;
                }
            }
        });

        // Special validation for checkbox group in step 7
        if (step === 7) {
            const checkboxes = currentStepContent.querySelectorAll('input[name="domainsOfInterest"]');
            const checked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            const errorMessage = currentStepContent.querySelector('.checkbox-group + .error-message');
            
            if (!checked) {
                errorMessage.style.display = 'block';
                isValid = false;
            } else {
                errorMessage.style.display = 'none';
            }
        }

        return isValid;
    }

    // Populate review content
    function populateReviewContent() {
        const formData = new FormData(form);
        let reviewHTML = '<h3>Review Your Information</h3>';

        // Group fields by step
        const sections = [
            {
                title: 'Personal Information',
                fields: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'misLoginUid', 'enrollmentNumber']
            },
            {
                title: 'Contact Information',
                fields: ['email', 'mobileNumber', 'country', 'permanentAddress', 'communicationAddress']
            },
            {
                title: 'Family Information',
                fields: ['fatherName', 'motherName', 'fatherOccupation', 'motherOccupation', 'fatherContact', 'motherContact', 'guardian']
            },
            {
                title: 'Academic Information',
                fields: ['rollNumber', 'semester', 'batchYear', 'yearOfStudy', 'program', 'gpa']
            },
            {
                title: 'Past Education',
                fields: ['qualification', 'boardUniversity', 'yearOfPassing', 'percentage']
            },
            {
                title: 'Semester Results',
                fields: ['resultSemester', 'result', 'backlogs', 'semesterPercentage']
            },
            {
                title: 'Skills & Technologies',
                fields: ['domainsOfInterest', 'programmingLanguages', 'technologiesFrameworks', 'toolsPlatforms', 'certificateCourses', 'projectResearchWork']
            },
            {
                title: 'Competitions & Events',
                fields: ['codingCompetitions', 'hackathonsIdeathons', 'paperPresentationsExhibitions']
            },
            {
                title: 'Interests & Activities',
                fields: ['motivation', 'thingsEnjoy', 'professionalMemberships', 'coCurricularParticipation', 'stateNationalParticipation', 'positionsHeld', 'awardsRecognitions', 'alumniConnect', 'industryConnect', 'familyEnvironment', 'stayingIn', 'personalProblems']
            },
            {
                title: 'Career Plan & SWOT Analysis',
                fields: ['careerPathPreferred', 'competitiveExams', 'currentStatus', 'desiredStatus', 'planSteps', 'departmentSupport', 'strengths', 'weaknesses', 'opportunities', 'threats', 'challenges']
            }
        ];

        sections.forEach(section => {
            reviewHTML += `<h4>${section.title}</h4><div class="review-section">`;
            section.fields.forEach(field => {
                if (field === 'domainsOfInterest') {
                    const interests = formData.getAll('domainsOfInterest');
                    if (interests.length > 0) {
                        reviewHTML += `<p><strong>Domains of Interest:</strong> ${interests.join(', ')}</p>`;
                    }
                } else {
                    const value = formData.get(field);
                    if (value) {
                        const label = document.querySelector(`label[for="${field}"]`)?.textContent.replace(' *', '') || field;
                        reviewHTML += `<p><strong>${label}:</strong> ${value}</p>`;
                    }
                }
            });
            reviewHTML += '</div>';
        });

        reviewContent.innerHTML = reviewHTML;
    }

    // Handle form submission
    function submitForm() {
        if (validateStep(currentStep)) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.domainsOfInterest = formData.getAll('domainsOfInterest');
            
            // Simulate form submission (replace with actual API call)
            console.log('Form submitted:', data);
            alert('Form submitted successfully! Check console for form data.');
            
            // Reset form
            form.reset();
            currentStep = 1;
            updateFormState();
        }
    }

    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateStep(currentStep);
            }
        });
    });
});