const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//主页
exports.index = asyncHandler(async (req, res, next) => {
  // 并行获取书的详细信息、书实例、作者和体裁的数量
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "本地图书馆主页",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

// 显示书本列表 
exports.book_list = function (req, res, next) {
	Book.find({}, "title author")
    .populate("author")
    .exec().then(list_books => {
		res.render("book_list", { title: "书本列表", book_list: list_books });
	}).catch (err => {
		return next(err);
	});
	
	/*
	//更改教程代码
	//Mongoose在2023/02废弃了下面的调用导致跑不起来hhh
	.exec(function (err, list_books) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("book_list", { title: "Book List", book_list: list_books });
    });
	*/
};

  // 显示特定书籍的详细信息页面。
exports.book_detail = asyncHandler(async (req, res, next) => {
	// 获取书籍的详细信息，以及特定书籍的实例
	const [book, bookInstances] = await Promise.all([
		Book.findById(req.params.id).populate("author").populate("genre").exec(),
		BookInstance.find({ book: req.params.id }).exec(),
	]);

	if (book === null) {
		// 没有结果。
		const err = new Error("书本未找到");
		err.status = 404;
		return next(err);
	}

	res.render("book_detail", {
		title: book.title,
		book: book,
		book_instances: bookInstances,
	});
});

// 显示书本创建表单GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
	//获取所有作者和流派，我们可以用它们添加到我们的书中。
	const [allAuthors, allGenres] = await Promise.all([
		Author.find().sort({ family_name: 1 }).exec(),
		Genre.find().sort({ name: 1 }).exec(),
	]);

	res.render("book_form", {
		title: "创建书本",
		authors: allAuthors,
		genres: allGenres,
	});
});

// 处理书本创建 POST.
exports.book_create_post = [
	// 将流派转换为数组。
	(req, res, next) => {
		if (!Array.isArray(req.body.genre)) {
			req.body.genre =
			typeof req.body.genre === "undefined" ? [] : [req.body.genre];
		}
		next();
	},

	// 验证和清理字段。
	body("title", "标题不能为空")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("author", "作者不能为空")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("summary", "摘要不能为空。")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("isbn", "国际标准书号(ISBN)不能为空").trim().isLength({ min: 1 }).escape(),
	body("genre.*").escape(),
	// 验证和清理后的处理请求。
	
	asyncHandler(async (req, res, next) => {
		//从请求中提取验证错误。
		const errors = validationResult(req);

		// 使用转义和修整的数据创建 Book 对象。
		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: req.body.genre,
		});

		if (!errors.isEmpty()) {
		  // 有错误。使用经过清理的值/错误消息再次呈现表单。

		  // 获取所有作者和流派的形式。
		  const [allAuthors, allGenres] = await Promise.all([
			Author.find().sort({ family_name: 1 }).exec(),
			Genre.find().sort({ name: 1 }).exec(),
		  ]);

		  // 将我们选择的流派标记为选中。
		  for (const genre of allGenres) {
			if (book.genre.includes(genre._id)) {
			  genre.checked = "true";
			}
		  }
		  res.render("book_form", {
			title: "创建书本",
			authors: allAuthors,
			genres: allGenres,
			book: book,
			errors: errors.array(),
		  });
		} else {
		  // 表单中的数据有效。保存书。
		  await book.save();
		  res.redirect(book.url);
		}
	}),
];


// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

// Handle book update on POST.
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
