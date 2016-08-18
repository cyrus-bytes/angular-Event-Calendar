using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EventCalenderAng.Domain;
using EventCalenderAng.Domain.BL;
using EventCalenderAng.Domain.Helper;

namespace EventCalenderAng.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAssignedTasks(string empId)
        {
            
            if (string.IsNullOrWhiteSpace(empId))
            {
                return new JsonResult { Data = null, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

            try
            {
                int id = Convert.ToInt16(empId);
                IRepository<Task> task = new TaskManager();
                var res = task.GetAll().Where(a => id > 0 ? a.EmployeeID == id : a.EmployeeID != null).OrderBy(a => a.StartAt).Select(a => new
                {
                    a.Description,
                    a.EndAt,
                    a.StartAt,
                    a.Title,
                    a.IsFullDay,
                    a.TaskID,
                    EmployeeName = a.Employee.Name,
                    a.LocationID,
                    LocationName=a.Location.Name,
                    a.EmployeeID
                }).ToList();
                return new JsonResult { Data = res, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch 
            {
                return new JsonResult { Data = null, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
           

        }
        public JsonResult GetNotAssignedTasks()
        {

            IRepository<Task> task = new TaskManager();
            var res = task.GetAll().Where(a=>a.EmployeeID == null).OrderBy(a => a.StartAt).Select(a => new
            {
                a.Description,
                a.EndAt,
                a.StartAt,
                a.Title,
                a.IsFullDay,
                a.TaskID,
                a.LocationID,
               LocationName= a.Location.Name
            
            }).ToList();
            return new JsonResult { Data = res, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        //Action for Save event
        [HttpPost]
        public JsonResult SaveTask(Task task)
        {
            bool status = false;
            IRepository<Task> _task = new TaskManager();
            if (task.EndAt != null && task.StartAt != null && task.StartAt.Value.TimeOfDay == new TimeSpan(0, 0, 0) &&
                    task.EndAt.Value.TimeOfDay == new TimeSpan(0, 0, 0))
                {
                    task.IsFullDay = true;
                }
                else
                {
                    task.IsFullDay = false;
                }
            if (task.StartAt == null)
            {
                task.EmployeeID = null;
                task.Employee = null;
            }
            if (task.TaskID > 0)
                {
                    var v = _task.Find(a => a.TaskID.Equals(task.TaskID)).FirstOrDefault();
                    if (v != null)
                    {
                        v.Title = task.Title;
                        v.Description = task.Description == "sm" ? v.Description : task.Description;
                        v.StartAt = task.StartAt;
                        v.EndAt = task.EndAt;
                        v.IsFullDay = task.IsFullDay;
                        v.EmployeeID = task.EmployeeID;
                        v.LocationID = task.LocationID;
                        status = _task.Update(v);
                    }
                }
                else
                {
                    status = _task.Add(task);
                }
                     
            return new JsonResult { Data = new { status = status } };
        }
        [HttpPost]
        public JsonResult DeleteTask(int taskId)
        {
            bool status = false;
            IRepository<Task> _task = new TaskManager();
            var v = _task.Find(a => a.TaskID.Equals(taskId)).FirstOrDefault();
                if (v != null)
                {
                    _task.Remove(v);
                    status = true;
                }
            
            return new JsonResult { Data = new { status = status } };
        }
        public JsonResult GetEmployees()
        {

            IRepository<Employee> task = new EmployeeManager();
            var res = task.GetAll().OrderBy(a => a.LocationID).Select(a => new
            {
                a.EmployeeID,
                a.Name,
               LocationName= a.Location.Name,
                a.LocationID
            }).ToList();
            return new JsonResult { Data = res, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public JsonResult GetLocations()
        {

            IRepository<Location> task = new LocationManager();
            var res = task.GetAll().OrderBy(a => a.Name).Select(a => new
            {
                a.LocationID,
                a.Name
            }).ToList();
            return new JsonResult { Data = res, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }

    //public class Res
    //{
    //    public TYPE NAME { get; set; }
    //}
}