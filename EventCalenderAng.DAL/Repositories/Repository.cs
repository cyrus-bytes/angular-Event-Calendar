using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using EventCalenderAng.Domain.Helper;

namespace EventCalenderAng.Domain.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private DbContext _context;
        protected DbSet<T> _set;
        const string ConnectionStringName = "CalContext";


       
        public Repository()
        {
            string connectionString = ConfigurationManager
                         .ConnectionStrings[ConnectionStringName]
                         .ConnectionString;

            //_context = new DbContext(connectionString);
            _context = new CalContext();
            _set = _context.Set<T>();
        }
        public IQueryable<T> GetAll()
        {
           return _set;
        }

        public IQueryable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return _set.Where(predicate);
        }

        public T FindById(int id)
        {
            return _set.Find(id);
        }

        public bool Add(T newEntity)
        {
            bool isSaved = false;

              DbEntityValidationResult validationResult = _context.Entry(newEntity).GetValidationResult();

                if (validationResult.IsValid)
                {
                    _context.Set<T>().Add(newEntity);
                    if (_context.SaveChanges() > 0)
                    {
                        isSaved = true;
                    }
                }
            
            return isSaved;
        }

        

        public bool Remove(T entity)
        {
            bool isDeleted = false;
            _context.Entry(entity).State = EntityState.Deleted;

            if (_context.SaveChanges() > 0)
            {
                isDeleted = true;
            }
            return isDeleted;
        }
        public bool Update(T entity)
        {
            bool isUpdated = false;
            _context.Entry(entity).State = EntityState.Modified;

            if (_context.SaveChanges() > 0)
            {
                isUpdated = true;
            }
            return isUpdated;
        }

     
    }
}
