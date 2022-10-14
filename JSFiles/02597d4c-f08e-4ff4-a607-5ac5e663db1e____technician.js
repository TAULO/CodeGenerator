var express = require('express');
var router = express.Router();
var db = require('../../config/db');
const bcrypt = require("bcrypt");
const config = require('config');
const url = config.get('appUrl');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var request = require("request");
const {
	check,
	validationResult
} = require('express-validator');
var md5 = require('md5');

function chksession(req, res) {
	if (!req.session.uid || req.session.role != "1") {
		// res.redirect(url + 'login');
		// req.end();
		res.redirect('/login');
		req.end();
	}
}

function countHours(inTime, outTime) {
	var startTime = moment(inTime, "MM/DD/YYYY HH:mm:ss a");
	var endTime = moment(outTime, "MM/DD/YYYY HH:mm:ss a");

	/* var duration = moment.duration(endTime.diff(startTime));
	var hours = parseInt(duration.asHours());
	var minutes = parseInt(duration.asMinutes()) % 60;
	var days = parseInt(hours / 24);
	hour = hours - (days * 24); */

	var difference = endTime.diff(startTime)
	var duration = moment.duration(difference).subtract(1800, 'seconds');
	var hours = parseInt(duration.asHours());
	var minutes = parseInt(duration.asMinutes()) % 60;
	return (hours + ' Hrs and ' + minutes + ' Min');
	/* var hours = parseInt(duration.asHours());
	var minutes = parseInt(duration.asMinutes()) % 60;
	var days = parseInt(hours / 24);
	hour = hours - (days * 24);
	return (days + ' days and ' + hour + ' hour and ' + minutes + ' minutes.'); */
}

/* function checkCountHours(inTime, outTime) {
	var startTime = moment(inTime, "HH:mm:ss a");
	var endTime = moment(outTime, "HH:mm:ss a");

	var duration = moment.duration(endTime.diff(startTime));
	var hours = parseInt(duration.asHours());
	var minutes = parseInt(duration.asMinutes()) % 60;
	if (hours <= 0 && minutes <= 0) {
		return 0;
	}

	return 1;
} */

function checkInHours(inTime, outTime, inputTime) {
	var format = 'hh:mm:ss'

	var time = moment(inputTime, format),
		beforeTime = moment(inTime, format),
		afterTime = moment(outTime, format);

	if (time.isBetween(beforeTime, afterTime)) {
		return 1;

	} else {

		return 0;
	}
}

/* GET users listing. */
router.get('/', function (req, res, next) {

});

router.get('/dashboard', function (req, res, next) {
	chksession(req, res);
	var data = {
		name: req.session.firstName,
		uid: req.session.uid,
		url: url,
	};
	res.render('user/technician/dashboard', {
		title: 'Technician Dashboard',
		layout: 'layout/user-layout.jade',
		data: data,
		applications: req.session
	});
});

router.get('/user-dashboard', function (req, res, next) {
	chksession(req, res);
	res.render('user/technician/user-dashboard', {
		title: 'User Dashboard',
		layout: 'layout/user-layout.jade'
	});
});

router.get('/view-timesheet', function (req, res, next) {
	chksession(req, res);
	res.render('user/technician/view-timesheet', {
		title: 'View Timesheet',
		layout: 'layout/user-layout.jade',
		applications: req.session
	});
});

router.get('/view-account', function (req, res, next) {
	chksession(req, res);
	res.render('user/technician/view-account', {
		title: 'View Account',
		layout: 'layout/user-layout.jade',
		applications: req.session
	});
});

/* GET question paper based on subject */
router.get('/giveExam', function (req, res) {
	chksession(req, res);
	var q_ans = [];
	var question_id = [];
	let easyData = [];
	let mediumData = [];
	let highData = [];

	db.query('SELECT jobtype, allowExam FROM users WHERE id=?', req.session.uid, function (err, randomPaper) {
		if (randomPaper[0].allowExam == 1) {

			db.query('SELECT * FROM exam_rules', function (err, rules) {
				easyData = rules[0].easy;
				mediumData = rules[0].medium;
				highData = rules[0].high;
				db.query('SELECT * FROM questions WHERE active=1 AND sub_id=? AND exam_level=1 AND active=1 ORDER BY RAND() LIMIT ?', [randomPaper[0].jobtype, easyData], function (err, easyData) {
					easyData.forEach(function (item) {
						q_ans.push(item)
					});
				});
				db.query('SELECT * FROM questions WHERE active=1 AND sub_id=? AND exam_level=2 ORDER BY RAND() LIMIT ?', [randomPaper[0].jobtype, mediumData], function (err, mediumData) {
					mediumData.forEach(function (item) {
						q_ans.push(item)
					});
				});
				db.query('SELECT * FROM questions WHERE active=1 AND sub_id=? AND exam_level=3 ORDER BY RAND() LIMIT ?', [randomPaper[0].jobtype, highData], function (err, highData) {
					highData.forEach(function (item) {
						q_ans.push(item)
					});
					q_ans.forEach(function (item) {
						question_id.push(item.q_id)
					});
					db.query('SELECT neg_marking_value FROM exam_rules', function (err, neg_marks) {
						var quesId = question_id.toString();
						var data = {
							userId: req.session.uid,
							start_time: new Date(),
							exam_date: new Date(),
							question: quesId,
							neg_mark: neg_marks[0].neg_marking_value
						};

						var q = db.query('INSERT INTO results SET ?', data, function (err, rows) {
							var testId = q._results[0]['insertId'];
							res.render('user/technician/giveExam', {
								title: 'View Question paper',
								layout: 'layout/user-layout.jade',
								questionAnswers: q_ans,
								testId: testId,
								randomQuesPaper: randomPaper,
								applications: req.session
							});
						});
					});
				});
			});
		} else {
			req.flash('msg_error', "You are not eligible for today exam.");
			res.redirect('/user/technician/dashboard');
		}

	})
});

/* POST to save questions & answers */
router.post('/save-QuestionAnser', async function (req, res) {
	chksession(req, res);

	var easy_marks = 0;
	var medium_marks = 0;
	var high_marks = 0;
	var total_marks = 0;
	var wrong_count = 0;
	var not_answered = 0;
	var userId = req.session.uid;
	var end_time = new Date();
	var date1 = new Date();
	var date = date1.toISOString().slice(0, 10)

	var ansData = [];

	var ans = req.body.userAnswers;
	ansData = ans.split(',');

	db.query('SELECT question FROM results WHERE id = ? AND userId = ? AND exam_date = ?', [req.body.testId, userId, date], function (err, data) {
		db.query('SELECT allowExam FROM users WHERE id = ?', req.session.uid, function (err, allowExam) {

			var quesData = data[0].question;
			var ques = [];
			if (allowExam[0].allowExam == 0) {
				req.flash('msg_error', "You not eligible for exam");
				res.redirect('/user/technician/dashboard');
			} else {
				ques = quesData.split(',');

				for (let key = 0; key < Object.keys(ques).length; key++) {

					if (ansData[key] === '0') {
						not_answered++;
					}

					db.query('SELECT exam_level FROM questions where q_id = ?', ques[key], async function (err, exam_level) {

						if (err)
							console.error(err.message)
						var levelCount = exam_level[0].exam_level;

						exam_level = levelCount;

						if (exam_level == 1) {
							db.query('SELECT correct_ans FROM questions where q_id = ?', ques[key], function (err, correct_ans) {
								if (err)
									console.error(err.message)

								if (correct_ans[0].correct_ans == ansData[key]) {
									var a = 1;
								} else {
									var a = 0;
								}
								if (a == 0) {
									wrong_count++;
								} else {
									easy_marks++;
									total_marks++;
								}
								var wrngCount = ((given_ans) - (total_marks));
								var result = {
									userId: req.session.uid,
									end_time: new Date(),
									std_answers: ans,
									level_1_score: easy_marks,
									total_score: total_marks,
									wrong_answer_count: wrngCount,
									correct_answer_count: total_marks,
								};

								db.query('UPDATE results SET ? WHERE id = ? AND exam_date=?', [result, req.body.testId, date], function (err, rows, fields) {
									if (err)
										console.error(err.message)

								});
							})
						}
						if (exam_level == 2) {
							db.query('SELECT correct_ans FROM questions where q_id = ?', ques[key], function (err, correct_ans) {
								if (err)
									console.error(err.message)

								if (correct_ans[0].correct_ans == ansData[key]) {
									var a = 1;
								} else {
									var a = 0;
								}
								if (a == 0) {
									wrong_count++;
								} else {
									medium_marks++;
									total_marks++;
								}
								var wrngCount = ((given_ans) - (total_marks));
								var result = {
									userId: req.session.uid,
									end_time: new Date(),
									std_answers: ans,
									level_2_score: medium_marks,
									total_score: total_marks,
									wrong_answer_count: wrngCount,
									correct_answer_count: total_marks,
								};

								db.query('UPDATE results SET ? WHERE id = ? AND exam_date=?', [result, req.body.testId, date], function (err, rows, fields) {
									if (err)
										console.error(err.message)
								});
							})
						}
						if (exam_level == 3) {
							db.query('SELECT correct_ans FROM questions where q_id = ?', ques[key], function (err, correct_ans) {
								if (err)
									console.error(err.message)

								if (correct_ans[0].correct_ans == ansData[key]) {
									var a = 1;
								} else {
									var a = 0;
								}
								if (a == 0) {
									wrong_count++;
								} else {
									high_marks++;
									total_marks++;
								}
								var wrngCount = ((given_ans) - (total_marks));
								var result = {
									userId: req.session.uid,
									end_time: new Date(),
									std_answers: ans,
									level_3_score: high_marks,
									total_score: total_marks,
									wrong_answer_count: wrngCount,
									correct_answer_count: total_marks,
								};

								db.query('UPDATE results SET ? WHERE id = ? AND exam_date=?', [result, req.body.testId, date], function (err, rows, fields) {
									if (err)
										console.error(err.message)
								});

							})
						}
					});
				}

				var given_ans = ((ansData.length) - (not_answered));
				db.query('UPDATE results SET no_of_given_answer=? WHERE id = ? AND exam_date=?', [given_ans, req.body.testId, date], function (err) {
					db.query('UPDATE users SET allowExam=0 WHERE id=?', req.session.uid, function (err) {
						if (err)
							console.error(err.message)

					});
				});

			}
		});
	});
	req.flash('msg_info', "You have submit successfully");
	res.redirect('/user/technician/dashboard');
});

/* GET technician edit-profile */
router.get('/edit-profile', function (req, res, next) {
	chksession(req, res);

	// db.query('SELECT GROUP_CONCAT(skill_id) as skills_id, u.profileImg, u.firstName, u.lastName,u.preferredName, u.dob, u.phone_number, u.email, u.experience, u.skills, u.jobType,  u.newAddress, us.user_id, us.skill_id, (SELECT designation_name FROM designation WHERE id=(SELECT designation_id from user_designation WHERE user_id = ?)) as designation FROM users as u JOIN user_skills AS us ON (u.id = us.user_id) WHERE u.id = ?', [req.session.uid, req.session.uid], function (err, rows) {
	db.query('SELECT profileImg, firstName, lastName, preferredName, dob, phone_number, email, experience, jobType, newAddress, (SELECT designation_name FROM designation WHERE id=(SELECT designation_id from user_designation WHERE user_id = ?)) as designation FROM users WHERE id = ?', [req.session.uid, req.session.uid], function (err, rows) {
		db.query('SELECT id, type_name FROM jobtype WHERE active=1', function (err, row) {

			if (err)
				console.error(err.message)
			res.render('user/technician/edit-profile', {
				title: 'Edit Profile',
				layout: 'layout/user-layout.jade',
				// skill: skill,
				jobtype: row,
				url: url,
				apiKey: config.get('apiKey'),
				value: rows[0],
				applications: req.session
			});
		});
	});
});

/* POST planner edit-profile */
router.post('/edit-profile', [
		check('firstName').not().isEmpty().withMessage('Name must have more than 2 characters'),
		check('lastName').not().isEmpty().withMessage('Name must have more than 2 characters'),
		check('dob', 'Date of birth is required').not().isEmpty(),
		check('email', 'Your email is not valid').not().isEmpty(),
	],
	function (req, res) {
		chksession(req, res);
		const errors = validationResult(req);
		var userId = req.session.uid;
		if (!errors.isEmpty()) {
			const validationErrors = errors.array();
			let errorMessages = [];
			validationErrors.forEach(function (row) {
				errorMessages.push(row.msg);
			})
			req.flash('msg_error', errorMessages);
			res.redirect('/user/technician/edit-profile');
		} else {
			/* var sk = req.body.skills;
			if (!sk)
				sk = 0;
			if (typeof sk != "object")
				sk = [sk]; */
			var experience;
			if (req.body.year == 'YEAR' && req.body.month == 'Month') {
				experience = 0.0;
			} else {
				experience = req.body.year + '.' + req.body.month;
			}
			if (!req.files) {
				var data = {
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					preferredName: req.body.preferredName,
					dob: moment(req.body.dob).format('YYYY-MM-DD'),
					phone_number: req.body.phone_number,
					experience: experience,
					newAddress: req.body.newAddress,
					latitude: req.body.latitude,
					longitude: req.body.longitude,
					jobtype: req.body.jobType,
					completeProfile: 1
				};
			} else {
				if (imageExtension[1] == "jpg" || imageExtension[1] == "JPG" || imageExtension[1] == "jpeg" || imageExtension[1] == "JPEG" || imageExtension[1] == "png" || imageExtension[1] == "PNG" || imageExtension[1] == "pdf" || imageExtension[1] == "PDF") {
					var imageFile = req.files.profileImg;
					let imageExtension = imageFile.name.split('.');
					let ext = imageExtension[(imageExtension).length - 1];
					var image = userId + '_' + new Date().toISOString();
					new_image = md5(image);
					new_image = new_image + '.' + ext;
					let fileName = new_image;
					var uploadPath = 'uploads/profile_img';
					var data = {
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						preferredName: req.body.preferredName,
						dob: moment(req.body.dob).format('YYYY-MM-DD'),
						phone_number: req.body.phone_number,
						experience: experience,
						newAddress: req.body.newAddress,
						latitude: req.body.latitude,
						longitude: req.body.longitude,
						jobtype: req.body.jobType,
						profileImg: fileName,
						completeProfile: 1
					};
					req.session.profileImg = fileName;
					imageFile.mv(`public/${uploadPath}/${fileName}`, function (err) {});
				} else {
					req.flash('msg_error', "This format is not allowed , please upload file with '.png','.gif','.jpg',");
					res.redirect('/user/technician/edit-profile');
					req.end();
				}
			}
			db.query('UPDATE users SET ? WHERE id = ? ', [data, userId], function (err, rows) {
				/* db.query('delete from user_skills where user_id=?', userId);
				sk.forEach(function (a) {
					db.query('INSERT INTO user_skills (user_id, skill_id)VALUES (?, ?)', [userId, a], function (err) {
						db.query('DELETE FROM user_skills WHERE skill_id = 0', function (err) {});
						if (err)
							console.error(err.message)
					});
				}); */
				req.flash('msg_info', "Profile Updated Successfully");
				res.redirect('/user/technician/edit-profile');
			});
		}
	});

/* show preferred designation */
router.get('/preferred-designation', function (req, res) {
	chksession(req, res)
	db.query('select jobType, search from users where id = ?', req.session.uid, function (err, user) {
		db.query('select id,designation_name from designation where job_type = ?', user[0].jobType, function (err, showdesignation) {
			db.query('select GROUP_CONCAT(designation_prefer_id) as designation_prefer_id,user_id from user_preferred_designation where user_id = ?', req.session.uid, function (err, data) {
				if (data[0].designation_prefer_id != null) {
					var designation_prefer_id = data[0].designation_prefer_id;
					var select_pre = designation_prefer_id.split(",");
					if (err)
						console.error(err.message)
					res.render('user/technician/dashboard', {
						title: 'Notification',
						layout: 'layout/user-layout.jade',
						selecteddata: showdesignation,
						showdesignation: select_pre,
						userSearch: user[0].search,
						applications: req.session
					});
				} else {
					res.render('user/technician/dashboard', {
						title: 'Notification',
						layout: 'layout/user-layout.jade',
						selecteddata: showdesignation,
						showdesignation: '',
						userSearch: user[0].search,
						applications: req.session
					});
				}

				//}
			});
		});
	});
});

/* GET Technician block-Unblock Status */
router.get('/block-UnblockTech', function (req, res, next) {
	chksession(req, res);
	db.query('SELECT id, search from users where id=?', req.session.uid, function (err, rows) {
		if (rows[0].search == 1) {
			db.query('UPDATE users SET search=0 WHERE id=?', req.session.uid, function (err) {
				if (err)
					console.error(err.message)
				req.flash('msg_error', "Status Changed! You will not be shown in any job searches.");
				// res.redirect('/user/technician/dashboard');
			});
		} else {
			db.query('UPDATE users SET search=1 WHERE id=?', req.session.uid, function (err) {
				if (err)
					console.error(err.message)
				req.flash('msg_info', " Status Changed! You will be shown in job searches.");
				// res.redirect('/user/technician/dashboard');
			});
		}
		res.render('user/technician/dashboard', {
			title: 'Notification',
			layout: 'layout/user-layout.jade',
			userSearch: rows[0].search,
			applications: req.session
		});

	});
});

/* post function add-Predesignation */
router.post('/add-Predesignation', function (req, res, next) {
	chksession(req, res)
	var data = {
		designation_prefer_id: req.body.designation_id,
		user_id: req.session.uid,
	};
	var designation_id = req.body.designation_id;
	if (typeof designation_id != "object")
		designation_id = [designation_id];

	db.query('select user_id from user_preferred_designation where user_id="' + data.user_id + '"', function (err, rows) {
		if (rows.length != 0) {
			db.query('DELETE FROM user_preferred_designation where user_id= ?', req.session.uid)
			designation_id.forEach(function (d) {
				db.query('INSERT INTO user_preferred_designation (user_id,designation_prefer_id)VALUES (?, ?)', [req.session.uid, d],
					function (err) {
						if (err)
							console.error(err.message)
					});
			});
			req.flash('msg_info', "Preferred DestibationSuccessfully");
			res.redirect('/user/technician/dashboard');
		} else {
			designation_id.forEach(function (d) {
				db.query('INSERT INTO user_preferred_designation (user_id,designation_prefer_id)VALUES (?, ?)', [req.session.uid, d],
					function (err) {
						if (err)
							console.error(err.message)
					});
			});
			req.flash('msg_info', "Preferred DestibationSuccessfully");
			res.redirect('/user/technician/dashboard');
		}
	});
});

/* GET to view report on particular user job */
router.get('/report/:id', function (req, res) {
	chksession(req, res);
	var userId = req.session.uid;
	db.query('SELECT id, inTime, jobId, date FROM taskreporting where userId="' + userId + '" AND outTime IS NULL AND jobId=?', req.params.id, function (err, rows) {
		if (rows.length == 0) {
			if (err)
				console.error(err.message)
			req.flash('msg_error', "You Need To Clock-In First.");
			res.redirect('/user/technician/userJobs');
		} else {
			res.render('user/technician/report', {
				reports: rows[0],
				applications: req.session
			});
		}
	});
});

/* POST particular user job report */
router.post('/report', function (req, res) {

	chksession(req, res);
	var userId = req.session.uid;
	var jobId = req.body.jobId;
	// var date = req.body.date;
	var countHourTime = countHours(req.body.inTime, req.body.outTime);
	/* var checkCountHourTime = checkCountHours(req.body.inTime, req.body.outTime);
	if (checkCountHourTime == 0) {
		req.flash('msg_error', "Please Enter Valid Time.");
		res.redirect('/user/technician/report/' + jobId);
		req.end();
	} */

	if (!req.files) {
		var data = {
			userId: userId,
			date: moment(new Date()).format('YYYY-MM-DD'),
			outTime: req.body.outTime,
			description: req.body.description,
			hours_count: countHourTime,
			status: 0,
			active: 1
		};
	} else {
		if (imageExtension[1] == "jpg" || imageExtension[1] == "JPG" || imageExtension[1] == "jpeg" || imageExtension[1] == "JPEG" || imageExtension[1] == "png" || imageExtension[1] == "PNG" || imageExtension[1] == "pdf" || imageExtension[1] == "PDF") {
			let imageFile = req.files.attachment;
			let imageExtension = imageFile.name.split('.');
			let ext = imageExtension[(imageExtension).length - 1];
			var image = userId + '_' + new Date().toISOString();
			new_image = md5(image);
			new_image = new_image + '.' + ext;
			let fileName = new_image;
			let uploadPath = 'uploads';
			var data = {
				userId: userId,
				date: moment(new Date()).format('YYYY-MM-DD'),
				outTime: req.body.outTime,
				attachment: fileName,
				description: req.body.description,
				hours_count: countHourTime,
				status: 0,
				active: 1
			};
			imageFile.mv(`public/${uploadPath}/${fileName}`, function (err) {});
		} else {
			req.flash('msg_error', "This format is not allowed , please upload file with '.png','.gif','.jpg','.pdf'");
			res.redirect('/user/technician/report/' + jobId);
			req.end();
		}
	}
	db.query('SELECT id FROM taskreporting where userId="' + userId + '" AND outTime IS NULL AND jobId = ?', jobId, function (err, rows) {
		var id = rows[0].id;
		if (rows.length == 0) {
			req.flash('msg_error', "Some thing went wrong.");
			res.redirect('/user/technician/report-view');
		} else {
			db.query('UPDATE taskreporting SET ? where id = ?', [data, id], function (err) {
				if (err)
					console.error(err.message)
				req.flash('msg_info', "Time Sheet Submitted Successfully.");
				res.redirect('/user/technician/report-view');
			});
		}
	});
});

router.post('/reportInTime', function (req, res) {
	chksession(req, res);
	var userId = req.session.uid;
	var jobId = req.body.jobId;
	var inputTime = req.body.inTime;

	// db.query('S')
	db.query('SELECT job_id, sup_id FROM users_job where user_id=? AND job_id=?', [req.session.uid, jobId], function (err, row) {
		if (row[0].job_id) {
			var data = {
				userId: userId,
				jobId: jobId,
				sup_id: row[0].sup_id,
				inTime: req.body.inTime,
				date: moment(new Date()).format('YYYY-MM-DD'),
				active: 1,
				status: 7
			};
			var h = 0;
			var date = data.date;
			db.query('SELECT id, userId, inTime, outTime, jobId, date FROM taskreporting where active=1 AND userId=? AND jobId=? AND date=? AND outTime IS NOT NULL', [userId, jobId, date], function (err, find) {
				find.forEach(function (a) {
					var inTime = a.inTime;
					var outTime = a.outTime;
					if (checkInHours(inTime, outTime, inputTime) == 1) {
						h++;
					}
				})
				if (h != 0) {
					req.flash('msg_error', "You Already have An Time Sheet For This Time Slot.");
					res.redirect('/user/technician/userJobs');
					// res.end();
				} else {
					db.query('SELECT userId FROM taskreporting where userId="' + userId + '" AND active=1 AND outTime IS NULL AND jobId=?', jobId, function (err, rows) {
						if (rows[0]) {
							req.flash('msg_error', "You Already have An Pending Time Sheet");
							res.redirect('/user/technician/report/' + jobId);
							res.end();
						} else {
							db.query('INSERT INTO taskreporting SET ?', data, function (err, rows, fields) {

								if (err)
									console.error(err.message)
								req.flash('msg_info', "Time Sheet Initiated Successfully");
								// res.redirect('/user/technician/report/' + jobId);
								res.redirect('/user/technician/userJobs');

							});
						}
					});
				}

			});

		} else {
			req.flash('msg_error', "You don't have any project to submit time sheet!");
			res.redirect('/user/technician/dashboard');
		}
	});
});

router.get('/report-view', function (req, res, next) {
	chksession(req, res);

	db.query('SELECT t.*, u.firstName, s.statusName, j.jobName FROM taskreporting AS t join users AS u  join statusname AS s ON(s.id=t.status) JOIN jobs AS j ON(t.jobId=j.id) where t.userId=u.id AND active=1 AND t.userId=? ORDER BY t.date DESC', req.session.uid, function (err, rows) {
		if (err)
			console.error(err.message)
		res.render('user/technician/report-view', {
			title: 'Technician Report View',
			layout: 'layout/user-layout.jade',
			reports: rows,
			applications: req.session
		});
	});
});

router.get('/deleteReport/:id', function (req, res, next) {
	chksession(req, res);
	db.query('UPDATE taskreporting SET active=0 WHERE id=?', req.params.id, function (err, rows) {
		if (err)
			console.error(err.message)
		req.flash('msg_error', "Time Sheet Deleted Successfully");
		res.redirect('/user/technician/report-view');
	});
});

router.get('/editReport/:id', function (req, res, next) {
	chksession(req, res);
	var a = db.query('SELECT * FROM taskreporting WHERE id = ?', req.params.id, function (err, rows) {
		console.log(a.sql,'qqqqqqqq',rows,'tt')
		if (err)
			console.error(err.message)
		res.render('user/technician/editReport', {
			title: 'Edit Technician Report',
			layout: 'layout/user-layout.jade',
			reports: rows,
			applications: req.session
		});
	});
});

router.post('/editReport/:id',
	function (req, res) {
		chksession(req, res);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const validationErrors = errors.array();
			let errorMessages = [];
			validationErrors.forEach(function (row) {
				errorMessages.push(row.msg);
			})
			req.flash('msg_error', errorMessages);
			res.redirect('/user/technician/editReport/' + req.params.id);
		} else {
			var userId = req.session.uid;
			var countHourTime = countHours(req.body.inTime, req.body.outTime);
			/* var checkCountHourTime = checkCountHours(req.body.inTime, req.body.outTime);
			if (checkCountHourTime == 0) {
				req.flash('msg_error', "Please Enter Valid Time.");
				res.redirect('/user/technician/editReport/' + req.params.id);
				req.end();
			} */
			if (!req.files) {
				var data = {
					date: moment(new Date()).format('YYYY-MM-DD'),
					outTime: req.body.outTime,
					inTime: req.body.inTime,
					description: req.body.description,
					hours_count: countHourTime,
					status: 0,
					active: 1
				};
			} else {
				if (imageExtension[1] == "jpg" || imageExtension[1] == "JPG" || imageExtension[1] == "jpeg" || imageExtension[1] == "JPEG" || imageExtension[1] == "png" || imageExtension[1] == "PNG" || imageExtension[1] == "pdf" || imageExtension[1] == "PDF") {
					let imageFile = req.files.attachment;
					let imageExtension = imageFile.name.split('.');
					let ext = imageExtension[(imageExtension).length - 1];
					var image = userId + '_' + new Date().toISOString();
					new_image = md5(image);
					new_image = new_image + '.' + ext;
					let fileName = new_image;
					let uploadPath = 'uploads';
					// var countHourTime = countHours(req.body.inTime, req.body.outTime);
					var data = {
						date: moment(new Date()).format('YYYY-MM-DD'),
						outTime: req.body.outTime,
						inTime: req.body.inTime,
						attachment: fileName,
						description: req.body.description,
						hours_count: countHourTime,
						status: 0,
						active: 1
					};
					imageFile.mv(`public/${uploadPath}/${fileName}`, function (err) {});
				} else {
					req.flash('msg_error', "This format is not allowed , please upload file with '.png','.gif','.jpg','.pdf'");
					res.redirect('/user/technician/editReport/' + req.params.id);
					req.end();
				}
			}
			db.query('SELECT userId, status FROM taskreporting WHERE id = ?', req.params.id, function (err, rows) {
				if (rows[0].userId == userId && rows[0].status == 0) {
					db.query('SELECT id FROM taskreporting where userId="' + userId + '"', function (err, row) {
						if (row.length != 0) {
							db.query('UPDATE taskreporting SET ? WHERE id = ? ', [data, req.params.id], function (err) {
								if (err)
									console.error(err.message)
								req.flash('msg_info', "Time Sheet Updated Successfully");
								res.redirect('/user/technician/report-view');
							});
						} else {
							req.flash('msg_error', "Some thing went wrong!");
							res.redirect('/user/technician/report-view');
						}
					});
				} else {
					req.flash('msg_error', "You Are Not Authorized To Edit This Time Sheet!");
					res.redirect('/user/technician/dashboard');
				}
			});
		}

	});

router.get('/view-reportDetails/:id', function (req, res, next) {
	chksession(req, res);
	db.query('SELECT t.*, CONCAT(`firstName`, " ", `lastName`) AS name, (SELECT CONCAT(`firstName`, " ", `lastName`) from users WHERE id=t.sup_id) as supervisorName, s.statusName FROM taskreporting AS t join users AS u ON (t.userId=u.id) JOIN statusname AS s ON (s.id=t.status) where t.id=?', req.params.id, function (err, rows) {
		if (err)
			console.error(err.message)
		res.render('user/technician/view-reportDetails', {
			title: 'View Report',
			layout: 'layout/user-layout.jade',
			reports: rows,
			applications: req.session
		});
	});
});

/* GET to view users job */
router.get('/userJobs', function (req, res) {
	chksession(req, res);
	db.query('SELECT j.id as jobId, j.jobName, j.startDate, j.endDate FROM jobs AS j JOIN users_job AS uj ON(j.id=uj.job_id) WHERE uj.user_id=? AND uj.isCurrentJob=1', req.session.uid, function (err, rows) {
		if (err)
			console.error(err.message)
		if (rows.length != 0) {
			res.render('user/technician/viewUserJobs', {
				title: 'Technician Report View',
				layout: 'layout/user-layout.jade',
				data: rows,
				applications: req.session

			});
		} else {
			req.flash('msg_error', "You don't have any job yet.");
			res.redirect('/user/technician/dashboard');
		}
	});
});

/*GET to view particular job */
router.get('/view-jobDetails/:id', function (req, res, next) {
	chksession(req, res);

	var id = req.params.id;
	chksession(req, res);
	// db.query('SELECT jobs.id as jobId, jobs.jobName, jobs.siteId, jobs.startDate, jobs.endDate, jobs.noOfPhases, jobs.jobCode, jobs.description, jobsites.siteName, jobsites.sitesCode, countries.name AS country, cities.name AS city, states.name AS state, (SELECT firstName from users WHERE id=jobs.jobSupervisor) AS SupervisorName, (SELECT statusName from statusname WHERE id=jobs.status) AS jobStatus FROM jobs LEFT JOIN jobsites ON (jobsites.id = jobs.siteId) LEFT JOIN countries ON (jobsites.country = countries.id) LEFT JOIN cities ON (jobsites.`city` = cities.id) LEFT JOIN states ON (jobsites.state = states.id) WHERE jobs.id=?', id, function (err, rows) {
	db.query('SELECT jobs.id as jobId, jobs.jobName, jobs.siteId, jobs.startDate, jobs.endDate, jobs.noOfPhases, jobs.jobCode, jobs.description, jobs.days_count, jobsites.siteName, jobsites.sitesCode, jobsites.newAddress, (SELECT CONCAT(`firstName`, " ", `lastName`) AS name from users WHERE id=jobs.jobPlanner) AS plannerName, (SELECT CONCAT(firstName, " ", lastName) from users JOIN user_sites ON (users.id = user_sites.user_id) WHERE user_sites.user_role=3 AND user_sites.is_current=1 AND user_sites.jobType=jobtype.id AND user_sites.site_id=jobsites.id) AS SupervisorName, (SELECT statusName from statusname WHERE id=jobs.status) AS jobStatus FROM jobs LEFT JOIN jobsites ON (jobsites.id = jobs.siteId) LEFT JOIN jobtype ON (jobs.jobTypeId = jobtype.id) LEFT JOIN users_job ON (jobsites.id=users_job.siteId) WHERE jobs.id=?', id, function (err, rows) {
		db.query('SELECT id, date, inTime, outTime, hours_count, (SELECT statusName from statusname WHERE id=taskreporting.status) AS jobStatus FROM taskreporting WHERE userId=? AND active=1 AND status!=7 ORDER BY date DESC limit 5', req.session.uid, function (err, list) {

			if (err)
				console.error(err.message)
			res.render('user/technician/view-jobDetails', {
				title: 'Technician Job Description',
				layout: 'layout/user-layout.jade',
				reportList: list,
				viewReportList: rows[0],
				applications: req.session
			});
		});
	});

});

/* GET Search Jobs */
/* router.get('/search-jobs', function (req, res, next) {
	chksession(req, res);
	db.query('SELECT jobType FROM users where id=?', req.session.uid, function (err, rows) {
		var jobtype = rows[0].jobType;
		db.query('SELECT J.id, J.jobName, J.noOfVacancy, J.jobCode, J.experience, J.createDate, J.skillsId, ci.name as city , s.name as state, C.name as country, (select GROUP_CONCAT(skill_name) from skills where FIND_IN_SET (id,J.skillsId)) as skills FROM jobs J LEFT JOIN jobsites js ON (J.siteId = js.id) LEFT JOIN cities ci ON (js.city = ci.id) LEFT JOIN states s ON (js.state = s.id) LEFT JOIN countries C ON (js.country = C.id) where J.jobTypeId=? AND j.id NOT IN(SELECT jobId FROM userapplications WHERE userId=? AND active =1) ORDER BY J.createDate DESC', [jobtype, req.session.uid], function (err, jobs) {

			if (err)
				console.error(err.message)
			res.render('user/technician/search-jobs', {
				title: 'Technician Dashboard',
				layout: 'layout/user-layout.jade',
				jobs: jobs,
				jobtype: jobtype,
				url: url,
				applications: req.session
			});
		});
	});
}); */

/* POST to search jobs */
/* router.post('/search-jobs', function (req, res) {
	chksession(req, res);
	var sk = req.body.skills;
	// skFilter = '';
	// if (sk) {
	// 	if (typeof sk == 'object') {
	// 		sk.forEach(function (a) {
	// 			_skFilter += _skFilter ? ` OR FIND_IN_SET ('${a}',J.skillsId)` : `FIND_IN_SET ('${a}',J.skillsId)`
	// 		})
	// 	} else {
	// 		_skFilter = `FIND_IN_SET ('${sk}',J.skillsId)`
	// 	}
	// }
	req.end();
	db.query('SELECT jobType FROM users where id=?', req.session.uid, function (err, rows) {
		var jobtype = rows[0].jobType;
		db.query(`SELECT J.id as jobId, J.jobName, J.noOfVacancy, J.jobCode, J.experience, J.createDate, J.skillsId, ci.name as city , s.name as state, C.name as country, (select GROUP_CONCAT(skill_name) from skills where  FIND_IN_SET (id,J.skillsId)) as skills FROM jobs J LEFT JOIN jobsites js ON (J.siteId = js.id) LEFT JOIN cities ci ON (js.city = ci.id) LEFT JOIN states s ON (js.state = s.id) LEFT JOIN countries C ON (js.country = C.id) where J.jobTypeId=1 AND J.jobName LIKE '${req.body.search ? req.body.search : '%'}' ${_skFilter ? `AND (${_skFilter})` : ''} ORDER BY J.createDate DESC`, jobtype, function (err, jobs, shift) {
			if (!jobs[0]) {
				req.flash('msg_error', 'There Are No Jobs That Matches Your Search !')
				res.render('user/technician/search-jobs', {
					title: 'Technician Dashboard',
					layout: 'layout/user-layout.jade',
					name: req.session.firstName,
					uid: req.session.uid,
					jobs: jobs,
					jobtype: jobtype,
					shift: shift,
					url: url
				});
			} else {
				res.render('user/technician/search-jobs', {
					title: 'Technician Dashboard',
					layout: 'layout/user-layout.jade',
					name: req.session.firstName,
					uid: req.session.uid,
					jobs: jobs,
					jobtype: jobtype,
					url: url
				});

			}
		});
	});
}); */

/* POST apply jobs */
/* router.post('/applyJobs', function (req, res) {
	chksession(req, res);
	var data = {
		userId: req.session.uid,
		date: moment(new Date()).format('YYYY-MM-DD'),
		jobId: req.body.applyJob,
		status: 0,
		preferredShift: req.body.shift
	};
	db.query('INSERT INTO userapplications SET ?', data, function (err, rows) {
		if (err)
			console.error(err.message)
		req.flash('msg_info', "Job Successfully Applied");
		res.redirect('/user/technician/search-jobs');
	});
}); */

/* GET To View Apply Jobs */
/* router.get('/view-appliedJobs', function (req, res, next) {
	chksession(req, res);
	db.query('SELECT ua.id, ua.date, j.jobCode, j.jobName, s.statusName FROM userapplications AS ua LEFT JOIN users AS u ON(ua.userId=u.id) LEFT JOIN jobs AS j ON(ua.jobId=j.id) LEFT JOIN statusname AS S ON(ua.status=s.id) WHERE u.id=? AND ua.active=1 ORDER BY ua.date DESC', req.session.uid, function (err, rows) {
		if (err)
			console.error(err.message)
		res.render('user/technician/view-appliedJobs', {
			title: 'View Applied Jobs',
			layout: 'layout/user-layout.jade',
			appliedJobs: rows,
			applications: req.session
		});
	});
}); */

/* GET Single Job */
router.get('/view-singleJob/:id', function (req, res) {
	chksession(req, res);
	var id = req.params.id;
	// db.query('SELECT J.id, J.jobName, J.noOfVacancy, J.jobCode, J.experience, J.createDate, J.description, js.siteName, js.sitesCode, ci.name as city , s.name as state, C.name as country, (select GROUP_CONCAT(skill_name) from skills where FIND_IN_SET (id,J.skillsId)) as skills FROM jobs J LEFT JOIN jobsites js ON (J.siteId = js.id) LEFT JOIN cities ci ON (js.city = ci.id) LEFT JOIN states s ON (js.state = s.id) LEFT JOIN countries C ON (js.country = C.id) where J.id=?', id, function (err, rows) {
	db.query('SELECT J.id, J.jobName, J.noOfVacancy, J.jobCode, J.experience, J.createDate, J.description, js.siteName, js.sitesCode, js.newAddress, (select GROUP_CONCAT(skill_name) from skills where FIND_IN_SET (id,J.skillsId)) as skills FROM jobs J LEFT JOIN jobsites js ON (J.siteId = js.id) where J.id=?', id, function (err, rows) {
		if (err)
			console.error(err.message)
		res.render('user/technician/view-singleJob', {
			title: 'Supervisor View Profile',
			layout: 'layout/admin-layout.jade',
			singleJob: rows,
			applications: req.session
		});

	});
});

/* Delete Particular Apllied job */
router.get('/delete-appliedJobs/:id', function (req, res) {
	chksession(req, res);
	var actionDate = moment(new Date()).format('YYYY-MM-DD');
	db.query('UPDATE userapplications SET active=0, actionDate=? WHERE id=?', [actionDate, req.params.id], function (err) {
		if (err)
			console.error(err.message)
		req.flash('msg_info', "Your job Successfully Deleted Which You Have Applied !");
		res.redirect('/user/technician/view-appliedJobs');
	});
});

/* GET To Add Certification */
router.get('/add-certificate', function (req, res) {
	chksession(req, res);
	res.render('user/technician/add-certificate', {
		title: 'add Certificate',
		layout: 'layout/user-layout.jade',
		url: url,
		applications: req.session
	});
});

/* POST to add certification */
router.post('/add-certificate', function (req, res) {

	chksession(req, res);
	var userId = req.session.uid;
	let imageFile = req.files.certificate_attachment;
	let imageExtension = imageFile.name.split('.');

	if (imageExtension[1] == "jpg" || imageExtension[1] == "JPG" || imageExtension[1] == "jpeg" || imageExtension[1] == "JPEG" || imageExtension[1] == "png" || imageExtension[1] == "PNG" || imageExtension[1] == "pdf" || imageExtension[1] == "PDF") {

		let ext = imageExtension[(imageExtension).length - 1];
		var image = userId + '_' + new Date().toISOString();
		new_image = md5(image);
		new_image = new_image + '.' + ext;
		let fileName = new_image;
		let uploadPath = 'uploads/certificate_attachment';
		var data = {
			userId: userId,
			certification_name: req.body.certification_name,
			authority: req.body.authority,
			certificate_attachment: fileName,
			description: req.body.description,
			exp_date: moment(req.body.exp_date).format('YYYY-MM-DD'),
			active: 1

		};

		imageFile.mv(`public/${uploadPath}/${fileName}`, function (err) {
			db.query('INSERT INTO certification SET ?', data, function (err, rows, fields) {

				if (err)
					console.error(err.message)
				req.flash('msg_info', "Certification Added Successfully.");
				res.redirect('/user/technician/view-certificate');
			});
		});
	} else {
		req.flash('msg_error', "This format is not allowed , please upload file with '.png','.gif','.jpg','.pdf'");
		res.redirect('/user/technician/add-certificate');
	}

});

/* GET To View Job Site Wise */
router.get('/view-certificate', function (req, res) {
	chksession(req, res);

	db.query('SELECT id, certification_name, certificate_attachment, authority,exp_date FROM certification where userId=? AND active=1', req.session.uid, function (err, rows) {

		if (err)
			console.error(err.message)
		res.render('user/technician/view-certificate', {
			title: 'Certificate View',
			layout: 'layout/user-layout.jade',
			certificateList: rows,
			applications: req.session
		});
	});
});

/* Get Edit-Roles */
router.get('/edit-certificate/:id', function (req, res) {
	chksession(req, res);
	db.query('SELECT id, certification_name, certificate_attachment, authority,exp_date,description FROM certification WHERE id = ?', req.params.id, function (err, rows) {
		if (err)
			console.error(err.message)
		res.render('user/technician/edit-certificate', {
			title: 'Edit Certificate',
			layout: 'layout/user-layout.jade',
			certificate: rows,
			applications: req.session,
			id: req.params.id
		});
	});
});

/* POST Edit-Roles */
router.post('/edit-certificate/:id', function (req, res) {
	chksession(req, res);
	var userId = req.session.uid;
	if (!req.files) {
		var data = {
			userId: userId,
			certification_name: req.body.certification_name,
			authority: req.body.authority,
			description: req.body.description,
			exp_date: moment(req.body.exp_date).format('YYYY-MM-DD'),
			active: 1
		};
	} else {
		let imageFile = req.files.certificate_attachment;
		let imageExtension = imageFile.name.split('.');

		if (imageExtension[1] == "jpg" || imageExtension[1] == "JPG" || imageExtension[1] == "jpeg" || imageExtension[1] == "JPEG" || imageExtension[1] == "png" || imageExtension[1] == "PNG" || imageExtension[1] == "pdf" || imageExtension[1] == "PDF") {

			let ext = imageExtension[(imageExtension).length - 1];
			var image = userId + '_' + new Date().toISOString();
			new_image = md5(image);
			new_image = new_image + '.' + ext;
			let fileName = new_image;
			let uploadPath = 'uploads/certificate_attachment';
			var data = {
				userId: userId,
				certification_name: req.body.certification_name,
				authority: req.body.authority,
				certificate_attachment: fileName,
				description: req.body.description,
				exp_date: moment(req.body.exp_date).format('YYYY-MM-DD'),
				active: 1

			};
			imageFile.mv(`public/${uploadPath}/${fileName}`, function (err) {});
		} else {
			req.flash('msg_error', "This format is not allowed , please upload file with '.png','.gif','.jpg','.pdf'");
			res.redirect('/user/technician/edit-certificate/' + req.params.id);
			req.end();
		}
	}
	db.query('UPDATE certification SET ? WHERE id = ? ', [data, req.params.id], function (err, rows, fields) {
		if (err) {
			console.error(err.message)
			req.flash('msg_error', "Some error occured!");
			res.redirect('/user/technician/add-certificate');
		} else {
			req.flash('msg_info', "Certificate Updated Successfully");
			res.redirect('/user/technician/view-certificate');
		}
	});
});

/* Delete Certificate */
router.get('/deleteCertificate/:id', function (req, res) {
	chksession(req, res);
	db.query('UPDATE certification SET active=0 WHERE id=?', req.params.id, function (err) {
		if (err)
			console.error(err.message)
		req.flash('msg_info', "Certificate Deleted Successfully");
		res.redirect('/user/technician/view-certificate');
	});
});

/* GET to see my offers */
router.get('/view-offers', function (req, res) {
	chksession(req, res);
	// db.query('SELECT jo.jobId, jo.id AS offerId, j.jobName, j.jobCode, j.startDate, j.endDate,countries.name AS country, cities.name AS city, states.name AS state FROM `joboffers` AS jo JOIN jobs AS j ON (jo.jobId=j.id) JOIN jobsites AS js ON (j.siteId=js.id) JOIN countries ON (js.country = countries.id) JOIN cities ON (js.`city` = cities.id) JOIN states ON (js.state = states.id) WHERE jo.userId=? AND jo.status=0 GROUP BY jo.jobId', req.session.uid, function (err, rows) {
	db.query('SELECT jo.jobId, jo.id AS offerId, j.jobName, j.jobCode, j.startDate, j.endDate,js.newAddress FROM `joboffers` AS jo JOIN jobs AS j ON (jo.jobId=j.id) JOIN jobsites AS js ON (j.siteId=js.id) WHERE jo.userId=? AND jo.status=0 GROUP BY jo.jobId', req.session.uid, function (err, rows) {
		if (err)
			console.error(err.message);
		res.render('user/technician/view-offers', {
			title: 'View Job Offers',
			layout: 'layout/user-layout.jade',
			offers: rows,
			applications: req.session
		});
	});
});

/* GET Single Job */
router.get('/viewSingelJobs/:id', function (req, res) {
	chksession(req, res);

	// var id = req.params.id;
	chksession(req, res);
	db.query(`SELECT jobs.id AS jobId, jobs.jobName, jobs.siteId, jobs.startDate, jobs.endDate, jobs.noOfPhases, jobs.jobCode, jobs.description, jobsites.newAddress, jobsites.siteName, jobsites.sitesCode, jobtype.type_name, jo.id AS offerId, (SELECT CONCAT(firstName, " ", lastName) AS name from users WHERE id=jobs.jobPlanner) AS plannerName, (SELECT CONCAT(firstName, " ", lastName) from users JOIN user_sites ON (users.id = user_sites.user_id) WHERE user_sites.user_role=3 AND user_sites.is_current=1 AND user_sites.jobType=jobtype.id AND user_sites.site_id=jobsites.id) AS SupervisorName, (SELECT statusName from statusname WHERE id=jobs.status) AS jobStatus FROM joboffers AS jo JOIN jobs ON (jo.jobId=jobs.id) JOIN jobsites ON (jobsites.id = jobs.siteId) LEFT JOIN jobtype ON (jobs.jobTypeId = jobtype.id) LEFT JOIN users_job ON (jobsites.id=users_job.siteId) WHERE jo.id=?`, req.params.id, function (err, rows) {


		if (err)
			console.error(err.message)
		res.render('user/technician/viewSingelJobs', {
			title: 'Job Description',
			layout: 'layout/admin-layout.jade',
			viewReportLists: rows[0],
			id: req.params.id,
			url: url,
			applications: req.session
		});
	});
});

/* POST to approve & reject jobs */
/* router.post('/acceptUser/:id', function (req, res) {
	chksession(req, res);
	var body = req.body;
	var id = req.body.act;
	db.query('SELECT userId, jobId FROM joboffers WHERE id=?', req.body.offerId, function (err, rows) {
		if (err)
			console.error(err.message)
		if (rows[0].userId == req.session.uid && rows[0].jobId == req.body.jobId) {
			switch (id) {
				case '1':

					db.query('SELECT siteId, startDate, endDate, jobSupervisor FROM jobs WHERE id = ?', req.body.jobId, function (err, job) {
						db.query('SELECT designation FROM joboffers WHERE id = ?', req.body.offerId, function (err, jobOff) {
							if (err)
								console.error(err.message)
							let currSiteId = job[0].siteId;

							var jobs = {
								user_id: req.session.uid,
								job_id: req.body.jobId,
								sup_id: job[0].jobSupervisor,
								siteId: currSiteId,
								designation: jobOff[0].designation,
								enroll_Indate: moment(req.body.startDate).format('YYYY-MM-DD'),
								enroll_Outdate: moment(req.body.endDate).format('YYYY-MM-DD'),
							};
							if (err)
								console.error(err.message)
							db.query('UPDATE joboffers SET status = ? WHERE id = ? ', [5, req.body.offerId], function (err, jobOfferData) {
								if (err)
									console.error(err.message)
								db.query('INSERT INTO users_job SET ?', jobs, function (err, jobsData) {
									db.query('SELECT jobType FROM users WHERE id=?', req.session.uid, function (err, user) {
										db.query('INSERT INTO user_sites (user_id, site_id, user_role, jobType) VALUES (?, ?, 1, ?)', [req.session.uid, currSiteId, user[0].jobType], function (err, jobsData) {
											if (err)
												console.error(err.message)
										});
										if (err)
											console.error(err.message)
										req.flash('msg_info', "Your offer has been accepted. ");
										res.redirect('/user/technician/view-jobDetails/' + req.body.jobId);
									});
								});
							});
						});
					});
					break;

				case '2':
					db.query('SELECT predicated_budget FROM jobs WHERE id = ?', req.body.jobId, function (err, jobBudegt) {
						db.query('SELECT predicated_budget FROM joboffers WHERE id = ?', req.body.offerId, function (err, offerBudget) {

							var sub = parseFloat(jobBudegt[0].predicated_budget);
							sub -= parseFloat(offerBudget[0].predicated_budget);

							db.query('UPDATE jobs SET predicated_budget = ? WHERE id = ?', [sub, req.body.jobId], function (err) {
								db.query('UPDATE joboffers SET status=? WHERE userId=? AND id=?', [6, req.session.uid, req.params.id], function (err, rows, fields) {
									if (err)
										console.error(err.message)
									req.flash('msg_error', "Your offer has been rejected.");
									res.redirect('/user/technician/view-offers');
								});
							});
						});
					});
					break;

				default:
					req.flash('msg_error', "You choosed wrong option");
					res.redirect('/user/technician/dashboard');
			}
		} else {
			req.flash('msg_error', "You are not authorized for this action.");
			res.redirect('/user/technician/dashboard');
		}
	})
}); */


router.post('/acceptUser/:id', function (req, res) {
	chksession(req, res);
	console.log(req.body,'body')
	var id = req.body.act;
	db.query('SELECT userId, jobId FROM joboffers WHERE id=?', req.body.offerId, function (err, rows) {
		if (err)
			console.error(err.message)
		if (rows[0].userId == req.session.uid && rows[0].jobId == req.body.jobId) {
			switch (id) {
				case '1':
					db.query('select j.startDate,js.latitude, js.longitude from jobs j JOIN jobsites AS js ON(j.siteId=js.id) where j.id =?', req.body.jobId, function (err, jobdet) {

						db.query('SELECT uj.job_id AS userCurrJobId, j.startDate, j.endDate, js.latitude, js.longitude FROM users_job AS uj JOIN jobs AS j ON(uj.job_id=j.id) JOIN jobsites AS js ON(uj.siteId=js.id) WHERE uj.user_id=? AND uj.isCurrentJob=1 AND (CAST(? AS DATE) BETWEEN CAST( j.startDate AS DATE) AND CAST(j.endDate AS DATE))', [req.session.uid, jobdet[0].startDate], function (err, currJob) {
							var disdiff = 0;
							var jobdetsite_latitude = parseFloat(jobdet[0].latitude);
							var jobdetsite_longitude = parseFloat(jobdet[0].longitude);



							if (!currJob[0]) {
								db.query('SELECT siteId, startDate, endDate, jobSupervisor FROM jobs WHERE id = ?', req.body.jobId, function (err, job) {
									db.query('SELECT designation FROM joboffers WHERE id = ?', req.body.offerId, function (err, jobOff) {
										if (err)
											console.error(err.message)
										let currSiteId = job[0].siteId;

										var jobs = {
											user_id: req.session.uid,
											job_id: req.body.jobId,
											sup_id: job[0].jobSupervisor,
											siteId: currSiteId,
											designation: jobOff[0].designation,
											enroll_Indate: moment(req.body.startDate).format('YYYY-MM-DD'),
											enroll_Outdate: moment(req.body.endDate).format('YYYY-MM-DD'),
										};
										
										db.query('UPDATE joboffers SET status = ? WHERE id = ? ', [5, req.body.offerId], function (err, jobOfferData) {
											if (err)
												console.error(err.message)
											db.query('INSERT INTO users_job SET ?', jobs, function (err, jobsData) {
												db.query('SELECT jobType FROM users WHERE id=?', req.session.uid, function (err, user) {
													db.query('INSERT INTO user_sites (user_id, site_id, user_role, jobType) VALUES (?, ?, 1, ?)', [req.session.uid, currSiteId, user[0].jobType], function (err, jobsData) {
														if (err)
															console.error(err.message)
													});
													if (err)
														console.error(err.message)
													req.flash('msg_info', "Your offer has been accepted. ");
													res.redirect('/user/technician/view-jobDetails/' + req.body.jobId);
												});
											});
										});
									});
								});

							} else {
								var cursite_latitude = parseFloat(currJob[0].latitude);
								var cursite_longitude = parseFloat(currJob[0].longitude);

								options = {
									uri: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + jobdetsite_latitude + '%2C' + jobdetsite_longitude + '&destinations=' + cursite_latitude + '%2C' + cursite_longitude + '&key='+config.apiKey,
									timeout: 200000000,
									followAllRedirects: true
								};
								request(options, function (error, response, body) {
									var jsonData = JSON.parse(body);
									var row = jsonData.rows;
									row.forEach(function (a) {

										var element = a.elements;
										element.forEach(function (b) {
											
											if (b.status == 'OK') {
												disdiff = b.distance.text;
											}

										});
									});

									if (disdiff.includes('ft')) {
										db.query('SELECT siteId, startDate, endDate, jobSupervisor FROM jobs WHERE id = ?', req.body.jobId, function (err, job) {
											db.query('SELECT designation FROM joboffers WHERE id = ?', req.body.offerId, function (err, jobOff) {
												if (err)
													console.error(err.message)
												let currSiteId = job[0].siteId;

												var jobs = {
													user_id: req.session.uid,
													job_id: req.body.jobId,
													sup_id: job[0].jobSupervisor,
													siteId: currSiteId,
													designation: jobOff[0].designation,
													enroll_Indate: moment(req.body.startDate).format('YYYY-MM-DD'),
													enroll_Outdate: moment(req.body.endDate).format('YYYY-MM-DD'),
												};
												
												if (err)
													console.error(err.message)
												db.query('UPDATE joboffers SET status = ? WHERE id = ? ', [5, req.body.offerId], function (err, jobOfferData) {
													if (err)
														console.error(err.message)
													db.query('INSERT INTO users_job SET ?', jobs, function (err, jobsData) {
														db.query('SELECT jobType FROM users WHERE id=?', req.session.uid, function (err, user) {
															db.query('INSERT INTO user_sites (user_id, site_id, user_role, jobType) VALUES (?, ?, 1, ?)', [req.session.uid, currSiteId, user[0].jobType], function (err, jobsData) {
																if (err)
																	console.error(err.message)
															});
															if (err)
																console.error(err.message)
															req.flash('msg_info', "Your offer has been accepted. ");
															res.redirect('/user/technician/view-jobDetails/' + req.body.jobId);
														});
													});
												});
											});
										});
									}
									if (disdiff.includes('mi')) {
										var distDiffer = disdiff.replace(',', '');
										var dis = parseFloat(distDiffer);
										if ((dis < 25)) {
											db.query('SELECT siteId, startDate, endDate, jobSupervisor FROM jobs WHERE id = ?', req.body.jobId, function (err, job) {
												if (err)
													console.error(err.message)
												db.query('SELECT designation FROM joboffers WHERE id = ?', req.body.offerId, function (err, jobOff) {
													if (err)
														console.error(err.message)
													let currSiteId = job[0].siteId;

													var jobs = {
														user_id: req.session.uid,
														job_id: req.body.jobId,
														sup_id: job[0].jobSupervisor,
														siteId: currSiteId,
														designation: jobOff[0].designation,
														enroll_Indate: moment(req.body.startDate).format('YYYY-MM-DD'),
														enroll_Outdate: moment(req.body.endDate).format('YYYY-MM-DD'),
													};

													db.query('UPDATE joboffers SET status = ? WHERE id = ? ', [5, req.body.offerId], function (err, jobOfferData) {
														if (err)
															console.error(err.message)
														db.query('INSERT INTO users_job SET ?', jobs, function (err, jobsData) {
															db.query('SELECT jobType FROM users WHERE id=?', req.session.uid, function (err, user) {
																if (err)
																	console.error(err.message)
																db.query('INSERT INTO user_sites (user_id, site_id, user_role, jobType) VALUES (?, ?, 1, ?)', [req.session.uid, currSiteId, user[0].jobType], function (err, jobsData) {
																	if (err)
																		console.error(err.message)
																});
																if (err)
																	console.error(err.message)
																req.flash('msg_info', "Your offer has been accepted. ");
																res.redirect('/user/technician/view-jobDetails/' + req.body.jobId);
															});
														});
													});
												});
											});
										} else {
											req.flash('msg_error', "You can't accept this job as you already have a job in this time frame.");
											res.redirect('/user/technician/dashboard');
										}
									}
								});
							}
						});
					});
					break;

				case '2':
					db.query('SELECT predicated_budget FROM jobs WHERE id = ?', req.body.jobId, function (err, jobBudegt) {
						db.query('SELECT predicated_budget FROM joboffers WHERE id = ?', req.body.offerId, function (err, offerBudget) {

							var sub = parseFloat(jobBudegt[0].predicated_budget);
							sub -= parseFloat(offerBudget[0].predicated_budget);

							db.query('UPDATE jobs SET predicated_budget = ? WHERE id = ?', [sub, req.body.jobId], function (err) {
								db.query('UPDATE joboffers SET status=? WHERE userId=? AND id=?', [6, req.session.uid, req.params.id], function (err, rows, fields) {
									if (err)
										console.error(err.message)
									req.flash('msg_error', "Your offer has been rejected.");
									res.redirect('/user/technician/view-offers');
								});
							});
						});
					});
					/* db.query('UPDATE joboffers SET status=? WHERE userId=? AND id=?', [6, req.session.uid, req.params.id], function (err, rows, fields) {
						if (err)
							console.error(err.message)
						req.flash('msg_error', "Your offer have been rejected.");
						res.redirect('/user/technician/view-offers');
					}); */

					break;

				default:
					req.flash('msg_error', "You choosed wrong option");
					res.redirect('/user/technician/dashboard');
			}
		} else {
			req.flash('msg_error', "You are not authorized for this action.");
			res.redirect('/user/technician/dashboard');
		}
	})
});

/* GET To View Report Card */
router.get('/report-card', function (req, res) {
	chksession(req, res);
	db.query('SELECT * FROM users WHERE id = ?', req.session.uid, function (err, rows) {
		db.query('SELECT id, type_name FROM jobtype', function (err, row) {
			db.query('SELECT AVG(rating) as total_rating, (SELECT AVG(rating) FROM `user_ratings` WHERE userId=? AND rating_type=1) AS Workmanship_Quality, (SELECT AVG(rating) FROM `user_ratings` WHERE userId=? AND rating_type=2) AS Attendance_Punctuality, (SELECT AVG(rating) FROM `user_ratings` WHERE userId=? AND rating_type=3) AS Organization_Cleanliness, (SELECT AVG(rating) FROM `user_ratings` WHERE userId=? AND rating_type=4) AS Communication_Updates, (SELECT AVG(rating) FROM `user_ratings` WHERE userId=? AND rating_type=5) AS Worked_Safe, (SELECT AVG(rating) FROM `user_ratings` WHERE userId=? AND rating_type=6) AS Followed_Instructions_Schedule, (SELECT AVG(rating) FROM `user_ratings` WHERE userId=? AND rating_type=7) AS Team_Player FROM `user_ratings` WHERE userId=?', [req.session.uid, req.session.uid, req.session.uid, req.session.uid, req.session.uid, req.session.uid, req.session.uid, req.session.uid], function (err, rating) {
				var a = db.query('SELECT exam_date, start_time, end_time, question, no_of_given_answer, level_1_score, level_2_score, level_3_score, total_score, wrong_answer_count, neg_mark FROM `results` WHERE userId=? ORDER BY exam_date, start_time DESC', req.session.uid, function (err, result) {
					console.log(a.sql,'qq')
					let jobType = row.filter(a => a.id == rows[0].jobType);
					if (err)
						console.error(err.message)
					res.render('user/technician/report-card', {
						title: 'Report Card',
						layout: 'layout/user-layout.jade',
						value: rows[0],
						jobType: jobType,
						userResult: result[0],
						rating: rating[0],
						applications: req.session
					});
				});
			});
		});
	});
});

/* GET to see reviews */
router.get('/view-reviews', function (req, res) {
	chksession(req, res);
	db.query('SELECT ur.id, ur.reviews, ur.reviewDate, ur.isJobreview, CONCAT(`firstName`, " ", `lastName`) AS name FROM user_reviews AS ur JOIN users AS u ON (ur.review_by=u.id) WHERE active=1 AND userId=? ORDER BY reviewDate DESC', req.session.uid, function (err, reviews) {
		if (err)
			console.error(err.message)
		res.render('user/technician/view-reviews', {
			title: 'technician Dashboard',
			layout: 'layout/user-layout.jade',
			reviewsList: reviews,
			applications: req.session
		});
	});
});

/* POST to change password*/
router.post('/changePassword', [
	check('currentPassword').isLength({
        min: 6
      }).withMessage('Current Password Must be at least 6 chars long').not().isEmpty().withMessage('Current Password is required!'),
	check('newPassword').isLength({
        min: 6
      }).withMessage('New Password Must be at least 6 chars long').not().isEmpty().withMessage('New Password is required!'),
	check('confirmNewPassword').isLength({
        min: 6
      }).withMessage('Confirm Password Must be at least 6 chars long').not().isEmpty().withMessage('Confirm Password is required!')
], function (req, res) {
	chksession(req, res);
	const {
		currentPassword,
		newPassword,
		confirmNewPassword
	} = req.body;
	db.query('SELECT password FROM users WHERE id = ?', req.session.uid, function (err, rows) {
		bcrypt.compare(currentPassword, rows[0].password, function (err, isMatch) {
			if (isMatch) {
				if (currentPassword != newPassword) {
					if (newPassword == confirmNewPassword) {
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(newPassword, salt, (err, hash) => {
								db.query('UPDATE users SET password= ? WHERE id =?', [hash, req.session.uid], function (err) {
									if (err)
										console.error(err.message)
									req.flash('msg_info', "Your Password Successfully Changed,Please Login to Continue.");
									res.redirect('/login');
								});
							});
						});
					} else {
						req.flash('msg_error', "New Password and Confirrm New Password not matched!");
						res.redirect('/user/technician/edit-profile');
					}
				} else {
					req.flash('msg_error', "Current Password and New Password can not be same!");
					res.redirect('/user/technician/edit-profile');
				}
			} else {
				req.flash('msg_error', "Current Password is Invalid!");
				res.redirect('/user/technician/edit-profile');
			}
		});

	});


});

/* GET chat */
router.get('/chat', function (req, res) {
	chksession(req, res);
	var uid = req.session.uid;
	var token = req.session.token;
	var decoded = jwt.decode(token);
	var tokenId = decoded.id;


	db.query(`SELECT msg_from FROM tech_messages WHERE msg_to=?`, uid, function (err, id) {
		var hrId = id[0].msg_from;
		db.query(`SELECT CONCAT(firstName,' ',lastName) AS name, u.profileImg, tm.id, tm.msg_from, tm.msg_to, tm.message, tm.time FROM tech_messages AS tm JOIN users AS u ON(tm.msg_from=u.id) WHERE msg_from IN (?,?) AND msg_to IN (?,?) AND tm.active=1 ORDER BY tm.time LIMIT 1`, [uid, hrId, uid, hrId], function (err, message) {

			db.query(`SELECT id, msg_to, msg_from FROM tech_messages ORDER BY id DESC LIMIT 1`, function (err, lastId) {

				var msg_to = lastId[0].msg_to;
				var msg_from = lastId[0].msg_from;
				db.query(`SELECT CONCAT(firstName,' ',lastName) AS name, u.profileImg, tm.msg_from, tm.msg_to, tm.message, tm.time FROM tech_messages AS tm JOIN users AS u ON(tm.msg_to=u.id) WHERE tm.msg_from IN (?,?) AND tm.msg_to IN (?,?) AND tm.active=1 GROUP BY tm.id ORDER BY tm.time `, [msg_from, msg_to, msg_from, msg_to], function (err, msgDetail) {

					res.render('user/technician/chat', {
						title: 'Technician & HR Chat View',
						layout: 'layout/hr-layout.jade',
						uid: uid,
						msg: message,
						msg_to: msg_to,
						msgDetails: msgDetail,
						token: token,
						url: url,
						applications: req.session

					})
				});
			});
		});

	});
});

module.exports = router;