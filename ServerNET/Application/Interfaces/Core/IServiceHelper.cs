using System;
using Application.Core;

namespace Application.Interfaces.Core;

public interface IServiceHelper<T>
{
    Task<Result<TResult>> ExecuteSafeAsync<TResult>(Func<Task<Result<TResult>>> operation);
}
