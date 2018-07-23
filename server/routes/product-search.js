const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('VY7UF55ECJ','cc3a7d59bc653a52d54103cf8691121d');
const index = client.initIndex('Amazv1')


router.get('/', (req, res, next) => {
   if(req.query.query) {
     index.search({
         query: req.query.query,
         page: req.query.page,
     }, (err, content) => {
         res.json({
         success: true,
         message: 'Here is your search',
         status: 200,
         content: content,
         search_result: req.query.query
     });
    });
  }
});

module.exports = router;