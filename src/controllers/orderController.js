// /src/controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Customer = require('../models/customerModel');

exports.placeOrder = async (req, res) => {
  try {
    const { customerId, products } = req.body;
    console.log({ customerId, products })
    // Find the customer
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      console.error(`Customer with ID ${customerId} not found`);
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Create the order
    const order = await Order.create();

    // Link the order with the customer
    await order.setCustomer(customer);

    // Add products to the order along with quantities
    await Promise.all(
      products.map(async (product) => {
        const { productId, quantity } = product;

        // Find the product
        const existingProduct = await Product.findByPk(productId);

        if (existingProduct) {
          // Add the product to the order with the specified quantity
          await order.addProduct(existingProduct, { through: { quantity } });
        } else {
          // If the product doesn't exist, handle accordingly
          console.error(`Product with ID ${productId} not found`);
        }
      })
    );

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { products, customerId, orderStatus } = req.body;

    // Find the order
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Clear existing products associated with the order
    await order.setProducts([]);

    // Add the new set of products to the order along with quantities
    await Promise.all(
      products.map(async (product) => {
        const { productId, quantity } = product;

        // Find the product
        const existingProduct = await Product.findByPk(productId);

        if (existingProduct) {
          // Add the product to the order with the specified quantity
          await order.addProduct(existingProduct, { through: { quantity } });
        } else {
          // If the product doesn't exist, handle accordingly
          console.error(`Product with ID ${productId} not found`);
        }
      })
    );

    // Update other order properties if needed
    await order.update({ orderStatus: orderStatus || order.orderStatus });

    // Link the order with the customer
    if (customerId) {
      const customer = await Customer.findByPk(customerId);

      if (customer) {
        await order.setCustomer(customer);
      } else {
        console.error(`Customer with ID ${customerId} not found`);
        return res.status(404).json({ error: 'Customer not found' });
      }
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Set order status to 'canceled'
    await order.update({ orderStatus: 'canceled' });

    // // Clear existing products associated with the order
    // await order.setProducts([]);

    // // Unlink the order from the customer
    // await order.setCustomer(null);

    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'description', 'price'],
          through: { attributes: ['quantity'] },
        },
        {
          model: Customer,
          attributes: ['id', 'name', 'email', 'address'],
        },
      ],
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
