// const plansData = [
//     {
//         planId: 1,
//         name: 'Arcade',
//         price: 0
//     },
//     {
//         planId: 2,
//         name: 'Advanced',
//         price: 0
//     },
//     {
//         planId: 3,
//         name: 'Pro',
//         price: 0
//     }
// ];
// const planType = [
//     {
//         planTypeId: 1,
//         type: 'Monthly',
//     },
//     {
//         planTypeId: 2,
//         type: 'Yearly'
//     }
// ];
// const planPrice = [
//     {
//         planPriceId: 1,
//         planId: 1,
//         planTypeId: 1,
//         price: 9
//     },
//     {
//         planPriceId: 2,
//         planId: 2,
//         planTypeId: 1,
//         price: 12
//     },
//     {
//         planPriceId: 3,
//         planId: 3,
//         planTypeId: 1,
//         price: 15
//     },
//     {
//         planPriceId: 4,
//         planId: 1,
//         planTypeId: 2,
//         price: 90
//     },
//     {
//         planPriceId: 5,
//         planId: 2,
//         planTypeId: 2,
//         price: 120
//     },
//     {
//         planPriceId: 6,
//         planId: 3,
//         planTypeId: 2,
//         price: 150
//     }
// ];
// const subscriptionData = {
//     personalInfo: null,
//     plan: null,
//     addOns: [],
// }

// region enums

const stepContent = {
    PERSONAL_INFO: 'personalInfo',
    PLANS: 'plans',
    ADD_ONS: 'addOns',
    FINISHING_UP: 'finishingUp',
    THANK_YOU: 'thankYou'
}
const stepContentOrder = {
    PERSONAL_INFO: 0,
    PLANS: 1,
    ADD_ONS: 2,
    FINISHING_UP: 3,
    THANK_YOU: 4
}
const modifierSelectors = {
    STEP_SELECTED: 'subscription__step--selected'
}

// endregion

// region global objects

const STEP_CONTENT_ARRAY = Object.values(stepContent);
const INVALID_REQUIRED_VALUE = {
    message: 'This field is required',
    class: 'invalid-control',
    style: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: 'hsl(354, 84%, 57%)',
        fontSize: '0.8rem',
        fontWeight: '500'
    }
};
let CURRENT_STEP_INDEX = 0;

// endregion

// region get elements from the DOM

const stepElement = document.querySelector('#step');
const stepContentElement = document.querySelector('#stepContent');

const basicInfoForm = stepContentElement.children[stepContent.PERSONAL_INFO].querySelector('#basicInfoForm');

const backStepButton = document.querySelector('#backStep');
const nextStepButton = document.querySelector('#nextStep');

// endregion

// region addEventListener
for (const element of basicInfoForm.elements) {
    element.addEventListener('keyup', (event) => {
        if (!event.target.value)
            setInvalidStateToControl(event.target);
        else
            clearControlInvalidState(event.target)
    });
}
backStepButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (CURRENT_STEP_INDEX === 0) {
        toggleButtonVisibility(backStepButton, false);
        return;
    }
    CURRENT_STEP_INDEX--;

    showStepContent(STEP_CONTENT_ARRAY[CURRENT_STEP_INDEX]);
});
nextStepButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (CURRENT_STEP_INDEX === STEP_CONTENT_ARRAY.length - 1) return;
    if (invalidStep()) return;
    CURRENT_STEP_INDEX++;
    toggleButtonVisibility(backStepButton, true);
    showStepContent(STEP_CONTENT_ARRAY[CURRENT_STEP_INDEX]);
});

//endregion

// region functions

const hideAllStepContents = () => {
    const children = Array.from(stepContentElement.children);
    const childrenShowing = children.filter(f => f.classList.contains('shown') /*f.style.display === '' || f.style.display === 'block'*/);
    console.log(children)
    for (const child of childrenShowing) {
        child.classList.remove('shown');
    }
}
const removeStepSelectedClass = () => {
    const children = Array.from(stepElement.children);
    const childrenWithSelectedClass = children.filter(f => f.classList.contains(modifierSelectors.STEP_SELECTED));
    for (const child of childrenWithSelectedClass) {
        child.classList.remove(modifierSelectors.STEP_SELECTED);
    }
}
const addStepSelectedClass = () => {
    removeStepSelectedClass();

    const stepClassName = `step${CURRENT_STEP_INDEX + 1}`;
    stepElement.children[stepClassName].classList.add(modifierSelectors.STEP_SELECTED);
}
const toggleButtonVisibility = (element, show) => element.style.visibility = show ? 'visible' : 'hidden';
const initializeStepContent = () => {
    hideAllStepContents();
    stepContentElement.children[stepContent.PERSONAL_INFO].classList.add('shown');
    CURRENT_STEP_INDEX = 0;
    addStepSelectedClass();

    toggleButtonVisibility(backStepButton, false);
}
const showStepContent = name => {
    hideAllStepContents();
    const child = stepContentElement.children[name];
    child.classList.add('shown');
    addStepSelectedClass();
}
const createInvalidElement = () => {
    const invalidContainer = document.createElement('div');
    const invalidMessage = document.createElement('span');
    invalidMessage.innerText = INVALID_REQUIRED_VALUE.message;
    const { position, top, right, color, fontSize, fontWeight } = INVALID_REQUIRED_VALUE.style;
    invalidMessage.style.position = position;
    invalidMessage.style.top = top;
    invalidMessage.style.right = right;
    invalidMessage.style.color = color;
    invalidMessage.style.fontSize = fontSize;
    invalidMessage.style.fontWeight = fontWeight;
    invalidContainer.append(invalidMessage);

    return invalidContainer;
}
const setInvalidStateToControl = inputElement => {
    const invalidContainer = createInvalidElement();
    const parentElement = inputElement.parentElement;
    parentElement.append(invalidContainer);
    parentElement.style.position = 'relative';
    inputElement.classList.add(INVALID_REQUIRED_VALUE.class);
}
const clearControlInvalidState = inputElement => {
    inputElement.classList.remove(INVALID_REQUIRED_VALUE.class);
    const parentElement = inputElement.parentElement;
    const invalidContainer = parentElement.querySelector('div');
    if (invalidContainer)
        parentElement.removeChild(invalidContainer);
}
const clearAllInvalidState = formElements => {
    for (const element of formElements) {
        clearControlInvalidState(element);
    }
}
const invalidStep = () => {
    let invalid = false;

    switch (CURRENT_STEP_INDEX) {
        case stepContentOrder.PERSONAL_INFO:
            clearAllInvalidState(basicInfoForm.elements);

            const {name, emailAddress, phoneNumber} = basicInfoForm.elements;
            if (name.value === "") setInvalidStateToControl(name)
            if (emailAddress.value === "") setInvalidStateToControl(emailAddress);
            if (phoneNumber.value === "") setInvalidStateToControl(phoneNumber);

            invalid = !name.value || !emailAddress.value || !phoneNumber.value ;
            break;
        case stepContentOrder.PLANS:
            //invalid = true;
            break;
        case stepContentOrder.ADD_ONS:
            //invalid = true;
            break;
        case stepContentOrder.FINISHING_UP:
            //invalid = true;
            break;
    }

    return invalid;
}

// endregion

initializeStepContent();