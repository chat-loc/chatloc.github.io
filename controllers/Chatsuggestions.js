const express = require('express');
const router = express.Router();




router.get('/searchnews',(req,res)=>{
    
    var searchtext = req.query['searchtext'];
    //console.log(searchtext);

    //newsapi
    //documentation: https://newsapi.org/docs/endpoints/everything
    
    const NewsAPI = require('newsapi');
    const newsapi = new NewsAPI(process.env.NEWSAPIKEY); // api key in env file so check for the key 

    newsapi.v2.everything({
        q: searchtext,
        qInTitle: searchtext,
        language: 'en',
        pageSize: 1
      }).then(response => {
        console.log(response);
        /*
          {
            status: "ok",
            articles: [...]
          }
        */

        res.redirect('/user/login');

      }).catch(err=>{
        console.log(`Error : ${err}`);
    });
});

module.exports = router;