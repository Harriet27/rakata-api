const { db } = require('../database');
const { createJWTToken } = require('../helper/jwt');

module.exports = {
    Login: (req,res) => {
        let { username, password } = req.body;
        // let sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        let sql = `SELECT * FROM users WHERE password = '${password}'`;
        db.query(sql, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            if (results.length !== 0) {
                let token = createJWTToken({...results[0]});
                res.status(200).send({
                    status: 'Success',
                    data: {
                        ...results[0],
                        token,
                    },
                    message: 'Login Successful',
                });
            } else {
                res.status(404).send({
                    status: 'Not Found',
                    message: 'User not found',
                });
            }
        });
    },
    KeepLogin: (req,res) => {
        res.status(200).send({
            status: 'Success',
            data: {
                ...req.user,
                token: req.token,
            },
            message: 'Authorized',
        });
    },
};
