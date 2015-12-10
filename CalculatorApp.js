var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');

var client = elasticsearch.Client();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
app.use('/api', router);

router.route('/getItemList')
	.post(function(req,resp){
	
		var filter = {};
		var categorySelected = req.body.data;
		if(categorySelected && categorySelected != "all"){
			var termFilter = {
				term : { category : categorySelected }
			}
			filter = termFilter;
		}

		client.search({
			index : 'item',
			type : 'recipe',
			body:{
			    "size": 200,
			    "filter" : filter,
			    "sort": [
			       	{
			          	"id": {
			             	"order": "asc"
			          	}
			       	}
			    ]
			}
		}, function(err, result){
			if(!err){
				var rawList = result.hits.hits;
				var itemList = []
				for(var key in rawList){
					itemList.push(rawList[key]._source)
				}
				resp.json({ data : itemList })
			}
		});
	});

router.route('/getFavouriteItemList')
	.post(function(req,resp){
		var idList = JSON.parse(req.body.data);
		client.search({
			index : 'item',
			type : 'recipe',
			body:{
			    "size": 200,
			    "filter" : {
			    	"terms" : {
			    		"id" : idList
			    	}
			    },
			    "sort": [
			       	{
			          	"name": {
			             	"order": "asc"
			          	}
			       	}
			    ]
			}
		}, function(err, result){
			if(!err){
				var rawList = result.hits.hits;
				var itemList = []
				for(var key in rawList){
					itemList.push(rawList[key]._source)
				}
				resp.json({ data : itemList })
			}
		});
	});

router.route('/submitPreset')
	.post(function(req,resp){
		var data = req.body;
		var name = data.name;
		var passphrase = data.passphrase;
		client.search({
			index : 'record',
			type : 'preset',
			body : {
				"query": {
			        "term": {
			           "name": {
			              "value": name
			           }
			        }
			    }
			}
		}, function(err, result){
			if(err){
				resp.json({
					message : "There is something goes wrong",
					success : false
				})
			}else{
				if(result.hits.total > 0){
					resp.json({
						message : "The preset '" + name + "' is already existed. Please try to use a different name.",
						success : false
					})
				}
				else{
					client.index({
						index : 'record',
						type: 'preset',
						body : {
							name : data.name,
							passphrase : data.passphrase,
							updateOn : (new Date()).getTime(),
							item : "",
							material : ""
						}
					},function(err, result){
						resp.json({
							message : "The preset '" + name + "' is created successfully.",
							success : true
						})
					});
				}
			}
		})
	});
app.use(express.static(__dirname + '/public/build/Calculator', {maxAge : 31556926000} ));
app.listen(3000);
console.log("BnS Calculator is running on port 3000");