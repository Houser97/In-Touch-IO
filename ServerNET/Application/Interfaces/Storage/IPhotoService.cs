using System;

namespace Application.Interfaces.Storage;

public interface IPhotoService
{
    Task<string> DeletePhoto(string publicId);
}
