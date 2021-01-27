 const {Router} = require('express');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const config = require('config');
 const {check, validationResult} = require('express-validator');
 const User = require('../models/User'); //db model
 const router = Router();


 // api/auth/register
 router.post(
     '/register',
     [   // validators array(express-validator)
        check('email', 'Некорректный email').isEmail(), // check email
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6})
     ],
      async (req,res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {  // if errors exist
            return res.status(400).json({  // send to front-end
                error: errors.array(),
                message: "Некорректные данные при регистрации"
            }) 
        }

        const {email, password} = req.body // send from front-end

        const candidate = await User.findOne({email}); //{email: email}
        if (candidate) {
            return res.status(400).json({ message: 'Такой пользователь уже существует'});
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);  // hash password
        const user = new User({ email, password: hashedPassword });

        await user.save();

        res.status(201).json({ message: 'Пользователь создан'});

    } catch(e) {
        res.status(500).json({message:'Что-то пошло не так попробуйте снова'});
    }
 });

  // api/auth/login
  router.post('/login',
  [
    check('email','Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()  //check if password entered exists
  ],
   async (req,res) => {
    try {
        //console.log(req.body);
        const errors = validationResult(req)

        if(!errors.isEmpty()) {  // if errors exist
            return res.status(400).json({  // send to front-end
                error: errors.array(),
                message: "Некорректные данные при входе в систему"
            }) 
        }

    const {email,password} = req.body;

    const user = await User.findOne({ email })  // search user by email entered in db

    if (!user) {  // if email isn't found
        return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const isMatch = await bcrypt.compare(password, user.password) // check if password entered match password from db

    if(!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    //Authorization
    const token = jwt.sign(  //create token for authorization
        { userId: user.id },
        config.get('jwtSecret'),   // secret string from config.json
        { expiresIn: '1h' }  //jwt token will exist for 1 hour
    )

    res.json({ token, userId: user.id })

    } catch(e) {
        res.status(500).json({message:'Что-то пошло не так. Попробуйте снова'});
    }
});

 module.exports = router;