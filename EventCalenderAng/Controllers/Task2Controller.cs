using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EventCalenderAng.Domain;
using EventCalenderAng.Domain.BL;
using EventCalenderAng.Domain.Helper;

namespace EventCalenderAng.Controllers
{
    public class Task2Controller : ApiController
    {
        public IEnumerable<Task> GetEvents()
        {
            //Here MyDatabaseEntities is our entity datacontext (see Step 4)
            IRepository<Task> task = new TaskManager();
            return task.GetAll().OrderBy(a => a.StartAt).ToList();
            //var v = dc.Events.OrderBy(a => a.StartAt).ToList();
            //return new JsonResult { Data = v, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}