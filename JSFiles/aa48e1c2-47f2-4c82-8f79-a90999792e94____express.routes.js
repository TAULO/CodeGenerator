'use strict';

module.exports = function(app) {
    var Option = require('../controller/option.class');
    var Extension = require('../controller/extension.class');
    var Department = require('../controller/department.class');
    var Report = require('../controller/report.class');
    var DashBoard = require('../controller/dashboard.class');
    // todoList Routes
    app.route('/option/department').get(Option.Department);

    app.route('/department')
      .get(Department.List)
      .post(type, Department.Upload);
      
	  app.route('/department/:id')
      .get(Department.Detail)
      .put(Department.Update)
      .delete(Department.Delete);

    app.route('/extension')
      .get(Extension.List)
      .post(Extension.AddNew);
	  
	  app.route('/extension/:id')
      .get(Extension.Detail)
      .put(Extension.Update)
      .delete(Extension.Delete);

    app.route('/report/cdr').get(Report.CDR);
    app.route('/report/daily').get(Report.Daily);
    app.route('/report/monthly').get(Report.Monthly);
    app.route('/report/extwise').get(Report.ExtensionWise);
    app.route('/report/dptwise').get(Report.DepartmentWise);
    
    app.route('/dashboad/livecalls').get(DashBoard.LiveCall);
    app.route('/dashboad/todaymin').get(DashBoard.TodayMin);
    app.route('/dashboad/todaycall').get(DashBoard.TodayCall);
}
