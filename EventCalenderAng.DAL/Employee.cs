//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EventCalenderAng.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class Employee
    {
        public Employee()
        {
            this.Tasks = new HashSet<Task>();
        }
    
        public int EmployeeID { get; set; }
        public string Name { get; set; }
        public Nullable<int> LocationID { get; set; }
    
        public virtual Location Location { get; set; }
        public virtual ICollection<Task> Tasks { get; set; }
    }
}
