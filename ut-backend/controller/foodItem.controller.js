const Brand = require("../model/Brand");
const foodItemServices = require("../services/foodItem.service");
const FoodItem = require("../model/Products");


// add food item
const addFoodItem = async (req, res,next) => {
  console.log('food-item--->',req.body);
  try {
    const firstItem = {
      img: req.body.img,
    };
    const imageURLs = [firstItem, ...(req.body.imageURLs || [])];
    const result = await foodItemServices.createFoodItemService({
      ...req.body,
      imageURLs: imageURLs,
    });

    console.log('food-item-result',result)
 
    res.status(200).json({
      success:true,
      status: "success",
      message: "Food item created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};


// add all food items
const addAllFoodItems = async (req,res,next) => {
  try {
    const result = await foodItemServices.addAllFoodItemService(req.body);
    res.json({
      message:'Food items added successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get all food items
const getAllFoodItems = async (req,res,next) => {
  try {
    console.log('Getting all food items...');
    const result = await foodItemServices.getAllFoodItemsService();
    console.log(`Found ${result.length} food items`);
    res.status(200).json({
      success:true,
      data:result,
    })
  } catch (error) {
    console.error('Error in getAllFoodItems:', error);
    next(error)
  }
}

// get all food items by type
const getFoodItemsByType = async (req,res,next) => {
  try {
    const result = await foodItemServices.getFoodItemTypeService(req);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// get offer food item controller
const getOfferTimerFoodItems = async (req,res,next) => {
  try {
    const result = await foodItemServices.getOfferTimerFoodItemService(req.query.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get Popular Food Item By Type
const getPopularFoodItemByType = async (req,res,next) => {
  try {
    const result = await foodItemServices.getPopularFoodItemServiceByType(req.params.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get top rated Food Items
const getTopRatedFoodItems = async (req,res,next) => {
  try {
    const result = await foodItemServices.getTopRatedFoodItemService();
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// getSingleFoodItem
const getSingleFoodItem = async (req,res,next) => {
  try {
    const foodItem = await foodItemServices.getFoodItemService(req.params.id)
    res.json(foodItem)
  } catch (error) {
    next(error)
  }
}

// get Related Food Item
const getRelatedFoodItems = async (req,res,next) => {
  try {
    const foodItems = await foodItemServices.getRelatedFoodItemService(req.params.id)
    res.status(200).json({
      success:true, 
      data:foodItems,
    })
  } catch (error) {
    next(error)
  }
}

// update food item
// exports.= async (req, res,next) => {
//   try {
//     const foodItem = await foodItemServices.updateFoodItemService(req.params.id,req.body)
//     res.send({ data: foodItem, message: "Food item updated successfully!" });
//   } catch (error) {
//     next(error)
//   }
// };


// exports = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const payload = req.body;

//     console.log("🛠️ Update food item:", id, payload);

//     const foodItem = await foodItemServices.updateFoodItemService(id, payload);

//     if (!foodItem) {
//       return res.status(404).json({ message: "Food item not found" });
//     }

//     res.status(200).json({
//       data: foodItem,
//       message: "Food item updated successfully!",
//     });
//   } catch (error) {
//     console.error("Error in updateFoodItem controller:", error);
//     next(error);
//   }
// };



// update food item
const updateFoodItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    console.log("🛠️ Update food item:", id, payload);

    const foodItem = await foodItemServices.updateFoodItemService(id, payload);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({
      data: foodItem,
      message: "Food item updated successfully!",
    });
  } catch (error) {
    console.error("Error in updateFoodItem controller:", error);
    next(error);
  }
};



// review food items
const reviewFoodItems = async (req, res,next) => {
  try {
    const foodItems = await foodItemServices.getReviewsFoodItems()
    res.status(200).json({
      success:true, 
      data:foodItems,
    })
  } catch (error) {
    next(error)
  }
};

// unavailable food items
const unavailableFoodItems = async (req, res,next) => {
  try {
    const foodItems = await foodItemServices.getUnavailableFoodItems();
    res.status(200).json({
      success:true, 
      data:foodItems,
    })
  } catch (error) {
    next(error)
  }
};



//  show notification of less food items
const getStockOutFoodItems = async (req, res, next) => {
  try {
    console.log("⚡ Fetching stock-out items...");

    const all = await FoodItem.find().select("name quantity status").lean();
    console.table(all);

    const result = await FoodItem.find({
      $or: [
        { status: "unavailable" },
        { quantity: { $lte: 1 } }
      ]
    })
      .sort({ createdAt: -1 })
      .select("name img status createdAt quantity")
      .lean();

    console.log("📦 Stock-out query result:", result.length);
    console.table(result);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getStockOutFoodItems:", error);
    next(error);
  }
};




// delete food item
const deleteFoodItem = async (req, res,next) => {
  try {
    await foodItemServices.deleteFoodItem(req.params.id);
    res.status(200).json({
      message:'Food item deleted successfully'
    })
  } catch (error) {
    next(error)
  }
};



module.exports = {
  addFoodItem,
  addAllFoodItems,
  getAllFoodItems,
  getOfferTimerFoodItems,
  getTopRatedFoodItems,
  reviewFoodItems,
  getPopularFoodItemByType,
  getRelatedFoodItems,
  getSingleFoodItem,
  unavailableFoodItems,
  updateFoodItem,
  getFoodItemsByType,
  getStockOutFoodItems,
  deleteFoodItem,
};

