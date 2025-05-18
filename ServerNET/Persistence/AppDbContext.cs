using System;

namespace Persistence;

public class AppDbContext
{
    public string ConnectionName { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string BooksCollectionName { get; set; } = null!;

}
