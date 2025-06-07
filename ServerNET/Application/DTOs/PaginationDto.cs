using System;

namespace Application.DTOs;

public class PaginationDto(int page, int limit)
{
    public int Page { get; set; } = page;
    public int Limit { get; set; } = limit;
}
