﻿using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Repositories.Base;

namespace Server.Repositories
{
    public class ProductRepository : Repository<Product, int>
    {
        public ProductRepository(FarminhouseContext context) : base(context) { }

        public  async Task<ICollection<Product>> GetAllProductsByCategory(string name,int pageNumber,int pageSize)
        {
            return await GetQueryable().Where(product => product.Category.Name.Equals(name)).Skip((pageNumber-1)*pageSize).Take(pageSize).ToArrayAsync();
        }
    }
}
