export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  wateringFrequency: string;
  sunlight: string;
  lastWatered: string;
  nextWatering: string;
  health: "excellent" | "good" | "fair" | "poor";
  location: string;
  notes: string;
}

export interface Notification {
  id: string;
  type: "water" | "fertilize" | "prune" | "tip";
  plantId?: string;
  plantName?: string;
  message: string;
  time: string;
  priority: "high" | "medium" | "low";
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  uvIndex: number;
  icon: string;
}

export const plants: Plant[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    image:
      "https://images.unsplash.com/photo-1654179280639-3de6d9d7f996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25zdGVyYSUyMHBsYW50JTIwaG9tZXxlbnwxfHx8fDE3NzIzNzg0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    wateringFrequency: "Every 7-10 days",
    sunlight: "Bright indirect light",
    lastWatered: "2026-02-26",
    nextWatering: "2026-03-05",
    health: "excellent",
    location: "Living Room",
    notes: "Large fenestrated leaves developing well. Shows vigorous growth.",
  },
  {
    id: "2",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    image:
      "https://images.unsplash.com/photo-1668426231244-1827c29ef8e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZSUyMHBsYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyNDMwNzk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    wateringFrequency: "Every 14-21 days",
    sunlight: "Low to bright indirect light",
    lastWatered: "2026-02-20",
    nextWatering: "2026-03-06",
    health: "excellent",
    location: "Bedroom",
    notes: "Very low maintenance. Perfect air purifier.",
  },
  {
    id: "3",
    name: "Boston Fern",
    scientificName: "Nephrolepis exaltata",
    image:
      "https://images.unsplash.com/photo-1656940655555-9da1ddbe3d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJuJTIwcGxhbnQlMjBncmVlbnxlbnwxfHx8fDE3NzI0NDg4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    wateringFrequency: "Every 2-3 days",
    sunlight: "Indirect bright light",
    lastWatered: "2026-03-01",
    nextWatering: "2026-03-03",
    health: "good",
    location: "Bathroom",
    notes: "Loves humidity. Keep soil consistently moist but not soggy.",
  },
  {
    id: "4",
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    image:
      "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWRkbGUlMjBsZWFmJTIwZmlnfGVufDF8fHx8MTc3MjM5MjU3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    wateringFrequency: "Every 7 days",
    sunlight: "Bright indirect light",
    lastWatered: "2026-02-27",
    nextWatering: "2026-03-06",
    health: "fair",
    location: "Office",
    notes:
      "Some brown spots on lower leaves. May need more consistent watering.",
  },
  {
    id: "5",
    name: "Succulent Garden",
    scientificName: "Mixed succulents",
    image:
      "https://images.unsplash.com/photo-1621512366232-0b7b78983782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjdWxlbnQlMjBwbGFudCUyMHBvdHxlbnwxfHx8fDE3NzI0MTk0MzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    wateringFrequency: "Every 14-18 days",
    sunlight: "Direct sunlight 6+ hours",
    lastWatered: "2026-02-18",
    nextWatering: "2026-03-04",
    health: "excellent",
    location: "Window Sill",
    notes: "Thriving in bright sunlight. Beautiful color development.",
  },
  {
    id: "6",
    name: "Potted Mixed Plants",
    scientificName: "Various species",
    image:
      "https://images.unsplash.com/photo-1563419837758-e48ef1b731dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwb3R0ZWQlMjBwbGFudHN8ZW58MXx8fHwxNzcyMzgxOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    wateringFrequency: "Every 5-7 days",
    sunlight: "Medium indirect light",
    lastWatered: "2026-02-28",
    nextWatering: "2026-03-05",
    health: "good",
    location: "Kitchen",
    notes: "Collection growing well. Consider separating into individual pots.",
  },
];

export const notifications: Notification[] = [
  {
    id: "1",
    type: "water",
    plantId: "3",
    plantName: "Boston Fern",
    message: "Boston Fern needs watering tomorrow",
    time: "Tomorrow",
    priority: "high",
  },
  {
    id: "2",
    type: "water",
    plantId: "5",
    plantName: "Succulent Garden",
    message: "Succulent Garden is due for watering in 2 days",
    time: "In 2 days",
    priority: "medium",
  },
  {
    id: "3",
    type: "tip",
    message:
      "Spring is coming! Consider repotting plants that have outgrown their containers.",
    time: "Today",
    priority: "low",
  },
  {
    id: "4",
    type: "fertilize",
    plantId: "1",
    plantName: "Monstera Deliciosa",
    message:
      "It's a good time to fertilize your Monstera for the growing season",
    time: "This week",
    priority: "medium",
  },
  {
    id: "5",
    type: "tip",
    message:
      "Check your plants for pests regularly. Early detection is key to preventing infestations.",
    time: "Today",
    priority: "low",
  },
  {
    id: "6",
    type: "prune",
    plantId: "4",
    plantName: "Fiddle Leaf Fig",
    message: "Remove brown leaves from Fiddle Leaf Fig to promote new growth",
    time: "This week",
    priority: "medium",
  },
];

export const weatherData: WeatherData = {
  temperature: 72,
  condition: "Partly Cloudy",
  humidity: 55,
  uvIndex: 6,
  icon: "cloud-sun",
};
