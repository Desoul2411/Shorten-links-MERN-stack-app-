const {Router} = require('express');
const config = require('config');
const shortid = require('shortid');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl');
        const {from} = req.body; // gey from path from front-end

        const code = shortid.generate(); // generate unique code

        const existing = await Link.findOne({ from }); 

        if (existing) {  // check if 'from' link already exist. if 'form' exist it means that all data for 'form' has been already formed and there is no need to form it again
            return res.json({ link: existing }); // and just send it
        }

        const to = baseUrl + '/t/' + code;  // shortened path // this route will be processed
        const link = new Link({  // create object of shortened link
            code, to, from, owner: req.user.userId     // owner: req.user.userId  - available due to auth middleware// * See auth.middleware.js const token = jwt.sign(...)
        });

        await link.save(); //return Promise

        res.status(201).json({ link }); // 201 - status 'created
    } catch(e) {
        res.status(500).json({message:'Что-то пошло не так попробуйте снова'});
    }
});

router.get('/', auth, async (req, res) => {  // get all links. using middleware auth - auth.middleware.js that contains token
    try {
        const links = await Link.find({ owner: req.user.userId }); // request to db to find all the links of current user // due to using middleware auth we have user.userId field in req
        res.json(links)
    } catch(e) {
        res.status(500).json({message:'Что-то пошло не так попробуйте снова'});
    }
});

router.get('/:id', auth, async (req, res) => { // get links by id / add auth middleware in order to prevent unauthorized users to create links
    try {
        const link = await Link.findById(req.params.id); // get id from GET params
        res.json(link)
    } catch(e) {
        res.status(500).json({message:'Что-то пошло не так попробуйте снова'});
    }
});

module.exports = router;