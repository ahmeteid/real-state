// Database service to fetch data from the database JSON file
class Database {
  constructor() {
    this.data = null;
    this.loaded = false;
    this.storageKey = "real_state_database";
  }

  // Load data from database JSON file or localStorage
  async loadData() {
    if (this.loaded && this.data) {
      return this.data;
    }

    try {
      // Check localStorage first
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        this.data = JSON.parse(storedData);
        this.loaded = true;
        return this.data;
      }

      // Fallback to JSON file
      const response = await fetch("/database/db.json");
      if (!response.ok) {
        throw new Error("Failed to load database");
      }
      this.data = await response.json();
      this.loaded = true;
      // Save to localStorage
      this.saveToStorage();
      return this.data;
    } catch (error) {
      console.error("Error loading database:", error);
      throw error;
    }
  }

  // Save data to localStorage
  saveToStorage() {
    if (this.data) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }
  }

  // Get next ID for a collection
  getNextId(collection) {
    if (!collection || collection.length === 0) return 1;
    return Math.max(...collection.map((item) => item.id)) + 1;
  }

  // Get all properties for sale
  async getPropertiesForSale() {
    const data = await this.loadData();
    return data.propertiesForSale || [];
  }

  // Get all properties for rent
  async getPropertiesForRent() {
    const data = await this.loadData();
    return data.propertiesForRent || [];
  }

  // Get all cars
  async getCars() {
    const data = await this.loadData();
    return data.cars || [];
  }

  // Get a single property for sale by ID
  async getPropertyForSaleById(id) {
    const properties = await this.getPropertiesForSale();
    return properties.find((p) => p.id === id) || null;
  }

  // Get a single property for rent by ID
  async getPropertyForRentById(id) {
    const properties = await this.getPropertiesForRent();
    return properties.find((p) => p.id === id) || null;
  }

  // Get a single car by ID
  async getCarById(id) {
    const cars = await this.getCars();
    return cars.find((c) => c.id === id) || null;
  }

  // Add a property
  async addProperty(type, property) {
    const data = await this.loadData();
    const collection = type === "sale" ? "propertiesForSale" : "propertiesForRent";
    
    if (!data[collection]) {
      data[collection] = [];
    }

    const newProperty = {
      ...property,
      id: this.getNextId(data[collection]),
    };

    data[collection].push(newProperty);
    this.saveToStorage();
    return newProperty;
  }

  // Update a property
  async updateProperty(type, id, updates) {
    const data = await this.loadData();
    const collection = type === "sale" ? "propertiesForSale" : "propertiesForRent";
    
    const index = data[collection].findIndex((p) => p.id === id);
    if (index !== -1) {
      data[collection][index] = { ...data[collection][index], ...updates, id };
      this.saveToStorage();
      return data[collection][index];
    }
    throw new Error("Property not found");
  }

  // Delete a property
  async deleteProperty(type, id) {
    const data = await this.loadData();
    const collection = type === "sale" ? "propertiesForSale" : "propertiesForRent";
    
    data[collection] = data[collection].filter((p) => p.id !== id);
    this.saveToStorage();
  }

  // Add a car
  async addCar(car) {
    const data = await this.loadData();
    
    if (!data.cars) {
      data.cars = [];
    }

    const newCar = {
      ...car,
      id: this.getNextId(data.cars),
    };

    data.cars.push(newCar);
    this.saveToStorage();
    return newCar;
  }

  // Update a car
  async updateCar(id, updates) {
    const data = await this.loadData();
    
    const index = data.cars.findIndex((c) => c.id === id);
    if (index !== -1) {
      data.cars[index] = { ...data.cars[index], ...updates, id };
      this.saveToStorage();
      return data.cars[index];
    }
    throw new Error("Car not found");
  }

  // Delete a car
  async deleteCar(id) {
    const data = await this.loadData();
    data.cars = data.cars.filter((c) => c.id !== id);
    this.saveToStorage();
  }
}

// Export a singleton instance
const database = new Database();
export default database;

