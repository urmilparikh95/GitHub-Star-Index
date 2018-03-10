var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('body-parser');

var token = "token " + process.env.GITTOKEN; // token stored as environment variable

var urlRoot = "https://api.github.com";

function getStarIndex(userName, callback) {
    buildStarArray(userName, function (result, message) {
        if (message.length > 0) {
            callback([], message);
            return;
        }
        result.sort(function (a, b) {
            return a - b;
        });
        result.reverse();
        var star_index = 0;
        for (var i = 0; i < result.length; i++) {
            if (result[i] < (i + 1)) {
                callback(i, message);
                break;
            }
        }
    });
}

function buildStarArray(userName, callback) {
    getRepos(userName, function (result, message) {
        if (message.length > 0) {
            callback([], message);
            return;
        }
        promises = [];
        for (var i = 0; i < result.length; i++) {
            promise = new Promise(function (resolve, reject) {
                getStars(userName, result[i], function (result2) {
                    resolve(result2);
                });
            });
            promises.push(promise);
        }
        Promise.all(promises).then(function (values) {
            callback(values, message);
        });
    });
}

function getStars(userName, repo, callback) {
    var options = {
        url: urlRoot + "/repos/" + userName + "/" + repo,
        method: 'GET',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        }
    };
    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
        } else if (response.statusCode == 200) {
            var obj = JSON.parse(body);
            callback(parseInt(obj.stargazers_count));
        }
    });
}

function getRepos(userName, callback) {
    var repos = [];
    var options = {
        url: urlRoot + '/users/' + userName + "/repos",
        method: 'GET',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        }
    };
    // Send a http request to url and specify a callback that will be called upon its return.
    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            message = "";
            if (response.statusCode == 404) {
                message = "No such User";
            }
            var obj = JSON.parse(body);
            if (response.statusCode == 200 && obj.length == 0) {
                message = "The User has no public repositories";
            }
            for (var i = 0; i < obj.length; i++) {
                repos.push(obj[i].name);
            }
            callback(repos, message);
        }
    });
}

module.exports = getStarIndex;