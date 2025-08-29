/**
 * script.js: Main logic for the data-driven pricing app.
 * This script reads from pricingData.js and planFeatures.js
 * to dynamically build the UI and display inclusions.
 */

// --- UTILITY FUNCTIONS ---
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
const notesSection = document.getElementById('notesSection'); // Reference for the 4th column

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

// --- NEW: FUNCTION TO DISPLAY PLAN FEATURES ---
function displayPlanFeatures(plan) {
    // FIX: Convert plan name "Business Lite" to camelCase key "businessLite"
    const planKey = plan.split(' ').map((word, index) => 
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    const features = planFeaturesData.planFeatures[planKey];

    if (!features) {
        notesSection.innerHTML = "<h3>Plan Features</h3><p>Select a plan to see details.</p>";
        return;
    }

    let html = "<h3>Included Features</h3>";

    for (const category in features) {
        if (category.toLowerCase().includes('notes')) continue;
        html += `<div class="feature-category"><h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4><ul>`;
        const categoryFeatures = features[category];

        for (const featureName in categoryFeatures) {
            if (featureName.toLowerCase().includes('notes')) continue;
            const value = categoryFeatures[featureName];
            let displayValue = (typeof value === 'boolean') ? (value ? '✔️ Included' : '❌ Not Included') : value;
            const formattedName = featureName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            html += `<li><strong>${formattedName}:</strong> ${displayValue}</li>`;
        }
        html += `</ul></div>`;
    }
    notesSection.innerHTML = html;
}

// --- INITIALIZATION ---
function buildPlanOptions() {
  // The keys in pricingData are the "display names"
  const planNames = Object.keys(pricingData.licensingTiers.userBased); 
  planNames.forEach(planName => {
    const option = document.createElement('option');
    option.value = planName; // e.g., "Business Lite"
    option.textContent = planName;
    planSelect.appendChild(option);
  });
}

function init() {
  buildPlanOptions();
  planSelect.addEventListener('change', onPlanModelDeployChange);
  deploySelect.addEventListener('change', onPlanModelDeployChange);
  modelSelect.addEventListener('change', onPlanModelDeployChange);
  addonFlag.addEventListener('change', onPlanModelDeployChange);

  [numDevelopersInp, numUsersInp, psManDaysInp, baseDiscountInp, licDiscountInp, psDiscountInp, addonsDiscountInp].forEach(inp => {
    inp.addEventListener('input', calcPrice);
  });
  [usageTaskTierSelect, regionSelect].forEach(sel => {
    sel.addEventListener('change', calcPrice);
  });

  onPlanModelDeployChange();
}

// --- EVENT HANDLERS ---
function onPlanModelDeployChange() {
  rebuildModelOptions();

  const modelVal = modelSelect.value;
  const deployVal = deploySelect.value;
  const planVal = planSelect.value; // No need to clean here, it's clean from the source

  document.querySelectorAll('.model-section').forEach(sec => sec.style.display = 'none');
  const sectionId = `${modelVal.charAt(0).toLowerCase() + modelVal.slice(1, -5)}Section`;
  if (document.getElementById(sectionId)) {
    document.getElementById(sectionId).style.display = 'block';
  }

  document.querySelectorAll('.addon-container-wrapper').forEach(wrapper => {
    wrapper.style.display = addonFlag.checked ? 'block' : 'none';
  });

  buildUsageLicenseTiers(planVal, deployVal);
  buildAddonsUI("Developer Based", deployVal, "developerAddonsContainer");
  buildAddonsUI("User Based", deployVal, "userAddonsContainer");
  buildAddonsUI("Usage Based", deployVal, "usageAddonsContainer");
  
  displayPlanFeatures(planVal);
  calcPrice();
}

// --- DYNAMIC UI BUILDER FUNCTIONS ---
function addDefaultOption(selectElement) {
  const defaultOpt = document.createElement("option");
  defaultOpt.textContent = "Select an option";
  defaultOpt.value = "";
  selectElement.appendChild(defaultOpt);
}

function buildAddonsUI(model, deploy, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = ""; 

  const relevantAddons = pricingData.addOns.filter(item =>
    item.model === model && item.deployment === deploy
  );

  const groupedAddons = relevantAddons.reduce((acc, item) => {
    acc[item.addonName] = acc[item.addonName] || [];
    acc[item.addonName].push(item);
    return acc;
  }, {});

  for (const addonName in groupedAddons) {
    const tiers = groupedAddons[addonName];
    const controlType = tiers[0].controlType;
    const label = document.createElement("label");
    label.textContent = addonName;
    container.appendChild(label);

    if (controlType === 'checkbox') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.addonName = addonName;
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

function rebuildModelOptions() {
  const deployVal = deploySelect.value;
  const planVal = planSelect.value;
  const oldModel = modelSelect.value;
  modelSelect.innerHTML = "";

  let options;
  if (planVal === "Business Lite") {
    options = [{ val: "userBased", text: "User Based" }];
  } else {
    options = (deployVal === "Cloud")
      ? [{ val: "userBased", text: "User Based" }, { val: "usageBased", text: "Usage Based" }]
      : [{ val: "developerBased", text: "Developer Based" }, { val: "userBased", text: "User Based" }, { val: "usageBased", text: "Usage Based" }];
  }

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
  const planKey = planVal;
  const tierList = pricingData.licensingTiers.usageBased[planKey]?.[deployVal];
  if (!tierList) return;
  addDefaultOption(usageTaskTierSelect);
  tierList.forEach(tier => {
    const opt = document.createElement("option");
    opt.value = tier.tierKey;
    opt.textContent = `${tier.tierKey} — $${tier.monthly}/mo`;
    usageTaskTierSelect.appendChild(opt);
  });
}

// --- CALCULATION LOGIC ---
function getBaseLicense(model, plan, deploy) {
  const planKey = plan;
  return pricingData.baseLicense[model]?.[planKey]?.[deploy] || 0;
}

function getDeveloperLicensingCost(plan, deploy, devCount) {
  const planKey = plan;
  const tierObj = pricingData.licensingTiers.developerBased[planKey]?.[deploy];
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
  const planKey = plan;
  const tierArray = pricingData.licensingTiers.userBased[planKey]?.[deploy];
  if (!tierArray) return 0;

  const tier = tierArray.find(t => t.maxUsers === null || userCount <= t.maxUsers);
  return tier ? tier.monthlyRate * userCount * 12 : 0;
}

function getUsageLicensingCost(plan, deploy, tierKey) {
  const planVal = planSelect.value;
  const planKey = planVal;
  const tierList = pricingData.licensingTiers.usageBased[planKey]?.[deploy];
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

  activeSection.querySelectorAll('input[type="checkbox"]:checked, select').forEach(control => {
    if (control.type === 'checkbox') {
      total += parseFloat(control.dataset.price) || 0;
    } else if (control.value) {
      const selectedOption = control.options[control.selectedIndex];
      total += parseFloat(selectedOption.dataset.price) || 0;
    }
  });
  
  return total;
}

function calcPrice() {
  const planVal = planSelect.value;
  const deployVal = deploySelect.value;
  const modelVal = modelSelect.value;

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

  const baseLicenseAfter = baseLicenseVal * (1 - (parseFloat(baseDiscountInp.value) || 0) / 100);
  const licensingAfter = licensingCost * (1 - (parseFloat(licDiscountInp.value) || 0) / 100);
  const addonsAfter = addOnsCost * (1 - (parseFloat(addonsDiscountInp.value) || 0) / 100);
  const psAfter = psCost * (1 - (parseFloat(psDiscountInp.value) || 0) / 100);

  const licenseSubtotal = baseLicenseAfter + licensingAfter + addonsAfter;
  const oneOffSubtotal = psAfter;
  const total = licenseSubtotal + oneOffSubtotal;

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
  document.getElementById("loginWrapper").style.display = "none";
  document.querySelector(".containerRoot").style.display = "grid";
  init();
});
