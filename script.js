/**
 * script.js: Main logic for the data-driven pricing app.
 * This script reads from pricingData.js and dynamically builds the UI.
 */

// --- UTILITY FUNCTIONS ---
const normalizeKey = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  const correctPassword = "dronahq2024"; // 🔐 Set your password here

  if (input === correctPassword) {
    document.getElementById("loginWrapper").style.display = "none";
    document.querySelector(".containerRoot").style.display = "grid";
    init(); // ✅ Boot up the pricing app
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

// --- DOM ELEMENT REFERENCES ---
const planSelect = document.getElementById('planSelect');
const modelSelect = document.getElementById('modelSelect');
const deploySelect = document.getElementById('deploySelect');
const addonFlag = document.getElementById('addonFlag');
const priceOutput = document.getElementById('priceOutput');

// Input fields
const numDevelopersInp = document.getElementById('numDevelopers');
const numUsersInp = document.getElementById('numUsers');
const usageTaskTierSelect = document.getElementById('usageTaskTierSelect');
const psManDaysInp = document.getElementById('psManDays');
const regionSelect = document.getElementById('regionSelect');

// Discount fields
const baseDiscountInp = document.getElementById('baseDiscount');
const licDiscountInp = document.getElementById('licDiscount');
const psDiscountInp = document.getElementById('psDiscount');
const addonsDiscountInp = document.getElementById('addonsDiscount');

// --- INITIALIZATION ---
function init() {

    buildPlanOptions();

  // Main selectors
  planSelect.addEventListener('change', onPlanModelDeployChange);
  deploySelect.addEventListener('change', onPlanModelDeployChange);
  modelSelect.addEventListener('change', onPlanModelDeployChange);
  addonFlag.addEventListener('change', onPlanModelDeployChange);
  planSelect.addEventListener('change', onPlanModelDeployChange);

  // Input fields that trigger recalculation
  [numDevelopersInp, numUsersInp, psManDaysInp, baseDiscountInp, licDiscountInp, psDiscountInp, addonsDiscountInp].forEach(inp => {
    inp.addEventListener('input', calcPrice);
  });
  [usageTaskTierSelect, regionSelect].forEach(sel => {
    sel.addEventListener('change', calcPrice);
  });

  // Initial setup
  onPlanModelDeployChange();
}

// --- DYNAMIC UI BUILDER FUNCTIONS ---

/**
 * The core function that dynamically builds all add-on UI controls.
 * It reads from pricingData.addOns and creates checkboxes or dropdowns.
 * @param {string} model - The pricing model (e.g., "User Based").
 * @param {string} deploy - The deployment type (e.g., "Cloud").
 * @param {string} containerId - The ID of the div to populate.
 */
function buildAddonsUI(model, deploy, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = ""; // Clear previous controls

  // Find all add-ons from the flat data that match the current criteria
  const relevantAddons = pricingData.addOns.filter(item =>
    item.model === model && item.deployment === deploy
  );

  // Group the add-ons by their name (e.g., all "PDF" tiers together)
  const groupedAddons = relevantAddons.reduce((acc, item) => {
    acc[item.addonName] = acc[item.addonName] || [];
    acc[item.addonName].push(item);
    return acc;
  }, {});

  // Build the UI for each group
  for (const addonName in groupedAddons) {
    const tiers = groupedAddons[addonName];
    const controlType = tiers[0].controlType; // 'checkbox' or 'select'

    const label = document.createElement("label");
    label.textContent = addonName;
    container.appendChild(label);

    if (controlType === 'checkbox') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.addonName = addonName; // For easy identification
      checkbox.dataset.price = tiers[0].price;
      checkbox.addEventListener('change', calcPrice);
      container.appendChild(checkbox);
    } else if (controlType === 'select') {
      const select = document.createElement('select');
      select.dataset.addonName = addonName;
      addDefaultOption(select);

      tiers.forEach(tier => {
        const option = document.createElement('option');
        option.value = tier.tier;
        option.dataset.price = tier.price;
        option.textContent = `${tier.tier} => $${tier.price} /year`;
        select.appendChild(option);
      });

      select.addEventListener('change', calcPrice);
      container.appendChild(select);
    }
  }
}

function addDefaultOption(selectElement) {
  const defaultOpt = document.createElement("option");
  defaultOpt.textContent = "Select an option";
  defaultOpt.value = "";
  selectElement.appendChild(defaultOpt);
}

function rebuildModelOptions() {
  const deployVal = deploySelect.value;
  const oldModel = modelSelect.value;
  modelSelect.innerHTML = "";

  const options = (deployVal === "Cloud")
    ? [{ val: "userBased", text: "User Based" }, { val: "usageBased", text: "Usage Based" }]
    : [{ val: "developerBased", text: "Developer Based" }, { val: "userBased", text: "User Based" }, { val: "usageBased", text: "Usage Based" }];

  options.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o.val;
    opt.textContent = o.text;
    modelSelect.appendChild(opt);
  });

  if (options.some(o => o.val === oldModel)) {
    modelSelect.value = oldModel;
  }
}



function buildUsageLicenseTiers(planVal, deployVal) {
  usageTaskTierSelect.innerHTML = "";
  const tierList = pricingData.licensingTiers.usageBased[planVal]?.[deployVal];
  if (!tierList) return;
  addDefaultOption(usageTaskTierSelect);
  tierList.forEach(tier => {
    const opt = document.createElement("option");
    opt.value = tier.tierKey;
    opt.textContent = `${tier.tierKey} — $${tier.monthly}/mo`;
    usageTaskTierSelect.appendChild(opt);
  });
}

// --- EVENT HANDLERS ---

function buildPlanOptions() {
  // Get all the plan names from the 'userBased' section of your pricing data
  const planNames = Object.keys(pricingData.licensingTiers.userBased); // ["Enterprise", "Business", "Business Lite"]

  planNames.forEach(planName => {
    const option = document.createElement('option');
    option.value = planName;
    option.textContent = planName;
    planSelect.appendChild(option);
  });
}

function onPlanModelDeployChange() {
  rebuildModelOptions();

  const modelVal = modelSelect.value;
  const deployVal = deploySelect.value;
  const planVal = planSelect.value;

  // Show/hide the correct model section
  document.querySelectorAll('.model-section').forEach(sec => sec.style.display = 'none');
  const sectionId = `${modelVal.charAt(0).toLowerCase() + modelVal.slice(1, -5)}Section`; // developerBased -> developerSection
  document.getElementById(sectionId).style.display = 'block';

  // Show/hide the add-on sections based on the checkbox
  document.querySelectorAll('.addon-container-wrapper').forEach(wrapper => {
    wrapper.style.display = addonFlag.checked ? 'block' : 'none';
  });

  // Build the dynamic UI
  buildUsageLicenseTiers(planVal, deployVal);
  buildAddonsUI("Developer Based", deployVal, "developerAddonsContainer");
  buildAddonsUI("User Based", deployVal, "userAddonsContainer");
  buildAddonsUI("Usage Based", deployVal, "usageAddonsContainer");
  
  calcPrice();
}

// --- CALCULATION LOGIC ---

function getBaseLicense(model, plan, deploy) {
  return pricingData.baseLicense[model]?.[plan]?.[deploy] || 0;
}

function getDeveloperLicensingCost(plan, deploy, devCount) {
  const tierObj = pricingData.licensingTiers.developerBased[plan]?.[deploy];
  if (!tierObj || devCount <= tierObj.baseDev) return 0;
  
  let totalLic = 0;
  const { baseDev, tier1Range, tier1Price, tier2Range, tier2Price, tier3Price } = tierObj;

  if (tier1Range && devCount >= tier1Range[0]) {
    const countInTier = Math.min(devCount, tier1Range[1]) - (tier1Range[0] - 1);
    totalLic += countInTier * tier1Price;
  }
  if (tier2Range && devCount >= tier2Range[0]) {
    const countInTier = Math.min(devCount, tier2Range[1]) - (tier2Range[0] - 1);
    totalLic += countInTier * tier2Price;
  }
  if (tier3Price && tier2Range && devCount > tier2Range[1]) {
    const countInTier = devCount - tier2Range[1];
    totalLic += countInTier * tier3Price;
  }
  return totalLic;
}

function getUserLicensingCost(plan, deploy, userCount) {
  const tierArray = pricingData.licensingTiers.userBased[plan]?.[deploy];
  if (!tierArray) return 0;

  const tier = tierArray.find(t => t.maxUsers === null || userCount <= t.maxUsers);
  return tier ? tier.monthlyRate * userCount * 12 : 0;
}

function getUsageLicensingCost(plan, deploy, tierKey) {
  const tierList = pricingData.licensingTiers.usageBased[plan]?.[deploy];
  const matchedTier = tierList?.find(t => t.tierKey === tierKey);
  return matchedTier ? matchedTier.monthly * 12 : 0;
}

function calculateAddOnsTotal() {
  let total = 0;
  if (!addonFlag.checked) return 0;

  const modelVal = modelSelect.value;
  const sectionId = `${modelVal.charAt(0).toLowerCase() + modelVal.slice(1, -5)}Section`;
  const activeSection = document.getElementById(sectionId);
  if (!activeSection) return 0;

  // Find all selected add-ons within the currently active model section
  activeSection.querySelectorAll('input[type="checkbox"]:checked, select').forEach(control => {
    if (control.type === 'checkbox') {
      total += parseFloat(control.dataset.price) || 0;
    } else if (control.value) { // It's a select with a selected option
      const selectedOption = control.options[control.selectedIndex];
      total += parseFloat(selectedOption.dataset.price) || 0;
    }
  });
  
  return total;
}

function calcPrice() {
  // Get current state
  const planVal = planSelect.value;
  const deployVal = deploySelect.value;
  const modelVal = modelSelect.value;

  // --- CALCULATIONS ---
  const baseLicenseVal = getBaseLicense(modelVal, planVal, deployVal);
  
  let licensingCost = 0;
  if (modelVal === "developerBased") {
    licensingCost = getDeveloperLicensingCost(planVal, deployVal, parseInt(numDevelopersInp.value) || 0);
  } else if (modelVal === "userBased") {
    licensingCost = getUserLicensingCost(planVal, deployVal, parseInt(numUsersInp.value) || 0);
  } else if (modelVal === "usageBased") {
    licensingCost = getUsageLicensingCost(planVal, deployVal, usageTaskTierSelect.value);
  }

  const addOnsCost = calculateAddOnsTotal();
  
  const dailyRate = (regionSelect.value === "india") ? pricingData.professionalServices.rateIndia : pricingData.professionalServices.rateOutside;
  const psCost = dailyRate * (parseInt(psManDaysInp.value) || 0);

  // Apply discounts
  const baseLicenseAfter = baseLicenseVal * (1 - (parseFloat(baseDiscountInp.value) || 0) / 100);
  const licensingAfter = licensingCost * (1 - (parseFloat(licDiscountInp.value) || 0) / 100);
  const addonsAfter = addOnsCost * (1 - (parseFloat(addonsDiscountInp.value) || 0) / 100);
  const psAfter = psCost * (1 - (parseFloat(psDiscountInp.value) || 0) / 100);

  const licenseSubtotal = baseLicenseAfter + licensingAfter + addonsAfter;
  const oneOffSubtotal = psAfter;
  const total = licenseSubtotal + oneOffSubtotal;

  // --- RENDER OUTPUT ---
  priceOutput.innerHTML = `
    <h3>License Summary</h3>
    <div>Base License: \$${baseLicenseAfter.toFixed(2)} <em>(Original: \$${baseLicenseVal.toFixed(2)})</em></div>
    <div>Licensing: \$${licensingAfter.toFixed(2)} <em>(Original: \$${licensingCost.toFixed(2)})</em></div>
    <div>Add-ons: \$${addonsAfter.toFixed(2)} <em>(Original: \$${addOnsCost.toFixed(2)})</em></div>
    <strong>License Subtotal: \$${licenseSubtotal.toFixed(2)}</strong>
    <hr/>
    <h3>One-off</h3>
    <div>Professional Services: \$${psAfter.toFixed(2)} <em>(Original: \$${psCost.toFixed(2)})</em></div>
    <strong>One-off Subtotal: \$${oneOffSubtotal.toFixed(2)}</strong>
    <hr/>
    <h3>Total</h3>
    <strong>\$${total.toFixed(2)}</strong>
  `;
}

// --- STARTUP ---
document.addEventListener('DOMContentLoaded', () => {
  // You can leave the password check or remove it
  // For now, we'll bypass it for easy testing.
  // checkPassword(); 
  document.getElementById("loginWrapper").style.display = "none";
  document.querySelector(".containerRoot").style.display = "grid";
  init();
});
