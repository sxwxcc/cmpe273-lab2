var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json());
app.use(connect.urlencoded());
app.use(connect.cookieParser());
app.use(connect.query());

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	console.log(cookies);
	   if ('session_id' in cookies)
      {
	var sid = cookies['session_id'];
        if ( login.isLoggedIn(sid) )
        {
	    response.setHeader('Set-Cookie', 'session_id=' + sid);
	    response.end(login.hello(sid));	
	}
        else
        {
			response.end("Invalid session_id! Please login again\n");
	}
      }
       else
          {
	         	response.end("Please login via HTTP POST\n");
	  }
};

function post(request, response) {
	var newSessionId = login.login('Nishant Jha', 'nishant.jha@sjsu.edu');
        var cookies = request.cookies;
        response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
	cookies['session_id'] = newSessionId;
        response.end(login.hello(newSessionId));
};

function del(request, response) {
	console.log("DELETE:: Logout from the server");
 	var cookies=request.cookies;
        var sid=cookies['session_id'];
        login.logout(sid);
  	response.end('Logged out from the server\n');
};

function put(request, response) {
	console.log("PUT:: Re-generate new session_id for the same user");
	var newSessionId = login.login('Nishant Jha', 'nishant.jha@sjsu.edu');
        var cookies = request.cookies;
        response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
        cookies['session_id'] = newSessionId;
       	response.end("Re-freshed session id\n");
};

app.listen(8000);

console.log("Node.JS server running at 8000...");
