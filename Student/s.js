

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

        // Show/hide placement reason field based on selection
        const campusPlacement = document.getElementById('campusPlacement');
        const placementReasonRow = document.getElementById('placementReasonRow');

        if (campusPlacement) {
            if (campusPlacement.value === 'no') {
                placementReasonRow.style.display = 'block';
            } else {
                placementReasonRow.style.display = 'none';
            }

            // Add event listener if not already added
            if (!campusPlacement.hasListener) {
                campusPlacement.addEventListener('change', function () {
                    if (this.value === 'no') {
                        placementReasonRow.style.display = 'block';
                    } else {
                        placementReasonRow.style.display = 'none';
                    }
                });
                campusPlacement.hasListener = true;
            }
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
                if (errorMessage) errorMessage.style.display = 'block';
                isValid = false;
            } else {
                field.classList.remove('error');
                if (errorMessage) errorMessage.style.display = 'none';
            }

            // Additional validation for specific fields
            if (field.type === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    field.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid email address';
                        errorMessage.style.display = 'block';
                    }
                    isValid = false;
                }
            }

            if (field.type === 'tel') {
                const phonePattern = /^\+?[\d\s-]{10,}$/;
                if (!phonePattern.test(field.value)) {
                    field.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid phone number';
                        errorMessage.style.display = 'block';
                    }
                    isValid = false;
                }
            }

            // Validate admission year
            if (field.id === 'admissionYear' && field.value) {
                const year = parseInt(field.value);
                const currentYear = new Date().getFullYear();
                if (year < 2000 || year > currentYear) {
                    field.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid admission year';
                        errorMessage.style.display = 'block';
                    }
                    isValid = false;
                }
            }

            // Validate semester fields
            if ((field.id === 'semester' || field.id === 'resultSemester') && field.value) {
                const semester = parseInt(field.value);
                if (semester < 1 || semester > 8) {
                    field.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Semester must be between 1 and 8';
                        errorMessage.style.display = 'block';
                    }
                    isValid = false;
                }
            }

            // Validate percentage fields
            if ((field.id === 'percentage' || field.id === 'semesterPercentage') && field.value) {
                const percentage = parseFloat(field.value);
                if (percentage < 0 || percentage > 100) {
                    field.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Percentage must be between 0 and 100';
                        errorMessage.style.display = 'block';
                    }
                    isValid = false;
                }
            }
        });

        // Special validation for checkbox group in step 8 (career objectives)
        if (step === 8) {
            const checkboxes = currentStepContent.querySelectorAll('input[name="careerObjective"]');
            const checked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            const errorMessage = currentStepContent.querySelector('.checkbox-group + .error-message');

            if (!checked) {
                if (errorMessage) errorMessage.style.display = 'block';
                isValid = false;
            } else {
                if (errorMessage) errorMessage.style.display = 'none';
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
                title: 'Student\'s Personal Information',
                fields: ['department', 'fullName', 'semesterSection', 'rollNo', 'admissionYear', 'mobile', 'email', 'linkedin', 'permanentAddress']
            },
            {
                title: 'Parent\'s Information',
                fields: ['fatherName', 'fatherMobile', 'fatherEmail', 'fatherOccupation', 'motherName', 'motherMobile', 'motherEmail', 'motherOccupation']
            },
            {
                title: 'Academic Information (Before Admission)',
                fields: ['sscPercentage', 'sscYear', 'hsscPercentage', 'hsscYear', 'diplomaPercentage', 'diplomaYear', 'entranceExam', 'entranceScore', 'entranceYear', 'otherQualification', 'otherPercentage', 'otherYear']
            },
            {
                title: 'Academic Information (After Admission)',
                fields: ['sem1Year', 'sem1SGPA', 'sem1Rank', 'sem1Awards', 'sem2Year', 'sem2SGPA', 'sem2Rank', 'sem2Awards', 'sem3Year', 'sem3SGPA', 'sem3Rank', 'sem3Awards', 'sem1Backlogs', 'sem2Backlogs', 'sem3Backlogs']
            },
            {
                title: 'Performance in Career Development Activities',
                fields: ['aptitudeScore', 'aptitudeDate', 'cocubesScore', 'cocubesDate', 'gatecatScore', 'gatecatDate', 'otherExamName', 'otherExamScore', 'otherExamDate']
            },
            {
                title: 'Project and Internship Details',
                fields: ['microProjectTitle', 'microProjectGuide', 'majorProjectTitle', 'majorProjectGuide', 'internship1Company', 'internship1Domain', 'internship1Type', 'internship1Paid', 'internship1Start', 'internship1End', 'internship2Company', 'internship2Domain', 'internship2Type', 'internship2Paid', 'internship2Start', 'internship2End']
            },
            {
                title: 'Co-Curricular Activities',
                fields: [] // Will be handled separately
            },
            {
                title: 'Career Objectives and Skills',
                fields: ['careerObjective', 'careerDetails', 'careerPreparedness', 'campusPlacement', 'placementReason', 'interpersonalSkills', 'softSkills', 'additionalSkills', 'expectations', 'mentorSignature']
            }
        ];

        sections.forEach(section => {
            let sectionHasContent = false;
            let sectionHTML = `<h4>${section.title}</h4><div class="review-section">`;

            section.fields.forEach(field => {
                if (field === 'careerObjective') {
                    const interests = formData.getAll('careerObjective');
                    if (interests.length > 0) {
                        sectionHTML += `<p><strong>Career Objectives:</strong> ${interests.join(', ')}</p>`;
                        sectionHasContent = true;
                    }
                } else {
                    const value = formData.get(field);
                    if (value) {
                        const label = document.querySelector(`label[for="${field}"]`)?.textContent?.replace(' *', '') ||
                            document.querySelector(`label[for="${field}"]`)?.textContent || field;
                        sectionHTML += `<p><strong>${label}:</strong> ${value}</p>`;
                        sectionHasContent = true;
                    }
                }
            });

            sectionHTML += '</div>';

            if (sectionHasContent) {
                reviewHTML += sectionHTML;
            }
        });

        // Handle co-curricular activities separately
        const activityRows = document.querySelectorAll('.activity-row');
        if (activityRows.length > 0) {
            reviewHTML += '<h4>Co-Curricular Activities</h4><div class="review-section">';

            activityRows.forEach((row, index) => {
                const inputs = row.querySelectorAll('input, select');
                let activityText = '';

                inputs.forEach(input => {
                    if (input.value) {
                        const label = input.parentElement.querySelector('label')?.textContent ||
                            input.getAttribute('placeholder') ||
                            input.name;
                        activityText += `${label}: ${input.value}, `;
                    }
                });

                if (activityText) {
                    reviewHTML += `<p><strong>Activity ${index + 1}:</strong> ${activityText.slice(0, -2)}</p>`;
                }
            });

            reviewHTML += '</div>';
        }

        reviewContent.innerHTML = reviewHTML;
    }

    // Handle form submission
    function submitForm() {
        if (validateStep(currentStep)) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.careerObjective = formData.getAll('careerObjective');

            // Collect co-curricular activities
            const activities = [];
            document.querySelectorAll('.activity-row').forEach(row => {
                const activityData = {};
                row.querySelectorAll('input, select').forEach(input => {
                    if (input.value) {
                        activityData[input.name || input.getAttribute('placeholder')] = input.value;
                    }
                });
                if (Object.keys(activityData).length > 0) {
                    activities.push(activityData);
                }
            });
            data.activities = activities;

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

        field.addEventListener('change', () => {
            if (field.classList.contains('error')) {
                validateStep(currentStep);
            }
        });
    });

    // Add row functionality for co-curricular activities

});