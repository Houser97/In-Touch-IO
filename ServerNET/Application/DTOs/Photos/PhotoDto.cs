using System;

namespace Application.DTOs.Photos;

public class Photo
{
    public required string PublicId { get; set; }
    public required string Url { get; set; }
}
