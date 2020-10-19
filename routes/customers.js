const { Customer, validate } = require('../models/customer');
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();


// 3. Customer endpoint functions

// return all customer info
router.get('/', auth, async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
}) 

// return by customer id
router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    // don't forget to do error handling!
    if (!customer) return res.status(404).send('The customer with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(customer);
}) 

router.put('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    }, { new: true });

    if (!customer) return res.status(404).send('The customer with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(customer);
})

router.post('/', auth, async (req, res) => {
    // 
    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })

    customer = await customer.save();

    res.send(customer);
})

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(customer);
})



module.exports = router;

