export const validateInventoryPayload = (data) => {
    // Basic validation implementation matching frontend expectations
    const errors = {};
    if (!data.id && !data.itemId)
        errors.id = 'Item ID is required';
    if (!data.name)
        errors.name = 'Item Name is required';
    if (!data.category)
        errors.category = 'Category is required';
    if (!data.price || isNaN(Number(data.price)))
        errors.price = 'Valid price is required';
    if (!data.stock)
        errors.stock = 'Stock is required';
    if (!data.threshold)
        errors.threshold = 'Threshold is required';
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
