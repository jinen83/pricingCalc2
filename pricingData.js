const pricingData = {
  "professionalServices": {
    "rateIndia": 109,
    "rateOutside": 174
  },
  "baseLicense": {
    "developerBased": {
      "Enterprise": { "Self Host": 15000, "Cloud": 0 },
      "Business": { "Self Host": 10000, "Cloud": 0 }
    },
    "userBased": {
      "Enterprise": { "Self Host": 15000, "Cloud": 15000 },
      "Business": { "Self Host": 10000, "Cloud": 0 },
      "Business Lite": { "Self Host": 5000, "Cloud": 0 }
    },
    "usageBased": {
      "Enterprise": { "Self Host": 0, "Cloud": 0 },
      "Business": { "Self Host": 0, "Cloud": 0 },
      "Business Lite": { "Self Host": 0, "Cloud": 0 }
    }
  },
  "licensingTiers": {
    "developerBased": {
      "Enterprise": {
        "Self Host": { "baseDev": 5, "tier1Range": [6, 10], "tier1Price": 3500, "tier2Range": [11, 100], "tier2Price": 2500, "tier3Price": 1500 },
        "Cloud": null
      },
      "Business": {
        "Self Host": { "baseDev": 1, "tier1Range": [2, 10], "tier1Price": 2500, "tier2Range": [11, 100], "tier2Price": 2000, "tier3Price": 1000 },
        "Cloud": null
      }
    },
    "userBased": {
      "Enterprise": {
        "Self Host": [{ "maxUsers": 100, "monthlyRate": 50 }, { "maxUsers": 300, "monthlyRate": 35 }, { "maxUsers": null, "monthlyRate": 20 }],
        "Cloud": [{ "maxUsers": 100, "monthlyRate": 50 }, { "maxUsers": 300, "monthlyRate": 35 }, { "maxUsers": null, "monthlyRate": 15 }]
      },
      "Business": {
        "Self Host": [{ "maxUsers": 100, "monthlyRate": 25 }, { "maxUsers": 300, "monthlyRate": 20 }, { "maxUsers": null, "monthlyRate": 20 }],
        "Cloud": [{ "maxUsers": 100, "monthlyRate": 25 }, { "maxUsers": 300, "monthlyRate": 20 }, { "maxUsers": null, "monthlyRate": 15 }]
      },
      "Business Lite": {
        "Cloud": [
          { "maxUsers": null, "monthlyRate": 15 }
        ]
      }
    },
    "usageBased": {
      "Business": {
        "Cloud": [{ "tierKey": "125k", "monthly": 500 }, { "tierKey": "250k", "monthly": 1000 }],
        "Self Host": [{ "tierKey": "300k", "monthly": 1500 }, { "tierKey": "500k", "monthly": 2500 }, { "tierKey": "1mn", "monthly": 5000 }]
      },
      "Enterprise": {
        "Cloud": [{ "tierKey": "500k", "monthly": 3500 }, { "tierKey": "1mn", "monthly": 7000 }, { "tierKey": "2mn", "monthly": 12000 }, { "tierKey": "5mn", "monthly": 25000 }],
        "Self Host": [{ "tierKey": "500k", "monthly": 3500 }, { "tierKey": "1mn", "monthly": 7000 }, { "tierKey": "2mn", "monthly": 12000 }, { "tierKey": "5mn", "monthly": 25000 }]
      }
    }
  },
  // ==================================================================================
  // COMPLETE, UNABRIDGED LIST OF ADD-ONS IN THE NEW FLAT STRUCTURE
  // ==================================================================================
  "addOns": [
    // --- Developer Based (Self Host) ---
    { "model": "Developer Based", "deployment": "Self Host", "addonName": "PDF", "tier": "Unlimited", "price": 15000, "controlType": "checkbox" },
    { "model": "Developer Based", "deployment": "Self Host", "addonName": "Automation", "tier": "Unlimited", "price": 15000, "controlType": "checkbox" },
    { "model": "Developer Based", "deployment": "Self Host", "addonName": "Public Apps", "tier": "Unlimited", "price": 15000, "controlType": "checkbox" },
    { "model": "Developer Based", "deployment": "Self Host", "addonName": "Secured Embed", "tier": "Unlimited", "price": 2500, "controlType": "checkbox" },
    { "model": "Developer Based", "deployment": "Self Host", "addonName": "File Storage", "tier": "Unlimited", "price": 2500, "controlType": "checkbox" },
    { "model": "Developer Based", "deployment": "Self Host", "addonName": "DB Storage", "tier": "Unlimited", "price": 2500, "controlType": "checkbox" },
    { "model": "Developer Based", "deployment": "Self Host", "addonName": "MCP", "tier": "Unlimited", "price": 2500, "controlType": "checkbox" },

    // --- User Based (Self Host) ---
    { "model": "User Based", "deployment": "Self Host", "addonName": "PDF", "tier": "10K", "price": 1800, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "PDF", "tier": "50K", "price": 7200, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Automation", "tier": "2.5k", "price": 600, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Automation", "tier": "10k", "price": 1800, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Automation", "tier": "50k", "price": 7200, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Automation", "tier": "Unlimited", "price": 15000, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Public Apps", "tier": "10k", "price": 1500, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Public Apps", "tier": "50k", "price": 7200, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Public Apps", "tier": "Unlimited", "price": 15000, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "Secured Embed", "tier": "Unlimited", "price": 600, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "File Storage", "tier": "Unlimited", "price": 2500, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "DB Storage", "tier": "Unlimited", "price": 2500, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "MCP", "tier": "20k runs", "price": 30, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "MCP", "tier": "60k runs", "price": 75, "controlType": "select" },
    { "model": "User Based", "deployment": "Self Host", "addonName": "MCP", "tier": "150k runs", "price": 150, "controlType": "select" },

    // --- User Based (Cloud) ---
    { "model": "User Based", "deployment": "Cloud", "addonName": "PDF", "tier": "10K", "price": 2400, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "PDF", "tier": "50K", "price": 10200, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Automation", "tier": "2.5k", "price": 600, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Automation", "tier": "5k", "price": 1200, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Automation", "tier": "10k", "price": 1800, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Public Apps", "tier": "5k", "price": 1200, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Public Apps", "tier": "10k", "price": 2400, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Public Apps", "tier": "50k", "price": 10200, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Secured Embed", "tier": "Unlimited", "price": 600, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "File Storage", "tier": "10GB", "price": 600, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "File Storage", "tier": "50GB", "price": 1200, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "File Storage", "tier": "100GB", "price": 2400, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "DB Storage", "tier": "10GB", "price": 1200, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "DB Storage", "tier": "50GB", "price": 2400, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "MCP", "tier": "20k runs", "price": 30, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "MCP", "tier": "60k runs", "price": 75, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "MCP", "tier": "150k runs", "price": 150, "controlType": "select" },
    { "model": "User Based", "deployment": "Cloud", "addonName": "Dashboard", "tier": "Annual Subscription", "price": 12000, "controlType": "checkbox" },

    // --- Usage Based (Self Host) ---
    { "model": "Usage Based", "deployment": "Self Host", "addonName": "PDF", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Self Host", "addonName": "Automation", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Self Host", "addonName": "Public Apps", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Self Host", "addonName": "File Storage", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Self Host", "addonName": "DB Storage", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Self Host", "addonName": "MCP", "tier": "Activation", "price": 600, "controlType": "select" },

    // --- Usage Based (Cloud) ---
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "PDF", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "Automation", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "Public Apps", "tier": "Activation", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "File Storage", "tier": "10GB", "price": 600, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "File Storage", "tier": "50GB", "price": 1200, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "File Storage", "tier": "100GB", "price": 2400, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "DB Storage", "tier": "10GB", "price": 1200, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "DB Storage", "tier": "50GB", "price": 2400, "controlType": "select" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "Dashboard", "tier": "Annual Subscription", "price": 12000, "controlType": "checkbox" },
    { "model": "Usage Based", "deployment": "Cloud", "addonName": "MCP", "tier": "Activation", "price": 600, "controlType": "select" }
  ]
};
