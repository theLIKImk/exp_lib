const Genre = require("../models/genre");
var Book = require("../models/book");
var async = require("async");
var mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// 显示所有类别
exports.genre_list = asyncHandler(async (req, res, next) => {
	Genre.find()
    .sort("name")
    .exec().then(list_genre => {
		//Successful, so render
		res.render("genre_list", {
			title: "种类列表",
			genre_list: list_genre,
		});
	}).catch(err => {
		return next(err);
	});
});

// 显示书本详细信息
exports.genre_detail = function (req, res, next){
	async.parallel(
		{
			genre: function (callback) {
				Genre.findById(req.params.id).exec(callback);
			},

			genre_books: function (callback) {
				Book.find({ genre: req.params.id }).exec(callback);
			},
		},
		
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.genre == null) {
				// No results.
				var err = new Error("Genre not found");
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render("genre_detail", {
				title: "Genre Detail",
				genre: results.genre,
				genre_books: results.genre_books,
			});
		},
	);
};

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

// Handle Genre create on POST.
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
