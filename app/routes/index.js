var express = require('express');
var router = express.Router();

const mysql2 = require('mysql2');
const mysql = mysql2.createPool({  // ผูก database mysql db_nodestock ่ที่เพิ่งสร้างขึ้นมา
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_nodestock'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/product', (req, res) => {

  mysql.query('SELECT * FROM tb_product', (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.render('product', { data: {}, products: rs});
    }
  })

})

router.post('/product', (req, res) => {
  mysql.query('INSERT INTO tb_product SET ?', req.body, (err, rs) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect('product');
      }
  })
})

router.get('/productDelete/:id', (req, res) => {
  var condition = [req.params.id];
  mysql.query('DELETE FROM tb_product WHERE id = ?', condition, (err, rs) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/product');
      }
    })
  })

router.get('/productEdit/:id', (req, res) =>{
  var condition = [req.params.id];
  var sql = 'SELECT * FROM tb_product WHERE id = ?';
  
  mysql.query(sql, condition, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      sql = 'SELECT * FROM tb_product';
      mysql.query(sql, (err, products) => {
        if (err) {
          res.send(err);
        } else {
          res.render('product', {data: rs[0], products: products});
      }
    })
  }
  })
})
router.post('/productEdit/:id', (req, res) => {
  var params = [req.body.barcode, req.body.name, req.params.id];
  var sql = 'UPDATE tb_product SET barcode = ?, name = ? WHERE id = ?';

  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/product');
  }
})
})

router.get('/importStock', (req, res) => {
  res.render('importStock');
})

router.post('/importStock', (req, res) => {
    var sql = 'INSERT INTO tb_import_stock(product_id, qty, import_date) VALUES(?, ?, NOW())';
    var params = [req.body.product_id, req.body.qty];

    mysql.query(sql, params, (err, rs) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('importStockSuccess');
        }
    })
})

router.get('/importStockSuccess', (req, res) => {
  res.render('importStockSuccess');
})

router.post('/searchProduct', (req, res) => {
  var sql = 'SELECT * FROM tb_product WHERE barcode = ?';
  mysql.query(sql, req.body.barcode, (err, rs) => {
      if (err) {
          res.send(err);
      } else {
          res.json(rs);
      }
  })
})

router.get('/outStock', (req, res) => {
  res.render('outStock');
})

router.post('/outStock', (req, res) => {
  var sql = 'INSERT INTO tb_outstock(product_id, qty, outdate) VALUES(?, ?, NOW())';
  var params = [req.body.product_id, req.body.qty];

  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('outStockSuccess');
    }
  })
})

router.get('/outStock', (req, res) => {
  res.render('outStock');
})


router.get('/outStockSuccess', (req, res) => {
  res.render('outStockSuccess');
})

module.exports = router;
