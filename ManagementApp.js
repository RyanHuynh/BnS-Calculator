var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var assign = require('object-assign');
var multer = require('multer');

var client = elasticsearch.Client();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
app.use('', router);

var integerType = ['id','docCreatedOn', 'duration', 'craftFee', 'quantity'];
function parseData(data){
	var res = data;
	for(var i = 0; i < integerType.length; i++){
		var key = integerType[i];
		if(res[key])
			res[key] = parseInt(res[key]);
	}
	if(res.materials){
		for(var t = 0; t < res.materials.length; t++){
			var mat = res.materials[t];
			mat.id = parseInt(mat.id);
			mat.quantity = parseInt(mat.quantity);
		}
	}
	return res;
}


//Intialize server
var _lastRecipeId = 0;
var _lastMaterialId = 0;
(function initializeServer(){
	client.search({
		index : 'item',
		body:{
			"size": 0,
			"aggs" : {
			    "count" : {
			        "terms" : {
			            "field" : "_type",
			            "size" : 0
			        },
		            "aggs" : {
		                "lastId" : {
		                    "max" : {
		                        "field" : "id"
		                    }
		                }
		            }
			    }
			}
		}
	},  function(err, result){
			if(!err){
				var buckets = result.aggregations.count.buckets;
				for(var i = 0; i < buckets.length; i++){
					var entry = buckets[i];
					if(entry.key == "recipe")
						_lastRecipeId = entry.lastId.value;
					else if(entry.key == "material")
						_lastMaterialId = entry.lastId.value;
				}
			}
		}
	)	
})();

router.route('/getRecipeList')
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
			    "sort" : [
				    {
				    	"id" : { "order" : "asc" }
				    }
			    ]
			}
		}, function(err, result){
			if(!err){
				var rawList = result.hits.hits;
				var itemList = []
				for(var key in rawList){
					var data = assign({}, rawList[key]._source, {
						docId : rawList[key]._id
					})
					itemList.push(data)
				}
				resp.json({ data : itemList })
			}
		});
	});

router.route('/getMaterialList')
	.get(function(req,resp){
		client.search({
			index : 'item',
			type : 'material',
			body:{
			    "size": 200,
			    "sort" : [
				    {
				    	"id" : { "order" : "asc" }
				    }
			    ]
			}
		},  function(err, result){
				if(!err){
					var rawList = result.hits.hits;
					var itemList = [];
					for(var i = 0; i < rawList.length; i++){
						var rawData = rawList[i];
						var data = assign({}, rawData._source, {
							docId : rawData._id
						});
						itemList.push(data);
					}
					resp.json({ data : itemList })
				}
			}
		)	
	});



router.route('/getMaterial')
	.post(function(req,resp){
		var keyword = '*' + req.body.keyword.toLowerCase() + '*';
		client.search({
			index : 'item',
			type : 'material',
			body: {
				"size" : 5,
				"query" : {
					"wildcard" : {
						"name" : keyword
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
			var returnResult = [];
			var arrResult = result.hits.hits;
			for(var i = 0; i < arrResult.length; i++){
				var data = arrResult[i]._source;
				returnResult.push(
					{ 
						value: data.id,
						label : data.name,
						info : data
				 	}
			 	);
			}
			if(!err)
				resp.json({ data : returnResult });
		});
	});


router.route('/updateRecipe')
	.post(function(req,resp){
		var reqData = req.body;
		var docId = Object.keys(reqData)[0];
		var info = reqData[docId];
		var parsedData = parseData(info);
		client.update({
			index : 'item',
			type : 'recipe',
			id : docId,
			body:{ doc : info }
		}, function(err, result){
			if(!err){
				resp.json({ msg : "success" });
			}
		});
	});

router.route('/submitRecipe')
	.post(function(req,resp){
		var info = req.body;
		_lastRecipeId++;
		info.id = _lastRecipeId;
		var parsedData = parseData(info);
		client.index({
			index : 'item',
			type: 'recipe',
			body: info,
		}, function(err, result){
			if(!err){
				resp.json({ msg : "success" });
			}
		});
	});

router.route('/deleteRecipe')
	.post(function(req,resp){
		var id = req.body.id;
		client.delete({
			index : 'item',
			type: 'recipe',
			id : id ,
		}, function(err, result){
			if(!err){
				resp.json({ msg : "success" });
			}
		});
	});


router.route('/updateMaterial')
	.post(function(req,resp){
		var reqData = req.body;
		var docId = Object.keys(reqData)[0];
		var info = reqData[docId];
		var parsedData = parseData(info);
		client.update({
			index : 'item',
			type : 'material',
			id : docId,
			body:{ doc : info }
		}, function(err, result){
			if(!err){
				resp.json({ msg : "success" });
			}
		});
	});

router.route('/submitMaterial')
	.post(function(req,resp){
		var info = req.body;
		_lastMaterialId++;
		info.id = _lastMaterialId;
		var parsedData = parseData(info);
		client.index({
			index : 'item',
			type: 'material',
			body: info,
		}, function(err, result){
			if(!err){
				resp.json({ msg : "success" });
			}
		});
	});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/build/Calculator/img/items')
  },
  filename: function (req, file, cb) {
  	
    cb(null, Date.now() + '.jpg')
  }
})
var upload = multer({ storage: storage });
app.post('/uploadIcon', upload.single('image'), function (req, res, next) {
	
	var info = {
		name : req.body.name,
		type : req.body.type,
		icon_url : req.file.filename
	};
	
	client.index({
		index : 'item',
		type: 'icon',
		body: info,
	}, function(err, result){
		if(!err){
			res.json({ msg : "success" });
		}
		else
			res.json({ msg : err });
	});
})

router.route('/getIconList')
	.post(function(req,resp){
		var filter = {};
		var type = req.body.data;
		if(type && type != "all"){
			var termFilter = {
				term : { type : type }
			}
			filter = termFilter;
		}
		client.search({
			index : 'item',
			type: 'icon',
			body: {
				"size" : "200",
				"filter" : filter,				
				"sort" : [
				    {
				    	"name" : { "order" : "asc" }
				    }
			    ]
			},
		}, function(err, result){
			if(!err){
				var rawList = result.hits.hits;
				var itemList = [];
				for(var key in rawList){
					var data = rawList[key]._source;
					itemList.push(data)
				}
				resp.json({ data : itemList })
			}
		});
	});

router.route('/backupData')
	.get(function(req,resp){
		var snapshotName = "snapshot_" +  new Date().getTime();
		client.snapshot.create({
			repository : 'bns_data_backup',
			snapshot : snapshotName
		})
		resp.json({ success : true });
	});
app.use(express.static(__dirname + '/public/build/' , {maxAge : 31556926000}));
app.listen(3002);
console.log("App is listening on port 3002");