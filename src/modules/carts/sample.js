create = async (req, res, next) => {
    try {
        const { products } = req.body;

        // Check if products is an array and has at least one item
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products array is required." });
        }

        // Fetch the existing cart for the user
        let existingCart = await CartModel.findOne({ customerid: req.authuser._id });

        // Process each product in the products array
        for (const { productid, quantity } of products) {
            // Validate product ID and quantity
            if (!productid || !quantity || quantity < 1) {
                return res.status(400).json({ message: "Product ID and quantity must be provided and valid." });
            }

            // Find the product in the ProductModel
            const product = await ProductModel.findById(productid);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productid} not found.` });
            }

            if (existingCart) {
                const productIndex = existingCart.products.findIndex(p => p.productid.toString() === productid);

                // If product already exists in the cart, update its quantity
                if (productIndex !== -1) {
                    existingCart.products[productIndex].quantity += quantity;
                    existingCart.products[productIndex].amount = product.price * existingCart.products[productIndex].quantity; // Update amount
                } else {
                    // Add new product to the cart
                    existingCart.products.push({
                        productid: productid,
                        quantity: quantity,
                        producttitle: product.title,
                        price: product.price,
                        amount: product.price * quantity // Calculate total amount
                    });
                }
                
                await existingCart.save(); // Save the updated cart

                return res.status(200).json({
                    result: existingCart,
                    message: "Product added to existing cart successfully.",
                    meta: null
                });
            } else {
                // Create a new cart if it doesn't exist
                const cartData = {
                    customerid: req.authuser._id,
                    products: [{
                        productid: productid,
                        producttitle: product.title,
                        quantity: quantity,
                        price: product.price,
                        amount: product.price * quantity // Calculate total amount
                    }],
                    status: CartStatus.PENDING, // Default status
                };

                const cart = await cartService.createCart(cartData); // Call your cart creation service

                return res.status(201).json({
                    result: cart,
                    message: "Cart created successfully.",
                    meta: null
                });
            }
        }
    } catch (exception) {
        console.error(exception);
        next(exception);
    }
}
