using System;

namespace Application.Interfaces;

public interface IPhotoService
{
    Task<string> DeletePhoto(string publicId);
}
