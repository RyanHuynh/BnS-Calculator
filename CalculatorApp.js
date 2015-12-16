var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');

var client = elasticsearch.Client();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
app.use('/api', router);

var ERROR_MSG = "It appears that Jinsoyun has attacked the server and something went wrong !!!";

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

router.route('/getCustomItemList')
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
					message : ERROR_MSG,
					status : "error"
				})
			}
			else{
				if(result.hits.total > 0){
					resp.json({
						message : "The preset '" + name + "' already exists.\n Please try to use a different name.",
						status : "warning"
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
						if(err){
							resp.json({
								message : ERROR_MSG,
								status : "error"
							})
						}
						else {
							resp.json({
								sys_id : result._id,
								message : "The preset '" + name + "' is created successfully.",
								status : "success"
							})
						}
					});
				}
			}
		})
	});

router.route('/loadPreset')
	.post(function(req, resp){
		var data = req.body;
		var name = data.name;
		var passphrase = data.passphrase;
		client.search({
			index : 'record',
			type : 'preset',
			body : {
				"_source" : ["item", "material"],
				"query": {
			        "bool": {
			            "must": [
			               {
			                   "term": {
			                       "name": {
			                          "value": name
			                       }
			                    }
			               },
			               {
			                   "term": {
			                       "passphrase": {
			                          "value": passphrase
			                       }
			                    }
			               }
			            ]
			        }
			    }
			}
		}, function(err, result){
			if(err){
				resp.json({
					message : ERROR_MSG,
					status : "error"
				});
			}
			else {
				if(result.hits.total == 0){
					resp.json({
						message : "Cannot find any preset with that combination.",
						status : "warning"
					});
				}
				else
				{
					resp.json({
						sys_id : result.hits.hits[0]._id,
						record : result.hits.hits[0]._source,
						message : "The preset '" + name + "' is loaded successfully.",
						status : "success"
					});
				}
			}
		})
	});

router.route('/savePreset')
	.post(function(req,resp){
		var data = req.body;
		client.update({
			index : 'record',
			type : 'preset',
			id : data["sys_id"],
			body : {
				doc : {
					item : data["data"]["item"],
					material : data["data"]["material"],
					updateOn : (new Date()).getTime()
				}
			}
		}, function(err, result){
			if(err){
				resp.json({
					message : ERROR_MSG,
					status : "error"
				});
			}
			else{
				resp.json({
					message : "Preset is saved successfully.",
					status : "success"
				});
			}
		})
	})
app.use(express.static(__dirname + '/public/dist/Calculator', {maxAge : 2678400000} ));
app.listen(3000);
console.log("BnS Calculator is running on port 3000");