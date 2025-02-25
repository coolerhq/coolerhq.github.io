import {
  Car,
  Plane,
  Truck,
  Home,
  Bolt,
  Snowflake,
  Laptop,
  Thermometer,
  Sun,
  TreeDeciduous,
  Leaf,
  Factory,
  Trash2,
  Coffee,
  Monitor,
  Users,
  BatteryCharging,
  Ship,
  Wind,
  Fuel,
  CloudRain,
  CloudSnow,
} from "lucide-react";

const equivalenciesData = [
  {
    text: "Taking about {x} gas {x|car|cars} off the road for a year.",
    icon: Car,
    factor: 8.89 * 489,
  },
  {
    text: "Equal to about {x} NYC-to-LA {x|flight|flights}.",
    icon: Plane,
    factor: 900,
  },
  {
    text: "Removing about {x} long-haul Mack {x|truck|trucks} for a year.",
    icon: Truck,
    factor: 72000,
  },
  {
    text: "Power used by {x} {x|home|homes} for a year.",
    icon: Home,
    factor: 7500,
  },
  {
    text: "Heating about {x} {x|home|homes} for a year with natural gas.",
    icon: Thermometer,
    factor: 10000,
  },
  {
    text: "CO₂ absorbed by about {x} {x|acre|acres} of forests per year.",
    icon: Leaf,
    factor: 980,
  },
  {
    text: "Recycling about {x} {x|ton|tons} of waste instead of landfilling.",
    icon: Trash2,
    factor: 2500,
  },
  {
    text: "Similar to streaming to about {x} {x|TV|TVs}.",
    icon: Monitor,
    factor: 500,
  },
  {
    text: "Electricity for about {x} {x|person|people} (U.S. grid mix).",
    icon: Users,
    factor: 4800,
  },
  {
    text: "Charging about {x} electric {x|vehicle|vehicles}.",
    icon: BatteryCharging,
    factor: 28.5, // kg CO₂ per EV charge (U.S. grid average)
  },
  {
    text: "Extracting about {x} {x|barrel|barrels} of crude oil.",
    icon: Factory,
    factor: 1600,
  },
  {
    text: "CO₂ emissions from about {x} cargo {x|ship|ships} crossing the ocean.",
    icon: Ship,
    factor: 9000,
  },
  {
    text: "Wind power generation equal to {x} {x|turbine|turbines} running for a year.",
    icon: Wind,
    factor: 8000,
  },
  {
    text: "Energy produced by {x} solar {x|panel|panels} for a year.",
    icon: Sun,
    factor: 5000,
  },
  {
    text: "Burning about {x} {x|gallon|gallons} of gasoline.",
    icon: Fuel,
    factor: 2300,
  },
  {
    text: "CO₂ removed by {x} {x|year|years} of heavy rainfall over the Amazon forest.",
    icon: CloudRain,
    factor: 7000,
  },
];

export default equivalenciesData;

// Function to generate equivalencies based on a given carbon footprint
export const generateEquivalencies = (carbonFootprint) => {
  console.log("📏 Generating equivalencies for footprint:", carbonFootprint);

  if (carbonFootprint === 0) {
    console.log("⚠️ Carbon footprint is zero. Returning an empty array.");
    return []; // Return an empty array to prevent display
  }

  // Convert metric tons to kilograms
  const carbonFootprintKg = carbonFootprint * 1000;

  return equivalenciesData.map(({ text, icon, factor }) => {
    const value = Math.round(carbonFootprintKg / factor);
    const pluralizedText = text.replace(
      /\{x\|([^|]+)\|([^}]+)\}/g,
      (_, singular, plural) => (value === 1 ? singular : plural)
    );
    return {
      text: pluralizedText.replace(/\{x\}/g, value),
      icon,
    };
  });
};

// Function to get 4 random equivalencies based on the footprint
export const getRandomEquivalencies = (carbonFootprint) => {
  const updatedEquivalencies = generateEquivalencies(carbonFootprint);

  // If the footprint is zero, return an empty array
  if (updatedEquivalencies.length === 0) {
    console.log("⚠️ No equivalencies available due to zero footprint.");
    return [];
  }

  return updatedEquivalencies.sort(() => 0.5 - Math.random()).slice(0, 4);
};
