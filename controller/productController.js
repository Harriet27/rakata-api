const { db, query } = require('../database');
const { uploader } = require('../helper/uploader');
const fs = require('fs');

module.exports = {
    getProduct: (req,res) => {
        let sql = `select * from products`;
        db.query(sql, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: 'Success',
                data: results,
                message: 'Fetched Successfully',
            });
        });
    },
    getProductLimit: async (req,res) => {
        let { limit, offset } = req.params
        let totalProduct = `SELECT COUNT(*) AS numRows FROM products`;
        let get = `SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`;
        try {
            let response = await query(get);
            let count = await query(totalProduct);
            res.status(200).send({
                data: response,
                count: count[0].numRows,
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
    addProduct: (req,res) => {
        try {
            const path = '/images';
            const upload = uploader(path, 'PQR').fields([{ name: 'image' }]);
            upload(req,res,(err) => {
                const { image } = req.files;
                const { nama, merk, harga } = req.body;
                const imagePath  = image ? `${path}/${image[0].filename}` : null;
                let sql = `insert into products (nama, merk, harga, imagePath) values ('${nama}', '${merk}', ${harga}, '${imagePath}')`;
                db.query(sql, (err,results) => {
                    if (err) {
                        fs.unlinkSync(`./public${imagePath}`);
                        res.status(500).send(err.message);
                    }
                    res.status(200).send({
                        status: 'Success',
                        message: 'Data Created',
                    });
                });
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
    editProduct: (req,res) => {
        // let { id } = req.params;
        // let sql = `select * from products where product_id = ${id}`;
        // db.query(sql, (err,results) => {
        //     if (err) {
        //         res.status(500).send(err.message);
        //     }
        //     let oldImagePath = results[0].imagePath;
        //     try {
        //         const path = '/images';
        //         const upload = uploader(path, 'PQR').fields([{ name: 'image' }]);
        //         upload(req,res,(err) => {
        //             if (err) {
        //                 res.status(500).send(err.message);
        //             }
        //             const { image } = req.files;
        //             const { nama, harga } = req.body;
        //             const imagePath = image ? `${path}/${image[0].filename}` : oldImagePath;
        //             let sql = `update products set nama = '${nama}', harga = ${harga}, imagePath = '${imagePath}' where product_id = ${id}`;
        //             db.query(sql, (err,results) => {
        //                 if (err) {
        //                     fs.unlinkSync(`./public${imagePath}`);
        //                     res.status(500).send(err.message);
        //                 }
        //                 if (image) {
        //                     fs.unlinkSync(`./public${oldImagePath}`);
        //                 }
        //                 res.status(200).send({
        //                     status: 'Success',
        //                     message: 'Data edited successfully',
        //                 });
        //             });
        //         });
        //     } catch (err) {
        //         res.status(500).send(err.message);
        //     }
        // });
        let { id } = req.params;
        let { nama, harga, merk } = req.body;
        let sql = `update products set nama = '${nama}', merk = '${merk}', harga = ${harga} where product_id = ${id}`;
        db.query(sql, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status : 'edited',
                message : 'Data Edited!',
            });
        });
    },
    deleteProduct: (req,res) => {
        let { id } = req.params;
        let sql = `delete from products where product_id = ${id}`;
        db.query(sql, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: 'Success',
                message: 'Deleted Successfully',
            });
        });
    },
    searchProduct: async (req,res) => {
        let { product, limit, offset } = req.params;
        let countSql = `SELECT COUNT(*) AS numRows FROM products WHERE nama LIKE '%${product}%'`;
        let sql = `SELECT * FROM products WHERE nama LIKE '%${product}%' LIMIT ${limit} OFFSET ${offset}`;
        try {
            let response = await query(sql);
            let total = await query(countSql);
            res.status(200).send({
                data: response,
                count: total[0].numRows,
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};
