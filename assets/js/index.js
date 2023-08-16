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
    STEP_SELECTED: 'subscription__step--selected'
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

/// region global

//// region elements

const stepElement = document.querySelector('#step');
const stepContentElement = document.querySelector('#stepContent');
const backStepButton = document.querySelector('#backStep');
const nextStepButton = document.querySelector('#nextStep');

//// endregion

//// region events

backStepButton.addEventListener('click', event => {
    event.preventDefault();

    if (CURRENT_STEP_INDEX === 0) {
        toggleButtonVisibility(backStepButton, false);
        return;
    }
    CURRENT_STEP_INDEX--;
    setValuesForStep();
    showStepContent(STEP_CONTENT_ARRAY[CURRENT_STEP_INDEX]);
});
nextStepButton.addEventListener('click', event => {
    event.preventDefault();

    if (CURRENT_STEP_INDEX === STEP_CONTENT_ARRAY.length - 1) return;
    if (invalidStep()) return;
    CURRENT_STEP_INDEX++;
    toggleButtonVisibility(backStepButton, true);
    showStepContent(STEP_CONTENT_ARRAY[CURRENT_STEP_INDEX]);
});

//// endregion

//// region functions

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
    const childrenWithSelectedClass = children.filter(f => f.classList.contains(modifierSelectors.STEP_SELECTED));
    for (const child of childrenWithSelectedClass) {
        child.classList.remove(modifierSelectors.STEP_SELECTED);
    }
}
const addStepSelectedClass = () => {
    if (CURRENT_STEP_INDEX > stepContentOrder.FINISHING_UP) return;

    removeStepSelectedClass();

    const stepClassName = `step${CURRENT_STEP_INDEX + 1}`;
    stepElement.children[stepClassName].classList.add(modifierSelectors.STEP_SELECTED);
}
const hideAllStepContents = () => {
    const children = Array.from(stepContentElement.children);
    const childrenShowing = children.filter(f => f.classList.contains('shown'));
    for (const child of childrenShowing) {
        child.classList.remove('shown');
    }
}
const showStepContent = name => {
    hideAllStepContents();
    const child = stepContentElement.children[name];
    child.classList.add('shown');
    addStepSelectedClass();
}
const toggleButtonVisibility = (element, show) => element.style.visibility = show ? 'visible' : 'hidden';
const initializeStepContent = () => {
    hideAllStepContents();
    stepContentElement.children[stepContent.PERSONAL_INFO].classList.add('shown');
    CURRENT_STEP_INDEX = 0;
    addStepSelectedClass();

    toggleButtonVisibility(backStepButton, false);
}

//// endregion

/// endregion

/// region personal info

//// region elements

const basicInfoForm = stepContentElement.children[stepContent.PERSONAL_INFO].querySelector('#basicInfoForm');

//// endregion

//// region events

for (const element of basicInfoForm.elements) {
    element.addEventListener('keyup', event => {
        if (!event.target.value)
            setInvalidStateToControl(event.target);
        else
            clearControlInvalidState(event.target)
    });
}

//// endregion

//// region functions

const createInvalidElement = () => {
    const invalidContainer = document.createElement('div');
    const invalidMessage = document.createElement('span');
    invalidMessage.innerText = INVALID_REQUIRED_VALUE.message;
    const {position, top, right, color, fontSize, fontWeight} = INVALID_REQUIRED_VALUE.style;
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
                initializeAddOnPrice();
            }
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
            initializeAddOnPrice();
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

    if (event.target.checked) {
        changePlanPrice(arcadePlanPrice, planType.YEARLY, plan.ARCADE);
        changePlanPrice(advancedPlanPrice, planType.YEARLY, plan.ADVANCED);
        changePlanPrice(proPlanPrice, planType.YEARLY, plan.PRO);
    } else {
        changePlanPrice(arcadePlanPrice, planType.MONTHLY, plan.ARCADE);
        changePlanPrice(advancedPlanPrice, planType.MONTHLY, plan.ADVANCED);
        changePlanPrice(proPlanPrice, planType.MONTHLY, plan.PRO);
    }

    clearAllActiveState(plansElement);
    SUBSCRIPTION_DATA.plan = null;
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
const initializeAddOnPrice = () => {
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

//// endregion

/// endregion

// start

initializeStepContent();