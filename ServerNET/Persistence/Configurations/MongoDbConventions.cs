using System;
using MongoDB.Bson.Serialization.Conventions;

namespace Persistence.Configurations;

public static class MongoDbConventions
{
    public static void Register()
    {
        var pack = new ConventionPack
        {
            new IgnoreExtraElementsConvention(true)
        };

        ConventionRegistry.Register("DefaultMongoConventions", pack, t => true );
    }
}
