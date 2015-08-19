var users = { admin: {id:1, username:"admin", password:"12345"}, jure: {id:2, username:"jure", password:"j12345"} };
exports.autenticar = function(login, password, callback) {
	if (users[login]) 
	{
		if (password === users[login].password) 
		{
			callback(null, users[login]);
		}
		else 
		{ 
			callback(new Error('Password erróneo')); 
		}
	} 
	else 
	{ 
		callback(new Error('Usuario inexistente')); 
	}
};
