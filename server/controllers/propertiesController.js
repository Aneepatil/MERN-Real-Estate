import { Property } from "../models/PropertyModel.js";
import { appError } from "../utils/appError.js";

// Create Property
export const createProperty = async (req, res, next) => {
  const {
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
    imageUrl,
  } = req.body;

  try {
    const property = await Property.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrl,
      userRef: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully...",
      property,
    });
  } catch (error) {
    next(error);
  }
};

// Getting all Properties
export const getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find();
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully...",
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// Get Property
export const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    // Check the property in database exist or not
    if (!property) {
      return next(appError(404, "Property not found..."));
    }

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully...",
      property,
    });
  } catch (error) {
    next(error);
  }
};

// Update Property
export const updateProperty = async (req, res, next) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    // Check the property in database exist or not
    if (!property) {
      return next(appError(404, "Property not found..."));
    }

    // Check the property is created by logged in user or not
    if (req.user !== property.userRef.toString()) {
      return next(appError(500, "You only can update your own property..."));
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Property Updated successfully...",
      updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Property
export const deleteProperty = async (req, res, next) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);

    // Check the property is in database or not
    if (!property) {
      return next(appError(404, "Property not found..."));
    }

    // Check the property is created by logged in user or not
    if (req.user !== property.userRef.toString()) {
      return next(appError(500, "You only can update your own property..."));
    }

    await Property.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Property Deleted successfully...",
    });
  } catch (error) {
    next(error);
  }
};
