/* region data */

const PLAN_PRICE_DATA = [
    {
        plan: 'Arcade',
        planType: 'Monthly',
        planTypeAbbrev: 'mo',
        currency: '$',
        price: 9
    },
    {
        plan: 'Advanced',
        planType: 'Monthly',
        planTypeAbbrev: 'mo',
        currency: '$',
        price: 12
    },
    {
        plan: 'Pro',
        planType: 'Monthly',
        planTypeAbbrev: 'mo',
        currency: '$',
        price: 15
    },
    {
        plan: 'Arcade',
        planType: 'Yearly',
        planTypeAbbrev: 'yr',
        currency: '$',
        price: 90
    },
    {
        plan: 'Advanced',
        planType: 'Yearly',
        planTypeAbbrev: 'yr',
        currency: '$',
        price: 120
    },
    {
        plan: 'Pro',
        planType: 'Yearly',
        planTypeAbbrev: 'yr',
        currency: '$',
        price: 150
    }
];
const ADD_ONS_DATA = [
    {
        addOn: 'Online service',
        planType: 'Monthly',
        planTypeAbbrev: 'mo',
        currency: '$',
        price: 1
    },
    {
        addOn: 'Larger storage',
        planType: 'Monthly',
        planTypeAbbrev: 'mo',
        currency: '$',
        price: 2
    },
    {
        addOn: 'Customizable profile',
        planType: 'Monthly',
        planTypeAbbrev: 'mo',
        currency: '$',
        price: 2
    },
    {
        addOn: 'Online service',
        planType: 'Yearly',
        planTypeAbbrev: 'yr',
        currency: '$',
        price: 10
    },
    {
        addOn: 'Larger storage',
        planType: 'Yearly',
        planTypeAbbrev: 'yr',
        currency: '$',
        price: 20
    },
    {
        addOn: 'Customizable profile',
        planType: 'Yearly',
        planTypeAbbrev: 'yr',
        currency: '$',
        price: 20
    }
];
const SUBSCRIPTION_DATA = {
    personalInfo: null,
    plan: null,
    addOns: []
};

/* endregion */

// region enums

const stepContent = {
    PERSONAL_INFO: 'personalInfo',
    PLANS: 'plans',
    ADD_ONS: 'addOns',
    FINISHING_UP: 'finishingUp',
    THANK_YOU: 'thankYou'
};
const stepContentOrder = {
    PERSONAL_INFO: 0,
    PLANS: 1,
    ADD_ONS: 2,
    FINISHING_UP: 3,
    THANK_YOU: 4
};
const modifierSelectors = {
    STEP_SELECTED: 'subscription__step-number--selected'
};
const plan = {
    ARCADE: 'Arcade',
    ADVANCED: 'Advanced',
    PRO: 'Pro'
};
const planType = {
    MONTHLY: 'Monthly',
    YEARLY: 'Yearly'
};
const planId = {
    ARCADE_PLAN: 'arcade-plan',
    ADVANCED_PLAN: 'advanced-plan',
    PRO_PLAN: 'pro-plan'
};
const planIdMap = {
    [plan.ARCADE]: planId.ARCADE_PLAN,
    [plan.ADVANCED]: planId.ADVANCED_PLAN,
    [plan.PRO]: planId.PRO_PLAN
};
const addOn = {
    ONLINE_SERVICE: 'Online service',
    LARGER_STORAGE: 'Larger storage',
    CUSTOMIZABLE_PROFILE: 'Customizable profile'
}

// endregion

// region objects

const STEP_CONTENT_ARRAY = Object.values(stepContent);
const INVALID_MESSAGE = {
    message: {
        required: 'This field is required',
        email: 'Invalid email'
    },
    class: {
        parent: 'invalid-control',
        message: 'invalid-message'
    }
};
let CURRENT_STEP_INDEX = 0;
const REGEX = {
    email: new RegExp('^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
};

// endregion

/// region global

//// region elements

const stepElement = document.querySelector('#step');
const stepContentElement = document.querySelector('#stepContent');
const stepNavigatorElement = document.querySelector('.subscription__step-navigator');
const backStepButton = document.querySelector('#backStep');

//// endregion

//// region events
const navigationElements = Array.from(stepContentElement.children)
    .map(m => m.children) // get step content
    .map(m => m[2]) // get footer elements
    .filter(f => f); // remove empty
for (const element of navigationElements) {
    element.addEventListener('click', handleStepNavigatorClick);
}

stepNavigatorElement.addEventListener('click', handleStepNavigatorClick);

//// endregion

//// region functions

function handleStepNavigatorClick(event) {
    const button = event.target.closest('.subscription__button');
    if (!button) return;
    if (button.classList.contains('subscription__button--back')) {
        handleBackStepButtonClick();
    } else if (button.classList.contains('subscription__button--next')) {
        handleNextStepButtonClick();
    }
}

const handleBackStepButtonClick = () => {
    if (CURRENT_STEP_INDEX === 0) return;
    CURRENT_STEP_INDEX--;
    if (CURRENT_STEP_INDEX === 0) toggleButtonVisibility(backStepButton, false);
    setValuesForStep();
    showStepContent(STEP_CONTENT_ARRAY[CURRENT_STEP_INDEX]);
}
const handleNextStepButtonClick = () => {
    if (CURRENT_STEP_INDEX === STEP_CONTENT_ARRAY.length - 1) return;
    if (invalidStep()) return;
    CURRENT_STEP_INDEX++;
    toggleButtonVisibility(backStepButton, true);
    showStepContent(STEP_CONTENT_ARRAY[CURRENT_STEP_INDEX]);
}
const createStrongElement = () => {
    return document.createElement('strong');
}
const createSpanElement = () => {
    return document.createElement('span');
}
const createDivElement = () => {
    return document.createElement('div');
}
const clearAllActiveState = containerElement => {
    const children = Array.from(containerElement.children);
    const activatedChildren = children.filter(f => f.classList.contains('active'));
    for (const child of activatedChildren) {
        child.classList.remove('active');
    }
}
const clearActivatedState = element => {
    element.classList.remove('active');
}
const setActivatedState = element => {
    element.classList.add('active');
}
const removeStepSelectedClass = () => {
    const children = Array.from(stepElement.children);
    const childrenWithSelectedClass = children.map(m => m.children[0]).filter(f => f.classList.contains(modifierSelectors.STEP_SELECTED));
    for (const child of childrenWithSelectedClass) {
        child.classList.remove(modifierSelectors.STEP_SELECTED);
    }
}
const addStepSelectedClass = () => {
    if (CURRENT_STEP_INDEX > stepContentOrder.FINISHING_UP) return;

    removeStepSelectedClass();

    const stepClassName = `step${CURRENT_STEP_INDEX + 1}`;
    stepElement.children[stepClassName].children[0].classList.add(modifierSelectors.STEP_SELECTED);
}
const hideAllStepContents = () => {
    const children = Array.from(stepContentElement.children);
    //const childrenShowing = children.filter(f => f.classList.contains('shown'));
    const childrenShowing = children.filter(f => f.style.display === 'flex' || f.style.display === '');
    for (const child of childrenShowing) {
        //child.classList.remove('shown');
        child.style.display = 'none';
    }
}
const showStepContent = name => {
    hideAllStepContents();
    const child = stepContentElement.children[name];
    //child.classList.add('shown');
    child.style.display = 'flex';
    addStepSelectedClass();
}
const toggleButtonVisibility = (element, show) => element.style.visibility = show ? 'visible' : 'hidden';
const initializeStepContent = () => {
    hideAllStepContents();
    //stepContentElement.children[stepContent.PERSONAL_INFO].classList.add('shown');
    stepContentElement.children[stepContent.PERSONAL_INFO].style.display = 'flex';
    CURRENT_STEP_INDEX = 0;
    addStepSelectedClass();

    toggleButtonVisibility(backStepButton, false);
}

//// endregion

/// endregion

/// region personal info

//// region elements

const basicInfoForm = document.querySelector('#basicInfoForm');

//// endregion

//// region events

for (const element of basicInfoForm.elements) {
    element.addEventListener('keyup', event => {
        if (!event.target.value)
            setInvalidStateToControl(event.target, INVALID_MESSAGE.message.required);
        else {
            if (event.target.id === 'email-address' && !REGEX.email.test(event.target.value))
                setInvalidStateToControl(event.target, INVALID_MESSAGE.message.email);
            else
                clearControlInvalidState(event.target);
        }
    });
}

//// endregion

//// region functions

const createInvalidElement = (message) => {
    const invalidContainer = createDivElement();
    const invalidMessage = createSpanElement();
    invalidMessage.innerText = message;
    invalidMessage.classList.add(INVALID_MESSAGE.class.message)
    invalidContainer.append(invalidMessage);

    return invalidContainer;
}
const setInvalidStateToControl = (inputElement, message) => {
    const invalidContainerElement = createInvalidElement(message);

    const parentElement = inputElement.parentElement;
    const divElement = parentElement.querySelector('div');
    if (divElement)
        parentElement.removeChild(divElement);
    parentElement.append(invalidContainerElement);
    parentElement.style.position = 'relative';

    inputElement.classList.add(INVALID_MESSAGE.class.parent);
}
const clearControlInvalidState = inputElement => {
    inputElement.classList.remove(INVALID_MESSAGE.class.parent);
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

            const {required, email} = INVALID_MESSAGE.message;
            const {name, emailAddress, phoneNumber} = basicInfoForm.elements;
            if (name.value === "") setInvalidStateToControl(name, required)
            if (emailAddress.value === "") setInvalidStateToControl(emailAddress, required);
            else if (!REGEX.email.test(emailAddress.value)) setInvalidStateToControl(emailAddress, email);
            if (phoneNumber.value === "") setInvalidStateToControl(phoneNumber, required);

            invalid = !name.value || !emailAddress.value || !phoneNumber.value;

            if (!invalid) {
                SUBSCRIPTION_DATA.personalInfo = {
                    name: name.value,
                    emailAddress: emailAddress.value,
                    phoneNumber: phoneNumber.value
                };

                basicInfoForm.reset();
            }
            break;
        case stepContentOrder.PLANS:
            invalid = !SUBSCRIPTION_DATA.plan;

            if (!invalid) {
                clearAllActiveState(plansElement);
                initAddOnSelector();
                initAddOnPrice();
            }
            break;
        case stepContentOrder.ADD_ONS:
            initFinishingUpStep();
            break;
        case stepContentOrder.FINISHING_UP:
            stepNavigatorElement.style.display = 'none';
            break;
    }

    return invalid;
}
const setValuesForStep = () => {
    switch (CURRENT_STEP_INDEX) {
        case stepContentOrder.PERSONAL_INFO:
            if (!SUBSCRIPTION_DATA.personalInfo) return;

            const {name, emailAddress, phoneNumber} = SUBSCRIPTION_DATA.personalInfo;
            basicInfoForm.elements.name.value = name;
            basicInfoForm.elements.emailAddress.value = emailAddress;
            basicInfoForm.elements.phoneNumber.value = phoneNumber;

            break;
        case stepContentOrder.PLANS:
            if (!SUBSCRIPTION_DATA.plan) return;
            const {plan: selectedPlan} = SUBSCRIPTION_DATA.plan;
            const planElementId = planIdMap[selectedPlan];
            const planElement = plansElement.children[planElementId];

            setActivatedState(planElement);
            break;
        case stepContentOrder.ADD_ONS:
            initAddOnPrice();
            initAddOnSelector();
            break;
    }
}

//// endregion

/// endregion

/// region plans

//// region elements

const plansElement = document.querySelector('.subscription__step-card-plans');
const switchPlanElement = document.querySelector('#switch-plan');

//// endregion

//// region events

plansElement.addEventListener('click', event => {
    const planElement = event.target.closest('.subscription__step-card-plan');

    if (planElement) {
        clearAllActiveState(plansElement);
        setActivatedState(planElement);
        getSelectedPlan(planElement);
    }
});
switchPlanElement.addEventListener('change', event => {
    const arcadePlanPrice = document.querySelector('#arcade-plan-price');
    const advancedPlanPrice = document.querySelector('#advanced-plan-price');
    const proPlanPrice = document.querySelector('#pro-plan-price');
    const freePlanInfoElements = document.querySelectorAll('.free-plan-info');

    if (event.target.checked) {
        changePlanPrice(arcadePlanPrice, planType.YEARLY, plan.ARCADE);
        changePlanPrice(advancedPlanPrice, planType.YEARLY, plan.ADVANCED);
        changePlanPrice(proPlanPrice, planType.YEARLY, plan.PRO);

        Array.from(freePlanInfoElements).forEach(el => {
           el.classList.add('free-plan-info--shown');
        });
    } else {
        changePlanPrice(arcadePlanPrice, planType.MONTHLY, plan.ARCADE);
        changePlanPrice(advancedPlanPrice, planType.MONTHLY, plan.ADVANCED);
        changePlanPrice(proPlanPrice, planType.MONTHLY, plan.PRO);
        Array.from(freePlanInfoElements).forEach(el => {
            el.classList.remove('free-plan-info--shown');
        });
    }

    clearAllActiveState(plansElement);
    SUBSCRIPTION_DATA.plan = null;
    SUBSCRIPTION_DATA.addOns = [];
});

//// endregion

/// region functions

const changePlanPrice = (element, planType, plan) => {
    const plans = PLAN_PRICE_DATA.filter(f => f.planType === planType);
    const {currency, price, planTypeAbbrev} = plans.find(f => f.plan === plan);
    element.textContent = `${currency}${price}/${planTypeAbbrev}`;
}
const getSelectedPlan = element => {
    SUBSCRIPTION_DATA.plan = null;
    const selectedPlanType = document.querySelector('#switch-plan').checked ?
        planType.YEARLY : planType.MONTHLY;
    switch (element.id) {
        case planId.ARCADE_PLAN:
            SUBSCRIPTION_DATA.plan = PLAN_PRICE_DATA.find(f => f.plan === plan.ARCADE && f.planType === selectedPlanType);
            break;
        case planId.ADVANCED_PLAN:
            SUBSCRIPTION_DATA.plan = PLAN_PRICE_DATA.find(f => f.plan === plan.ADVANCED && f.planType === selectedPlanType);
            break;
        case planId.PRO_PLAN:
            SUBSCRIPTION_DATA.plan = PLAN_PRICE_DATA.find(f => f.plan === plan.PRO && f.planType === selectedPlanType);
            break;
    }
}

/// endregion

/// endregion

/// region pick add-ons

//// region elements

const onlineServiceElement = document.querySelector('#online-service');
const largerStorageElement = document.querySelector('#larger-storage');
const customizableProfileElement = document.querySelector('#customizable-profile');

//// endregion

//// region events

onlineServiceElement.addEventListener('change', event => {
    handleCheckboxChange(event);
    addAddOn(addOn.ONLINE_SERVICE, event);
});
largerStorageElement.addEventListener('change', event => {
    handleCheckboxChange(event);
    addAddOn(addOn.LARGER_STORAGE, event);
});
customizableProfileElement.addEventListener('change', event => {
    handleCheckboxChange(event);
    addAddOn(addOn.CUSTOMIZABLE_PROFILE, event);
});

//// endregion

//// region functions

const handleCheckboxChange = event => {
    if (event.target.checked)
        setActivatedState(event.target.parentElement);
    else
        clearActivatedState(event.target.parentElement);
}
const addAddOn = (addOn, event) => {
    if (event.target.checked) {
        const selectedPlanType = SUBSCRIPTION_DATA.plan.planType;
        const _addOn = ADD_ONS_DATA.find(f => f.addOn === addOn && f.planType === selectedPlanType);
        if (!SUBSCRIPTION_DATA.addOns.some(s => s.addOn === addOn))
            SUBSCRIPTION_DATA.addOns.push(_addOn);
    } else {
        SUBSCRIPTION_DATA.addOns = SUBSCRIPTION_DATA.addOns.filter(f => f.addOn !== addOn);
    }
}
const initAddOnPrice = () => {
    if (!SUBSCRIPTION_DATA.plan) return;
    const {planType: selectedPlanType} = SUBSCRIPTION_DATA.plan;

    const onlineServicePrice = document.querySelector('#online-service-price');
    const largerStoragePrice = document.querySelector('#larger-storage-price');
    const customizableProfilePrice = document.querySelector('#customizable-profile-price');

    setAddOnPrice(onlineServicePrice, addOn.ONLINE_SERVICE, selectedPlanType);
    setAddOnPrice(largerStoragePrice, addOn.LARGER_STORAGE, selectedPlanType);
    setAddOnPrice(customizableProfilePrice, addOn.CUSTOMIZABLE_PROFILE, selectedPlanType);
}
const setAddOnPrice = (element, addOn, planType) => {
    const {
        currency,
        price,
        planTypeAbbrev
    } = ADD_ONS_DATA.find(f => f.addOn === addOn && f.planType === planType);
    element.textContent = `${currency}${price}/${planTypeAbbrev}`;
}
const selectAddOn = (addOnElement, addOnName) => {
    let selectedAddOn = SUBSCRIPTION_DATA.addOns.some(s => s.addOn === addOnName);
    if (selectedAddOn) {
        addOnElement.checked = selectedAddOn;
        setActivatedState(addOnElement.parentElement);
    } else {
        addOnElement.checked = false;
        clearActivatedState(addOnElement.parentElement);
    }
}
const initAddOnSelector = () => {
    selectAddOn(onlineServiceElement, addOn.ONLINE_SERVICE);
    selectAddOn(largerStorageElement, addOn.LARGER_STORAGE);
    selectAddOn(customizableProfileElement, addOn.CUSTOMIZABLE_PROFILE);
}

//// endregion

/// endregion

/// region finishing up

//// region elements

const changeLink = document.querySelector('#change-selected-plan');

//// endregion

//// region events

changeLink.addEventListener('click', event => {
    event.preventDefault();

    CURRENT_STEP_INDEX = stepContentOrder.PLANS;
    setValuesForStep();
    showStepContent(STEP_CONTENT_ARRAY[CURRENT_STEP_INDEX]);
});

//// endregion

//// region functions

const setSummaryPlan = () => {
    const selectedPlanElement = document.querySelector('#selected-plan');
    const summaryPriceElement = document.querySelector('#summary-price');

    const {plan, planType, currency, price, planTypeAbbrev} = SUBSCRIPTION_DATA.plan;

    let strongElement = createStrongElement();
    strongElement.textContent = `${plan} (${planType})`;

    if (selectedPlanElement.childElementCount > 0)
        selectedPlanElement.children[0].remove();

    selectedPlanElement.append(strongElement);

    strongElement = createStrongElement();
    strongElement.textContent = `${currency}${price}/${planTypeAbbrev}`;

    if (summaryPriceElement.childElementCount > 0)
        summaryPriceElement.firstChild.remove();

    summaryPriceElement.append(strongElement);
}
const listSelectedAddOns = () => {
    const summaryAddOnsElement = document.querySelector('.subscription__summary-add-ons-selected');
    while (summaryAddOnsElement.firstChild) {
        summaryAddOnsElement.removeChild(summaryAddOnsElement.firstChild);
    }
    for (const addOn of SUBSCRIPTION_DATA.addOns) {
        const {addOn: name, currency, price, planTypeAbbrev} = addOn;
        const divElement = createDivElement();
        const nameElement = createSpanElement();
        nameElement.textContent = name;
        const priceElement = createSpanElement();
        priceElement.classList.add('price', 'price--summary');
        priceElement.textContent = `+${currency}${price}/${planTypeAbbrev}`;
        divElement.append(nameElement, priceElement);
        summaryAddOnsElement.append(divElement);
    }
}
const calculateTotal = () => {
    let total = 0;
    total = total + SUBSCRIPTION_DATA.plan.price;
    const totalSelectedAddOns = SUBSCRIPTION_DATA.addOns.reduce((total, cV, _) => {
        return total + cV.price;
    }, 0);
    total = total + totalSelectedAddOns;

    const {planType: _planType, currency, planTypeAbbrev} = SUBSCRIPTION_DATA.plan;
    const totalNameElement = document.querySelector('#summary-total-name');
    const totalPlanType = _planType === planType.MONTHLY ? 'month' : 'year';
    totalNameElement.textContent = `Total (per ${totalPlanType})`;
    const totalPriceElement = document.querySelector('#summary-total-price');
    if (totalPriceElement.firstChild)
        totalPriceElement.removeChild(totalPriceElement.firstChild);
    const strongElement = createStrongElement();
    strongElement.textContent = `${currency}${total}/${planTypeAbbrev}`;
    totalPriceElement.append(strongElement);
}
const initFinishingUpStep = () => {
    setSummaryPlan();
    listSelectedAddOns();
    calculateTotal();
}

//// endregion

/// endregion

// start

initializeStepContent();