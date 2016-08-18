using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace EventCalenderAng.Domain.Helper
{
    public interface IRepository<T>
          where T : class
    {
        IQueryable<T> GetAll();


        IQueryable<T> Find(Expression<Func<T, bool>> predicate);


        T FindById(int id);
     
        bool Add(T newEntity);

        bool Remove(T entity);
        bool Update(T entity);


    }
}
