using System;
using Application.Core;
using Application.Interfaces.Core;
using Moq;

namespace Application.Tests.Extensions;

public static class ServiceHelperMockExtension
{
    public static void SetupExecuteSafe<TService, TResult>(this Mock<IServiceHelper<TService>> mock)
    {
        mock
            .Setup(x => x.ExecuteSafeAsync(It.IsAny<Func<Task<Result<TResult>>>>()))
            .Returns((Func<Task<Result<TResult>>> func) => func());
    }
}
