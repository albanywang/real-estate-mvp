// models/PropertyBuilder.js
/**
 * Builder pattern for creating complex Property instances
 */
import { Property } from "./Property.js";

class PropertyBuilder {
  constructor() {
    this.data = {};
  }

  /**
   * Set basic information
   */
  setBasicInfo(title, price, address, area) {
    this.data.title = title;
    this.data.price = price;
    this.data.address = address;
    this.data.area = area;
    return this;
  }

  /**
   * Set property characteristics
   */
  setCharacteristics(propertyType, layout, yearBuilt) {
    this.data.propertyType = propertyType;
    this.data.layout = layout;
    this.data.yearBuilt = yearBuilt;
    return this;
  }

  /**
   * Set financial information
   */
  setFinancials(managementFee, maintenanceFees, otherFees = 0) {
    this.data.managementFee = managementFee;
    this.data.maintenanceFees = maintenanceFees;
    this.data.otherFees = otherFees;
    return this;
  }

  /**
   * Set location
   */
  setLocation(latitude, longitude) {
    this.data.location = [latitude, longitude];
    return this;
  }

  /**
   * Set features
   */
  setFeatures(pets = false, parking = '', kitchen = '') {
    this.data.pets = pets;
    this.data.parking = parking;
    this.data.kitchen = kitchen;
    return this;
  }

  /**
   * Add images
   */
  addImages(images) {
    this.data.images = Array.isArray(images) ? images : [images];
    return this;
  }

  /**
   * Set legal information
   */
  setLegalInfo(landRights, transactionMode, propertyNumber) {
    this.data.landRights = landRights;
    this.data.transactionMode = transactionMode;
    this.data.propertyNumber = propertyNumber;
    return this;
  }

  /**
   * Build the Property instance
   */
  build() {
    return new Property(this.data);
  }

  /**
   * Reset the builder
   */
  reset() {
    this.data = {};
    return this;
  }
}

export { PropertyBuilder };