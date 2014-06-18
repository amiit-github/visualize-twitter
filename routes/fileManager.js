var path = require('path'); 

exports.render_data = function(req, res) {
	var filename = req.params.fname;
	var file = './data/'+filename+'.json';
	


	path.exists(file, function(exists) { 
	  if (exists) { 
	    res.sendfile(file);
	  }
	  else res.send({status:false});
	}); 
}