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
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        console.log("Database saved to localStorage successfully");
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        // If localStorage is full, try to clear some space or notify user
        if (error.name === "QuotaExceededError") {
          alert("Storage is full. Please clear some space and try again.");
        }
      }
    }
  }

  // Get next ID for a collection
  getNextId(collection) {
    if (!collection || collection.length === 0) return 1;
    return Math.max(...collection.map((item) => item.id)) + 1;
  }

  // Get all properties for sale (sorted by ID descending - newest first)
  async getPropertiesForSale() {
    const data = await this.loadData();
    const properties = data.propertiesForSale || [];
    return properties.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  // Get all properties for rent (sorted by ID descending - newest first)
  async getPropertiesForRent() {
    const data = await this.loadData();
    const properties = data.propertiesForRent || [];
    return properties.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  // Get all cars (sorted by ID descending - newest first)
  async getCars() {
    const data = await this.loadData();
    const cars = data.cars || [];
    return cars.sort((a, b) => (b.id || 0) - (a.id || 0));
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

    // Add new property at the beginning (newest first)
    data[collection].unshift(newProperty);
    this.saveToStorage();
    console.log(`Property ${newProperty.id} added to ${collection}`);
    return newProperty;
  }

  // Update a property
  async updateProperty(type, id, updates) {
    const data = await this.loadData();
    const collection = type === "sale" ? "propertiesForSale" : "propertiesForRent";
    
    const index = data[collection].findIndex((p) => p.id === id);
    if (index !== -1) {
      // Preserve the ID and merge all updates with existing property data
      const updatedProperty = { 
        ...data[collection][index], 
        ...updates, 
        id // Ensure ID is preserved
      };
      data[collection][index] = updatedProperty;
      this.saveToStorage();
      console.log(`Property ${id} updated in ${collection}:`, updatedProperty);
      return updatedProperty;
    }
    throw new Error(`Property with id ${id} not found in ${collection}`);
  }

  // Delete a property
  async deleteProperty(type, id) {
    const data = await this.loadData();
    const collection = type === "sale" ? "propertiesForSale" : "propertiesForRent";
    
    const initialLength = data[collection] ? data[collection].length : 0;
    data[collection] = data[collection].filter((p) => p.id !== id);
    
    if (data[collection].length < initialLength) {
      this.saveToStorage();
      console.log(`Property ${id} deleted from ${collection}`);
    } else {
      console.warn(`Property ${id} not found in ${collection}`);
    }
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

    // Add new car at the beginning (newest first)
    data.cars.unshift(newCar);
    this.saveToStorage();
    console.log(`Car ${newCar.id} added to cars`);
    return newCar;
  }

  // Update a car
  async updateCar(id, updates) {
    const data = await this.loadData();
    
    const index = data.cars.findIndex((c) => c.id === id);
    if (index !== -1) {
      // Preserve the ID and merge all updates with existing car data
      const updatedCar = { 
        ...data.cars[index], 
        ...updates, 
        id // Ensure ID is preserved
      };
      data.cars[index] = updatedCar;
      this.saveToStorage();
      console.log(`Car ${id} updated in cars:`, updatedCar);
      return updatedCar;
    }
    throw new Error(`Car with id ${id} not found`);
  }

  // Delete a car
  async deleteCar(id) {
    const data = await this.loadData();
    const initialLength = data.cars ? data.cars.length : 0;
    data.cars = data.cars.filter((c) => c.id !== id);
    
    if (data.cars.length < initialLength) {
      this.saveToStorage();
      console.log(`Car ${id} deleted from cars`);
    } else {
      console.warn(`Car ${id} not found in cars`);
    }
  }
}

// Export a singleton instance
const database = new Database();
export default database;

